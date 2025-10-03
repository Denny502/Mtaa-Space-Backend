const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import database connection and routes
const connectDatabase = require('./config/database');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const favoriteRoutes = require('./routes/favorites'); 
const inquiryRoutes = require('./routes/inquiries');

// Initialize express app
const app = express();

// Initialize database connection
connectDatabase();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Mtaa Space Backend Server is running!',
    api: 'Visit /api for available endpoints',
    version: '1.0.0'
  });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🏠 Welcome to Mtaa Space API',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      properties: ['GET /api/properties', 'GET /api/properties/featured', 'POST /api/properties'],
      favorites: ['GET /api/favorites', 'POST /api/favorites/:id', 'DELETE /api/favorites/:id'],
      inquiries: ['POST /api/inquiries', 'GET /api/inquiries/user', 'GET /api/inquiries/agent'],
      health: ['GET /api/health', 'GET /api/debug/db']
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mtaa Space API is running!',
    database: mongoose.connection.db?.databaseName || 'Connecting...',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint
app.get('/api/debug/db', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const collectionData = {};
    for (let collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      collectionData[collection.name] = count;
    }

    res.json({
      success: true,
      database: db.databaseName,
      collections: collectionData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 404 handler - MUST BE LAST
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`,
    suggestion: 'Visit /api to see all available endpoints'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}/api`);
});