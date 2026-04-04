const User = require('../models/User');
const BehaviorProfile = require('../models/BehaviorProfile');
const { formatResponse } = require('../utils/responseFormatter');

exports.chatResponse = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const user = await User.findOne({ userId });
    if (!user) return formatResponse(res, 404, 'User not found');

    const profile = await BehaviorProfile.findOne({ userId });

    // Simple rule-based mock response logic. 
    // In a real scenario, we'd pass `user` and `profile` as context to an OpenAI system prompt.
    let aiResponse = "I'm SpendSense AI. How can I help you manage your finances today?";
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('budget') || lowerMessage.includes('spend')) {
      const remaining = user.monthlyBudget - (profile.avgDailySpend * 15); // Mocked
      aiResponse = `Based on your profile, you have an estimated ₹${remaining} left. Your average daily spend is around ₹${profile.avgDailySpend.toFixed(2)}. Watch out for those impulse buys!`;
    } else if (lowerMessage.includes('goal')) {
      aiResponse = `You are saving for ${user.goalName}. Keep your impulse rate low (currently: ${profile.impulseRate}) to reach it faster!`;
    }

    return formatResponse(res, 200, 'Success', {
      response: aiResponse
    });

  } catch (error) {
    return formatResponse(res, 500, error.message);
  }
};
