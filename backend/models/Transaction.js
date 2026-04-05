const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["Food", "Travel", "Shopping", "Utilities", "Entertainment", "Transport", "Bills", "Other"],
    default: "Other"
  },
  merchant: {
    type: String,
    required: true
  },
  upiId: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tag: {
    type: String,
    enum: ["Impulse", "Normal", "Recurring", "Risky"]
  },
  riskLevel: {
    type: String,
    enum: ["Low", "Medium", "High"]
  },
  reason: {
    type: String
  },
  wasBlocked: {
    type: Boolean,
    default: false
  },
  userProceed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
