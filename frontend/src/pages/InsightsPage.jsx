import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import {
  Fingerprint, Flame, Users, Activity, Moon, AlertTriangle, Calendar,
  TrendingUp, Award, Zap, BrainCircuit, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend
} from 'recharts';
import { getInsights, getRecommendations, getUserId } from '../utils/api';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getHeatColor = (val) => {
  if (!val || val < 5) return 'rgba(108,99,255,0.05)';
  if (val > 80) return 'rgba(239,68,68,0.85)';
  if (val > 60) return 'rgba(245,158,11,0.75)';
  if (val > 30) return 'rgba(108,99,255,0.55)';
  return 'rgba(108,99,255,0.2)';
};

const ICON_MAP = { Moon, AlertTriangle, Calendar };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: 'var(--color-surface2)', border: '1px solid rgba(108,99,255,0.3)', padding: '10px 14px', borderRadius: 10 }}>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill || p.color || 'var(--color-accent)', fontWeight: 700, fontSize: '0.85rem' }}>
          {p.name}: {p.name?.includes('Stress') ? `${p.value}%` : `₹${p.value?.toLocaleString()}`}
        </p>
      ))}
    </div>
  );
  return null;
};

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState('dna');
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const uId = getUserId();
    Promise.all([
      getInsights(uId).catch(() => null),
      getRecommendations(uId).catch(() => null),
    ]).then(([insightsJson, recsJson]) => {
      if (insightsJson?.success) setLiveData(insightsJson.data);
      if (recsJson?.success && recsJson.data?.recommendations) {
        setRecommendations(recsJson.data.recommendations);
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--color-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-muted)' }}>Analyzing behavioral patterns…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    </div>
  );

  const heatmapData    = liveData?.heatmapData    || [];
  const personalityData = liveData?.personalityData || [];
  const pulseData      = liveData?.pulseData       || [];
  const traits         = liveData?.traits          || [];
  const benchmark      = liveData?.benchmark       || {};
  const userFlags      = liveData?.userFlags       || {};

  const totalDataPoints = heatmapData.reduce((s, row) =>
    s + days.reduce((ds, d) => ds + (row[d] || 0), 0), 0
  );

  const weeklyBenchmark = [
    { name: 'You',       value: benchmark.userSpend || 0,  color: '#8B5CF6' },
    { name: 'Peers Avg', value: benchmark.peerAvg   || 0,  color: '#00D4AA' },
    { name: 'Top 10%',   value: benchmark.top10pct  || 0,  color: '#F59E0B' },
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Financial DNA & Insights</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: 2 }}>
              Cognitive Behavioral Analysis · {totalDataPoints > 0 ? totalDataPoints.toLocaleString() : 'Live'} Data Points
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {userFlags.spendingStyle && (
              <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
                {userFlags.spendingStyle} Spender
              </span>
            )}
            <div className="badge-safe"><BrainCircuit size={13} /> Neural Engine Active</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          {[
            { key: 'dna',       label: 'DNA Profile',    icon: Fingerprint },
            { key: 'heatmap',   label: 'Spend Heatmap',  icon: Flame       },
            { key: 'benchmark', label: 'Peer Benchmark',  icon: Users       },
            { key: 'pulse',     label: 'Behavior Pulse',  icon: Activity    },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px',
                background: activeTab === tab.key ? 'var(--color-accent)' : 'var(--color-surface)',
                color: activeTab === tab.key ? 'white' : 'var(--color-muted)',
                border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === tab.key ? '0 8px 20px rgba(139, 92, 246, 0.3)' : 'var(--neumorphic-outset)',
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── DNA PROFILE ────────────────────────────────────────────────── */}
        {activeTab === 'dna' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Live behavioral trait cards */}
              {traits.length > 0 ? traits.map((t) => {
                const Icon = ICON_MAP[t.icon] || Activity;
                const levelColor = t.level === 'high' ? '#EF4444' : t.level === 'medium' ? '#F59E0B' : '#00D4AA';
                return (
                  <div key={t.title} className="skeuo-card" style={{ borderColor: `${t.color}25`, display: 'flex', gap: 18, alignItems: 'flex-start', padding: 24 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={22} color={t.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem' }}>{t.title}</h3>
                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: t.color }}>{t.stat}</span>
                        <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 10, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', background: `${levelColor}20`, color: levelColor }}>{t.level}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>{t.desc}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="skeuo-card" style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Start transacting to generate behavioral insights.</p>
                </div>
              )}

              {/* AI Recommendations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recommendations.length > 0 ? recommendations.map((rec, i) => (
                  <div key={i} style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 14, padding: '16px 20px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#00D4AA', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Award size={14} /> AI Recommendation · {rec.type?.toUpperCase()}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>"{rec.message}"</p>
                  </div>
                )) : (
                  <div style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 14, padding: '16px 20px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Award size={14} /> All Systems Nominal
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                      "You are currently tracking safely. No active spending interventions needed right now."
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Personality Radar */}
            <div className="skeuo-card" style={{ padding: 32 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', marginBottom: 24 }}>Financial Personality Radar</h3>
              {personalityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={personalityData}>
                    <PolarGrid stroke="rgba(108,99,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-muted)', fontSize: 12, fontWeight: 500 }} />
                    <Radar name="You" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={3} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
                  No profile data yet. Complete setup to see your full personality radar.
                </div>
              )}
              <div style={{ padding: '24px 0 0', borderTop: '1px solid rgba(108,99,255,0.08)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 12 }}>
                {personalityData.slice(0, 3).map((item) => (
                  <div key={item.subject} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: item.A > 70 ? '#EF4444' : item.A > 40 ? '#F59E0B' : '#00D4AA' }}>{item.A}/100</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: 4, fontWeight: 600 }}>{item.subject}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SPEND HEATMAP ──────────────────────────────────────────────── */}
        {activeTab === 'heatmap' && (
          <div className="skeuo-card" style={{ padding: 32 }}>
            <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', marginBottom: 8 }}>Temporal Spending Intensity</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', marginBottom: 28 }}>
              Based on {heatmapData.length > 0 ? 'your real transaction timestamps' : 'no transactions recorded yet'}
            </p>
            {heatmapData.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '4px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px 12px', color: 'var(--color-muted)', fontSize: '0.78rem', textAlign: 'left', fontWeight: 700 }}>Time</th>
                      {days.map(d => (
                        <th key={d} style={{ padding: '8px 12px', color: 'var(--color-muted)', fontSize: '0.78rem', textAlign: 'center', fontWeight: 700 }}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row) => (
                      <tr key={row.hour}>
                        <td style={{ padding: '8px 12px', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: 700 }}>{row.hour}</td>
                        {days.map(d => (
                          <td key={d}>
                            <div style={{
                              width: '100%', height: 40, borderRadius: 8,
                              background: getHeatColor(row[d]),
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', color: 'white', fontWeight: 800,
                              boxShadow: row[d] > 80 ? '0 0 12px rgba(239,68,68,0.3)' : 'none',
                              transition: 'background 0.3s',
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
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-muted)' }}>
                <Flame size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p>No transactions recorded yet. Make some transactions to see your spending heatmap.</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 20, marginTop: 28, padding: '16px', background: 'var(--color-surface)', borderRadius: 12 }}>
              {[
                { color: 'rgba(239,68,68,0.85)', label: 'Critical (>80)' },
                { color: 'rgba(245,158,11,0.75)', label: 'Elevated (60-80)' },
                { color: 'rgba(108,99,255,0.55)', label: 'Regular (30-60)' },
                { color: 'rgba(108,99,255,0.15)', label: 'Minimal (<30)' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 600 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PEER BENCHMARK ─────────────────────────────────────────────── */}
        {activeTab === 'benchmark' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28 }}>
            <div className="skeuo-card" style={{ padding: 32 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', marginBottom: 28 }}>Monthly Expenditure Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyBenchmark} layout="vertical" barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.06)" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${v/1000}k`} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-text)', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.04)' }} />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                    {weeklyBenchmark.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                {
                  label: 'vs Peer Average',
                  value: benchmark.spendVsPeer || '—',
                  desc: benchmark.spendPctVsPeer > 0
                    ? `Your spending is ${benchmark.spendPctVsPeer}% higher than demographic average.`
                    : `You spend ${Math.abs(benchmark.spendPctVsPeer || 0)}% less than your peer group. Excellent!`,
                  color: (benchmark.spendPctVsPeer || 0) > 0 ? '#EF4444' : '#00D4AA',
                  icon: (benchmark.spendPctVsPeer || 0) > 0 ? ArrowUpRight : ArrowDownRight,
                },
                {
                  label: 'Savings Percentile',
                  value: benchmark.savingsPercentile || '—',
                  desc: benchmark.savingsPercentile === 'Top 10%'
                    ? 'Exceptional financial discipline. You are in the top 10% of savers.'
                    : benchmark.savingsPercentile === 'Top 30%'
                    ? 'Good discipline. You are saving more than 70% of your peers.'
                    : 'Action required: Target top 50% for financial safety.',
                  color: benchmark.savingsPercentile === 'Top 10%' ? '#00D4AA' : benchmark.savingsPercentile === 'Top 30%' ? '#F59E0B' : '#EF4444',
                  icon: TrendingUp,
                },
                {
                  label: 'Impulse Index',
                  value: userFlags.impulseRate > 50 ? 'HIGH' : userFlags.impulseRate > 25 ? 'MEDIUM' : 'LOW',
                  desc: `Your behavior engine scores ${userFlags.impulseRate || 0}/100 impulse rate — ${userFlags.impulseRate > 50 ? 'requires active interventions' : userFlags.impulseRate > 25 ? 'within manageable range' : 'excellent spending control'}.`,
                  color: userFlags.impulseRate > 50 ? '#EF4444' : userFlags.impulseRate > 25 ? '#F59E0B' : '#00D4AA',
                  icon: Zap,
                },
              ].map(b => (
                <div key={b.label} className="skeuo-card" style={{ display: 'flex', gap: 18, alignItems: 'center', padding: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${b.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <b.icon size={20} color={b.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: b.color }}>{b.value}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', margin: '2px 0' }}>{b.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BEHAVIOR PULSE ─────────────────────────────────────────────── */}
        {activeTab === 'pulse' && (
          <div className="skeuo-card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem', marginBottom: 4 }}>Weekly Stress vs Spend Correlation</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                  Impulse-rate proxy correlated with discretionary outflow by week.
                </p>
              </div>
              <div className="badge-warn">
                {userFlags.impulseRate > 50 ? 'High Correlation Detected' : 'Correlation Normal'}
              </div>
            </div>
            {pulseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pulseData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.06)" />
                  <XAxis dataKey="week" tick={{ fill: 'var(--color-muted)', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left"  tickFormatter={(v) => `${v}%`}           tick={{ fill: '#EF4444', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `₹${v/1000}k`} tick={{ fill: '#8B5CF6', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" />
                  <Bar yAxisId="left"  dataKey="stress" name="Stress Index %"  fill="#EF4444" opacity={0.65} radius={[6,6,0,0]} />
                  <Bar yAxisId="right" dataKey="spend"  name="Weekly Spend ₹"  fill="#8B5CF6" opacity={0.65} radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)' }}>
                Pulse data will appear once transactions are recorded.
              </div>
            )}
            <div style={{ marginTop: 28, padding: '20px 24px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, display: 'flex', gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={16} color="#EF4444" />
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: '#EF4444' }}>AI Insight: </strong>
                {userFlags.stress
                  ? 'Stress spending pattern detected. The AI suggests activating '
                  : 'No active stress spending pattern detected. '}
                {userFlags.stress && <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>ZEN MODE</span>}
                {userFlags.stress && ' on delivery apps during high-stress periods.'}
                {userFlags.lateNight && ' Late-night transactions are a risk driver — consider app time restrictions after 10 PM.'}
                {!userFlags.stress && !userFlags.lateNight && ' Maintain current discipline for optimal financial health.'}
              </p>
            </div>
          </div>
        )}
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
