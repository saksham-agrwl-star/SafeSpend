/**
 * Analyzes the transaction against the user's Behavioral Profile.
 * Returns a risk score and tags.
 */
const analyzeBehavior = (transaction, profile) => {
  let riskScore = 0;
  const tags = [];
  let reason = '';

  // Simple rule-based behavior logic
  const isNight = transaction.time && (transaction.time >= '22:00' || transaction.time <= '05:00');
  
  if (isNight && (transaction.category === 'Food' || transaction.category === 'Entertainment')) {
    riskScore += 40;
    tags.push('Impulse');
    reason += 'Late-night spending in non-essential category. ';
  }

  // If this purchase amount is way above their daily average
  if (profile && profile.avgDailySpend > 0 && transaction.amount > profile.avgDailySpend * 2) {
    riskScore += 30;
    tags.push('Risky');
    reason += 'Amount is significantly higher than your daily average. ';
  }

  // Profile-based impulse rate modifier
  if (profile && profile.impulseRate > 0.7) {
    riskScore += 20;
    reason += 'High historical impulse rate active. ';
  }

  if (tags.length === 0) {
    tags.push('Normal');
  }

  return {
    riskScore: Math.min(riskScore, 100),
    tags,
    reason: reason.trim() || 'Typical spending pattern.'
  };
};

module.exports = { analyzeBehavior };
