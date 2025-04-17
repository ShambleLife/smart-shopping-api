const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Update profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: req.body },
      { new: true }
    );
    res.json({ message: 'Profile updated', profile: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;

document.getElementById("diet-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const selected = Array.from(document.querySelectorAll('input[name="diet"]:checked')).map(checkbox => checkbox.value);
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("https://smart-shopping-api-1k1z.onrender.com/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dietaryPreferences: selected })  // backend will store this field
    });

    if (!res.ok) throw new Error("Failed to save");

    localStorage.setItem("dietaryPreference", JSON.stringify(selected)); // so recipe results page can use it
    alert("Dietary preferences saved!");
  } catch (err) {
    console.error(err);
    alert("There was a problem saving your preferences.");
  }
});