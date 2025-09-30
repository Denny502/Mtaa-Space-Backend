const Inquiry = require('../models/inquiry');
const Property = require('../models/Property');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private
exports.createInquiry = async (req, res) => {
  try {
    const { propertyId, message, phone } = req.body;
    
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    const inquiry = await Inquiry.create({
      name: req.user.name,
      email: req.user.email,
      phone: phone || req.user.phone,
      message,
      property: propertyId,
      agent: property.agent
    });
    
    await inquiry.populate('property', 'title location');
    await inquiry.populate('agent', 'name email phone');
    
    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get agent inquiries
// @route   GET /api/inquiries/agent
// @access  Private (Agents only)
exports.getAgentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ agent: req.user.id })
      .populate('property', 'title location images')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user inquiries
// @route   GET /api/inquiries/user
// @access  Private
exports.getUserInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ email: req.user.email })
      .populate('property', 'title location images')
      .populate('agent', 'name email phone avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};