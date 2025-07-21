import express, { Request, Response } from "express";
import Locker from "../models/Locker";
import LockerScheduler from "../services/lockerScheduler";
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

// Route pour déclencher manuellement la mise à jour des statuts (utile pour les tests)
router.post(
  "/update-statuses",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const scheduler = LockerScheduler.getInstance();
      await scheduler.runManualUpdate();
      res
        .status(200)
        .json({ message: "Mise à jour des statuts effectuée avec succès" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// Route pour vérifier le statut du planificateur
router.get("/scheduler/status", (req: Request, res: Response): void => {
  const scheduler = LockerScheduler.getInstance();
  res.status(200).json({
    isRunning: scheduler.getStatus(),
    message: scheduler.getStatus()
      ? "Planificateur actif"
      : "Planificateur inactif",
  });
});

export default router;
