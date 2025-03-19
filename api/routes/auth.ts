import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import MailgunClient from '../utils/mailgunClient';
import Mailgun from "mailgun.js";

const router = express.Router();

// Register a new user
router.post("/register", async (req: Request, res: Response): Promise<any>=> {
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
    
    res.cookie('token', token, {
      httpOnly: true, // Pour empêcher l'accès JavaScript côté client
      secure: process.env.NODE_ENV === 'production', // Uniquement sur HTTPS en production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 heures
    });

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
    res.cookie('token', token, {
      httpOnly: true, // Pour empêcher l'accès JavaScript côté client
      secure: process.env.NODE_ENV === 'production', // Uniquement sur HTTPS en production
      sameSite: 'strict',
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
  res.clearCookie('token');
  res.json({ success: true, message: "Logged out successfully" });
});

// Get current user
router.get("/me", async (req: Request, res: Response): Promise<any> => {
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
    
    res.json({ 
        id: user._id,
        email: user.email
    });
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
}
);

// Forgot password (request reset link)
router.post("/forgot-password", async (req: Request, res: Response): Promise<any> => {

  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security reasons
      return res.json({ message: "If the email exists, a reset link will be sent" });
    }
    
    // Create a reset token (different from auth token)
    const secret = process.env.JWT_SECRET + user.password; // Add password to make token unique and invalidate if password changes
    if (!secret) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "15m" }); // Short expiry for security
    console.log("Reset token:", token);
    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/auth/forgot_passord/${token}`;
    
    // Use the Mailgun singleton to send email
    const mailgunClient = MailgunClient.getInstance();
    
    // TODO: Configure Mailgun to send email
    // await mailgunClient.sendEmail(
    //   [user.email],
    //   'Password Reset Link',
    //   `Please use the following link to reset your password: ${resetUrl}`,
    //   `<p>Please use the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
    // );
    
    res.json({ message: "If the email exists, a reset link will be sent" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "An error occurred during the password reset process" });
  }
});

// Reset password (with token)
router.post("/reset-password/:token", async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: "Missing required information" });
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
    
    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "An error occurred during the password reset process" });
  }
});

export default router;