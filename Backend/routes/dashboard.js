const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/stats", async (req, res) => {
  try {

    const buyers = await User.countDocuments({ role: "buyer" });
    const partners = await User.countDocuments({ role: "partner" });
    const developers = await User.countDocuments({ role: "developer" });

    res.json({
      buyers,
      partners,
      developers
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;