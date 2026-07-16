const express = require('express');
const router = express.Router();

const { getPublicProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// IMPORTANT: /profile must come before /:username/profile is fine since paths differ,
// but keep the auth-protected update route distinctly named to avoid collisions.
router.put('/profile', protect, updateProfile);
router.get('/:username/profile', getPublicProfile);

module.exports = router;
