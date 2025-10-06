const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const User = require('../models/User');

// ✅ FIXED: Create property with real agent ID
router.post('/', async (req, res) => {
  try {
    console.log('📦 Received property data:', req.body);
    
    const { title, description, price, location, bedrooms, bathrooms, area, type, amenities, images, leaseTerm, deposit } = req.body;
    
    // Validate required fields
    if (!title || !price || !location || !bedrooms || !bathrooms || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, price, location, bedrooms, bathrooms, area'
      });
    }
    
    // ✅ FIX: Get a real agent from database
    let agent = await User.findOne({ role: 'agent' });
    
    // If no agent exists, create one temporarily
    if (!agent) {
      console.log('⚠️ No agent found, creating temporary agent...');
      agent = await User.create({
        name: 'System Agent',
        email: 'system@mtaaspace.com',
        password: 'temp123456',
        role: 'agent',
        phone: '+254700000000'
      });
      console.log('✅ Temporary agent created:', agent._id);
    }
    
    console.log('👤 Using agent:', agent._id);
    
    // ✅ FIX: Validate and set property type
    const validTypes = ['apartment', 'studio', 'house', 'condo'];
    const propertyType = validTypes.includes(type) ? type : 'apartment';
    
    // Create property in database with REAL ObjectId
    const property = await Property.create({
      title,
      description: description || '',
      price,
      location, 
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      area: parseInt(area),
      type: propertyType, // ✅ Now using valid enum value
      amenities: amenities || [],
      images: images || [],
      leaseTerm: leaseTerm || '12 months',
      deposit: deposit || '',
      available: true,
      featured: false,
      agent: agent._id // ✅ Now using real ObjectId
    });
    
    // Populate agent data
    await property.populate('agent', 'name email phone avatar');
    
    console.log('✅ Property saved to MongoDB with ID:', property._id);
    
    res.status(201).json({
      success: true,
      message: 'Property added successfully!',
      data: property
    });
    
  } catch (error) {
    console.error('❌ Error saving property to MongoDB:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Keep your other routes...
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({})
      .populate('agent', 'name email phone avatar')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ featured: true, available: true })
      .populate('agent', 'name email phone avatar')
      .limit(6)
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Debug route to check agents
router.get('/debug/agents', async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('_id name email');
    res.json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;