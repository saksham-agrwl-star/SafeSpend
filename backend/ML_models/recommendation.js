const generateRecommendations = (data) => {
    const {
        category,
        categorySpend,
        categoryBudget,
        totalSpent,
        totalBudget,
        goalAmount,
        predictedBalance,
        remainingDays,
        behaviorTag
    } = data;

    const suggestions = [];
    const weeks = Math.ceil(remainingDays / 7) || 1;

    // 🔴 1. Overspending in category
    if (categorySpend > categoryBudget) {
        const extra = categorySpend - categoryBudget;
        const weeklyCut = Math.ceil(extra / weeks);

        suggestions.push({
            type: "overspending",
            message: `Reduce ₹${weeklyCut}/week in ${category} spending`
        });
    }

    // 🟡 2. Goal risk
    if (predictedBalance < goalAmount) {
        const gap = goalAmount - predictedBalance;
        const weeklySave = Math.ceil(gap / weeks);

        suggestions.push({
            type: "goal",
            message: `Save ₹${weeklySave}/week to stay on track for your goal`
        });
    }

    // 🔵 3. High overall spending
    const totalUsage = totalSpent / totalBudget;
    if (totalUsage > 0.85) {
        suggestions.push({
            type: "budget",
            message: "You are nearing your monthly budget limit"
        });
    }

    // 🟣 4. Impulse behavior
    if (behaviorTag === "impulse") {
        suggestions.push({
            type: "behavior",
            message: "Avoid late-night or impulse spending"
        });
    }

    return suggestions;
};

module.exports = generateRecommendations;