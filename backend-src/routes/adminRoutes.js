const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.get("/verify", requireAdmin, (req, res) => {
  res.status(200).json({ success: true, message: "Admin access verified." });
});

module.exports = router;