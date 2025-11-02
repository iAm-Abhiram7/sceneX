const mongoose = require('mongoose');
const config = require('./config');

/**
 * Connect to MongoDB Atlas
 * Implements retry logic for robust connection handling
 */
const connectDB = async () => {
  let retries = 5;
  
  while (retries) {
    try {
      const conn = await mongoose.connect(config.mongodb.uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      
      // Connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
      
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection failed. Retries left: ${retries - 1}`);
      console.error('Error:', error.message);
      retries -= 1;
      
      if (retries === 0) {
        console.error('💥 Unable to connect to MongoDB after multiple attempts');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 5000 * (6 - retries)));
    }
  }
};

/**
 * Gracefully close database connection
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
};

module.exports = { connectDB, disconnectDB };
