import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Cpu, PlayCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { simulate, getUserId, getDashboard } from '../utils/api';

// The cashflow is now generated dynamically by the backend simulateController

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: 'var(--color-surface2)', border: '1px solid rgba(108,99,255,0.3)', padding: '10px 14px', borderRadius: 10 }}>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.75rem' }}>{label} {payload[0].payload.isHistory ? '(Past)' : '(Projected)'}</p>
      <p style={{ color: payload[0].payload.isHistory ? 'var(--color-muted)' : '#00D4AA', fontWeight: 700 }}>₹{payload[0].value?.toLocaleString()}</p>
    </div>
  );
  return null;
};

const params = [
  { key: 'swiggy',   label: 'Food & Swiggy',     min: 500, max: 8000, step: 100, default: 3000 },
  { key: 'shopping', label: 'Shopping Budget',    min: 500, max: 8000, step: 100, default: 2500 },
  { key: 'coffee',   label: 'Coffee & Leisure',   min: 200, max: 4000, step: 100, default: 1500 },
];

export default function SimulatorPage() {
  const [vals, setVals] = useState({ swiggy: 3000, shopping: 2500, coffee: 1500 });
  const [isRunning, setIsRunning] = useState(false);
  const [cashflow, setCashflow] = useState([]);
  const [simResult, setSimResult] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const json = await getDashboard(getUserId());
        if (json.success && json.data) {
          // Extract user-like fields from dashboard data
          setUser({
            monthlyIncome: json.data.currentBalance + Math.max(0, (json.data.monthlyBudget || 0) - (json.data.budgetLeft || 0)),
            goalName: json.data.goalProgress?.[0]?.goalName || null,
            monthlyBudget: json.data.monthlyBudget,
          });
        }
      } catch (e) {
        console.error("Failed to load user context", e);
      }
    };
    fetchUser();
    // Run initial simulation with defaults
    runSimulation();
  }, []);

  const total = vals.swiggy + vals.shopping + vals.coffee;
  // Dynamic display factors from the 15-day History + 15-day Projection results
  const displayBalance = simResult ? simResult.newFutureBalance : (user?.monthlyIncome || 65000) - total - (15 * 1200);
  const displayGoalImpact = simResult ? simResult.goalImpact : 0;
  const riskLevel = simResult ? simResult.riskStatus : (total > 9000 ? 'HIGH' : total > 6000 ? 'CAUTION' : 'SAFE');
  const riskColor = riskLevel === 'HIGH' ? '#EF4444' : riskLevel === 'CAUTION' ? '#F59E0B' : '#00D4AA';
  
  // Use user's goal name if available, otherwise default to a relevant placeholder
  const activeGoalName = user?.goalName || "Savings Goal";

  const runSimulation = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const userId = getUserId();
    try {
      const json = await simulate({ userId, ...vals });
      if (json.success) {
        setSimResult(json.data);
        setCashflow(json.data.cashflow || []);
      }
    } catch (e) {
      console.error('Simulation failed', e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>What-If Simulator</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: 2 }}>30-Day Analysis: 15-Day History + 15-Day Neural Projection</p>
          </div>
          <div className="badge-safe"><Cpu size={13} /> Engine Online</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)', gap: 24 }}>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="skeuo-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 24 }}>Expense Parameters</h3>
              {params.map(p => (
                <div key={p.key} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>{p.label}</label>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-accent)' }}>₹{vals[p.key].toLocaleString()}</span>
                  </div>
                  <input type="range" min={p.min} max={p.max} step={p.step} value={vals[p.key]}
                    onChange={e => setVals(v => ({ ...v, [p.key]: Number(e.target.value) }))} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>₹{p.min.toLocaleString()}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>₹{p.max.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={runSimulation} disabled={isRunning}>
                <PlayCircle size={17} /> {isRunning ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>

            <div className="skeuo-card" style={{ padding: 20, borderColor: `${riskColor}30` }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Risk Assessment</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: riskColor, letterSpacing: '-0.02em' }}>{riskLevel}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: 4 }}>
                Total Discretionary: <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
              {[
                { label: 'Projected Balance', value: `₹${Math.max(0,displayBalance).toLocaleString()}`, sub: 'End of 30-day window', color: displayBalance < 10000 ? '#EF4444' : '#00D4AA' },
                { label: 'Target Month', value: (() => { const d = new Date(); d.setMonth(d.getMonth()+1); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + String(d.getFullYear()).slice(2); })(), sub: 'AI Projection', color: '#8B5CF6' },
                { label: `${activeGoalName} Impact`, value: displayGoalImpact > 0 ? `+${Math.round(displayGoalImpact)}d` : `${Math.round(displayGoalImpact)}d`, sub: displayGoalImpact > 0 ? 'Delay detected' : 'Time saved', color: displayGoalImpact > 0 ? '#F59E0B' : '#00D4AA' },
              ].map(kpi => (
                <div key={kpi.label} className="skeuo-card" style={{ textAlign: 'center', padding: '16px 12px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{kpi.label}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            <div className="skeuo-card" style={{ padding: 24, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>Cash Flow Simulation</h3>
                <span className="badge-warn">30-Day</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={cashflow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,99,255,0.08)" />
                  <XAxis dataKey="day" tick={{ fill: 'var(--color-muted)', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${Math.round(v/1000)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine x={`D${new Date().getDate()}`} stroke="var(--color-accent)" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: 'var(--color-accent)', fontSize: 10, fontWeight: 'bold' }} />
                  <ReferenceLine y={10000} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Danger Zone', fill: '#EF4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="balance" stroke="#8B5CF6" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#8B5CF6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Cpu size={15} color="var(--color-accent)" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>AI Neural Analysis</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                  Based on your last 15 days of spending, {riskLevel === 'HIGH'
                    ? `you are trending ₹${(total - 7000).toLocaleString()} above budget. Reduction recommended to avoid Day 18 insolvency.`
                    : riskLevel === 'CAUTION'
                    ? `you are within manageable range, but careful allocation is needed to hit your ${activeGoalName}.`
                    : `your current trajectory is excellent! You are projected to hit your ${activeGoalName} ahead of schedule.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
