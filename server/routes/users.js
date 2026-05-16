// routes/users.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.use(protect);
router.get('/profile', async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
});

module.exports = router;
