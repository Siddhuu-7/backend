const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: String,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: String,
    ref: 'User', 
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;