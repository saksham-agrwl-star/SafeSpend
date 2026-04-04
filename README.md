# 💸 SafeSpend — AI-Powered Smart Spending System

SafeSpend is a real-time financial decision system that analyzes user transactions **before payment** and provides actionable insights, warnings, and recommendations to help users stay within budget and achieve their financial goals.

---

## 🚀 Features

- 🔍 Real-Time Transaction Analysis  
  - Scan QR / UPI or enter amount manually  
  - Extract transaction details instantly  

- 🧠 Decision Engine  
  - Evaluates risk in real time  
  - Output: SAFE / WARNING / BLOCK  

- 📊 Prediction System  
  - Forecasts future balance  
  - Detects overspending trends  

- 💡 Recommendation Engine  
  - Suggests:
    - Reduce ₹X/week  
    - Save ₹Y/week  
  - Based on user behavior  

- 🤖 AI Explanation Layer  
  - Converts output into human-readable warnings  
  - Uses Groq LLM  

- 📱 User Interface  
  - Alert popups before payment  
  - Dashboard insights  

---

## 🧠 How It Works
User → Process → Fetch Data → Analyze → Decide → Predict → Recommend → Explain (AI) → UI


---

## ⚙️ Tech Stack

Backend: Node.js, Express.js  
Database: MongoDB  
Frontend: React.js, Tailwind CSS  
AI: Groq API  

---

## 📂 Project Structure

### backend
- ai
- config
- controllers
- ML_models
- models
- routes
- services
- utils

### frontend
- dist
- node_modules
- public
- src

---

🛠️ Setup Instructions
1. Clone the repo
https://github.com/saksham-agrwl-star/SafeSpend.git
cd safespend

2. Install dependencies
npm install

3. Setup environment variables

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key

4. Run server
npm run dev


🎯 Key Design Principles
Real-time decision making
Rule-based logic (no heavy ML required)
AI only for explanation, not decision
Data-driven recommendations
Modular architecture

🏆 Use Case
Prevent impulsive spending
Stay within budget
Provide actionable financial advice
Improve financial awareness
