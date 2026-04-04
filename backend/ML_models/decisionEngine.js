/**
 * DecisionEngine — final AI verdict combining behavior + prediction scores.
 * Returns: SAFE | CAUTION | WARNING | BLOCK
 * Also generates a human-readable intervention message.
 */
const makeAIDecision = ({ behaviorResult, predictionResult, amount, category, user }) => {
  const { riskScore, signals, lateNight } = behaviorResult;
  const { riskStatus, budgetAfterTx, goalImpactDays, runwayDays, goalName, dailyBurnRate } = predictionResult;

  const cat = (category || '').toLowerCase();
  const safeBudget = user?.monthlyBudget || 30000;

  // ── Compute composite risk ────────────────────────────────────────────────
  let compositeRisk = riskScore; // 0–100 from behavior
  if (riskStatus === 'BLOCK')   compositeRisk += 50;
  if (riskStatus === 'WARNING') compositeRisk += 25;
  if (riskStatus === 'CAUTION') compositeRisk += 10;
  compositeRisk = Math.min(compositeRisk, 100);

  // ── Final decision ────────────────────────────────────────────────────────
  let decision;
  if (compositeRisk >= 80 || riskStatus === 'BLOCK') {
    decision = 'BLOCK';
  } else if (compositeRisk >= 55 || riskStatus === 'WARNING') {
    decision = 'WARNING';
  } else if (compositeRisk >= 30 || riskStatus === 'CAUTION') {
    decision = 'CAUTION';
  } else {
    decision = 'SAFE';
  }

  // ── Generate AI message ───────────────────────────────────────────────────
  let message = '';
  const amtStr = `₹${parseFloat(amount).toLocaleString()}`;

  if (decision === 'BLOCK') {
    if (budgetAfterTx < 0) {
      message = `Blocked: Spending ${amtStr} on ${cat} would push your budget ₹${Math.abs(budgetAfterTx).toLocaleString()} into deficit.`;
    } else if (goalImpactDays > 7) {
      message = `Blocked: This ${cat} spend delays your ${goalName || 'goal'} by ${goalImpactDays} days. SafeSpend is protecting your future.`;
    } else {
      message = `This ${amtStr} transaction is flagged as high risk — ${signals[0]?.msg || 'multiple risk patterns detected.'}`;
    }
  } else if (decision === 'WARNING') {
    if (lateNight) {
      message = `Late-night ${cat} spend of ${amtStr}? You often regret these. Budget remaining after this: ₹${Math.max(0, budgetAfterTx).toLocaleString()}.`;
    } else if (goalImpactDays > 0) {
      message = `Caution: This ${amtStr} spend delays your ${goalName || 'savings goal'} by ~${goalImpactDays} day${goalImpactDays > 1 ? 's' : ''}.`;
    } else {
      message = `Budget alert: After this payment, only ₹${Math.max(0, budgetAfterTx).toLocaleString()} remains for the month.`;
    }
  } else if (decision === 'CAUTION') {
    message = `Heads up: Your budget will be at ${Math.round(((safeBudget - budgetAfterTx) / safeBudget) * 100)}% after this. Daily burn: ₹${dailyBurnRate.toLocaleString()}/day.`;
  } else {
    message = `All clear. ${amtStr} fits comfortably within budget. Runway: ${runwayDays} days remaining.`;
  }

  // ── Intervention strategies ──────────────────────────────────────────────
  const interventions = [];
  if (decision === 'BLOCK' && goalImpactDays > 0) {
    interventions.push({ type: 'DELAY', label: 'Delay 24h', desc: 'Wait until tomorrow — 80% of late-night purchases are regretted.' });
    interventions.push({ type: 'DENY', label: 'Cancel Payment', desc: 'Skip and protect your goal.' });
  } else if (decision === 'WARNING') {
    interventions.push({ type: 'PROCEED', label: 'Proceed Anyway', desc: 'Override AI warning and continue.' });
    interventions.push({ type: 'DELAY', label: 'Add to Wishlist', desc: 'Revisit tomorrow when budget refreshes.' });
  }

  return {
    decision,
    compositeRiskScore: Math.round(compositeRisk),
    message,
    signals,
    interventions,
    financials: {
      budgetAfterTx:  Math.max(0, budgetAfterTx),
      goalImpactDays,
      runwayDays,
      goalName,
      dailyBurnRate,
    },
  };
};

module.exports = makeAIDecision;
