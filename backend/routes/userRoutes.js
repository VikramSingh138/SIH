import express from "express";
import UserCount from "../models/UserCount.js"; // Mongoose model

const router = express.Router();

// Increment count when user accepts cookies
router.post("/accept", async (req, res) => {
  try {
    let record = await UserCount.findOne();

    if (!record) {
      record = new UserCount({ count: 0 });
    }

    record.count += 1;
    await record.save();

    res.json({ success: true, count: record.count });
  } catch (error) {
    console.error("Error updating count:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get current count
router.get("/count", async (req, res) => {
  try {
    let record = await UserCount.findOne();
    res.json({ count: record ? record.count : 0 });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
