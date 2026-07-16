const User = require('../models/User');
const Trip = require('../models/Trip');

// GET /api/users/:username/profile  (public, no auth)
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select(
      'name username bio createdAt'
    ); // explicitly exclude email & password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const trips = await Trip.find({ user: user._id })
      .select('title destination startDate endDate rating coverImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      name: user.name,
      username: user.username,
      bio: user.bio,
      memberSince: user.createdAt,
      trips,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load profile', error: error.message });
  }
};

// PUT /api/users/profile (auth required) - update own bio / username
exports.updateProfile = async (req, res) => {
  try {
    const { bio, username, name } = req.body;
    const updates = {};

    if (bio !== undefined) updates.bio = bio;
    if (name) updates.name = name;

    if (username) {
      const lower = username.toLowerCase();
      const taken = await User.findOne({ username: lower, _id: { $ne: req.user.id } });
      if (taken) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      updates.username = lower;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update profile', error: error.message });
  }
};
