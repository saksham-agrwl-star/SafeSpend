/**
 * Calculates financial impacts of a transaction without saving it.
 */
const runPrediction = (user, profile, goal, transactionAmount) => {
  // Mock simplified math
  const currentBudgetLeft = user.monthlyBudget - (profile.avgDailySpend * 15); // Approximating mid-month
  const futureBalance = currentBudgetLeft - transactionAmount;
  
  // Calculate days left of budget remaining
  let daysLeft = 0;
  if (profile.avgDailySpend > 0) {
    daysLeft = Math.floor(futureBalance / profile.avgDailySpend);
  } else {
    daysLeft = 30; 
  }
  daysLeft = Math.max(0, daysLeft);

  let riskStatus = 'Safe';
  let goalImpactDays = 0;

  if (futureBalance < 0) {
    riskStatus = 'Critical';
    // Every 500 under balance delays goal by 1 day
    goalImpactDays = Math.ceil(Math.abs(futureBalance) / 500); 
  } else if (futureBalance < (user.monthlyBudget * 0.2)) {
    riskStatus = 'Warning';
  }

  return {
    predictedBalance: futureBalance,
    daysLeft,
    riskStatus,
    goalImpactDays
  };
};

module.exports = { runPrediction };
