import express, { Request, Response } from "express";
import Locker from "../models/Locker";
import { auth } from "../middleware/auth";

const router = express.Router();

router.use(auth);

router.get("/", async (req: Request, res: Response) => {
  try {
    const lockers = await Locker.find();
    res.status(200).json(lockers);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
