const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ✅ Check if model already exists to prevent overwrite
if (mongoose.models.User) {
  module.exports = mongoose.models.User;
} else {
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['renter', 'agent'],
      default: 'renter'
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150/667eea/white?text=User'
    }
  }, {
    timestamps: true
  });

  // Encrypt password using bcrypt
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  // Match user entered password to hashed password in database
  userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  module.exports = mongoose.model('User', userSchema);
}