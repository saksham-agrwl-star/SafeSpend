const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  predictedBalance: {
    type: Number,
    required: true
  },
  daysLeft: {
    type: Number,
    required: true
  },
  riskStatus: {
    type: String,
    enum: ["Safe", "Warning", "Critical"],
    default: "Safe"
  },
  goalImpactDays: {
    type: Number,
    default: 0
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', predictionSchema);
