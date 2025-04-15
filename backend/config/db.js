const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\x1b[32m%s\x1b[0m', '✅ MongoDB connected');
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
