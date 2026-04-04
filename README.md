# 💸 SafeSpend — AI-Powered Smart Spending System

SafeSpend is a real-time financial decision system that analyzes user transactions **before payment** and provides actionable insights, warnings, and recommendations to help users stay within budget and achieve their financial goals.

---

## 🚀 Features

- 🔍 **Real-Time Transaction Analysis**
  - Scan QR / UPI or enter amount manually
  - Extract transaction details instantly

- 🧠 **Decision Engine**
  - Evaluates risk (SAFE / WARNING / BLOCK)
  - Based on user behavior, budget usage, and spending patterns

- 📊 **Prediction System**
  - Forecasts future balance
  - Detects if user will exceed budget

- 💡 **Recommendation Engine**
  - Suggests actionable steps:
    - Reduce ₹X/week
    - Save ₹Y/week
  - Personalized based on spending habits

- 🤖 **AI Explanation Layer**
  - Converts system output into human-readable warnings
  - Uses LLM (Groq) for natural language responses

- 📱 **User Interface**
  - Alert popups before payment
  - Dashboard insights & suggestions

---

## 🧠 How It Works
# 💸 SafeSpend — AI-Powered Smart Spending System

SafeSpend is a real-time financial decision system that analyzes user transactions **before payment** and provides actionable insights, warnings, and recommendations to help users stay within budget and achieve their financial goals.

---

## 🚀 Features

- 🔍 **Real-Time Transaction Analysis**
  - Scan QR / UPI or enter amount manually
  - Extract transaction details instantly

- 🧠 **Decision Engine**
  - Evaluates risk (SAFE / WARNING / BLOCK)
  - Based on user behavior, budget usage, and spending patterns

- 📊 **Prediction System**
  - Forecasts future balance
  - Detects if user will exceed budget

- 💡 **Recommendation Engine**
  - Suggests actionable steps:
    - Reduce ₹X/week
    - Save ₹Y/week
  - Personalized based on spending habits

- 🤖 **AI Explanation Layer**
  - Converts system output into human-readable warnings
  - Uses LLM (Groq) for natural language responses

- 📱 **User Interface**
  - Alert popups before payment
  - Dashboard insights & suggestions

---

## 🧠 How It Works
User → Process → Fetch Data → Analyze → Decide → Predict → Recommend → Explain (AI) → UI


---

## ⚙️ Tech Stack

### 🖥️ Backend
- Node.js
- Express.js

### 🗄️ Database
- MongoDB (User, Transactions, Goals)

### 🧠 Core Logic
- Decision Engine (rule-based)
- Prediction Engine (mathematical modeling)
- Recommendation Engine (dynamic calculations)

### 🤖 AI Layer
- Groq API (LLM for generating warnings)

### 🌐 Frontend
- React.js
- Tailwind CSS

---

## 📂 Project Structure
backend/
│
├── controllers/
│ ├── decisionController.js
│ ├── recommendationController.js
│
├── services/
│ ├── decisionEngine.js
│ ├── predictionEngine.js
│ ├── recommendationEngine.js
│ ├── behaviorEngine.js
│ ├── llmService.js
│
├── models/
│ ├── User.js
│ ├── Transaction.js
│ ├── Goal.js
│
├── routes/
│ ├── decisionRoutes.js
│ ├── recommendationRoutes.js
│
├── utils/
│ ├── qrParser.js
│ ├── categoryMapper.js
│
├── server.js


---

## 🧪 Example API
### 📌 Check Transaction Decision
**POST** `/api/decision/check`
```json
{
  "amount": 2500,
  "category": "food",
  "hour": 23,
  "spent": 12000,
  "budget": 15000,
  "daysPassed": 20
}

✅ Response
{
  "decision": "WARNING",
  "predictedBalance": 2000,
  "warning": "Late-night spending may affect your monthly budget",
  "recommendations": [
    "Reduce ₹500/week in food spending",
    "Save ₹700/week to stay on track"
  ]
}

🛠️ Setup Instructions
1️⃣ Clone the repo
git clone https://github.com/your-username/safespend.git
cd safespend
2️⃣ Install dependencies
npm install
3️⃣ Setup environment variables

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key
4️⃣ Run server
npm run dev

🎯 Key Design Principles
⚡ Real-time decision making
🧠 Rule-based logic (no heavy ML required)
💬 AI only for explanation, not decision
📊 Data-driven recommendations
🧩 Modular architecture (easy to scale)
🏆 Use Case
Prevent impulsive spending
Help users stay within budget
Provide actionable financial advice
Improve financial awareness
📌 Future Improvements
User-specific behavior learning
Advanced analytics dashboard
Subscription detection
Multi-category budget tracking
