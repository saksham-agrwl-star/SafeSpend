const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const Goal = require('../models/Goal');
const { formatResponse } = require('../utils/responseFormatter');

exports.setupUser = async (req, res) => {
  try {
    const { 
      userId, name, email, monthlyBudget, goalAmount, goalName, goalDeadline, 
      ageGroup, occupation, annualIncome, 
      categoryLimits, spendingStyle, impulseFlags 
    } = req.body;

    const monthlyIncome = req.body.monthlyIncome || Math.floor((annualIncome || 0) / 12);

    const userData = {
      userId, name, email: (email || '').toLowerCase().trim(), 
      monthlyBudget: monthlyBudget || 0, monthlyIncome, 
      ageGroup: ageGroup || 'Gen Z (18-25)', 
      occupation: occupation || 'Not specified', 
      annualIncome: annualIncome || 0,
      categoryLimits: categoryLimits || { food: 5000, shopping: 3000, entertainment: 2000, transport: 2000 },
      spendingStyle: spendingStyle || 'Moderate',
      impulseFlags: impulseFlags || { lateNight: false, weekend: false, stress: false }
    };

    // Only set goal fields if they have real values
    if (goalName && goalName.trim()) {
      userData.goalName = goalName.trim();
      userData.goalAmount = goalAmount || 0;
      if (goalDeadline && goalDeadline.trim()) {
        userData.goalDeadline = new Date(goalDeadline);
      }
    }

    const user = new User(userData);
    await user.save();

    // Calculate a real impulse rate based on onboarding
    let baseImpulseRate = spendingStyle === 'Impulsive' ? 0.4 : spendingStyle === 'Disciplined' ? 0.1 : 0.25;
    const flags = impulseFlags || {};
    if (flags.lateNight) baseImpulseRate += 0.1;
    if (flags.weekend) baseImpulseRate += 0.05;
    if (flags.stress) baseImpulseRate += 0.15;
    baseImpulseRate = Math.min(baseImpulseRate, 0.9); // Cap at 90%

    const profile = new BehaviorProfile({
      userId,
      avgDailySpend: (monthlyBudget || 0) / 30,
      mostUsedCategory: 'Unknown',
      impulseRate: baseImpulseRate
    });
    await profile.save();

    if (goalName && goalName.trim() && goalAmount) {
      const goal = new Goal({
        userId, goalName: goalName.trim(), targetAmount: goalAmount, 
        deadline: (goalDeadline && goalDeadline.trim()) ? new Date(goalDeadline) : undefined
      });
      await goal.save();
    }

    return formatResponse(res, 201, 'User setup successful', { user, profile });
  } catch (error) {
    // Handle duplicate key errors (email or userId already exists)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return formatResponse(res, 409, `An account with this ${field} already exists. Please log in instead.`);
    }
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

// Login by email — returns userId and name for session storage
exports.loginUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return formatResponse(res, 400, 'Email is required');

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return formatResponse(res, 404, 'No account found with that email. Please sign up first.');

    return formatResponse(res, 200, 'Login successful', {
      userId: user.userId,
      name: user.name,
      email: user.email,
      monthlyBudget: user.monthlyBudget,
      monthlyIncome: user.monthlyIncome,
    });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

// Create a new goal for a user
exports.createGoal = async (req, res) => {
  try {
    const { userId, goalName, targetAmount, deadline } = req.body;
    if (!userId || !goalName || !targetAmount) {
      return formatResponse(res, 400, 'userId, goalName and targetAmount are required');
    }

    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');

    const goal = new Goal({
      userId,
      goalName,
      targetAmount: Number(targetAmount),
      deadline: deadline ? new Date(deadline) : undefined,
    });
    await goal.save();

    return formatResponse(res, 201, 'Goal created', { goal });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { userId } = req.params;
    const { monthlyBudget } = req.body;
    if (!monthlyBudget) return formatResponse(res, 400, 'monthlyBudget is required');

    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');

    const oldBudget = user.monthlyBudget || 30000;
    const newBudgetVal = Number(monthlyBudget);
    
    // Proportionally scale category limits to match new budget visually on the dashboard
    if (newBudgetVal > 0 && oldBudget > 0) {
      const ratio = newBudgetVal / oldBudget;
      user.categoryLimits = {
        food: Math.round((user.categoryLimits?.food || 5000) * ratio),
        shopping: Math.round((user.categoryLimits?.shopping || 3000) * ratio),
        entertainment: Math.round((user.categoryLimits?.entertainment || 2000) * ratio),
        transport: Math.round((user.categoryLimits?.transport || 2000) * ratio)
      };
    }

    user.monthlyBudget = newBudgetVal;
    await user.save();

    return formatResponse(res, 200, 'Budget updated', { user });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { userId, goalId } = req.params;
    const { goalName, targetAmount, deadline } = req.body;
    
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) return formatResponse(res, 404, 'Goal not found');

    if (goalName) goal.goalName = goalName;
    if (targetAmount) goal.targetAmount = Number(targetAmount);
    if (deadline !== undefined) goal.deadline = deadline ? new Date(deadline) : undefined;
    
    await goal.save();
    return formatResponse(res, 200, 'Goal updated', { goal });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { userId, goalId } = req.params;
    const goal = await Goal.findOneAndDelete({ _id: goalId, userId });
    if (!goal) return formatResponse(res, 404, 'Goal not found');
    
    return formatResponse(res, 200, 'Goal deleted');
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

