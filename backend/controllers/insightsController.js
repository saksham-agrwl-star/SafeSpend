const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const Transaction = require('../models/Transaction');
const { formatResponse } = require('../utils/responseFormatter');

exports.getInsights = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    const profile = await BehaviorProfile.findOne({ userId });
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    if (!user) return formatResponse(res, 404, 'User not found');

    // ── 1. HEATMAP: Hour × Day spending intensity ──────────────────────────
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hourBuckets = {
      '12am': [0,0,0,0,0,0,0], '3am':  [0,0,0,0,0,0,0], '6am':  [0,0,0,0,0,0,0],
      '9am':  [0,0,0,0,0,0,0], '12pm': [0,0,0,0,0,0,0], '3pm':  [0,0,0,0,0,0,0],
      '6pm':  [0,0,0,0,0,0,0], '9pm':  [0,0,0,0,0,0,0], '11pm': [0,0,0,0,0,0,0],
    };

    let lateNightCount = 0, weekendCount = 0, foodCount = 0, totalTxCount = transactions.length;

    transactions.forEach(tx => {
      if (tx.amount >= 0) return; // skip income
      const date = new Date(tx.date);
      const dayIdx = date.getDay();
      const hour = date.getHours();
      const amt = Math.abs(tx.amount);

      if (hour >= 22 || hour < 4) lateNightCount++;
      if (dayIdx === 0 || dayIdx === 6) weekendCount++;
      if ((tx.category || '').toLowerCase() === 'food') foodCount++;

      let bucket = '12pm';
      if (hour < 3)       bucket = '12am';
      else if (hour < 6)  bucket = '3am';
      else if (hour < 9)  bucket = '6am';
      else if (hour < 12) bucket = '9am';
      else if (hour < 15) bucket = '12pm';
      else if (hour < 18) bucket = '3pm';
      else if (hour < 21) bucket = '6pm';
      else if (hour < 23) bucket = '9pm';
      else                bucket = '11pm';

      // Accumulate intensity (capped at 100)
      hourBuckets[bucket][dayIdx] = Math.min(100, hourBuckets[bucket][dayIdx] + Math.round(amt / 100));
    });

    const heatmapData = Object.keys(hourBuckets).map(hour => ({
      hour,
      Mon: Math.round(hourBuckets[hour][1]),
      Tue: Math.round(hourBuckets[hour][2]),
      Wed: Math.round(hourBuckets[hour][3]),
      Thu: Math.round(hourBuckets[hour][4]),
      Fri: Math.round(hourBuckets[hour][5]),
      Sat: Math.round(hourBuckets[hour][6]),
      Sun: Math.round(hourBuckets[hour][0]),
    }));

    // ── 2. PERSONALITY RADAR: from impulseFlags + spendingStyle + profile ──
    const impulseRate = profile ? Math.round(profile.impulseRate * 100) : 30;
    const disciplineScore = Math.max(10, 100 - impulseRate);
    const personalityData = [
      { subject: 'Impulsive',   A: impulseRate },
      { subject: 'Disciplined', A: disciplineScore },
      { subject: 'Social',      A: user.impulseFlags?.weekend ? 75 : 35 },
      { subject: 'Cautious',    A: user.spendingStyle === 'Disciplined' ? 80 : 30 },
      { subject: 'Tech-Heavy',  A: 50 },
      { subject: 'Foodie',      A: totalTxCount > 0 ? Math.min(95, Math.round((foodCount / totalTxCount) * 200)) : 40 },
    ];

    // ── 3. BEHAVIORAL TRAITS: derived from real flags ──────────────────────
    const lateNightPct = totalTxCount > 0 ? Math.round((lateNightCount / totalTxCount) * 100) : 0;
    const weekendPct   = totalTxCount > 0 ? Math.round((weekendCount   / totalTxCount) * 100) : 0;
    const stressTrigger = user.impulseFlags?.stress;

    const traits = [
      {
        icon: 'Moon',
        title: 'Late Night Spender',
        stat: `${lateNightPct}%`,
        desc: lateNightPct > 30
          ? `${lateNightPct}% of your transactions happen after 10 PM. Cognitive resistance drops significantly in late hours.`
          : `Only ${lateNightPct}% of spending happens at night. Good discipline after hours.`,
        color: '#8B5CF6',
        level: lateNightPct > 50 ? 'high' : lateNightPct > 20 ? 'medium' : 'low',
      },
      {
        icon: 'Calendar',
        title: 'Weekend Enthusiast',
        stat: `${weekendPct}%`,
        desc: weekendPct > 40
          ? `${weekendPct}% of discretionary spend happens on Sat-Sun. Social pressure drives significant weekend outflow.`
          : `Your weekend spending is ${weekendPct}% of total — within healthy range.`,
        color: '#F59E0B',
        level: weekendPct > 50 ? 'high' : weekendPct > 30 ? 'medium' : 'low',
      },
      {
        icon: 'AlertTriangle',
        title: 'Stress Spender',
        stat: stressTrigger ? '2.4×' : '1.0×',
        desc: stressTrigger
          ? 'You flagged stress as an impulse trigger. Spending typically spikes during high-pressure periods — comfort spending detected.'
          : 'No stress spending pattern flagged. Maintain healthy emotional distance from discretionary purchases.',
        color: '#EF4444',
        level: stressTrigger ? 'high' : 'low',
      },
    ];

    // ── 4. PULSE: weekly stress vs spend (approximated from real txn volume) ─
    const now = new Date();
    const pulseData = [1, 2, 3, 4].map(w => {
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (4 - w) * 7);
      const weekEnd   = new Date(weekStart.getTime() + 7 * 24 * 3600 * 1000);
      const weekTxns  = transactions.filter(tx => {
        const d = new Date(tx.date);
        return d >= weekStart && d < weekEnd && tx.amount < 0;
      });
      const spend = weekTxns.reduce((s, tx) => s + Math.abs(tx.amount), 0);
      // Stress proxy: normalized impulse rate + late-night txns in the week
      const lateInWeek = weekTxns.filter(t => {
        const h = new Date(t.date).getHours();
        return h >= 22 || h < 4;
      }).length;
      const stress = Math.min(95, Math.round(impulseRate * 0.6 + lateInWeek * 8));
      return { week: `W${w}`, stress, spend };
    });

    // ── 5. BENCHMARK: Compare user spend to hypothetical peer group ─────────
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthlyTxns = transactions.filter(tx => new Date(tx.date) >= firstDay && tx.amount < 0);
    const userMonthlySpend = monthlyTxns.reduce((s, tx) => s + Math.abs(tx.amount), 0);
    const budget = user.monthlyBudget || 30000;
    // Peer avg is typically 80% of user budget; top 10% is 55%
    const peerAvg = Math.round(budget * 0.75);
    const top10pct = Math.round(budget * 0.52);

    return formatResponse(res, 200, 'Insights loaded', {
      heatmapData,
      personalityData,
      traits,
      pulseData,
      benchmark: {
        userSpend: userMonthlySpend,
        peerAvg,
        top10pct,
        spendVsPeer: userMonthlySpend > peerAvg
          ? `+₹${(userMonthlySpend - peerAvg).toLocaleString()}`
          : `-₹${(peerAvg - userMonthlySpend).toLocaleString()}`,
        spendPctVsPeer: peerAvg > 0 ? Math.round(((userMonthlySpend - peerAvg) / peerAvg) * 100) : 0,
        savingsPercentile: userMonthlySpend < top10pct ? 'Top 10%' : userMonthlySpend < peerAvg ? 'Top 30%' : '23rd',
      },
      userFlags: {
        lateNight: user.impulseFlags?.lateNight,
        weekend:   user.impulseFlags?.weekend,
        stress:    user.impulseFlags?.stress,
        spendingStyle: user.spendingStyle,
        impulseRate,
      }
    });

  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
