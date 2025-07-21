import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import MailClient from "../utils/mailClient";
import { auth } from "../middleware/auth";

const router = express.Router();

// Register a new user
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({ email, password });
    await user.save();

    // Create and send JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "24h" });

    res.cookie("token", token, {
      httpOnly: true, // Pour empêcher l'accès JavaScript côté client
      secure: process.env.NODE_ENV === "production", // Uniquement sur HTTPS en production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
    });

    // Send welcome email
    try {
      const mailClient = MailClient.getInstance();
      const verificationSecret = process.env.JWT_SECRET + user.password;
      const verificationToken = jwt.sign(
        { userId: user.id },
        verificationSecret,
        { expiresIn: "7d" }
      );
      const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email/${verificationToken}`;

      await mailClient.sendEmailWithTemplate(
        [user.email],
        "Veuillez vérifier votre email",
        "email-confirmation",
        {
          confirmUrl: verificationUrl,
          email: user.email,
          currentYear: new Date().getFullYear(),
        }
      );
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "24h" });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true, // Pour empêcher l'accès JavaScript côté client
      secure: process.env.NODE_ENV === "production", // Uniquement sur HTTPS en production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
    });

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Logout user
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

// Get current user
router.get("/me", auth, async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Forgot password (request reset link)
router.post(
  "/forgot-password",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists for security reasons
        return res.json({
          message: "If the email exists, a reset link will be sent",
        });
      }

      // Create a reset token (different from auth token)
      const secret = process.env.JWT_SECRET + user.password;
      if (!secret) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "15m" });
      console.log(
        "\x1b[36m",
        "Reset token:",
        "\x1b[0m\x1b[33m",
        token,
        "\x1b[0m"
      );

      // Create reset URL
      const resetUrl = `${process.env.CLIENT_URL}/auth/forgot_password/${token}`;

      const mailClient = MailClient.getInstance();

      await mailClient.sendEmailWithTemplate(
        [user.email],
        "Password Reset Link",
        "password-reset",
        {
          resetUrl,
          loginUrl: `${process.env.CLIENT_URL}/auth/signin`,
          email: user.email,
          currentYear: new Date().getFullYear(),
        }
      );

      res.json({ message: "If the email exists, a reset link will be sent" });
    } catch (error) {
      console.error("Password reset error:", error);
      res
        .status(500)
        .json({
          message: "An error occurred during the password reset process",
        });
    }
  }
);

// Reset password (with token)
router.post(
  "/reset-password/:token",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      if (!token || !password) {
        return res
          .status(400)
          .json({ message: "Missing required information" });
      }

      // Decode token to get user ID (without verification yet)
      const decoded = jwt.decode(token) as { userId: string };
      if (!decoded || !decoded.userId) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify token with user-specific secret
      const secret = process.env.JWT_SECRET + user.password;
      try {
        jwt.verify(token, secret);
      } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Update password
      user.password = password; // The User model should hash this before saving
      await user.save();

      // Send confirmation email (via Mailtrap)
      const mailClient = MailClient.getInstance();
      const loginUrl = `${process.env.CLIENT_URL}/auth/signin`;

      await mailClient.sendEmailWithTemplate(
        [user.email],
        "Password Reset Successful",
        "password-reset-confirmation", // Nom du template dans /templates/emails/
        {
          loginUrl,
          email: user.email,
          currentYear: new Date().getFullYear(),
        }
      );

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      console.log(error);
      res
        .status(500)
        .json({
          message: "An error occurred during the password reset process",
        });
    }
  }
);

// Send verification email
router.post(
  "/send-verification-email",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ message: "Server configuration error" });
      }

      const decoded = jwt.verify(token, secret) as { userId: string };

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // If already verified, no need to send
      if (user.emailVerified) {
        return res.json({ message: "Email already verified" });
      }

      // Create a verification token (similar to reset password)
      const verificationSecret = process.env.JWT_SECRET + user.password;
      const verificationToken = jwt.sign(
        { userId: user.id },
        verificationSecret,
        { expiresIn: "7d" }
      );

      // Create verification URL
      const verificationUrl = `${process.env.CLIENT_URL}/auth/verify-email/${verificationToken}`;

      // Send the verification email
      const mailClient = MailClient.getInstance();

      await mailClient.sendEmailWithTemplate(
        [user.email],
        "Please Verify Your Email",
        "email-confirmation",
        {
          confirmUrl: verificationUrl,
          email: user.email,
          currentYear: new Date().getFullYear(),
        }
      );

      res.json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res
        .status(500)
        .json({ message: "An error occurred during email verification" });
    }
  }
);

// Verify email with token
router.get(
  "/verify-email/:token",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({ message: "Missing verification token" });
      }

      // Decode token to get user ID (without verification yet)
      const decoded = jwt.decode(token) as { userId: string };
      if (!decoded || !decoded.userId) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If already verified
      if (user.emailVerified) {
        return res.json({ message: "Email already verified" });
      }

      // Verify token with user-specific secret
      const secret = process.env.JWT_SECRET + user.password;
      try {
        jwt.verify(token, secret);
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      }

      // Mark email as verified
      user.emailVerified = true;
      await user.save();

      try {
        const mailClient = MailClient.getInstance();
        await mailClient.sendEmailWithTemplate(
          [user.email],
          "Bienvenue sur Lokify",
          "welcome", // ton template /templates/emails/welcome.html
          {
            email: user.email,
            dashboardUrl: `${process.env.CLIENT_URL}/dashboard`,
            currentYear: new Date().getFullYear(),
          }
        );
      } catch (mailErr) {
        console.error("Erreur lors de l'envoi du mail de bienvenue :", mailErr);
      }

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res
        .status(500)
        .json({ message: "An error occurred during email verification" });
    }
  }
);

export default router;
