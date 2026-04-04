const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const Goal = require('../models/Goal');
const { formatResponse } = require('../utils/responseFormatter');
const { runPrediction } = require('../services/predictionEngine');

exports.simulateTransaction = async (req, res) => {
  try {
    const { userId, hypotheticalAmount } = req.body;
    
    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');
    
    const profile = await BehaviorProfile.findOne({ userId });
    const goal = await Goal.findOne({ userId });

    const predictionResult = runPrediction(user, profile, goal, hypotheticalAmount);

    return formatResponse(res, 200, 'Simulation successful', {
      newFutureBalance: predictionResult.predictedBalance,
      goalImpact: predictionResult.goalImpactDays,
      riskStatus: predictionResult.riskStatus
    });

  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
