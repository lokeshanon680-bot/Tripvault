const path = require('path');
const Trip = require('../models/Trip');

exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, user: req.user.id });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create trip', error: error.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load trips', error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load trip', error: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Unable to update trip', error: error.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete trip', error: error.message });
  }
};

// POST /api/trips/:id/upload
exports.uploadTripPhoto = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const imageUrl = req.file && req.file.path
      ? `/uploads/${path.basename(req.file.path)}`
      : '';

    if (!trip.coverImage) {
      trip.coverImage = imageUrl;
    }
    trip.photos.push(imageUrl);

    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};
