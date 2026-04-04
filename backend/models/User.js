const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  ageGroup:    { type: String, required: true },
  occupation:  { type: String, required: true },
  annualIncome: { type: Number, required: true },
  monthlyBudget: { type: Number, required: true },
  monthlyIncome: { type: Number, required: true },
  goalAmount:   { type: Number, required: false },
  goalName:     { type: String, required: false },
  goalDeadline: { type: Date,   required: false },
  // Category spending limits set during onboarding
  categoryLimits: {
    food:          { type: Number, default: 5000 },
    shopping:      { type: Number, default: 3000 },
    entertainment: { type: Number, default: 2000 },
    transport:     { type: Number, default: 2000 },
  },
  // Behavioural self-assessment from onboarding
  spendingStyle: {
    type: String,
    enum: ['Disciplined', 'Moderate', 'Impulsive'],
    default: 'Moderate'
  },
  impulseFlags: {
    lateNight: { type: Boolean, default: false },
    weekend:   { type: Boolean, default: false },
    stress:    { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

