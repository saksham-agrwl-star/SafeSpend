// Pre-loaded demo data for SpendSense hackathon presentation
// Covers 3 months of realistic Indian spending patterns

export const transactions = [
  // February 2025
  { id: 1, merchant: "Swiggy", amount: 890, category: "food", date: "2025-02-01 22:45", behaviorTag: "impulse", aiStatus: "warning", icon: "🍕" },
  { id: 2, merchant: "Spotify", amount: 119, category: "subscriptions", date: "2025-02-02 00:00", behaviorTag: "recurring", aiStatus: "safe", icon: "🎵" },
  { id: 3, merchant: "Amazon", amount: 3499, category: "shopping", date: "2025-02-03 14:20", behaviorTag: "planned", aiStatus: "safe", icon: "📦" },
  { id: 4, merchant: "Uber", amount: 320, category: "transport", date: "2025-02-05 09:10", behaviorTag: "planned", aiStatus: "safe", icon: "🚗" },
  { id: 5, merchant: "Zomato", amount: 650, category: "food", date: "2025-02-06 21:30", behaviorTag: "stress", aiStatus: "warning", icon: "🍛" },
  { id: 6, merchant: "Netflix", amount: 649, category: "subscriptions", date: "2025-02-07 00:00", behaviorTag: "recurring", aiStatus: "safe", icon: "🎬" },
  { id: 7, merchant: "BookMyShow", amount: 1200, category: "entertainment", date: "2025-02-09 16:45", behaviorTag: "planned", aiStatus: "safe", icon: "🎭" },
  { id: 8, merchant: "Swiggy", amount: 1240, category: "food", date: "2025-02-10 23:55", behaviorTag: "impulse", aiStatus: "blocked", icon: "🍕" },
  { id: 9, merchant: "HDFC Rent", amount: 12000, category: "rent", date: "2025-02-10 00:00", behaviorTag: "planned", aiStatus: "safe", icon: "🏠" },
  { id: 10, merchant: "Myntra", amount: 2800, category: "shopping", date: "2025-02-13 13:00", behaviorTag: "stress", aiStatus: "warning", icon: "👕" },
  { id: 11, merchant: "Rapido", amount: 78, category: "transport", date: "2025-02-14 08:30", behaviorTag: "planned", aiStatus: "safe", icon: "🛵" },
  { id: 12, merchant: "Zomato", amount: 450, category: "food", date: "2025-02-15 20:00", behaviorTag: "planned", aiStatus: "safe", icon: "🍛" },
  { id: 13, merchant: "Amazon", amount: 5600, category: "shopping", date: "2025-02-17 11:20", behaviorTag: "impulse", aiStatus: "blocked", icon: "📦" },
  { id: 14, merchant: "Gym Fee", amount: 1800, category: "health", date: "2025-02-18 00:00", behaviorTag: "recurring", aiStatus: "safe", icon: "💪" },
  { id: 15, merchant: "Swiggy", amount: 720, category: "food", date: "2025-02-19 22:10", behaviorTag: "stress", aiStatus: "warning", icon: "🍕" },
  { id: 16, merchant: "SALARY", amount: 45000, category: "income", date: "2025-02-28 00:00", behaviorTag: "planned", aiStatus: "safe", icon: "💰" },

  // March 2025
  { id: 17, merchant: "Swiggy", amount: 980, category: "food", date: "2025-03-01 23:30", behaviorTag: "impulse", aiStatus: "warning", icon: "🍕" },
  { id: 18, merchant: "Spotify", amount: 119, category: "subscriptions", date: "2025-03-02 00:00", behaviorTag: "recurring", aiStatus: "safe", icon: "🎵" },
  { id: 19, merchant: "Nykaa", amount: 1850, category: "shopping", date: "2025-03-04 15:00", behaviorTag: "planned", aiStatus: "safe", icon: "💄" },
  { id: 20, merchant: "Ola", amount: 240, category: "transport", date: "2025-03-05 09:45", behaviorTag: "planned", aiStatus: "safe", icon: "🚕" },
  { id: 21, merchant: "HDFC Rent", amount: 12000, category: "rent", date: "2025-03-10 00:00", behaviorTag: "planned", aiStatus: "safe", icon: "🏠" },
  { id: 22, merchant: "Swiggy", amount: 2800, category: "food", date: "2025-03-11 00:05", behaviorTag: "impulse", aiStatus: "blocked", icon: "🍕" },
  { id: 23, merchant: "Amazon", amount: 899, category: "shopping", date: "2025-03-12 14:00", behaviorTag: "planned", aiStatus: "safe", icon: "📦" },
  { id: 24, merchant: "Netflix", amount: 649, category: "subscriptions", date: "2025-03-14 00:00", behaviorTag: "recurring", aiStatus: "safe", icon: "🎬" },
  { id: 25, merchant: "Zomato", amount: 550, category: "food", date: "2025-03-16 19:30", behaviorTag: "planned", aiStatus: "safe", icon: "🍛" },
  { id: 26, merchant: "SALARY", amount: 45000, category: "income", date: "2025-03-31 00:00", behaviorTag: "planned", aiStatus: "safe", icon: "💰" },
];

