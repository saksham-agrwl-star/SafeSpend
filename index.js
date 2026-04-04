const behaviorEngine = require("./behavior/behaviorEngine");
const {
  predictMonthlySpend,
  willOverspend
} = require("./prediction/spendPredictor");

const analyzeRisk = require("./ai/behaviour/intervention/riskAnalyzer");
const triggerAlert = require("./ai/behaviour/intervention/alertSystem");
const preSpendCheck = require("./ai/behaviour/intervention/preSpendAnalyzer");

const buildUserProfile = require("./personalization/userMemory");

const runAI = async (transactions, newTransaction, user) => {
  // 1. Build user memory
  const userProfile = buildUserProfile(transactions);

  // 2. Behavior
  const behavior = await behaviorEngine(transactions, newTransaction);

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  behavior.budgetUsed = ((totalSpent / user.monthlyBudget) * 100).toFixed(0);

  // 3. Prediction
  const predictedSpend = predictMonthlySpend(transactions);
  const overspending = willOverspend(predictedSpend, user.monthlyBudget);

  const prediction = {
    predictedSpend,
    overspending,
    daysLeft: Math.max(
      1,
      Math.floor((user.monthlyBudget - totalSpent) / (predictedSpend / 30))
    )
  };

  // 4. Risk
  const risk = analyzeRisk(behavior, newTransaction, prediction);

  // 5. PRE-SPEND CHECK 🔥
  const preCheck = preSpendCheck(behavior, newTransaction, prediction);

  // 6. Alert
  const alert = await triggerAlert(risk, {
    behavior,
    transaction: newTransaction,
    prediction,
    goal: user.savingsGoal,
    risk
  });

  return {
    userProfile,
    behavior,
    prediction,
    risk,
    preCheck,
    alert
  };
};

module.exports = runAI;