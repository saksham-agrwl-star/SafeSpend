import { useState } from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Brain, MessageSquare, Target,
  HelpCircle, LogOut, Zap, ChevronRight, Moon, TrendingUp, Users, Activity
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';



const heatmapData = [
  { hour: '12am', Mon: 0, Tue: 0, Wed: 20, Thu: 0, Fri: 0, Sat: 40, Sun: 30 },
  { hour: '3am', Mon: 0, Tue: 10, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
  { hour: '6am', Mon: 50, Tue: 20, Wed: 30, Thu: 10, Fri: 40, Sat: 0, Sun: 0 },
  { hour: '9am', Mon: 80, Tue: 90, Wed: 70, Thu: 60, Fri: 85, Sat: 20, Sun: 10 },
  { hour: '12pm', Mon: 60, Tue: 75, Wed: 80, Thu: 55, Fri: 90, Sat: 50, Sun: 40 },
  { hour: '3pm', Mon: 40, Tue: 50, Wed: 45, Thu: 70, Fri: 60, Sat: 95, Sun: 80 },
  { hour: '6pm', Mon: 70, Tue: 65, Wed: 60, Thu: 80, Fri: 100, Sat: 90, Sun: 70 },
  { hour: '9pm', Mon: 85, Tue: 80, Wed: 90, Thu: 75, Fri: 95, Sat: 100, Sun: 85 },
  { hour: '11pm', Mon: 50, Tue: 60, Wed: 70, Thu: 55, Fri: 80, Sat: 75, Sun: 60 },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getHeatColor = (val) => {
  if (!val) return 'rgba(108,99,255,0.05)';
  if (val > 80) return 'rgba(239,68,68,0.8)';
  if (val > 60) return 'rgba(245,158,11,0.7)';
  if (val > 30) return 'rgba(108,99,255,0.5)';
  return 'rgba(108,99,255,0.2)';
};

const personalityData = [
  { subject: 'Impulsive', A: 78 },
  { subject: 'Disciplined', A: 45 },
  { subject: 'Social', A: 82 },
  { subject: 'Cautious', A: 35 },
  { subject: 'Tech-Heavy', A: 65 },
  { subject: 'Foodie', A: 90 },
];

const weeklyBenchmark = [
  { name: 'You', value: 21400, color: '#8B5CF6' },
  { name: 'Peers Avg', value: 16800, color: '#00D4AA' },
  { name: 'Top 10%', value: 11200, color: '#F59E0B' },
];

const pulseData = [
  { week: 'W1', stress: 60, spend: 18000 },
  { week: 'W2', stress: 80, spend: 24000 },
  { week: 'W3', stress: 45, spend: 14000 },
  { week: 'W4', stress: 90, spend: 28000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--color-surface2)', border: '1px solid rgba(108,99,255,0.3)', padding: '10px 14px', borderRadius: '10px' }}>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || 'var(--color-accent)', fontWeight: 700, fontSize: '0.85rem' }}>
            {p.name}: ₹{p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const traits = [
  { icon: '🦉', title: 'Night Owl Spender', stat: '73%', desc: 'of impulse orders occur after 11 PM. Your cognitive resistance to "Add to Cart" drops significantly in the late hours.', color: '#8B5CF6' },
  { icon: '😰', title: 'Stress Swiggy-er', stat: '2.4×', desc: 'food spend spikes during high-stress weeks. Comfort spending is your primary coping mechanism.', color: '#EF4444' },
  { icon: '🎉', title: 'Weekend FOMO Buyer', stat: '45%', desc: 'higher spend on Sat-Sun vs weekdays. Social pressure correlates with 45% of your discretionary outflow.', color: '#F59E0B' },
];

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('dna');
  const { isDark } = useTheme();

  return (
    <div className={`dashboard-layout ${!isDark ? 'light-theme' : ''}`}>
      <AppSidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text)' }}>YOUR SPENDING DNA</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
              The Kinetic Vault has analyzed 1,422 data points to decode your financial personality.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[
            { key: 'dna', label: '🧬 DNA Profile' },
            { key: 'heatmap', label: '🔥 Spend Heatmap' },
            { key: 'benchmark', label: '👥 Peer Benchmark' },
            { key: 'pulse', label: '💓 Behavior Pulse' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 18px',
                background: activeTab === tab.key ? 'var(--color-accent)' : 'rgba(108,99,255,0.08)',
                color: activeTab === tab.key ? 'white' : 'var(--color-muted)',
                border: activeTab === tab.key ? 'none' : '1px solid rgba(108,99,255,0.15)',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dna' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Trait Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {traits.map((t) => (
                <div key={t.title} className="glass-card" style={{ borderColor: `${t.color}25`, display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', flexShrink: 0 }}>{t.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>{t.title}</h3>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: t.color }}>{t.stat}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>{t.desc}</p>
                  </div>
                </div>
              ))}

              {/* AI Highlight */}
              <div style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontSize: '0.7rem', color: '#00D4AA', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>AI Insight</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  "Your resilience in the 'Gadgets' category is 40% higher than users in your income bracket. Maintain this trajectory to reach your 'Tesla Downpayment' goal 4 months early."
                </p>
              </div>
            </div>

            {/* Personality Radar */}
            <div className="glass-card">
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 20 }}>Financial Personality Radar</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={personalityData}>
                  <PolarGrid stroke="rgba(108,99,255,0.15)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
                  <Radar name="You" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ padding: '16px 0 0', borderTop: '1px solid rgba(108,99,255,0.1)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 8 }}>
                {[
                  { label: 'Food Score', val: '9.0/10', color: '#EF4444' },
                  { label: 'Social Score', val: '8.2/10', color: '#F59E0B' },
                  { label: 'Discipline', val: '4.5/10', color: '#8B5CF6' },
                ].map((m) => (
                  <div key={m.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heatmap' && (
          <div className="glass-card">
            <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 20 }}>Spend Heatmap — When You Spend Most</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px 12px', color: 'var(--color-muted)', fontSize: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Time</th>
                    {days.map(d => (
                      <th key={d} style={{ padding: '8px 12px', color: 'var(--color-muted)', fontSize: '0.75rem', textAlign: 'center', fontWeight: 600 }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row) => (
                    <tr key={row.hour}>
                      <td style={{ padding: '8px 12px', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{row.hour}</td>
                      {days.map(d => (
                        <td key={d} style={{ padding: '8px 12px', textAlign: 'center' }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 8, margin: '0 auto',
                            background: getHeatColor(row[d]),
                            border: row[d] > 80 ? '1px solid rgba(239,68,68,0.4)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', color: 'white', fontWeight: 700,
                          }}>
                            {row[d] > 30 ? row[d] : ''}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-4">
              {[
                { color: 'rgba(239,68,68,0.8)', label: 'High Spend (>80)' },
                { color: 'rgba(245,158,11,0.7)', label: 'Medium (60-80)' },
                { color: 'rgba(108,99,255,0.5)', label: 'Low (30-60)' },
                { color: 'rgba(108,99,255,0.15)', label: 'Minimal (<30)' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'benchmark' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="glass-card">
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 20 }}>Monthly Spend vs Peers</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyBenchmark} layout="vertical" barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.08)" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${v/1000}k`} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {weeklyBenchmark.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'vs Peer Average', value: '+₹4,600', desc: 'You spend more than peers your age', color: '#EF4444', icon: '📈' },
                { label: 'Gadget Resilience', value: '+40%', desc: 'Higher than similar income bracket', color: '#00D4AA', icon: '💪' },
                { label: 'Savings Percentile', value: '23rd', desc: 'Bottom quarter for savings rate', color: '#F59E0B', icon: '📊' },
              ].map(b => (
                <div key={b.label} className="glass-card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{ fontSize: '1.8rem' }}>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: b.color }}>{b.value}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)' }}>{b.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{b.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 12, padding: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  "Users like you saved <strong style={{ color: '#00D4AA' }}>23% more</strong> this period by avoiding weekend impulse purchases."
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pulse' && (
          <div className="glass-card">
            <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 4 }}>Behavior Pulse — Stress vs Spending</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', marginBottom: 20 }}>Correlation between detected stress levels and discretionary spending.</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pulseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.08)" />
                <XAxis dataKey="week" tick={{ fill: 'var(--color-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tickFormatter={(v) => `${v}%`} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `₹${v/1000}k`} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar yAxisId="left" dataKey="stress" name="Stress Level %" fill="#EF4444" opacity={0.7} radius={[6,6,0,0]} />
                <Bar yAxisId="right" dataKey="spend" name="Spend ₹" fill="#8B5CF6" opacity={0.7} radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                ⚠️ <strong style={{ color: '#EF4444' }}>Week 4 anomaly detected:</strong> Your spending peaked at ₹28,000 with a 90% stress index. Calendar shows 3 deadlines that week — Swiggy and Amazon were your primary coping channels.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
