const express = require("express");
const PortfolioContent = require("../models/PortfolioContent");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();
const contentFields = [
  "name",
  "role",
  "avatar",
  "email",
  "about",
  "about2",
  "socials",
  "skills",
  "experience",
];

router.get("/", async (req, res) => {
  try {
    const content = await PortfolioContent.findOne({ key: "portfolio" });
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch portfolio content." });
  }
});

router.put("/", requireAdmin, async (req, res) => {
  try {
    const content = Object.fromEntries(
      contentFields
        .filter((field) => Object.hasOwn(req.body, field))
        .map((field) => [field, req.body[field]])
    );

    const savedContent = await PortfolioContent.findOneAndUpdate(
      { key: "portfolio" },
      { $set: content },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: savedContent });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update portfolio content.",
      error: error.message,
    });
  }
});

module.exports = router;