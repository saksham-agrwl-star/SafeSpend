const simulateTransaction = (data) => {
    const {
        simulatedAmount,
        currentBalance,
        totalSpent,
        daysPassed,
        remainingDays,
        goalAmount
    } = data;

    // Calculate current daily burn rate
    const dailySpend = totalSpent / daysPassed;
    
    // Total projected spend for the rest of the month (excluding the "What-If" amount)
    const projectedRestOfMonthSpend = dailySpend * remainingDays;
    
    // Predicted balance at the end of the month
    const predictedBalance = currentBalance - projectedRestOfMonthSpend - simulatedAmount;
    
    // Determine goal status
    const goalStatus = predictedBalance >= goalAmount ? "ON-TRACK" : "DELAYED";
    
    // Calculate runway (how many days until balance hits zero at current rate)
    // New daily rate including the "What-If" amount spread over remaining days
    const newDailyRate = dailySpend + (simulatedAmount / remainingDays);
    const runwayDays = Math.floor(currentBalance / newDailyRate);

    return {
        predictedBalance: Math.round(predictedBalance),
        after: {
            goalStatus,
            runwayDays: Math.round(runwayDays),
            dailySpend: Math.round(newDailyRate)
        }
    };
};

module.exports = simulateTransaction;
