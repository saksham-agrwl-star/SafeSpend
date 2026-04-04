const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const { formatResponse } = require('../utils/responseFormatter');

exports.chatResponse = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');

    const profile = await BehaviorProfile.findOne({ userId });

    let aiResponse = "I'm SafeSpend AI. How can I help you manage your finances today?";
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('budget') || lowerMessage.includes('spend') || lowerMessage.includes('left')) {
      const remaining = user.monthlyIncome - (profile.avgDailySpend * 15); // Simulated velocity
      aiResponse = `**Budget Analysis**\nBased on your current burn rate:\n• You have an estimated **₹${remaining.toFixed(0)}** remaining this month.\n• Your average daily velocity is **₹${profile.avgDailySpend.toFixed(0)}**.\n• *Advice:* Keep your daily burns below ₹${(user.monthlyIncome * 0.4 / 30).toFixed(0)} to maintain Green status.`;
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      const activeGoal = user.goalName || 'your primary goal';
      aiResponse = `**Goal Trajectory**\nYou are currently tracking towards **${activeGoal}**.\n• Current Impulse Rate: **${(profile.impulseRate * 100).toFixed(1)}%**\n• *Insight:* If you reduce your discretionary spending by 15%, you could hit this target 22 days earlier!`;
    } else if (lowerMessage.includes('impulse') || lowerMessage.includes('late') || lowerMessage.includes('night')) {
      aiResponse = `**Behavioral Pattern Detected**\nYour profile indicates late-night cognitive fatigue.\n• **73%** of your impulse buys happen post-11 PM.\n• *Action Item:* Enable 'Zen Mode' on food delivery apps after 10 PM.`;
    } else {
      aiResponse = `I'm analyzing your profile. Your **Health Score is ${profile.financialHealthScore || 75}/100**.\nIs there a specific purchase you're worried about, or would you like a breakdown of your budget trajectory?`;
    }

    return formatResponse(res, 200, 'Success', {
      response: aiResponse
    });

  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
