const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');

const analyzeBehaviorML = require('../ML_models/behaviorEngine');
const predictImpact     = require('../ML_models/predictionEngine');
const makeAIDecision    = require('../ML_models/decisionEngine');
const generateWarning   = require('../ML_models/llmService');

exports.aiCheck = async (req, res) => {
  try {
    const { userId, amount, category, localTimeHr, merchant, isEmergency, isSubscription } = req.body;

    const parsedAmount = parseFloat(amount || 0);
    const hour = parseInt(localTimeHr ?? new Date().getHours());
    const cat  = category || 'Other';

    // ── 1. Fetch user context from DB ────────────────────────────────────────
    const user    = await User.findOne({ userId });
    const profile = await BehaviorProfile.findOne({ userId });
    const goal    = await Goal.findOne({ userId });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // ── 2. Real monthly spend from transactions ───────────────────────────────
    const now       = new Date();
    const firstDay  = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed  = Math.max(1, now.getDate());

    const monthlyTxns = await Transaction.find({ userId, date: { $gte: firstDay } });
    const totalSpentThisMonth = monthlyTxns
      .filter(tx => tx.amount < 0)
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);

    // Category-level spend for the current month
    const catSpend = monthlyTxns
      .filter(tx => tx.amount < 0 && (tx.category || '').toLowerCase() === cat.toLowerCase())
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);

    const catLimit = (user.categoryLimits || {})[cat.toLowerCase()] || (user.monthlyBudget * 0.3);
    const budgetUsed = totalSpentThisMonth / (user.monthlyBudget || 30000);

    // ── 3. Behavior ML ───────────────────────────────────────────────────────
    const behaviorResult = analyzeBehaviorML({
      hour,
      category: cat,
      impulseFlags:  user.impulseFlags  || {},
      spendingStyle: user.spendingStyle || 'Moderate',
      impulseRate:   profile?.impulseRate || 0.25,
    });

    // Boost risk if category limit is exceeded
    if (catSpend + parsedAmount > catLimit) {
      behaviorResult.riskScore = Math.min(100, behaviorResult.riskScore + 30);
      behaviorResult.signals.push({
        type: 'CATEGORY_OVER_LIMIT',
        severity: 'high',
        msg: `Your ${cat} budget (₹${catLimit.toLocaleString()}) will be exceeded by this purchase.`,
      });
    }

    // Emergency override: reduce risk
    if (isEmergency) {
      behaviorResult.riskScore = Math.max(0, behaviorResult.riskScore - 40);
      behaviorResult.signals = [{ type: 'EMERGENCY', severity: 'low', msg: 'Marked as emergency — AI risk reduced.' }];
    }

    // ── 4. Prediction ML ─────────────────────────────────────────────────────
    const predictionResult = predictImpact({
      monthlyBudget:       user.monthlyBudget || 30000,
      monthlyIncome:       user.monthlyIncome || user.monthlyBudget || 30000,
      totalSpentThisMonth,
      transactionAmount:   parsedAmount,
      goal,
      daysPassed,
      daysInMonth,
    });

    // ── 5. Decision ML ───────────────────────────────────────────────────────
    const aiResult = makeAIDecision({
      behaviorResult,
      predictionResult,
      amount: parsedAmount,
      category: cat,
      user,
    });

    // ── 6. LLM message ───────────────────────────────────────────────────────
    const llmMessage = generateWarning({
      budgetUsed,
      category: cat,
      lateNight: behaviorResult.lateNight,
      predictedBalance: predictionResult.predictedBalance,
      amount: parsedAmount,
      goalName: goal?.goalName,
      spendingStyle: user.spendingStyle,
    });

    // If LLM gives a more contextual message, prefer it for SAFE/CAUTION
    const finalMessage = ['SAFE', 'CAUTION'].includes(aiResult.decision)
      ? llmMessage
      : aiResult.message;

    return res.status(200).json({
      success: true,
      data: {
        risk:   aiResult.decision,
        score:  aiResult.compositeRiskScore,
        preCheck: {
          allow:   aiResult.decision !== 'BLOCK',
          message: finalMessage,
          predictedBalance: predictionResult.predictedBalance,
        },
        signals:       aiResult.signals,
        interventions: aiResult.interventions,
        financials: {
          budgetAfterTx:       predictionResult.budgetAfterTx,
          goalImpactDays:      predictionResult.goalImpactDays,
          runwayDays:          predictionResult.runwayDays,
          goalName:            goal?.goalName || null,
          dailyBurnRate:       predictionResult.dailyBurnRate,
          totalSpentThisMonth: Math.round(totalSpentThisMonth),
          monthlyBudget:       user.monthlyBudget,
          catSpend:            Math.round(catSpend),
          catLimit:            Math.round(catLimit),
          budgetUsedPct:       Math.round(budgetUsed * 100),
        },
        merchant: merchant || 'Unknown',
        category: cat,
        amount:   parsedAmount,
      }
    });

  } catch (error) {
    console.error('AI Check Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
