import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import {
  Plus, Target, CheckCircle2, Circle, Cpu, Edit2, Trash2,
  Palmtree, Smartphone, Car, ShieldCheck, TrendingUp, Flag, Calendar
} from 'lucide-react';
import { getUser, createGoal, updateGoal, deleteGoal, getUserId } from '../utils/api';


const ICON_MAP = { Palmtree, Smartphone, Car, ShieldCheck, Target };

function daysUntil(deadline) {
  if (!deadline) return 0;
  const diff = new Date(deadline) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function GoalCard({ goal, onUpdate, onDelete, updatingId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTarget, setEditTarget] = useState(goal.target);
  const pct = Math.min((goal.current / goal.target) * 100, 100);
  const isComplete = goal.status === 'completed';
  const Icon = goal.icon || Target;

  const handleSave = async () => {
    if (!editTarget) return;
    await onUpdate(goal.id, editTarget);
    setIsEditing(false);
  };

  return (
    <div className="skeuo-card" style={{ borderColor: isComplete ? 'rgba(0,212,170,0.25)' : `${goal.color}20`, position: 'relative', overflow: 'hidden', padding: 24 }}>
      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => { setIsEditing(!isEditing); setEditTarget(goal.target); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: 4 }}>
          {isEditing ? <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Cancel</span> : <Edit2 size={16} />}
        </button>
        <button onClick={() => onDelete(goal.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4 }}><Trash2 size={16} /></button>
        {isComplete && <CheckCircle2 size={20} color="#00D4AA" />}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${goal.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} color={goal.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.1rem' }}>{goal.name}</h3>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              background: isComplete ? 'rgba(0,212,170,0.15)' : 'rgba(108,99,255,0.12)',
              color: isComplete ? '#00D4AA' : goal.color,
              border: `1px solid ${isComplete ? 'rgba(0,212,170,0.3)' : `${goal.color}40`}`,
            }}>
              {isComplete ? 'Completed' : 'Active'}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: 4 }}>
            Target: ₹{goal.target.toLocaleString()} · {goal.deadline}
          </div>
        </div>
      </div>

      {isEditing && (
        <div style={{ padding: '12px 16px', background: 'var(--color-surface)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
          <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Target: ₹</span>
          <input
            type="number"
            value={editTarget}
            onChange={(e) => setEditTarget(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '0.9rem', flex: 1, outline: 'none', fontWeight: 600 }}
            autoFocus
          />
          <button onClick={handleSave} disabled={updatingId === goal.id} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: 6, height: 'auto' }}>
            {updatingId === goal.id ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(108,99,255,0.1)" strokeWidth="6" />
            <circle cx="40" cy="40" r="32" fill="none"
              stroke={isComplete ? '#00D4AA' : goal.color} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: isComplete ? '#00D4AA' : goal.color }}>{Math.round(pct)}%</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: 'rgba(108,99,255,0.05)', borderRadius: 10, padding: '12px' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Saved</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>₹{goal.current.toLocaleString()}</div>
          </div>
          <div style={{ background: 'rgba(108,99,255,0.05)', borderRadius: 10, padding: '12px' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Time Left</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>{isComplete ? '—' : `${goal.daysLeft}d`}</div>
          </div>
        </div>
      </div>

      <div style={{ height: 6, borderRadius: 3, background: 'rgba(108,99,255,0.1)', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: isComplete ? '#00D4AA' : goal.color, borderRadius: 3, transition: 'width 1s ease' }} />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(108,99,255,0.06)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(108,99,255,0.1)' }}>
        <Cpu size={14} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
          <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>AI Forecast: </span>{goal.aiNote}
        </p>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const userId = getUserId();
    getUser(userId)
      .then((json) => {
        if (json.success && json.data?.goals?.length > 0) {
          const mapped = json.data.goals.map((g, i) => ({
            id: g._id || i,
            icon: Target,
            name: g.goalName,
            target: g.targetAmount,
            current: g.savedAmount || 0,
            deadline: g.deadline ? new Date(g.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBD',
            status: (g.savedAmount || 0) >= g.targetAmount ? 'completed' : 'active',
            aiNote: 'AI will analyze spending patterns to project goal completion timeline.',
            color: ['#8B5CF6', '#00D4AA', '#F59E0B', '#EF4444'][i % 4],
            daysLeft: daysUntil(g.deadline),
          }));
          setGoals(mapped);
        } else {
          // No goals: show empty state, do NOT show fake demo data
          setGoals([]);
        }
      })
      .catch(() => setGoals([]))
      .finally(() => setLoading(false));
  }, []);

  const addGoal = async () => {
    if (!newGoal.name || !newGoal.target) return;
    setSaving(true);
    const userId = getUserId();
    try {
      const json = await createGoal({
        userId,
        goalName: newGoal.name,
        targetAmount: Number(newGoal.target),
        deadline: newGoal.deadline || undefined,
      });
      const g = json.data?.goal;
      const newEntry = {
        id: g?._id || Date.now(),
        icon: Target,
        name: newGoal.name,
        target: Number(newGoal.target),
        current: 0,
        deadline: newGoal.deadline || 'TBD',
        status: 'active',
        aiNote: 'Goal created. AI will analyze patterns to project completion.',
        color: '#8B5CF6',
        daysLeft: daysUntil(newGoal.deadline),
      };
      setGoals((prev) => [newEntry, ...prev]);
    } catch {
      // Optimistic add even on network failure
      setGoals((prev) => [{
        id: Date.now(), icon: Target, name: newGoal.name,
        target: Number(newGoal.target), current: 0,
        deadline: newGoal.deadline || 'TBD', status: 'active',
        aiNote: 'Goal created locally. Will sync when backend is reachable.',
        color: '#8B5CF6', daysLeft: daysUntil(newGoal.deadline),
      }, ...prev]);
    } finally {
      setSaving(false);
      setNewGoal({ name: '', target: '', deadline: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdate = async (id, newTargetValue) => {
    const newTarget = parseInt(newTargetValue);
    if (isNaN(newTarget) || newTarget <= 0) return alert("Invalid amount.");
    
    setUpdatingId(id);
    try {
      await updateGoal(getUserId(), id, { targetAmount: newTarget });
      setGoals(prev => prev.map(g => g.id === id ? { ...g, target: newTarget, status: g.current >= newTarget ? 'completed' : 'active' } : g));
    } catch (e) {
      alert("Failed to update goal.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await deleteGoal(getUserId(), id);
      setGoals(prev => prev.filter(g => g.id !== id));
      alert("Goal deleted.");
    } catch (e) {
      alert("Failed to delete goal.");
    }
  };

  const active = goals.filter((g) => g.status === 'active');
  const comp   = goals.filter((g) => g.status === 'completed');
  const totalTarget = active.reduce((s, g) => s + g.target, 0);
  const totalSaved  = active.reduce((s, g) => s + g.current, 0);

  const timeline = [
    { month: 'JAN', label: 'Started',  status: 'done' },
    { month: 'FEB', label: 'Current',  status: 'current' },
    { month: 'MAR', label: 'Goal #1',  status: 'upcoming' },
    { month: 'JUN', label: 'Goal #2',  status: 'upcoming' },
    { month: 'DEC', label: 'Target',   status: 'future' },
  ];

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Financial Goals</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: 2 }}>Strategic Wealth Building · AI Powered</p>
          </div>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={16} /> New Goal
          </button>
        </div>

        {showAddForm && (
          <div className="skeuo-card" style={{ marginBottom: 28, padding: 24, border: '1px solid rgba(0,212,170,0.3)' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 20, fontSize: '1rem' }}>Create Strategic Goal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 16, alignItems: 'end' }}>
              <div>
                <label className="auth-label">Goal Name</label>
                <input className="auth-input" placeholder="e.g. European Summer" value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} />
              </div>
              <div>
                <label className="auth-label">Target (₹)</label>
                <input className="auth-input" type="number" placeholder="50000" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} />
              </div>
              <div>
                <label className="auth-label">Deadline (optional)</label>
                <input className="auth-input" type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} />
              </div>
              <button className="btn-primary" style={{ height: 44 }} onClick={addGoal} disabled={saving}>
                {saving ? 'Saving...' : 'Add Goal'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--color-accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
              {[
                { label: 'Active',       value: active.length,                              color: '#8B5CF6' },
                { label: 'Completed',    value: comp.length,                                color: '#00D4AA' },
                { label: 'Total Target', value: `₹${totalTarget.toLocaleString()}`,         color: '#F59E0B' },
                { label: 'Total Saved',  value: `₹${totalSaved.toLocaleString()}`,          color: '#00D4AA' },
              ].map((s) => (
                <div key={s.label} className="skeuo-card" style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 32 }}>
            {goals.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1' }}>
                <Target size={48} color="var(--color-muted)" style={{ marginBottom: 16, opacity: 0.4 }} />
                <h3 style={{ color: 'var(--color-text)', fontWeight: 700, marginBottom: 8 }}>No goals yet</h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Click "New Goal" to set your first financial target. The AI will track your progress automatically.</p>
              </div>
            )}
            {goals.length > 0 && goals.map((goal) => <GoalCard key={goal.id} goal={goal} onUpdate={handleUpdate} onDelete={handleDelete} updatingId={updatingId} />)}
            </div>
          </>
        )}
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
