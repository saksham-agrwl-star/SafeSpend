# 💸 SafeSpend — AI-Powered Smart Spending System

## 🌐 Live Demo
👉 [https://safe-spend-henna.vercel.app/](https://safe-spend-henna.vercel.app/)

SafeSpend is a real-time financial decision system that analyzes user transactions **before payment** and provides actionable insights, warnings, and recommendations to help users stay within budget and achieve their financial goals.

---

## 🚀 Features

- 🔍 **Real-Time Transaction Analysis**
  - Scan QR / UPI or enter amount manually
  - Extract transaction details instantly

- 🧠 **Decision Engine**
  - Evaluates risk in real time
  - Output: `SAFE` / `WARNING` / `BLOCK`

- 📊 **Prediction System**
  - Forecasts future balance
  - Detects overspending trends

- 💡 **Recommendation Engine**
  - Suggests spending cuts and savings targets based on user behavior

- 🤖 **AI Explanation Layer**
  - Converts output into human-readable warnings
  - Powered by Groq LLM

- 📱 **User Interface**
  - Alert popups before payment
  - Dashboard insights

---

## 🧠 How It Works
User → Fetch Data → Analyze → Decide → Predict → Recommend → AI Explain → UI

---

## ⚙️ Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Backend  | Node.js, Express.js         |
| Database | MongoDB                     |
| Frontend | React.js, Tailwind CSS      |
| AI       | Groq API                    |

---

## 🛠️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/saksham-agrwl-star/SafeSpend.git
cd safespend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file in the backend root:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
```

### 4. Run the server
```bash
npm run dev
```

---

## 🎯 Key Design Principles

- ⚡ Real-time decision making
- 🔧 Rule-based logic (no heavy ML required)
- 🤖 AI used only for explanation, not decision
- 📈 Data-driven recommendations
- 🧩 Modular architecture

---

## 🏆 Use Cases

- Prevent impulsive spending
- Stay within monthly budget
- Get actionable financial advice
- Improve overall financial awareness
