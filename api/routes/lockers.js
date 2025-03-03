const express = require("express");
const router = express.Router();

const Locker = require("../models/Locker");

router.get("/", async (req, res) => {
  try {
    const lockers = await Locker.find();
    res.status(200).json(lockers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
