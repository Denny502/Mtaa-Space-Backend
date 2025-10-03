const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    console.log('🔍 Attempting to connect to MongoDB...');
    console.log('📍 Checking connection string...');
    
    // Check if connection string exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('✅ Connection string found, connecting...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log('🎯 Ready to save data to MongoDB Atlas!');
    
    return conn;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Check your MongoDB Atlas connection string and network');
    process.exit(1);
  }
};

module.exports = connectDatabase;