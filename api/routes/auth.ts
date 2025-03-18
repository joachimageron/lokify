import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { auth } from "../middleware/auth";
import bycrypt from "bcryptjs";

const router = express.Router();

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
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
    
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
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
    
    // Create and send JWT token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server configuration error" });
    }
    
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "24h" });
    
    res.json({ user: email, token });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


export default router;