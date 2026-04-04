const Transaction = require('../models/Transaction');
const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const Goal = require('../models/Goal');
const Prediction = require('../models/Prediction');
const { formatResponse } = require('../utils/responseFormatter');

const analyzeBehaviorML = require('../ML_models/behaviorEngine');
const predictImpact     = require('../ML_models/predictionEngine');
const makeAIDecision    = require('../ML_models/decisionEngine');
const generateWarning   = require('../ML_models/llmService');

/**
 * scanTransaction — called immediately on QR scan, before user confirms amount.
 * Returns AI pre-analysis to show on PaymentConfirmPage.
 */
exports.scanTransaction = async (req, res) => {
  try {
    const { userId, amount, merchant, upiId, category } = req.body;
    const parsedAmount = parseFloat(amount || 0);
    const cat = category || 'Other';
    const hour = new Date().getHours();

    const user    = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');

    const profile = await BehaviorProfile.findOne({ userId });
    const goal    = await Goal.findOne({ userId });

    // Real monthly spend
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed  = Math.max(1, now.getDate());

    const monthlyTxns = await Transaction.find({ userId, date: { $gte: firstDay } });
    const totalSpentThisMonth = monthlyTxns
      .filter(tx => tx.amount < 0)
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);

    // Run prediction (amount may be 0 if QR had no amount — just context)
    const predictionResult = predictImpact({
      monthlyBudget:       user.monthlyBudget || 30000,
      monthlyIncome:       user.monthlyIncome || user.monthlyBudget,
      totalSpentThisMonth,
      transactionAmount:   parsedAmount,
      goal,
      daysPassed,
      daysInMonth,
    });

    // Quick behavior scan
    const behaviorResult = analyzeBehaviorML({
      hour,
      category: cat,
      impulseFlags:  user.impulseFlags  || {},
      spendingStyle: user.spendingStyle || 'Moderate',
      impulseRate:   profile?.impulseRate || 0.25,
    });

    const aiResult = makeAIDecision({
      behaviorResult,
      predictionResult,
      amount: parsedAmount,
      category: cat,
      user,
    });

    return formatResponse(res, 200, 'Scan complete', {
      // Pre-scan context for display on PaymentConfirmPage
      predictedBalance: predictionResult.predictedBalance,
      goalImpactDays:   predictionResult.goalImpactDays,
      runwayDays:       predictionResult.runwayDays,
      goalName:         goal?.goalName || null,
      initialRisk:      aiResult.decision,
      budgetAfterTx:    predictionResult.budgetAfterTx,
      dailyBurnRate:    predictionResult.dailyBurnRate,
      totalSpentThisMonth: Math.round(totalSpentThisMonth),
      monthlyBudget:    user.monthlyBudget,
      budgetUsedPct:    Math.round((totalSpentThisMonth / (user.monthlyBudget || 30000)) * 100),
      merchant,
      upiId,
    });

  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};

/**
 * addTransaction — saves a completed transaction and updates behavior/prediction.
 */
exports.addTransaction = async (req, res) => {
  try {
    const {
      userId, transactionId, amount, category, merchant, upiId,
      time, tag, riskLevel, reason, wasBlocked, userProceed
    } = req.body;

    // Store as negative number for expenses (positive already = income)
    const txAmount = parseFloat(amount);
    const storeAmount = txAmount > 0 ? -Math.abs(txAmount) : txAmount; // always store spend as negative

    const transaction = new Transaction({
      userId,
      transactionId: transactionId || ('txn_' + Date.now()),
      amount: storeAmount,
      category: category || 'Other',
      merchant: merchant || 'Unknown',
      upiId,
      time: time || new Date().toLocaleTimeString(),
      tag,
      riskLevel: riskLevel || 'Low',
      reason: reason || 'QR Payment',
      wasBlocked: !!wasBlocked,
      userProceed: !!userProceed,
      date: new Date(),
    });

    await transaction.save();

    // Update BehaviorProfile impulse rate dynamically
    const profile = await BehaviorProfile.findOne({ userId });
    if (profile) {
      const hour = new Date().getHours();
      const isLateNight = hour >= 22 || hour < 5;
      const isNonEssential = ['food', 'shopping', 'entertainment'].includes((category || '').toLowerCase());

      // Weighted moving average of impulse rate
      const wasImpulse = isLateNight && isNonEssential ? 1 : 0;
      profile.impulseRate = Math.min(0.95, profile.impulseRate * 0.85 + wasImpulse * 0.15);
      profile.avgDailySpend = Math.round(
        profile.avgDailySpend * 0.8 + Math.abs(txAmount) * 0.2
      );
      profile.lastUpdated = Date.now();
      await profile.save();
    }

    // Store latest prediction snapshot
    const user = await User.findOne({ userId });
    const goal = await Goal.findOne({ userId });
    if (user && profile) {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysPassed  = Math.max(1, now.getDate());
      const allTxns = await Transaction.find({ userId, date: { $gte: firstDay } });
      const totalSpent = allTxns.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

      const pred = predictImpact({
        monthlyBudget: user.monthlyBudget,
        monthlyIncome: user.monthlyIncome || user.monthlyBudget,
        totalSpentThisMonth: totalSpent,
        transactionAmount: 0,
        goal,
        daysPassed,
        daysInMonth,
      });

      await new Prediction({
        userId,
        predictedBalance: pred.predictedBalance,
        daysLeft:         pred.runwayDays,
        riskStatus:       pred.riskStatus,
        goalImpactDays:   pred.goalImpactDays,
      }).save();
    }

    return formatResponse(res, 201, 'Transaction recorded', { transaction });

  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
