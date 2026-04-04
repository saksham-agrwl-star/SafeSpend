const Transaction = require('../models/Transaction');
const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const Goal = require('../models/Goal');
const Prediction = require('../models/Prediction');
const { formatResponse } = require('../utils/responseFormatter');
const { parseUPIQRCode } = require('../utils/qrParser');
const { analyzeBehavior } = require('../services/behaviorEngine');
const { runPrediction } = require('../services/predictionEngine');
const { makeDecision } = require('../services/decisionEngine');
const { generateUPILink } = require('../services/upiService');

exports.scanTransaction = async (req, res) => {
  try {
    const { userId, amount, merchant, upiId, category } = req.body;
    
    // Fetch context
    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');
    
    const profile = await BehaviorProfile.findOne({ userId });
    const goal = await Goal.findOne({ userId });
    
    const incomingTransaction = { amount, merchant, upiId, category: category || 'Other', time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"}) };

    // 1. Behavior
    const behaviorData = analyzeBehavior(incomingTransaction, profile);
    
    // 2. Prediction
    const predictionData = runPrediction(user, profile, goal, amount);
    
    // 3. Decision
    const decision = makeDecision(behaviorData, predictionData);
    
    // 4. UPI URI Gen
    const upiLink = generateUPILink(upiId, amount, merchant);

    return formatResponse(res, 200, 'Scan Complete', {
      status: decision,
      reason: behaviorData.reason,
      impact: predictionData.riskStatus,
      goalDelay: predictionData.goalImpactDays,
      futureBalance: predictionData.predictedBalance,
      upiLink
    });

  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { userId, transactionId, amount, category, merchant, upiId, time, tag, riskLevel, reason, wasBlocked, userProceed } = req.body;
    
    const transaction = new Transaction({
      userId, transactionId, amount, category, merchant, upiId, time, tag, riskLevel, reason, wasBlocked, userProceed
    });
    
    await transaction.save();

    // Update Behavior Profile
    const profile = await BehaviorProfile.findOne({ userId });
    if (profile) {
      // Very crude average compute logic
      profile.avgDailySpend = (profile.avgDailySpend + amount) / 2; // Mock avg update
      profile.lastUpdated = Date.now();
      await profile.save();
    }
    
    // Update Prediction metrics based on completed txn
    const user = await User.findOne({ userId });
    const goal = await Goal.findOne({ userId });
    if (user && profile) {
      const predResult = runPrediction(user, profile, goal, 0); // using current new avg
      const newPrediction = new Prediction({
        userId,
        predictedBalance: predResult.predictedBalance,
        daysLeft: predResult.daysLeft,
        riskStatus: predResult.riskStatus,
        goalImpactDays: predResult.goalImpactDays
      });
      await newPrediction.save();
    }

    return formatResponse(res, 201, 'Transaction Added Successfully', { transaction });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
