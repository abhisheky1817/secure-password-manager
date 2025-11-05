const mongoose = require('mongoose');


const passwordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  platform: {
    type: String, 
    required: true
  },
  username: {
    type: String, 
    required: true
  },
  password: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Password', passwordSchema);
