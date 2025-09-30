const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'property',
        populate: {
          path: 'agent',
          select: 'name email phone avatar'
        }
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites.map(fav => fav.property)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId
    });
    
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }
    
    const favorite = await Favorite.create({
      user: req.user.id,
      property: req.params.propertyId
    });
    
    await favorite.populate({
      path: 'property',
      populate: {
        path: 'agent',
        select: 'name email phone avatar'
      }
    });
    
    res.status(201).json({
      success: true,
      data: favorite.property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }
    
    await Favorite.findByIdAndDelete(favorite._id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if property is favorited
// @route   GET /api/favorites/check/:propertyId
// @access  Private
exports.checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: req.params.propertyId
    });
    
    res.status(200).json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};