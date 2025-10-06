const express = require('express');
const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Properties endpoint working',
    data: []
  });
});

router.get('/featured', (req, res) => {
  res.json({
    success: true,
    message: 'Featured properties endpoint working',
    data: []
  });
});

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Property ${req.params.id} endpoint working`,
    data: { _id: req.params.id, title: 'Test Property' }
  });
});

// ADD PROPERTY - SIMPLIFIED VERSION
router.post('/', (req, res) => {
  console.log('📦 Received property data:', req.body);
  
  const { title, description, price, location, bedrooms, bathrooms, area } = req.body;
  
  // Mock response
  res.status(201).json({
    success: true,
    message: 'Property added successfully!',
    data: {
      _id: 'property-' + Date.now(),
      title: title || 'Test Property',
      description: description || 'Beautiful apartment',
      price: price || '25000',
      location: location || 'Nairobi',
      bedrooms: bedrooms || 2,
      bathrooms: bathrooms || 1,
      area: area || 800,
      type: 'apartment',
      amenities: [],
      images: [],
      available: true,
      featured: false,
      agent: {
        _id: 'mock-agent-id',
        name: 'Test Agent',
        email: 'agent@example.com'
      },
      createdAt: new Date().toISOString()
    }
  });
});

// Also add the mock endpoint for testing
router.post('/mock', (req, res) => {
  console.log('🎯 Mock endpoint hit');
  res.status(201).json({
    success: true,
    message: 'Mock property created!',
    data: req.body
  });
});

module.exports = router;