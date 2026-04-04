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
    
    const totalSpent = monthlyTxns
      .filter(tx => tx.amount < 0)
      .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    const budgetLeft = user.monthlyBudget - totalSpent;
    
    // Calculate category-specific spending
    const categorySpent = { food: 0, shopping: 0, entertainment: 0, transport: 0, other: 0 };
    monthlyTxns.forEach(tx => {
      if (tx.amount >= 0) return; // only count expenses
      const cat = (tx.category || '').toLowerCase();
      if (categorySpent[cat] !== undefined) categorySpent[cat] += Math.abs(tx.amount);
      else categorySpent.other += Math.abs(tx.amount);
    });
    
    let score = 100;
    if (totalSpent > user.monthlyBudget) score = 0;
    else if (totalSpent > user.monthlyBudget * 0.8) score = 40;
    else if (totalSpent > user.monthlyBudget * 0.5) score = 70;
    
    if (profile && profile.impulseRate > 0.5) score -= 20;

    // Compute Daily Spends array for charts
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailySpendMap = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
    
    // Process only last 7 days of transactions dynamically
    const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    monthlyTxns.forEach(tx => {
      if (tx.amount >= 0) return; // ignore income for spend chart
      if (new Date(tx.date) > oneWeekAgo) {
        const txDayName = shortDays[new Date(tx.date).getDay()];
        dailySpendMap[txDayName] += Math.abs(tx.amount);
      }
    });

    const dailySpends = shortDays.map(day => ({
      day,
      amount: dailySpendMap[day] || 0
    }));

    // Reorder shortDays array so it ends with today
    const currentDayIndex = currentDate.getDay();
    const orderedDailySpends = [];
    for(let i=1; i<=7; i++) {
        let idx = (currentDayIndex + i) % 7;
        orderedDailySpends.push(dailySpends[idx]);
    }

    return formatResponse(res, 200, 'Dashboard loaded', {
      currentBalance: Math.max(0, (user.monthlyIncome || 0) - totalSpent),
      budgetLeft: Math.max(0, (user.monthlyBudget || 0) - totalSpent),
      monthlyBudget: user.monthlyBudget || 0,
      score: Math.max(0, score),
      recentTransactions,
      goalProgress: goals,
      prediction: predictionLatest || null,
      categoryLimits: user.categoryLimits || { food: 5000, shopping: 3000, entertainment: 2000, transport: 2000 },
      categorySpent,
      dailySpends: orderedDailySpends
    });
  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
