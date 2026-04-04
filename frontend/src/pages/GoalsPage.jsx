import { useState } from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Brain, MessageSquare, Target,
  HelpCircle, LogOut, Zap, ChevronRight, Plus, Flag, TrendingUp,
  Calendar, CheckCircle2, Circle, Cpu
} from 'lucide-react';



const INITIAL_GOALS = [
  {
    id: 1,
    emoji: '🏖️',
    name: 'Goa Trip',
    target: 8000,
    current: 3040,
    deadline: 'March 31, 2025',
    status: 'active',
    aiNote: "At current rate you'll save ₹5,200 by March 31 — ₹2,800 short. Cut ₹380/week to hit the target.",
    color: '#8B5CF6',
    daysLeft: 42,
  },
  {
    id: 2,
    emoji: '📱',
    name: 'New Phone Fund',
    target: 12000,
    current: 2160,
    deadline: 'June 30, 2025',
    status: 'active',
    aiNote: 'On track if you hold current spend patterns. You\'re saving ₹360/week toward this goal.',
    color: '#00D4AA',
    daysLeft: 118,
  },
  {
    id: 3,
    emoji: '🚗',
    name: 'Tesla Downpayment',
    target: 200000,
    current: 28000,
    deadline: 'Dec 2026',
    status: 'active',
    aiNote: 'Keep your Gadgets discipline. You\'re 40% more restrained than peers — that\'s your edge.',
    color: '#F59E0B',
    daysLeft: 634,
  },
  {
    id: 4,
    emoji: '🏠',
    name: 'Emergency Fund',
    target: 100000,
    current: 100000,
    deadline: 'Completed',
    status: 'completed',
    aiNote: '3-month runway secured. AI recommends maintaining this buffer.',
    color: '#00D4AA',
    daysLeft: 0,
  },
];

const timeline = [
  { month: 'JAN', label: 'Started', status: 'done' },
  { month: 'FEB', label: 'Current', status: 'current' },
  { month: 'MAR', label: 'Goa Goal', status: 'upcoming' },
  { month: 'JUN', label: 'Phone Fund', status: 'upcoming' },
  { month: 'DEC', label: 'Savings Target', status: 'future' },
];

