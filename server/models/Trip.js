const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: Date,
    endDate: Date,
    description: String,
    rating: { type: Number, min: 1, max: 5 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverImage: { type: String, default: '' },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);
