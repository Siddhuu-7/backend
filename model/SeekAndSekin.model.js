const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  seeker:{
    type:String,
    require:true
  },
  seeking:{
    type:String,
    require:true
  },
  role:{
    type:String,
    default:"none"
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'complete'],
    default: 'pending',
  },
});

const SeekAndSeking = mongoose.model('SeekAndSeking', requestSchema);

module.exports = SeekAndSeking;