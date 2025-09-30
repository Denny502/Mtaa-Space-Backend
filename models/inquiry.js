const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  },
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true
  },
  agent: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'viewing_scheduled', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);