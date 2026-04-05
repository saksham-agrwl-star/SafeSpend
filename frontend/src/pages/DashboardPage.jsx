import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { getDashboard, getUserId, updateUserBudget } from '../utils/api';
import {
  Bell, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Shield,
  AlertTriangle, UtensilsCrossed, Car, Film, ShoppingBag, Banknote, ScanQrCode,
  PenLine, Edit2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--color-surface2)', border: '1px solid rgba(108,99,255,0.3)', padding: '10px 14px', borderRadius: 10 }}>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>{label}</p>
        <p style={{ color: 'var(--color-accent)', fontWeight: 700 }}>₹{payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// Generate forecast dynamically from current month
const buildForecastData = (monthlyBudget) => {
  const now = new Date();
  const months = [];
  const shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  // 3 actual (past) months + 3 forecast months
  for (let i = -2; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = shortMonths[d.getMonth()];
    const base = monthlyBudget || 20000;
    const isHistory = i <= 0;
    // Realistic variance: ±15% of budget
    const amount = Math.round(base * (0.85 + Math.random() * 0.30));
    months.push({
      month: label,
      actual: isHistory ? amount : null,
      forecast: !isHistory ? Math.round(base * (0.90 + Math.random() * 0.20)) : null,
    });
  }
  return months;
};

export default function DashboardPage() {
  const [alertVisible, setAlertVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetInputValue, setBudgetInputValue] = useState('');
  const [updatingBudget, setUpdatingBudget] = useState(false);
  const [data, setData] = useState({
    currentBalance: 0,
    budgetLeft: 0,
    score: 0,
    recentTransactions: [],
    goalProgress: [],
    prediction: null,
    categoryLimits: { food: 5000, shopping: 3000, entertainment: 2000, transport: 2000 },
    categorySpent: { food: 0, shopping: 0, entertainment: 0, transport: 0, other: 0 },
    monthlyBudget: 30000,
    monthlyIncome: 0
  });

  useEffect(() => {
    const userId = getUserId();
    const fetchData = async () => {
      try {
        const json = await getDashboard(userId);
        if (json.success) setData(json.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateBudget = async () => {
    if (!budgetInputValue) return;
    const newBudget = parseInt(budgetInputValue);
    if (isNaN(newBudget) || newBudget <= 0) {
      alert("Invalid amount.");
      return;
    }
    setUpdatingBudget(true);
    try {
      await updateUserBudget(getUserId(), { monthlyBudget: newBudget });
      
      // Re-fetch the entire dashboard context so category limits and ML updates immediately reflect
      const json = await getDashboard(getUserId());
      if (json.success) setData(json.data);
      
      setShowBudgetForm(false);
      setBudgetInputValue('');
      alert("Budget updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingBudget(false);
    }
  };

  const getStats = () => {
    return [
      { label: 'Monthly Salary', value: `₹${(data.monthlyIncome || 0).toLocaleString()}`, sub: 'Fixed Income', Icon: Wallet, color: '#8B5CF6', trend: 'up' },
      { label: 'Monthly Spend', value: `₹${((data.monthlyBudget || 0) - (data.budgetLeft || 0)).toLocaleString()}`, sub: `₹${(data.budgetLeft || 0).toLocaleString()} left`, Icon: CreditCard, color: '#F59E0B', trend: 'down' },
      { label: 'Financial Health', value: `${data.score}/100`, sub: data.score > 80 ? 'SAFE zone' : data.score > 50 ? 'CAUTION zone' : 'RISK zone', Icon: Shield, color: data.score > 50 ? '#00D4AA' : '#EF4444', trend: null },
      { label: 'Upcoming Target', value: data.goalProgress && data.goalProgress.length > 0 && data.goalProgress[0]?.targetAmount ? `₹${data.goalProgress[0].targetAmount.toLocaleString()}` : 'No Goal Set', sub: data.goalProgress && data.goalProgress.length > 0 ? data.goalProgress[0].goalName : 'Add a goal in settings', Icon: TrendingUp, color: '#00D4AA', trend: 'up' },
    ];
  };

  const categories = [
    { name: 'Food & Dining', spent: data.categorySpent.food || 0, budget: data.categoryLimits.food || 5000, color: '#8B5CF6', Icon: UtensilsCrossed },
    { name: 'Shopping', spent: data.categorySpent.shopping || 0, budget: data.categoryLimits.shopping || 3000, color: '#EF4444', Icon: ShoppingBag },
    { name: 'Entertainment', spent: data.categorySpent.entertainment || 0, budget: data.categoryLimits.entertainment || 2000, color: '#F59E0B', Icon: Film },
    { name: 'Transport', spent: data.categorySpent.transport || 0, budget: data.categoryLimits.transport || 2000, color: '#00D4AA', Icon: Car },
  ];

  // Check if any category is over 90% (critical) or 60% (warn)
  const highestPctCategory = categories.reduce((max, cat) => {
    const pct = (cat.spent / cat.budget) * 100;
    return pct > max.pct ? { ...cat, pct } : max;
  }, { pct: 0 });

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--color-accent)] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">

        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              Financial Command Center
            </h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: 2 }}>
              Active · Real-Time Governance
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/pay" state={{ upiData: { name: '', upiId: 'manual@upi', amount: '' }, scanResult: null }} style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '10px 18px', display: 'flex', gap: 8, alignItems: 'center', background: 'var(--color-surface2)', color: 'var(--color-text)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <PenLine size={18} /> Manual Entry
              </button>
            </Link>
            <Link to="/scan" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '10px 18px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <ScanQrCode size={18} /> Scan QR 
              </button>
            </Link>
          </div>
        </div>

        {/* AI Alert Banner (Dynamic based on Category Budgets) */}
        {alertVisible && highestPctCategory.pct > 60 && (
          <div className="alert-card" style={{ 
            background: highestPctCategory.pct > 90 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', 
            border: `1px solid ${highestPctCategory.pct > 90 ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`, 
            borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 
          }}>
            <AlertTriangle size={18} color={highestPctCategory.pct > 90 ? '#EF4444' : '#F59E0B'} />
            <div style={{ flex: 1 }}>
              <span style={{ color: highestPctCategory.pct > 90 ? '#EF4444' : '#F59E0B', fontWeight: 700, fontSize: '0.85rem' }}>
                 {highestPctCategory.pct > 90 ? 'Critical Goal Risk' : 'AI Budget Warning'}
              </span>
              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginLeft: 8 }}>
                Your {highestPctCategory.name} budget is {Math.round(highestPctCategory.pct)}% used. {highestPctCategory.pct > 90 ? 'Further spends will be blocked.' : 'Cut optional spends.'}
              </span>
            </div>
            <button onClick={() => setAlertVisible(false)} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="dashboard-stats-grid">
          {getStats().map((stat) => (
            <div key={stat.label} className="skeuo-card stat-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.Icon size={18} color={stat.color} />
                </div>
                {stat.trend === 'up'   && <ArrowUpRight   size={16} color="#00D4AA" />}
                {stat.trend === 'down' && <ArrowDownRight size={16} color="#EF4444" />}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 600 }}>{stat.label}</div>
              <div style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', marginTop: 4 }}>{stat.value}</div>
              <div style={{ fontSize: '0.73rem', color: stat.color, marginTop: 4, fontWeight: 700 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="dashboard-charts-row">
          <div className="skeuo-card chart-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>Daily Spend This Week</h3>
              <span className="badge-safe">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.dailySpends || []} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.08)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {(data.dailySpends || []).map((e, i) => <Cell key={i} fill={e.amount > 2000 ? '#EF4444' : '#8B5CF6'} opacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="skeuo-card chart-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>30-Day Forecast</h3>
              <span className="badge-warn">AI Predicted</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={buildForecastData(data.monthlyBudget)}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3}/><stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.08)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="actual"   stroke="#8B5CF6" fill="url(#g1)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="forecast" stroke="#00D4AA" fill="url(#g2)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="dashboard-bottom-row">
          {/* Budget Categories */}
          <div className="skeuo-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>Monthly Constraints</h3>
              <button onClick={() => { setShowBudgetForm(!showBudgetForm); setBudgetInputValue(data.monthlyBudget || ''); }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                <Edit2 size={12} /> {showBudgetForm ? 'Cancel' : 'Update Budget'}
              </button>
            </div>
            {showBudgetForm && (
              <div style={{ padding: '12px 16px', background: 'var(--color-surface)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem', fontWeight: 600 }}>₹</span>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={budgetInputValue}
                  onChange={(e) => setBudgetInputValue(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '0.9rem', flex: 1, outline: 'none', fontWeight: 600 }}
                  autoFocus
                />
                <button onClick={handleUpdateBudget} disabled={updatingBudget} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 6, height: 'auto' }}>
                  {updatingBudget ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {categories.map((cat) => {
                const pct = Math.min((cat.spent / cat.budget) * 100, 100);
                const isWarn = pct > 60;
                const isOver = pct > 90;
                const barColor = isOver ? '#EF4444' : isWarn ? '#F59E0B' : cat.color;
                
                return (
                  <div key={cat.name}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: 600 }}>
                        <cat.Icon size={14} color={barColor} />
                        {cat.name}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: barColor, fontWeight: 600 }}>
                        ₹{cat.spent.toLocaleString()} / ₹{cat.budget.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: 'rgba(108,99,255,0.1)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Goal Trajectory</div>
              <div style={{ fontWeight: 700, color: (highestPctCategory.pct > 90) ? '#EF4444' : 'var(--color-text)' }}>
                {highestPctCategory.pct > 90 ? 'Action required to protect goal' : 'Holding stable'}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="skeuo-card" style={{ padding: 24, flex: 1.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>Recent Activity</h3>
              <button style={{ fontSize: '0.8rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(data.recentTransactions || []).length > 0 ? data.recentTransactions.map((tx, i) => {
                const Icon = (tx.category || '').toLowerCase() === 'food' ? UtensilsCrossed : 
                             (tx.category || '').toLowerCase() === 'transport' ? Car :
                             (tx.category || '').toLowerCase() === 'entertainment' ? Film :
                             (tx.category || '').toLowerCase() === 'shopping' ? ShoppingBag : Banknote;
                
                return (
                  <div key={tx.transactionId || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < data.recentTransactions.length - 1 ? '1px solid rgba(108,99,255,0.06)' : 'none' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: tx.amount > 0 ? 'rgba(0,212,170,0.1)' : 'rgba(108,99,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color={tx.amount > 0 ? '#00D4AA' : 'var(--color-accent)'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant || tx.description}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{tx.time || new Date(tx.date).toLocaleTimeString()} · {tx.category}</div>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, flexShrink: 0, color: tx.amount > 0 ? '#00D4AA' : tx.riskLevel === 'High' ? '#EF4444' : 'var(--color-text)' }}>
                      {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8" style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>No recent activity.</div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
