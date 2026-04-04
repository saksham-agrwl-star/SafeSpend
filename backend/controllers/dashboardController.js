const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const Prediction = require('../models/Prediction');
const { formatResponse } = require('../utils/responseFormatter');

exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');

    const profile = await BehaviorProfile.findOne({ userId });
    const goals = await Goal.find({ userId });
    
    const recentTransactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10);
    const predictionLatest = await Prediction.findOne({ userId }).sort({ generatedAt: -1 });

    // Calculate budget left simply based on total spent this month
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const monthlyTxns = await Transaction.find({
      userId,
      date: { $gte: firstDay }
    });
    
    const totalSpent = monthlyTxns.reduce((acc, curr) => acc + curr.amount, 0);
    const budgetLeft = user.monthlyBudget - totalSpent;
    
    // compute arbitrary safety score
    let score = 100;
    if (budgetLeft < 0) score = 0;
    else if (budgetLeft < user.monthlyBudget * 0.2) score = 40;
    
    if (profile && profile.impulseRate > 0.5) score -= 20;

    return formatResponse(res, 200, 'Dashboard loaded', {
      currentBalance: user.monthlyIncome - totalSpent,
      budgetLeft,
      score: Math.max(0, score),
      recentTransactions,
      goalProgress: goals,
      prediction: predictionLatest || null
    });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
