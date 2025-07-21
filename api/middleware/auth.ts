import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Check for token in cookie first
    const tokenFromCookie = req.cookies.token;

    // If no token in cookie, check Authorization header
    const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "");

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      res
        .status(401)
        .json({ message: "No authentication token, authorization denied" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
