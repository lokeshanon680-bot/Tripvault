const express = require('express');
const router = express.Router();

const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  uploadTripPhoto,
} = require('../controllers/tripController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', protect, createTrip);
router.get('/', protect, getTrips);
router.get('/:id', protect, getTripById);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);
router.post('/:id/upload', protect, upload.single('image'), uploadTripPhoto);

module.exports = router;
