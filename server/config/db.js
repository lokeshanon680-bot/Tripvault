const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tripvault';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected -> ${mongoUri}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.error('Make sure your local MongoDB server is running (e.g. run "mongod" or start the MongoDB service).');
    process.exit(1);
  }
};

module.exports = connectDB;
