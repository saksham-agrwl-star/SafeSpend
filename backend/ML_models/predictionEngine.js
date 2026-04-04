/**
 * PredictionEngine — financial impact model for a prospective transaction
 * Uses real budget, actual spend, and goal data.
 */
const predictImpact = ({ monthlyBudget, monthlyIncome, totalSpentThisMonth, transactionAmount, goal, daysPassed, daysInMonth }) => {
  const safeAmount   = parseFloat(transactionAmount) || 0;
  const safeBudget   = parseFloat(monthlyBudget)    || 30000;
  const safeSpent    = parseFloat(totalSpentThisMonth) || 0;
  const safeIncome   = parseFloat(monthlyIncome)    || safeBudget;
  const dp           = Math.max(1, daysPassed);
  const remaining    = Math.max(1, daysInMonth - dp);

  // Current daily burn rate
  const dailyBurn    = safeSpent / dp;

  // Projected remaining spend WITHOUT this transaction
  const projectedRemainingSpend = dailyBurn * remaining;

  // Budget left after today's transaction
  const budgetAfterTx = safeBudget - safeSpent - safeAmount;

  // Predicted end-of-month balance (income - all projected expenses)
  const predictedBalance = safeIncome - safeSpent - safeAmount - projectedRemainingSpend;

  // Goal impact: how many extra days to recover if this goes through
  let goalImpactDays = 0;
  if (goal && goal.targetAmount > 0) {
    const savedSoFar     = goal.savedAmount || 0;
    const remaining_target = goal.targetAmount - savedSoFar;
    const dailySavingRate = safeBudget > 0 ? Math.max(1, (safeIncome - safeBudget) / daysInMonth) : 1;

    if (predictedBalance < 0) {
      goalImpactDays = Math.ceil(Math.abs(predictedBalance) / dailySavingRate);
    } else if (budgetAfterTx < safeBudget * 0.15) {
      goalImpactDays = Math.ceil(safeAmount / dailySavingRate / 2);
    }
  }

  // Risk categorisation
  let riskStatus = 'SAFE';
  if (budgetAfterTx < 0 || predictedBalance < 0) {
    riskStatus = 'BLOCK';
  } else if (budgetAfterTx < safeBudget * 0.15) {
    riskStatus = 'WARNING';
  } else if (budgetAfterTx < safeBudget * 0.30) {
    riskStatus = 'CAUTION';
  }

  // Runway: days until funds run out at current rate + this transaction
  const newDailyBurn  = (safeSpent + safeAmount) / dp;
  const runwayDays    = newDailyBurn > 0 ? Math.floor((safeBudget - safeSpent - safeAmount) / newDailyBurn) : remaining;

  return {
    predictedBalance:  Math.round(predictedBalance),
    budgetAfterTx:     Math.round(budgetAfterTx),
    dailyBurnRate:     Math.round(dailyBurn),
    runwayDays:        Math.max(0, runwayDays),
    goalImpactDays:    Math.max(0, goalImpactDays),
    riskStatus,
    goalName: goal?.goalName || null,
    projectedMonthEndBalance: Math.round(predictedBalance),
  };
};

module.exports = predictImpact;
