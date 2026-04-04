import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { loginUser } from '../utils/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    try {
      const json = await loginUser(form.email);
      localStorage.setItem('safespend_user_id', json.data.userId);
      localStorage.setItem('safespend_user_name', json.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem('safespend_user_id', 'user123');
    localStorage.setItem('safespend_user_name', 'Demo User');
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #8B5CF6, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text)' }}>
              Safe<span style={{ color: 'var(--color-accent)' }}>Spend</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>Log in to your financial command center</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--color-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--color-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                className="auth-input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ paddingLeft: 42, paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ marginTop: 6, textAlign: 'right' }}>
              <a href="#" style={{ fontSize: '0.78rem', color: 'var(--color-accent)', textDecoration: 'none' }}>Forgot password?</a>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-danger)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>
          )}

          {/* Submit */}
          <button type="submit" className="btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
            {loading ? (
              <><div style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing in...</>
            ) : (
              <>Log In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(108,99,255,0.1)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(108,99,255,0.1)' }} />
        </div>

        {/* Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          style={{ width: '100%', padding: '11px', borderRadius: 10, background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.25)', color: 'var(--color-accent2)', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', marginBottom: 12 }}
        >
          ⚡ Try Demo Account
        </button>

        {/* Sign up link */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
        </p>


        {/* Trust badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24, color: 'var(--color-muted)', fontSize: '0.75rem' }}>
          <Shield size={13} color="var(--color-accent2)" />
          <span>256-bit encrypted · RBI compliant · Zero data selling</span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