export const budgetConfig = {
  monthly: 15000,
  goal: { name: "Goa Trip", target: 20000, saved: 8400, deadline: "May 2025" },
  categories: {
    food: { limit: 3000, spent: 2800 },
    shopping: { limit: 4000, spent: 3200 },
    transport: { limit: 1000, spent: 638 },
    subscriptions: { limit: 1500, spent: 1536 },
    entertainment: { limit: 1500, spent: 1200 },
    health: { limit: 2000, spent: 1800 },
  }
};

export const forecastData = [
  { day: "Apr 1", balance: 32000 },
  { day: "Apr 3", balance: 30800 },
  { day: "Apr 5", balance: 29500 },
  { day: "Apr 7", balance: 28200 },
  { day: "Apr 9", balance: 27100 },
  { day: "Apr 11", balance: 25900 },
  { day: "Apr 13", balance: 24600 },
  { day: "Apr 15", balance: 14000 }, // Rent hits
  { day: "Apr 17", balance: 13100 },
  { day: "Apr 19", balance: 11900 },
  { day: "Apr 21", balance: 10600 },
  { day: "Apr 23", balance: 9200 },
  { day: "Apr 25", balance: 7800 },
  { day: "Apr 27", balance: 6300 },
  { day: "Apr 29", balance: 4800 },
  { day: "Apr 30", balance: 3600 },
];

export const healthHistory = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 78 },
  { day: "Wed", score: 65 },
  { day: "Thu", score: 80 },
  { day: "Fri", score: 71 },
  { day: "Sat", score: 55 },
  { day: "Sun", score: 78 },
];

export const peerData = {
  avgSavingsRate: 18,
  yourSavingsRate: 23,
  avgFoodSpend: 3800,
  yourFoodSpend: 2800,
  percentile: 76,
};

export const features = [
  {
    number: "01",
    title: "Smart Budget Governor",
    description: "Set monthly budgets per category. AI enforces limits in real time — not at month end.",
    icon: "🛡️",
    color: "accent",
  },
  {
    number: "02",
    title: "Behavioral Fingerprinting",
    description: "Detects impulse patterns — late-night orders, stress purchases, FOMO spends.",
    icon: "🧠",
    color: "accent2",
  },
  {
    number: "03",
    title: "AI Prediction Engine",
    description: "Forecasts your balance 7, 14, 30 days into the future based on YOUR actual patterns.",
    icon: "📈",
    color: "accent",
  },
  {
    number: "04",
    title: "What-If Simulator",
    description: "Drag to simulate a purchase. See exactly what happens to your goal and balance.",
    icon: "⚡",
    color: "warn",
  },
  {
    number: "05",
    title: "Real-Time Interventions",
    description: "The moment a transaction threatens your budget, AI fires a specific, contextual alert.",
    icon: "🔔",
    color: "danger",
  },
  {
    number: "06",
    title: "Goal Tracker",
    description: "Every spend is evaluated against your goal. AI adjusts advice to keep you on track.",
    icon: "🎯",
    color: "accent2",
  },
  {
    number: "07",
    title: "Financial Health Score",
    description: "A daily 0–100 score based on spend discipline and goal progress. With streaks.",
    icon: "❤️",
    color: "danger",
  },
  {
    number: "08",
    title: "Conversational AI",
    description: '"How much can I spend this weekend?" — answered with full context of your finances.',
    icon: "💬",
    color: "accent",
  },
  {
    number: "09",
    title: "Peer Benchmarking",
    description: '"Users like you save 23% more this month." Anonymous, motivating, not shaming.',
    icon: "👥",
    color: "accent2",
  },
  {
    number: "10",
    title: "Expense Radar",
    description: "Detects unnecessary subscriptions and recurring charges. Proactively suggests cuts.",
    icon: "🔍",
    color: "warn",
  },
];
