const mongoose = require('mongoose');

// ✅ Check if model already exists to prevent overwrite
if (mongoose.models.Property) {
  module.exports = mongoose.models.Property;
} else {
  const propertySchema = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
      type: String,
      required: [true, 'Please add a price']
    },
    location: {
      type: String,
      required: [true, 'Please add a location']
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please add number of bedrooms'],
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please add number of bathrooms'],
      min: [0, 'Bathrooms cannot be negative']
    },
    area: {
      type: Number,
      required: [true, 'Please add area in square feet'],
      min: [0, 'Area cannot be negative']
    },
    type: {
      type: String,
      enum: ['apartment', 'studio', 'house', 'condo'],
      default: 'apartment'
    },
    amenities: [{
      type: String
    }],
    images: [{
      type: String
    }],
    leaseTerm: {
      type: String,
      default: '12 months'
    },
    deposit: {
      type: String
    },
    available: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    agent: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
    timestamps: true
  });

  // Create index for search functionality
  propertySchema.index({
    title: 'text',
    description: 'text',
    location: 'text'
  });

  module.exports = mongoose.model('Property', propertySchema);
}