const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  monthlyBudget: {
    type: Number,
    required: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  goalAmount: {
    type: Number,
    required: true
  },
  goalName: {
    type: String,
    required: true
  },
  goalDeadline: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
