const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      match: [/^[a-z0-9_.]+$/, 'Username can only contain lowercase letters, numbers, underscores and dots'],
    },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: '', maxlength: 300 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
