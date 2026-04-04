const User = require('../models/User');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const { formatResponse } = require('../utils/responseFormatter');
const simulateTransaction = require('../ML_models/simulationEngine');

exports.simulateTransaction = async (req, res) => {
  try {
    const { userId, swiggy, shopping, coffee } = req.body;
    const simulatedAmount = (swiggy || 0) + (shopping || 0) + (coffee || 0);
    
    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');
    
    const goal = await Goal.findOne({ userId });

    // Fetch transactions from the start of the current month
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthlyTxns = await Transaction.find({ userId, date: { $gte: firstDay } });
    
    const totalSpent = monthlyTxns.reduce((acc, curr) => acc + (curr.amount > 0 ? curr.amount : 0), 0);
    const currentBalance = user.monthlyIncome - totalSpent;

    const daysPassed = Math.max(currentDate.getDate(), 1); 
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const remainingDays = Math.max(daysInMonth - daysPassed, 1);
    const goalAmount = goal ? goal.targetAmount : (user.monthlyBudget * 0.8);

    const simData = {
      simulatedAmount,
      currentBalance,
      totalSpent: totalSpent || 1, // Fallback to avoid div by zero inside engine
      daysPassed,
      remainingDays,
      goalAmount
    };

    // Run Engine
    const result = simulateTransaction(simData);

    // 🔹 MOCK 15 DAYS HISTORY (Using current avg for realistic trend)
    const history = [];
    const avgDailySpend = (totalSpent / daysPassed) || 1200;
    let histBalance = user.monthlyIncome - (totalSpent - (avgDailySpend * 15)); // Approximation

    for (let i = 15; i >= 1; i--) {
        const dayNum = Math.max(1, daysPassed - i);
        // Add random variance for realistic UI
        const variance = (Math.random() - 0.5) * 400; 
        histBalance -= (avgDailySpend + variance);
        history.push({
            day: `D${dayNum}`,
            balance: Math.max(0, Math.round(histBalance)),
            isHistory: true
        });
    }

    // 🔹 PROJECT NEXT 15 DAYS
    const projection = [];
    let rollingBalance = currentBalance;
    const projectedDailySpend = result.after.dailySpend;

    for (let i = 1; i <= 15; i++) {
        rollingBalance -= projectedDailySpend;
        projection.push({
            day: `D${daysPassed + i}`,
            balance: Math.max(Math.round(rollingBalance), 0),
            isProjected: true
        });
    }

    const cashflow = [...history, ...projection];

    // Map output to frontend expectations
    return formatResponse(res, 200, 'Simulation successful', {
      newFutureBalance: result.predictedBalance,
      goalImpact: result.after.goalStatus === "DELAYED" ? 14 : -5, 
      riskStatus: result.after.goalStatus === "DELAYED" ? "HIGH" : 
                  result.after.runwayDays < 15 ? "CAUTION" : "SAFE",
      totalDiscretionary: simulatedAmount,
      runwayDays: result.after.runwayDays,
      dailySpend: result.after.dailySpend,
      cashflow
    });

  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

