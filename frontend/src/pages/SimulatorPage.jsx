import { useState, useEffect } from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Brain, MessageSquare, Target,
  HelpCircle, LogOut, Zap, ChevronRight, TrendingDown, AlertTriangle,
  Cpu, PlayCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';


const generateCashflow = (swiggy, shopping, coffee) => {
  const base = 65000;
  const dailyFixed = 800;
  const days = [];
  let balance = base;
  for (let i = 1; i <= 30; i++) {
    balance -= dailyFixed;
    if (i % 3 === 0) balance -= swiggy / 10;
    if (i % 7 === 0) balance -= shopping / 4;
    if (i % 2 === 0) balance -= coffee / 15;
    days.push({ day: `D${i}`, balance: Math.round(balance) });
  }
  return days;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--color-surface2)', border: '1px solid rgba(108,99,255,0.3)', padding: '10px 14px', borderRadius: '10px' }}>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>{label}</p>
        <p style={{ color: '#00D4AA', fontWeight: 700 }}>₹{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function SimulatorPage() {
  const [swiggy, setSwiggy] = useState(3000);
  const [shopping, setShoppingBudget] = useState(2500);
  const [coffee, setCoffee] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [cashflow, setCashflow] = useState(generateCashflow(3000, 2500, 1500));

  const totalMonthly = swiggy + shopping + coffee;
  const newBalance = 65000 - totalMonthly - 800 * 30;
  const budgetDaysLeft = Math.max(0, Math.round((65000 - totalMonthly - 800 * 30) / (800 + (swiggy / 30))));
  const goalImpact = (totalMonthly - 7000) / 380;

  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => {
      setCashflow(generateCashflow(swiggy, shopping, coffee));
      setIsRunning(false);
    }, 1200);
  };

  useEffect(() => {
    setCashflow(generateCashflow(swiggy, shopping, coffee));
  }, [swiggy, shopping, coffee]);

  const riskLevel = totalMonthly > 9000 ? 'HIGH' : totalMonthly > 6000 ? 'CAUTION' : 'SAFE';
  const riskColor = riskLevel === 'HIGH' ? '#EF4444' : riskLevel === 'CAUTION' ? '#F59E0B' : '#00D4AA';
  const { isDark } = useTheme();

  return (
    <div className={`dashboard-layout ${!isDark ? 'light-theme' : ''}`}>
      <AppSidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text)' }}>
              SIMULATE BEFORE YOU SPEND
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
              Predictive Financial Engine v2.4.0 // Neural Network Simulation
            </p>
          </div>
          <div className="badge-safe" style={{ padding: '8px 16px' }}>
            <Cpu size={14} /> Engine Online
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="glass-card">
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 24 }}>
                Expense Parameters
              </h3>

              {[
                { label: '🍔 Food & Swiggy', value: swiggy, setter: setSwiggy, min: 500, max: 8000, step: 100 },
                { label: '🛍️ Shopping Budget', value: shopping, setter: setShoppingBudget, min: 500, max: 8000, step: 100 },
                { label: '☕ Coffee & Leisure', value: coffee, setter: setCoffee, min: 200, max: 4000, step: 100 },
              ].map((param) => (
                <div key={param.label} style={{ marginBottom: 28 }}>
                  <div className="flex items-center justify-between mb-3">
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>{param.label}</label>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-accent)' }}>₹{param.value.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value}
                    onChange={(e) => param.setter(Number(e.target.value))}
                  />
                  <div className="flex justify-between mt-1">
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>₹{param.min.toLocaleString()}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>₹{param.max.toLocaleString()}</span>
                  </div>
                </div>
              ))}

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', gap: 10 }}
                onClick={runSimulation}
                disabled={isRunning}
              >
                <PlayCircle size={18} />
                {isRunning ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>

            {/* Risk Assessment */}
            <div className="glass-card" style={{ borderColor: `${riskColor}30` }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Risk Assessment</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: riskColor, marginBottom: 4 }}>{riskLevel}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>Total Monthly Discretionary: <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>₹{totalMonthly.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'New Balance', value: `₹${Math.max(0, newBalance).toLocaleString()}`, sub: 'End of month', color: newBalance < 10000 ? '#EF4444' : '#00D4AA' },
                { label: 'Budget Days Left', value: `${Math.max(0, budgetDaysLeft)} DAYS`, sub: 'At current rate', color: '#8B5CF6' },
                { label: 'Goa Trip Impact', value: goalImpact > 0 ? `+${Math.round(goalImpact)} DAYS` : `${Math.round(goalImpact)} days`, sub: 'Goal delay', color: '#F59E0B' },
              ].map((kpi) => (
                <div key={kpi.label} className="glass-card" style={{ textAlign: 'center', padding: '16px 12px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{kpi.label}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Cashflow Chart */}
            <div className="glass-card" style={{ flex: 1 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>Cash Flow Simulation</h3>
                <span className="badge-warn">30-Day</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={cashflow}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.08)" />
                  <XAxis dataKey="day" tick={{ fill: 'var(--color-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${Math.round(v/1000)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={10000} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Danger Zone', fill: '#EF4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="balance" stroke="#8B5CF6" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#8B5CF6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insight */}
            <div style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Cpu size={16} color="var(--color-accent)" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>AI Neural Analysis</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  {riskLevel === 'HIGH'
                    ? `At ₹${totalMonthly.toLocaleString()} on discretionary spend — reduce by ₹${(totalMonthly - 7000).toLocaleString()}. Cook 3 meals this week and recover by Day 18. Your calorie vs cost ratio in the Food category is 22% above baseline.`
                    : riskLevel === 'CAUTION'
                    ? `You're within manageable range. Consider reducing Swiggy by ₹500 to stay on track for your Goa Trip goal.`
                    : `Excellent allocation! At this rate, you'll hit your Goa Trip goal 12 days early and save an additional ₹3,200 in the buffer fund.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
