const mongoose = require('mongoose');

const behaviorProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    unique: true
  },
  avgDailySpend: {
    type: Number,
    default: 0
  },
  mostUsedCategory: {
    type: String
  },
  peakSpendingTime: {
    type: String, // "Night", "Morning", "Evening"
    enum: ["Night", "Morning", "Evening", "Afternoon", "Unknown"],
    default: "Unknown"
  },
  impulseRate: {
    type: Number, // 0.0 to 1.0
    default: 0.0,
    min: 0,
    max: 1
  },
  topMerchants: [{
    type: String
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BehaviorProfile', behaviorProfileSchema);
