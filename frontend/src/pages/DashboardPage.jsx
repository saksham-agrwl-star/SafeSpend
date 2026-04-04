import { useState } from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, FlaskConical, Brain, MessageSquare, Target,
  HelpCircle, LogOut, Zap, Bell, TrendingUp, TrendingDown, AlertTriangle,
  ChevronRight, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Shield
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';



const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--color-surface2)', border: '1px solid rgba(108,99,255,0.3)', padding: '10px 14px', borderRadius: '10px' }}>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>{label}</p>
        <p style={{ color: 'var(--color-accent)', fontWeight: 700 }}>₹{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const spendData = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 850 },
  { day: 'Wed', amount: 2100 },
  { day: 'Thu', amount: 650 },
  { day: 'Fri', amount: 1800 },
  { day: 'Sat', amount: 3200 },
  { day: 'Sun', amount: 950 },
];

const forecastData = [
  { month: 'Jul', actual: 18400, forecast: null },
  { month: 'Aug', actual: 21200, forecast: null },
  { month: 'Sep', actual: 19800, forecast: null },
  { month: 'Oct', actual: null, forecast: 20500 },
  { month: 'Nov', actual: null, forecast: 22100 },
  { month: 'Dec', actual: null, forecast: 23800 },
];

const categories = [
  { name: 'Food & Dining', spent: 3840, budget: 5000, color: '#8B5CF6', icon: '🍕' },
  { name: 'Transport', spent: 1650, budget: 2000, color: '#00D4AA', icon: '🚗' },
  { name: 'Entertainment', spent: 1200, budget: 1500, color: '#F59E0B', icon: '🎬' },
  { name: 'Shopping', spent: 4100, budget: 2500, color: '#EF4444', icon: '🛍️' },
];

const transactions = [
  { name: "Swiggy • McDonald's", time: 'Today, 9:24 PM', amount: -840, category: 'FOOD', status: 'warn' },
  { name: 'BESCOM Electricity', time: 'Yesterday, 11:15 AM', amount: -2450, category: 'UTILITIES', status: 'safe' },
  { name: 'Uber India', time: 'Sep 18, 08:30 AM', amount: -420, category: 'TRANSPORT', status: 'safe' },
  { name: 'Amazon Pay', time: 'Sep 17, 03:45 PM', amount: -1280, category: 'SHOPPING', status: 'warn' },
  { name: 'Salary Credit', time: 'Sep 15, 12:00 AM', amount: +65000, category: 'INCOME', status: 'safe' },
];

export default function DashboardPage() {
  const [healthScore] = useState(74);
  const [alertVisible, setAlertVisible] = useState(true);
  const { isDark } = useTheme();

  return (
    <div className={`dashboard-layout ${!isDark ? 'light-theme' : ''}`}>
      <AppSidebar />
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text)' }}>
              THE KINETIC VAULT
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
              Active Command Center · Sep 2025
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="badge-warn" style={{ cursor: 'pointer' }}>
              <Bell size={12} /> 3 Alerts
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              AK
            </div>
          </div>
        </div>

        {/* AI Alert Banner */}
        {alertVisible && (
          <div className="alert-card" style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
          }}>
            <AlertTriangle size={18} color="#EF4444" />
            <div style={{ flex: 1 }}>
              <span style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.85rem' }}>AI Intervention Active</span>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginLeft: 8 }}>
                Your Swiggy spend is 84% of category budget. AI recommends pausing impulse orders for 4 days.
              </span>
            </div>
            <button onClick={() => setAlertVisible(false)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
        )}

        {/* Top Stats */}
        <div className="dashboard-stats-grid">
          {[
            { label: 'Net Worth', value: '₹2,47,500', sub: '+₹12,000 this month', icon: Wallet, color: '#8B5CF6', trend: 'up' },
            { label: 'Monthly Spend', value: '₹19,840', sub: '68% of ₹29,000 budget', icon: CreditCard, color: '#F59E0B', trend: 'down' },
            { label: 'Financial Health', value: `${healthScore}/100`, sub: 'CAUTION zone', icon: Shield, color: '#EF4444', trend: null },
            { label: 'Savings Rate', value: '23.4%', sub: '+2.1% vs last month', icon: TrendingUp, color: '#00D4AA', trend: 'up' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card stat-card">
                <div className="flex items-start justify-between mb-3">
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={stat.color} />
                  </div>
                  {stat.trend === 'up' && <ArrowUpRight size={16} color="#00D4AA" />}
                  {stat.trend === 'down' && <ArrowDownRight size={16} color="#EF4444" />}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: 8, fontWeight: 600 }}>{stat.label}</div>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginTop: 4 }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: stat.color, marginTop: 4, fontWeight: 700 }}>{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="dashboard-charts-row">
          {/* Daily Spend */}
          <div className="glass-card chart-card">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>Daily Spend This Week</h3>
              <span className="badge-safe">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={spendData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.08)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {spendData.map((entry, i) => (
                    <Cell key={i} fill={entry.amount > 2000 ? '#EF4444' : '#8B5CF6'} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 30-Day Forecast */}
          <div className="glass-card chart-card">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>30-Day Forecast</h3>
              <span className="badge-warn">AI Predicted</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.08)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="actual" stroke="#8B5CF6" fill="url(#actualGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="forecast" stroke="#00D4AA" fill="url(#forecastGrad)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              <span style={{ fontSize: '0.7rem', color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 2, background: '#8B5CF6', display: 'inline-block' }} /> Actual</span>
              <span style={{ fontSize: '0.7rem', color: '#00D4AA', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 12, height: 2, background: '#00D4AA', display: 'inline-block', borderTop: '2px dashed #00D4AA' }} /> AI Forecast</span>
            </div>
          </div>
        </div>

        {/* Budget Categories + Recent Transactions */}
        <div className="dashboard-bottom-row">
          {/* Budget Categories */}
          <div className="glass-card">
            <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 20 }}>Monthly Budget</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {categories.map((cat) => {
                const pct = Math.min((cat.spent / cat.budget) * 100, 100);
                const isOver = cat.spent > cat.budget;
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: 600 }}>
                        {cat.icon} {cat.name}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: isOver ? '#EF4444' : 'var(--color-muted)', fontWeight: 600 }}>
                        ₹{cat.spent.toLocaleString()} / ₹{cat.budget.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(108,99,255,0.1)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: isOver ? '#EF4444' : cat.color,
                        borderRadius: 3,
                        transition: 'width 1s ease',
                        boxShadow: `0 0 10px ${isOver ? '#EF4444' : cat.color}60`,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Cycle Reset</div>
              <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>Next Salary: Sep 30</div>
              <div style={{ fontSize: '0.8rem', color: '#00D4AA' }}>12 days remaining</div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>Recent Activity</h3>
              <button style={{ fontSize: '0.8rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {transactions.map((tx, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < transactions.length - 1 ? '1px solid rgba(108,99,255,0.06)' : 'none' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: tx.amount > 0 ? 'rgba(0,212,170,0.1)' : 'rgba(108,99,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem'
                  }}>
                    {tx.amount > 0 ? '💰' : tx.category === 'FOOD' ? '🍔' : tx.category === 'TRANSPORT' ? '🚗' : tx.category === 'UTILITIES' ? '⚡' : '🛍️'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: 600 }}>{tx.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{tx.time} · {tx.category}</div>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: tx.amount > 0 ? '#00D4AA' : tx.status === 'warn' ? '#EF4444' : 'var(--color-text)' }}>
                    {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
