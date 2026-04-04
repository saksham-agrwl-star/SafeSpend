const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  savedAmount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ["On Track", "Delayed", "Achieved"],
    default: "On Track"
  }
});

module.exports = mongoose.model('Goal', goalSchema);
