const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const Goal = require('../models/Goal');
const { formatResponse } = require('../utils/responseFormatter');

exports.setupUser = async (req, res) => {
  try {
    const { userId, name, email, monthlyBudget, monthlyIncome, goalAmount, goalName, goalDeadline } = req.body;

    const user = new User({
      userId, name, email, monthlyBudget, monthlyIncome, goalAmount, goalName, goalDeadline
    });
    await user.save();

    const profile = new BehaviorProfile({
      userId,
      avgDailySpend: monthlyBudget / 30, // Mock init
      mostUsedCategory: 'Unknown'
    });
    await profile.save();

    const goal = new Goal({
      userId, goalName, targetAmount: goalAmount, deadline: goalDeadline
    });
    await goal.save();

    return formatResponse(res, 201, 'User setup successful', { user, profile, goal });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return formatResponse(res, 404, 'User not found');
    
    const goals = await Goal.find({ userId: req.params.userId });
    return formatResponse(res, 200, 'User retrieved', { user, goals });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
