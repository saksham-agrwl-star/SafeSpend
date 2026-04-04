import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, User, Briefcase, Wallet, Target, Activity, Check } from 'lucide-react';
import { setupUser } from '../utils/api';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    // Step 1
    name: '', email: '', password: '', phone: '',
    // Step 2
    ageGroup: 'Gen Z (18-25)', occupation: '', annualIncome: '', monthlyBudget: '',
    // Step 3
    foodLimit: '5000', shoppingLimit: '3000', entertainmentLimit: '2000', transportLimit: '2000',
    // Step 4
    goalName: '', goalAmount: '', goalDeadline: '',
    spendingStyle: 'Moderate',
    impulseFlags: { lateNight: false, weekend: false, stress: false }
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => {
    setError('');
    if (step === 1 && (!form.name || !form.email || !form.password)) {
      setError('Please fill all identity fields.'); return;
    }
    if (step === 2 && (!form.occupation || !form.annualIncome || !form.monthlyBudget)) {
      setError('Please fill all financial fields.'); return;
    }
    if (step === 3 && (!form.foodLimit || !form.shoppingLimit)) {
      setError('Please fill category limits.'); return;
    }
    setStep((s) => s + 1);
  };

  const handleToggleFlag = (flag) => {
    setForm(prev => ({
      ...prev,
      impulseFlags: { ...prev.impulseFlags, [flag]: !prev.impulseFlags[flag] }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    // Generate a user ID
    const generatedUserId = 'usr_' + Date.now().toString(36);

    try {
      const payload = {
        userId: generatedUserId,
        name: form.name,
        email: form.email.toLowerCase().trim(),
        ageGroup: form.ageGroup,
        occupation: form.occupation,
        annualIncome: Number(form.annualIncome) || 0,
        monthlyIncome: Math.floor((Number(form.annualIncome) || 0) / 12),
        monthlyBudget: Number(form.monthlyBudget) || 0,
        categoryLimits: {
          food: Number(form.foodLimit) || 5000,
          shopping: Number(form.shoppingLimit) || 3000,
          entertainment: Number(form.entertainmentLimit) || 2000,
          transport: Number(form.transportLimit) || 2000
        },
        spendingStyle: form.spendingStyle || 'Moderate',
        impulseFlags: form.impulseFlags
      };

      // Only add goal fields if user actually filled them
      if (form.goalName && form.goalName.trim()) {
        payload.goalName = form.goalName.trim();
        payload.goalAmount = Number(form.goalAmount) || 0;
        if (form.goalDeadline) {
          payload.goalDeadline = form.goalDeadline;
        }
      }

      const res = await setupUser(payload);
      
      // Save for auth
      localStorage.setItem('safespend_user_id', generatedUserId);
      localStorage.setItem('safespend_user_name', form.name);
      
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Setup failed. Please try again.';
      if (msg.includes('duplicate') || msg.includes('E11000')) {
        setError('An account with this email already exists. Please log in instead.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Identity', icon: User },
    { id: 2, title: 'Profile', icon: Briefcase },
    { id: 3, title: 'Limits', icon: Wallet },
  ];

  return (
    <div className="skeuo-page-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      
      {/* Brand */}
      <Link to="/" style={{ position: 'absolute', top: 32, left: 40, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={20} color="white" />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>SafeSpend</span>
      </Link>

      <div className="skeuo-card" style={{ width: '100%', maxWidth: 520, padding: '40px' }}>
        
        {/* Progress header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
          {steps.map(s => {
            const active = step >= s.id;
            const current = step === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: active ? 1 : 0.4 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: '50%', 
                  background: current ? 'var(--color-accent)' : active ? 'var(--color-surface2)' : 'transparent',
                  border: `2px solid ${active ? 'var(--color-accent)' : 'var(--color-muted)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: current ? 'white' : active ? 'var(--color-accent)' : 'var(--color-muted)',
                  boxShadow: current ? '0 0 15px rgba(108,99,255,0.4)' : 'none'
                }}>
                  {active && !current ? <Check size={18} /> : <Icon size={18} />}
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: active ? 'var(--color-text)' : 'var(--color-muted)' }}>{s.title}</span>
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--color-text)' }}>Create Account</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: 24 }}>Let's get your secure profile started.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="auth-label">Full Name</label>
                <input className="auth-input" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
              </div>
              <div>
                <label className="auth-label">Email Address</label>
                <input className="auth-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="auth-label">Password</label>
                  <input className="auth-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
                </div>
                <div>
                  <label className="auth-label">Phone</label>
                  <input className="auth-input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--color-text)' }}>Financial ML Profile</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: 24 }}>This helps the AI benchmark you against similar peers.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="auth-label">Age Group</label>
                  <select className="auth-input" name="ageGroup" value={form.ageGroup} onChange={handleChange}>
                    <option>Gen Z (18-25)</option><option>Millennial (26-40)</option><option>Gen X (41-55)</option>
                  </select>
                </div>
                <div>
                  <label className="auth-label">Occupation</label>
                  <input className="auth-input" name="occupation" value={form.occupation} onChange={handleChange} placeholder="Software Engineer" />
                </div>
              </div>
              <div>
                <label className="auth-label">Annual Income (₹)</label>
                <input className="auth-input" type="number" name="annualIncome" value={form.annualIncome} onChange={handleChange} placeholder="e.g. 1200000" />
              </div>
              <div>
                <label className="auth-label">Monthly Target Budget (₹)</label>
                <input className="auth-input" type="number" name="monthlyBudget" value={form.monthlyBudget} onChange={handleChange} placeholder="What do you plan to spend per month?" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--color-text)' }}>Category Limits</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginBottom: 24 }}>Set maximums. The AI will enforce these limits during payments.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="auth-label">Food & Dining</label>
                <input className="auth-input" type="number" name="foodLimit" value={form.foodLimit} onChange={handleChange} />
              </div>
              <div>
                <label className="auth-label">Shopping</label>
                <input className="auth-input" type="number" name="shoppingLimit" value={form.shoppingLimit} onChange={handleChange} />
              </div>
              <div>
                <label className="auth-label">Entertainment</label>
                <input className="auth-input" type="number" name="entertainmentLimit" value={form.entertainmentLimit} onChange={handleChange} />
              </div>
              <div>
                <label className="auth-label">Transport</label>
                <input className="auth-input" type="number" name="transportLimit" value={form.transportLimit} onChange={handleChange} />
              </div>
            </div>
          </div>
        )}



        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          {step > 1 && (
            <button type="button" onClick={() => setStep(s => s - 1)} style={{ padding: '12px 24px', borderRadius: 10, background: 'var(--color-surface2)', border: 'none', color: 'var(--color-text)', fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--neumorphic-outset)' }}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={handleNext} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Building Profile...</>
              ) : (
                <><Activity size={18} /> Complete Setup</>
              )}
            </button>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
        </p>

      </div>
      <style>{`.animate-fade-in { animation: fadeIn 0.4s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
