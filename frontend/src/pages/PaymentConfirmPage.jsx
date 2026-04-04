import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  ShieldCheck, AlertTriangle, ArrowRight, ShieldAlert, TrendingDown,
  Clock, CheckCircle2, BrainCircuit, Zap, Target, Wallet, Activity,
  XCircle, ChevronRight
} from 'lucide-react';
import { aiCheck, addTransaction, getUserId } from '../utils/api';

const RISK_CONFIG = {
  SAFE:    { color: '#00D4AA', bg: 'rgba(0,212,170,0.1)',   border: 'rgba(0,212,170,0.3)',   label: 'Cleared',        Icon: CheckCircle2 },
  CAUTION: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', label: 'Heads Up',       Icon: Activity },
  WARNING: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  label: 'Budget Warning', Icon: AlertTriangle },
  BLOCK:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   label: 'Blocked',        Icon: ShieldAlert },
};

const SignalPill = ({ signal }) => {
  const colors = { high: '#EF4444', medium: '#F59E0B', low: '#00D4AA' };
  const c = colors[signal.severity] || '#8B5CF6';
  return (
    <div style={{
      padding: '5px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
      background: `${c}15`, color: c, border: `1px solid ${c}30`,
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block' }} />
      {signal.type.replace(/_/g, ' ')}
    </div>
  );
};

const FinancialRow = ({ label, value, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(108,99,255,0.06)' }}>
    <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 600 }}>{label}</span>
    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: color || 'var(--color-text)' }}>{value}</span>
  </div>
);

const PaymentConfirmPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { upiData, scanResult } = location.state || {};

  const [amount, setAmount]             = useState(upiData?.amount || '');
  const [merchantName, setMerchantName] = useState(upiData?.name || '');
  const isManual = upiData?.upiId === 'manual@upi';

  const [loading, setLoading]                 = useState(false);
  const [riskAssessment, setRiskAssessment]   = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showMLForm, setShowMLForm]           = useState(false);
  const [autoCountdown, setAutoCountdown]     = useState(null);
  const [mlContext, setMlContext] = useState({ category: 'Food', isEmergency: false, isSubscription: false });

  useEffect(() => { if (!upiData) navigate('/scan'); }, [upiData, navigate]);
  if (!upiData) return null;

  // Countdown for WARNING auto-proceed
  useEffect(() => {
    if (autoCountdown === null) return;
    if (autoCountdown <= 0) { saveAndRedirect('WARNING', false); return; }
    const t = setTimeout(() => setAutoCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [autoCountdown]);

  const risk = riskAssessment?.risk || null;
  const cfg  = risk ? RISK_CONFIG[risk] || RISK_CONFIG.SAFE : null;

  const runAICheck = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    setShowMLForm(false);
    try {
      const json = await aiCheck({
        userId: getUserId(),
        merchant: merchantName,
        amount,
        localTimeHr: new Date().getHours(),
        ...mlContext,
      });
      const data = json.data;
      setRiskAssessment(data);

      if (data.risk === 'SAFE' || data.risk === 'CAUTION') {
        saveAndRedirect(data.risk, false);
      } else if (data.risk === 'WARNING') {
        setAutoCountdown(4);
      } else {
        setShowConfirmPopup(true);
      }
    } catch (e) {
      console.error('AI Check error', e);
      saveAndRedirect('UNKNOWN', false);
    } finally {
      setLoading(false);
    }
  };

  const saveAndRedirect = async (riskLevel, wasBlocked) => {
    try {
      await addTransaction({
        userId:        getUserId(),
        transactionId: 'txn_' + Date.now(),
        amount:        parseFloat(amount),
        merchant:      merchantName || 'Unknown Merchant',
        upiId:         upiData.upiId,
        time:          new Date().toLocaleTimeString(),
        category:      mlContext.category,
        riskLevel:     riskLevel === 'SAFE' || riskLevel === 'CAUTION' ? 'Low' : riskLevel === 'WARNING' ? 'Medium' : 'High',
        reason:        'QR Payment',
        wasBlocked,
        userProceed:   true,
      });
    } catch (e) { console.warn('Failed to log transaction', e); }

    if (!wasBlocked) {
      const upiUrl = `upi://pay?pa=${upiData.upiId}&pn=${encodeURIComponent(upiData.name || '')}&am=${amount}&cu=INR`;
      window.location.href = upiUrl;
    } else {
      navigate('/dashboard');
    }
  };

  const budgetBar = scanResult
    ? Math.min(100, Math.round((scanResult.totalSpentThisMonth / (scanResult.monthlyBudget || 30000)) * 100))
    : riskAssessment?.financials
    ? Math.min(100, riskAssessment.financials.budgetUsedPct)
    : 0;

  return (
    <div className="skeuo-page-bg flex flex-col pt-16 min-h-screen">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full" style={{ maxWidth: 520 }}>

          {/* ── Main Card ──────────────────────────────────────────────── */}
          <div className="skeuo-card relative overflow-hidden" style={{ padding: 28 }}>
            {/* Risk gradient top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: cfg
                ? `linear-gradient(90deg, ${cfg.color}, ${cfg.color}66)`
                : 'linear-gradient(90deg, #8B5CF6, #00D4AA)',
              transition: 'background 0.5s ease',
            }} />

            {/* Merchant avatar */}
            <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 8 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px',
                background: cfg ? `${cfg.color}20` : 'rgba(139,92,246,0.15)',
                border: `2px solid ${cfg?.color || 'rgba(139,92,246,0.3)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.8rem', fontWeight: 900, color: cfg?.color || '#8B5CF6',
                boxShadow: `0 0 24px ${(cfg?.color || '#8B5CF6')}30`,
                transition: 'all 0.4s ease',
              }}>
                {(merchantName || 'M').charAt(0).toUpperCase()}
              </div>
              {isManual ? (
                <input
                  value={merchantName}
                  onChange={e => setMerchantName(e.target.value)}
                  placeholder="Enter Merchant Name"
                  style={{
                    background: 'transparent', border: 'none', borderBottom: '1px solid rgba(108,99,255,0.3)',
                    textAlign: 'center', fontSize: '1.15rem', fontWeight: 800,
                    color: 'var(--color-text)', outline: 'none', width: 200,
                  }}
                />
              ) : (
                <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: 4 }}>
                  {merchantName || 'Unknown Merchant'}
                </h2>
              )}
              <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                {upiData.upiId} <ShieldCheck size={12} color="var(--color-accent)" />
              </p>
            </div>

            {/* Amount input */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6, fontWeight: 700 }}>Amount</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-muted)' }}>₹</span>
                <input
                  type="number" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  disabled={loading || showConfirmPopup || showMLForm}
                  style={{
                    fontSize: '3rem', fontWeight: 900, color: 'var(--color-text)',
                    background: 'transparent', border: 'none', outline: 'none',
                    width: 180, textAlign: 'center',
                    opacity: loading ? 0.5 : 1,
                  }}
                />
              </div>
              <div style={{ height: 1, width: 200, margin: '8px auto 0', background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent)' }} />
            </div>

            {/* Pre-scan AI context from scanTransaction */}
            {scanResult && !riskAssessment && (
              <div style={{
                background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)',
                borderRadius: 14, padding: '16px 20px', marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <BrainCircuit size={16} color="var(--color-accent)" />
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    AI Pre-Scan Analysis
                  </span>
                  <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 10, fontSize: '0.65rem', fontWeight: 800, background: `${(RISK_CONFIG[scanResult.initialRisk] || RISK_CONFIG.SAFE).color}20`, color: (RISK_CONFIG[scanResult.initialRisk] || RISK_CONFIG.SAFE).color }}>
                    {scanResult.initialRisk || 'SCANNING'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  {[
                    { icon: Wallet,      label: 'Budget Used', value: `${scanResult.budgetUsedPct || 0}%`,  color: scanResult.budgetUsedPct > 85 ? '#EF4444' : scanResult.budgetUsedPct > 65 ? '#F59E0B' : '#00D4AA' },
                    { icon: TrendingDown, label: 'Post-Pay Balance', value: `₹${Math.max(0, scanResult.predictedBalance || 0).toLocaleString()}`, color: (scanResult.predictedBalance || 0) < 5000 ? '#EF4444' : 'var(--color-text)' },
                    { icon: Target, label: 'Goal Delay', value: scanResult.goalImpactDays > 0 ? `+${scanResult.goalImpactDays}d` : 'Safe', color: scanResult.goalImpactDays > 0 ? '#F59E0B' : '#00D4AA' },
                    { icon: Activity, label: 'Runway',          value: `${scanResult.runwayDays || 0}d`,   color: (scanResult.runwayDays || 0) < 5 ? '#EF4444' : 'var(--color-text)' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} style={{ background: 'rgba(108,99,255,0.05)', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                        <Icon size={12} color="var(--color-muted)" />
                        <span style={{ fontSize: '0.62rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{label}</span>
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 900, color }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Budget bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--color-muted)', marginBottom: 4 }}>
                    <span>Monthly Budget</span>
                    <span>₹{(scanResult.totalSpentThisMonth || 0).toLocaleString()} / ₹{(scanResult.monthlyBudget || 0).toLocaleString()}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'rgba(108,99,255,0.1)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${budgetBar}%`, borderRadius: 3, background: budgetBar > 85 ? '#EF4444' : budgetBar > 65 ? '#F59E0B' : '#00D4AA', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Post-AI-check result panel */}
            {riskAssessment && cfg && (
              <div style={{
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                borderRadius: 14, padding: '18px 20px', marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <cfg.Icon size={22} color={cfg.color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: cfg.color, fontSize: '0.9rem' }}>{cfg.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Score: {riskAssessment.score}/100</div>
                  </div>
                  {risk === 'WARNING' && autoCountdown > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, background: 'rgba(245,158,11,0.2)', color: '#F59E0B', fontSize: '0.72rem', fontWeight: 800 }}>
                      <Clock size={11} /> {autoCountdown}s
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--color-muted)', lineHeight: 1.6, marginBottom: 14 }}>
                  {riskAssessment.preCheck?.message}
                </p>

                {/* Signal pills */}
                {riskAssessment.signals?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {riskAssessment.signals.map((s, i) => <SignalPill key={i} signal={s} />)}
                  </div>
                )}

                {/* Financial impact grid */}
                {riskAssessment.financials && (
                  <div>
                    <FinancialRow label="Budget after payment"  value={`₹${(riskAssessment.financials.budgetAfterTx || 0).toLocaleString()}`}  color={riskAssessment.financials.budgetAfterTx < 5000 ? '#EF4444' : null} />
                    <FinancialRow label="Daily burn rate"       value={`₹${(riskAssessment.financials.dailyBurnRate || 0).toLocaleString()}/day`} />
                    <FinancialRow label="Budget runway"         value={`${riskAssessment.financials.runwayDays || 0} days left`} color={riskAssessment.financials.runwayDays < 5 ? '#EF4444' : null} />
                    {riskAssessment.financials.goalImpactDays > 0 && (
                      <FinancialRow label={`${riskAssessment.financials.goalName || 'Goal'} delay`} value={`+${riskAssessment.financials.goalImpactDays} days`} color="#F59E0B" />
                    )}
                    <FinancialRow label="Month budget used"    value={`${riskAssessment.financials.budgetUsedPct || 0}%`} color={riskAssessment.financials.budgetUsedPct > 85 ? '#EF4444' : null} />
                  </div>
                )}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={() => setShowMLForm(true)}
              disabled={loading || showConfirmPopup || !amount || parseFloat(amount) <= 0 || showMLForm || autoCountdown > 0}
              style={{
                width: '100%', padding: '16px 20px', borderRadius: 14,
                border: 'none', cursor: (!amount || loading || showMLForm || autoCountdown > 0) ? 'not-allowed' : 'pointer',
                background: (!amount || parseFloat(amount) <= 0 || loading || showMLForm || autoCountdown > 0)
                  ? 'var(--color-surface2)' : 'var(--color-accent)',
                color: (!amount || parseFloat(amount) <= 0) ? 'var(--color-muted)' : 'white',
                fontWeight: 800, fontSize: '0.95rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: amount && !loading ? '0 8px 24px rgba(139,92,246,0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid white', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} /> AI Evaluating...</>
              ) : (
                <><BrainCircuit size={18} /> Analyse & Pay <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* ── ML Form Popup ────────────────────────────────────────────── */}
      {showMLForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="skeuo-card" style={{ width: '100%', maxWidth: 380, padding: 28, position: 'relative' }}>
            <button onClick={() => setShowMLForm(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: 18 }}>×</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <BrainCircuit size={22} color="var(--color-accent)" />
              <div>
                <h3 style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1rem', marginBottom: 2 }}>AI Intent Verification</h3>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>Help the AI assess this transaction accurately</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {['Food', 'Shopping', 'Entertainment', 'Transport', 'Bills', 'Other'].map(c => (
                    <button key={c} onClick={() => setMlContext({ ...mlContext, category: c })}
                      style={{
                        padding: '10px 6px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem',
                        background: mlContext.category === c ? 'var(--color-accent)' : 'var(--color-surface2)',
                        color: mlContext.category === c ? 'white' : 'var(--color-muted)',
                        transition: 'all 0.15s ease',
                        boxShadow: mlContext.category === c ? '0 4px 12px rgba(139,92,246,0.3)' : 'none',
                      }}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { key: 'isEmergency', label: '🚨 Emergency', desc: 'Reduces AI risk score' },
                  { key: 'isSubscription', label: '🔄 Subscription', desc: 'Recurring payment' },
                ].map(({ key, label, desc }) => (
                  <button key={key} onClick={() => setMlContext({ ...mlContext, [key]: !mlContext[key] })}
                    style={{
                      flex: 1, padding: '12px 8px', borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'center',
                      background: mlContext[key] ? 'rgba(0,212,170,0.15)' : 'var(--color-surface2)',
                      color: mlContext[key] ? '#00D4AA' : 'var(--color-muted)',
                      fontWeight: 700, fontSize: '0.78rem',
                      boxShadow: mlContext[key] ? '0 0 0 1px rgba(0,212,170,0.3)' : 'none',
                      transition: 'all 0.15s ease',
                    }}>
                    <div>{label}</div>
                    <div style={{ fontSize: '0.62rem', opacity: 0.7, marginTop: 3 }}>{desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowMLForm(false)} style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--color-surface2)', color: 'var(--color-muted)', fontWeight: 700 }}>
                  Cancel
                </button>
                <button onClick={runAICheck} style={{ flex: 2, padding: 14, borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--color-accent)', color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(139,92,246,0.35)' }}>
                  <Zap size={16} /> Run AI Engine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Block Popup ──────────────────────────────────────────────── */}
      {showConfirmPopup && riskAssessment && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)' }}>
          <div className="skeuo-card" style={{ width: '100%', maxWidth: 380, padding: 32, border: '1px solid rgba(239,68,68,0.3)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', width: 56, height: 56, borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(239,68,68,0.5)', border: '4px solid var(--color-bg)' }}>
              <ShieldAlert size={26} color="white" />
            </div>

            <div style={{ textAlign: 'center', marginTop: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: 8 }}>Payment Blocked</h3>
              <p style={{ fontSize: '0.85rem', color: '#EF4444', fontWeight: 700, marginBottom: 16, lineHeight: 1.5 }}>
                {riskAssessment.preCheck?.message || 'This violates your financial boundaries.'}
              </p>

              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 16px', textAlign: 'left', marginBottom: 16 }}>
                {riskAssessment.signals?.slice(0, 2).map((s, i) => (
                  <div key={i} style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: i < 1 ? 8 : 0, display: 'flex', gap: 6 }}>
                    <span style={{ color: '#EF4444', fontWeight: 800 }}>↳</span>{s.msg}
                  </div>
                ))}
              </div>

              {riskAssessment.financials?.goalImpactDays > 0 && (
                <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Target size={16} color="#F59E0B" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Goal Impact</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F59E0B' }}>
                      {riskAssessment.financials.goalName || 'Your goal'} delayed by {riskAssessment.financials.goalImpactDays} days
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => { setShowConfirmPopup(false); navigate('/dashboard'); }}
                style={{ padding: '14px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'var(--color-accent)', color: 'white', fontWeight: 800, fontSize: '0.9rem' }}
              >
                Protect My Goal
              </button>
              <button
                onClick={() => { setShowConfirmPopup(false); saveAndRedirect('HIGH', false); }}
                style={{ padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', background: 'transparent', color: '#EF4444', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <XCircle size={15} /> Override — Accept Risk & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PaymentConfirmPage;
