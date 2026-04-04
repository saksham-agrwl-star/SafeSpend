const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173', // Vercel URL set in Render dashboard
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}));

// Mount routers
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/simulate', require('./routes/simulateRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/ai-check', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('SafeSpend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
