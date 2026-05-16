const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\n📌 Fix: Make sure MongoDB is running.');
    console.error('   Windows: Open Services → Find "MongoDB Server" → Start\n');
    process.exit(1);
  }
};

module.exports = connectDB;
