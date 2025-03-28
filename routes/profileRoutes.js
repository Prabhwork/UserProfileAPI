const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Store uploaded profile pictures

// ✅ Get User Profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update User Profile
router.put("/me", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const { name, address, bio } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedData = { name, address, bio };
    if (profilePic) updatedData.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(req.user, updatedData, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
