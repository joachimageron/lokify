import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

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

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: "Logged out successfully" });
});

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

export default router;