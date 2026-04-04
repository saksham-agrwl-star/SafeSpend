/**
 * BehaviorEngine — ML model for real-time transaction risk profiling
 * Analyses hour, category, impulse flags, and spend patterns.
 */
const analyzeBehaviorML = ({ hour, category, impulseFlags = {}, spendingStyle = 'Moderate', impulseRate = 0.25 }) => {
  let riskScore = 0;
  const signals = [];

  const cat = (category || '').toLowerCase();
  const isLateNight = hour >= 22 || hour < 5;
  const isNonEssential = ['food', 'entertainment', 'shopping'].includes(cat);
  const isEssential = ['bills', 'transport', 'medical'].includes(cat);

  // ── Signal 1: Late-night + non-essential ──────────────────────────────────
  if (isLateNight && isNonEssential) {
    riskScore += 35;
    signals.push({ type: 'LATE_NIGHT_IMPULSE', severity: 'high', msg: 'Late-night spending in a non-essential category detected.' });
  } else if (isLateNight) {
    riskScore += 10;
    signals.push({ type: 'LATE_NIGHT', severity: 'low', msg: 'Transaction after 10 PM.' });
  }

  // ── Signal 2: User self-reported impulse flags ────────────────────────────
  if (impulseFlags.lateNight && isLateNight) {
    riskScore += 20;
    signals.push({ type: 'IMPULSE_FLAG_LATE_NIGHT', severity: 'medium', msg: 'You flagged yourself as a late-night impulse spender.' });
  }
  if (impulseFlags.stress) {
    riskScore += 10;
    signals.push({ type: 'STRESS_SPENDER', severity: 'medium', msg: 'Stress spending pattern active — you flagged this trigger.' });
  }
  const isWeekend = [0, 6].includes(new Date().getDay());
  if (impulseFlags.weekend && isWeekend && isNonEssential) {
    riskScore += 15;
    signals.push({ type: 'WEEKEND_IMPULSE', severity: 'medium', msg: 'Weekend spending in discretionary category.' });
  }

  // ── Signal 3: Speding style modifier ─────────────────────────────────────
  if (spendingStyle === 'Impulsive') {
    riskScore += 15;
    signals.push({ type: 'IMPULSIVE_PROFILE', severity: 'medium', msg: 'Your spending style is rated Impulsive.' });
  } else if (spendingStyle === 'Disciplined' && isNonEssential) {
    riskScore -= 10; // Credit for discipline
  }

  // ── Signal 4: ML impulse rate model ──────────────────────────────────────
  if (impulseRate > 0.7) {
    riskScore += 25;
    signals.push({ type: 'HIGH_IMPULSE_RATE', severity: 'high', msg: `High impulse rate (${Math.round(impulseRate * 100)}%) from behavior model.` });
  } else if (impulseRate > 0.4) {
    riskScore += 10;
    signals.push({ type: 'ELEVATED_IMPULSE_RATE', severity: 'medium', msg: `Elevated impulse rate (${Math.round(impulseRate * 100)}%) detected.` });
  }

  // Essential spend gets a large discount
  if (isEssential) riskScore = Math.max(0, riskScore - 30);

  if (signals.length === 0) {
    signals.push({ type: 'NORMAL_PATTERN', severity: 'low', msg: 'Typical spending pattern detected.' });
  }

  return {
    riskScore: Math.min(Math.max(riskScore, 0), 100),
    signals,
    lateNight: isLateNight,
    isNonEssential,
    primaryReason: signals[0]?.msg || 'Typical spending pattern.',
  };
};

module.exports = analyzeBehaviorML;
