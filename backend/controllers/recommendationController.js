const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Goal = require("../models/Goal");

const generateRecommendations = require("../ML_models/recommendation");

const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔹 1. Fetch user budget
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const budget = user.monthlyBudget || 30000; // Fallback budget

    // 🔹 2. Get all transactions (this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: startOfMonth }
    });

    // 🔹 3. Total spending
    let totalSpent = 0;
    const categoryMap = {};

    transactions.forEach(txn => {
      // Assuming amount is positive or negative. Let's assume absolute spending
      if (txn.amount > 0) return; // Skip income
      const amt = Math.abs(txn.amount);
      totalSpent += amt;

      if (!categoryMap[txn.category]) {
        categoryMap[txn.category] = 0;
      }

      categoryMap[txn.category] += amt;
    });

    // 🔹 4. Find highest spending category
    let topCategory = null;
    let maxSpend = 0;

    for (let cat in categoryMap) {
      if (categoryMap[cat] > maxSpend) {
        maxSpend = categoryMap[cat];
        topCategory = cat;
      }
    }

    if (!topCategory) topCategory = 'Shopping'; // Dummy fallback

    // 🔹 5. Category budget (simple split)
    const categoryBudget = budget * 0.3; // 30% rule

    // 🔹 6. Goal
    const goal = await Goal.findOne({ userId });

    const goalAmount = goal ? goal.targetAmount : 0; // Using targetAmount based on earlier schemas

    // 🔹 7. Remaining days
    const today = new Date();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const remainingDays = Math.ceil(
      (endOfMonth - today) / (1000 * 60 * 60 * 24)
    );

    // 🔹 8. Prediction (simple)
    const daysPassed = Math.max(1, today.getDate());
    const dailyAvg = totalSpent / daysPassed;

    const predictedBalance =
      budget - (totalSpent + dailyAvg * remainingDays);

    // 🔹 9. Behavior detection
    const lateNightCount = transactions.filter(
      txn => new Date(txn.date).getHours() > 22 || new Date(txn.date).getHours() < 4
    ).length;

    const behaviorTag = lateNightCount > 5 ? "impulse" : "normal";

    // 🔹 10. Build input for engine
    const inputData = {
      category: topCategory,
      categorySpend: maxSpend,
      categoryBudget,
      totalSpent,
      totalBudget: budget,
      goalAmount,
      predictedBalance,
      remainingDays,
      behaviorTag
    };

    // 🔹 11. Generate recommendations
    const recommendations = generateRecommendations(inputData);

    res.json({
      success: true,
      data: {
        totalSpent,
        topCategory,
        predictedBalance,
        recommendations
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = { getRecommendations };