function GoalCard({ goal }) {
  const pct = Math.min((goal.current / goal.target) * 100, 100);
  const isComplete = goal.status === 'completed';

  return (
    <div className="glass-card" style={{ borderColor: isComplete ? 'rgba(0,212,170,0.25)' : `${goal.color}20`, position: 'relative', overflow: 'hidden' }}>
      {isComplete && (
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <CheckCircle2 size={20} color="#00D4AA" />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>{goal.emoji}</div>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-2">
            <h3 style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.05rem' }}>{goal.name}</h3>
            <span style={{
              padding: '2px 10px',
              borderRadius: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: isComplete ? 'rgba(0,212,170,0.15)' : 'rgba(108,99,255,0.12)',
              color: isComplete ? '#00D4AA' : goal.color,
              border: `1px solid ${isComplete ? 'rgba(0,212,170,0.3)' : `${goal.color}40`}`,
            }}>
              {isComplete ? 'Completed' : 'Progress Active'}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: 2 }}>
            Target: ₹{goal.target.toLocaleString()} by {goal.deadline}
          </div>
        </div>
      </div>

      {/* Progress Ring + Numbers */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 16 }}>
        {/* SVG Progress Ring */}
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(108,99,255,0.1)" strokeWidth="7" />
            <circle
              cx="40" cy="40" r="32"
              fill="none"
              stroke={isComplete ? '#00D4AA' : goal.color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
              transform="rotate(-90 40 40)"
              style={{ filter: `drop-shadow(0 0 6px ${isComplete ? '#00D4AA' : goal.color}80)`, transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: isComplete ? '#00D4AA' : goal.color }}>{Math.round(pct)}%</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Current Balance', value: `₹${goal.current.toLocaleString()} / ₹${goal.target.toLocaleString()}` },
              { label: 'Days Remaining', value: isComplete ? '—' : `${goal.daysLeft} Days` },
            ].map((kpi) => (
              <div key={kpi.label} style={{ background: 'rgba(108,99,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text)' }}>{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(108,99,255,0.1)', marginBottom: 14, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: isComplete ? '#00D4AA' : `linear-gradient(90deg, ${goal.color}, ${goal.color}aa)`,
          borderRadius: 3,
          boxShadow: `0 0 10px ${goal.color}50`,
          transition: 'width 1s ease',
        }} />
      </div>

      {/* AI Note */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(108,99,255,0.05)', borderRadius: 8, padding: '10px 12px' }}>
        <Cpu size={14} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--color-accent)' }}>AI Kinetic Forecast: </strong>
          {goal.aiNote}
        </p>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    const g = {
      id: Date.now(),
      emoji: '⭐',
      name: newGoal.name,
      target: parseInt(newGoal.target),
      current: 0,
      deadline: newGoal.deadline || 'TBD',
      status: 'active',
      aiNote: 'Goal created. AI will analyze your spending patterns to project your completion date.',
      color: '#8B5CF6',
      daysLeft: 365,
    };
    setGoals((prev) => [g, ...prev]);
    setNewGoal({ name: '', target: '', deadline: '' });
    setShowAddForm(false);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const totalTarget = activeGoals.reduce((s, g) => s + g.target, 0);
  const totalSaved = activeGoals.reduce((s, g) => s + g.current, 0);
  const { isDark } = useTheme();

  return (
    <div className={`dashboard-layout ${!isDark ? 'light-theme' : ''}`}>
      <AppSidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text)' }}>YOUR FINANCIAL GOALS</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
              Goal Tracker · AI-powered forecasting · 2025 Vision
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ gap: 8, padding: '10px 20px' }}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={16} /> New Goal
          </button>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="glass-card alert-card" style={{ marginBottom: 24, borderColor: 'rgba(0,212,170,0.2)' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Create New Goal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Europe Trip"
                  value={newGoal.name}
                  onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
                  style={{ width: '100%', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, padding: '10px 14px', color: 'var(--color-text)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={newGoal.target}
                  onChange={e => setNewGoal({ ...newGoal, target: e.target.value })}
                  style={{ width: '100%', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, padding: '10px 14px', color: 'var(--color-text)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deadline</label>
                <input
                  type="text"
                  placeholder="e.g. June 2025"
                  value={newGoal.deadline}
                  onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  style={{ width: '100%', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, padding: '10px 14px', color: 'var(--color-text)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>
              <button className="btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }} onClick={addGoal}>
                Add Goal
              </button>
            </div>
          </div>
        )}

        {/* Summary Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Active Goals', value: activeGoals.length, color: '#8B5CF6' },
            { label: 'Completed', value: completedGoals.length, color: '#00D4AA' },
            { label: 'Total Target', value: `₹${totalTarget.toLocaleString()}`, color: '#F59E0B' },
            { label: 'Total Saved', value: `₹${totalSaved.toLocaleString()}`, color: '#00D4AA' },
          ].map((s) => (
            <div key={s.label} className="glass-card" style={{ textAlign: 'center', padding: '16px', borderColor: `${s.color}20` }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active Goals Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 28 }}>
          {goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
        </div>

        {/* Goal Timeline */}
        <div className="glass-card">
          <h3 style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem', marginBottom: 24 }}>Goal Timeline — 2025 Vision</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 20px' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 20, right: 20, top: 20, height: 2, background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent2))', zIndex: 0 }} />
            {timeline.map((point, i) => (
              <div key={point.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: point.status === 'done' ? '#00D4AA' : point.status === 'current' ? 'var(--color-accent)' : 'var(--color-surface2)',
                  border: point.status === 'upcoming' ? '2px solid rgba(108,99,255,0.4)' : point.status === 'future' ? '2px solid rgba(108,99,255,0.2)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: point.status === 'current' ? '0 0 20px rgba(108,99,255,0.5)' : 'none',
                }}>
                  {point.status === 'done' ? <CheckCircle2 size={18} color="white" /> :
                   point.status === 'current' ? <Flag size={16} color="white" /> :
                   <Circle size={16} color="rgba(108,99,255,0.4)" />}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: point.status === 'current' ? 'var(--color-accent)' : 'var(--color-text)', fontSize: '0.85rem' }}>{point.month}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 2 }}>{point.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
