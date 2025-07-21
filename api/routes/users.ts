import express, { Request, Response } from "express";
import User from "../models/User";
import { auth } from "../middleware/auth";

const router = express.Router();

router.use(auth);

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id).select("email");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
