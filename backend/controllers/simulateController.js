const User = require('../models/User');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');
const { formatResponse } = require('../utils/responseFormatter');
const simulateTransaction = require('../ML_models/simulationEngine');

exports.simulateTransaction = async (req, res) => {
  try {
    const { userId, food, entertainment, shopping, bills, transport, medical } = req.body;
    const simulatedAmount = (food || 0) + (entertainment || 0) + (shopping || 0) + (bills || 0) + (transport || 0) + (medical || 0);
    
    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');
    
    const goal = await Goal.findOne({ userId });

    // Fetch transactions from the start of the current month
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthlyTxns = await Transaction.find({ userId, date: { $gte: firstDay } });
    
    const totalSpent = monthlyTxns.reduce((acc, curr) => acc + (curr.amount < 0 ? Math.abs(curr.amount) : 0), 0);
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

    // 🔹 PROJECT NEXT 30 DAYS
    const projection = [];
    let rollingBalance = currentBalance;
    const projectedDailySpend = result.after.dailySpend;

    for (let i = 1; i <= 30; i++) {
        rollingBalance -= projectedDailySpend;
        projection.push({
            day: `D${daysPassed + i}`,
            balance: Math.round(rollingBalance),
            isProjected: true
        });
    }

    const cashflow = projection;

    // Calculate effective goal impact
    const safeIncome = user.monthlyIncome || 0;
    const safeBudget = user.monthlyBudget || 30000;
    const dailySavingRate = safeIncome > 0 ? Math.max(200, (safeIncome - safeBudget) / 30) : 200;
    
    let calculatedGoalImpact = 0;
    if (result.after.goalStatus === "DELAYED") {
        calculatedGoalImpact = Math.max(1, Math.ceil(Math.abs(goalAmount - result.predictedBalance) / dailySavingRate));
    } else {
        calculatedGoalImpact = -Math.max(1, Math.ceil(Math.abs(result.predictedBalance - goalAmount) / dailySavingRate));
    }

    // Map output to frontend expectations
    return formatResponse(res, 200, 'Simulation successful', {
      newFutureBalance: result.predictedBalance,
      goalImpact: calculatedGoalImpact, 
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

