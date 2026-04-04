/**
 * LLM Service — rule-based natural language generation for AI warnings.
 * Acts as a local alternative to a real LLM API.
 * Generates contextual, personalized messages based on user state.
 */
const generateWarning = ({ budgetUsed, category, lateNight, predictedBalance, amount, goalName, spendingStyle }) => {
  const cat    = (category || 'general').toLowerCase();
  const pct    = Math.round((budgetUsed || 0) * 100);
  const amtStr = `₹${parseFloat(amount || 0).toLocaleString()}`;
  const goal   = goalName || 'your savings goal';

  // Critical: Over budget
  if (budgetUsed >= 1.0 || predictedBalance < 0) {
    return `🔴 BLOCKED: Spending ${amtStr} on ${cat} would exceed your monthly budget entirely. SafeSpend is intervening to protect ${goal}.`;
  }

  // High usage: 85%+
  if (budgetUsed >= 0.85) {
    if (lateNight) {
      return `⚠️ You've used ${pct}% of your budget and it's past 10 PM. This ${cat} purchase risks a deficit. Sleep on it — 73% of late-night orders get regretted.`;
    }
    return `⚠️ Budget at ${pct}% — dangerously close to your limit. This ${amtStr} ${cat} spend pushes you into the warning zone. Consider delaying.`;
  }

  // Medium usage: 65–85%
  if (budgetUsed >= 0.65) {
    const templates = [
      `You're at ${pct}% of your monthly budget. The ${amtStr} ${cat} spend is borderline — mindful choice advised.`,
      `${pct}% budget used. ${amtStr} in ${cat} will leave you with limited buffer for essentials this month.`,
      `Budget health at ${pct}%. This ${cat} purchase is possible but consider if it aligns with ${goal}.`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Late night + non-essential even if budget is fine
  if (lateNight && ['food', 'entertainment', 'shopping'].includes(cat)) {
    return `🌙 Late-night ${cat} purchase of ${amtStr} detected. Your behavioral pattern suggests higher regret probability after 10 PM. Proceed with intent.`;
  }

  // Spending style warnings
  if (spendingStyle === 'Impulsive' && ['shopping', 'entertainment'].includes(cat)) {
    return `Your spending profile flags you as Impulsive. This ${amtStr} ${cat} purchase — is it planned or reactive? SafeSpend suggests a 5-minute pause.`;
  }

  // All clear
  const clearMessages = [
    `✅ ${amtStr} in ${cat} — within budget. Budget used: ${pct}%. You're on track for ${goal}.`,
    `✅ Transaction cleared. ${pct}% of budget used — healthy range. Keep it up!`,
    `✅ All clear! ${amtStr} fits your plan. ${100 - pct}% of budget still available this month.`,
  ];
  return clearMessages[Math.floor(Math.random() * clearMessages.length)];
};

module.exports = generateWarning;
