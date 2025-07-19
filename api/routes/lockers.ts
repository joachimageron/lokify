import express, { Request, Response } from "express";
import Locker from "../models/Locker";
import { auth } from "../middleware/auth";

const router = express.Router();

router.use(auth);

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const lockers = await Locker.find();
    res.status(200).json(lockers);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const locker = await Locker.findById(req.params.id);
    if (!locker) {
      res.status(404).json({ error: "Locker not found" });
      return;
    }
    res.status(200).json(locker);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const locker = new Locker(req.body);
    await locker.save();
    res.status(201).json(locker);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const locker = await Locker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!locker) {
      res.status(404).json({ error: "Locker not found" });
      return;
    }
    res.status(200).json(locker);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const locker = await Locker.findByIdAndDelete(req.params.id);
    if (!locker) {
      res.status(404).json({ error: "Locker not found" });
      return;
    }
    res.status(200).json({ message: "Locker deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
