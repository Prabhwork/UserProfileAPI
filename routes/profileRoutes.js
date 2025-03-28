const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure authentication
const User = require("../models/User");

const router = express.Router();

// ✅ Get Profile (Authenticated)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update Profile
router.put("/update", authMiddleware, async (req, res) => {
  const { name, address, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { name, address, bio },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
