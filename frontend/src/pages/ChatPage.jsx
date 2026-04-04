import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { Send, Bot, User, BrainCircuit } from 'lucide-react';
import { chatMessage, getDashboard, getUserId } from '../utils/api';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    content: "Hey! I'm your AI Financial Command System. I have real-time access to your spending profile. Ask me anything — from \"can I afford this?\" to \"why am I always broke before payday.\"",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTIONS = [
  "How's my Food budget doing?",
  "When will I hit my savings goal?",
  "Am I spending more than peers?",
  "Give me a weekly spending tip",
];

export default function ChatPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [kpis, setKpis] = useState([
    { label: 'Health Score', value: '—', color: '#F59E0B' },
    { label: 'Budget Left', value: '—', color: '#00D4AA' },
    { label: 'Balance', value: '—', color: '#8B5CF6' },
    { label: 'Active Goals', value: '—', color: '#00D4AA' },
  ]);
  const scrollRef = useRef(null);

  // Load live KPI data on mount
  useEffect(() => {
    const userId = getUserId();
    getDashboard(userId)
      .then((json) => {
        if (json.success && json.data) {
          const d = json.data;
          setKpis([
            { label: 'Health Score', value: `${d.score}/100`, color: d.score > 70 ? '#00D4AA' : d.score > 40 ? '#F59E0B' : '#EF4444' },
            { label: 'Budget Left',  value: `₹${(d.budgetLeft || 0).toLocaleString()}`, color: '#00D4AA' },
            { label: 'Balance',      value: `₹${(d.currentBalance || 0).toLocaleString()}`, color: '#8B5CF6' },
            { label: 'Active Goals', value: `${(d.goalProgress || []).length}`, color: '#F59E0B' },
          ]);
        }
      })
      .catch(() => {}); // Silently fall back to placeholder
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const onSend = async (txt) => {
    const val = txt || input.trim();
    if (!val) return;
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: val,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((p) => [...p, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const userId = getUserId();
      const json = await chatMessage({ userId, message: val });
      const aiText = json?.data?.response || "I couldn't process that request right now. Please try again.";
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: "Sorry, I'm having trouble connecting to the AI engine right now. Make sure the backend is running on port 5000.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**')) return <div key={i} style={{ fontWeight: 800, margin: '10px 0 4px', color: 'var(--color-text)' }}>{line.replace(/\*\*/g, '')}</div>;
      if (line.startsWith('• ')) return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}><span style={{ color: 'var(--color-accent)' }}>•</span>{line.slice(2)}</div>;
      return <div key={i} style={{ marginBottom: 4 }}>{line}</div>;
    });
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', paddingBottom: 20 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexShrink: 0 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>AI Financial Command</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: 2 }}>Neural Analysis · Context Aware · Live Data</p>
          </div>
          <div className="badge-safe"><BrainCircuit size={13} /> AI System Online</div>
        </div>

        {/* Live KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24, flexShrink: 0 }}>
          {kpis.map((k) => (
            <div key={k.label} className="skeuo-card" style={{ padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{k.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Chat window */}
        <div className="skeuo-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', gap: 16, flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: m.role === 'user' ? 'var(--color-surface2)' : 'linear-gradient(135deg, #8B5CF6, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.role === 'user' ? <User size={18} color="var(--color-accent)" /> : <Bot size={18} color="white" />}
                </div>
                <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '14px 20px',
                    borderRadius: 16,
                    background: m.role === 'user' ? 'var(--color-accent)' : 'var(--color-surface2)',
                    color: m.role === 'user' ? 'white' : 'var(--color-text)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    boxShadow: 'var(--neumorphic-outset)'
                  }}>
                    {renderContent(m.content)}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 6, fontWeight: 600 }}>
                    {m.role === 'ai' ? 'SafeSpend AI' : 'You'} · {m.time}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="white" />
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', animation: 'typingDot 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Bottom shelf */}
          <div style={{ padding: '20px 32px', background: 'rgba(108,99,255,0.03)', borderTop: '1px solid rgba(108,99,255,0.08)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  disabled={isTyping}
                  style={{ padding: '6px 14px', borderRadius: 20, background: 'var(--color-bg)', border: '1px solid rgba(108,99,255,0.15)', color: 'var(--color-muted)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}
                  onMouseOver={(e) => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.color = 'var(--color-text)'; }}
                  onMouseOut={(e) => { e.target.style.borderColor = 'rgba(108,99,255,0.15)'; e.target.style.color = 'var(--color-muted)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSend()}
                disabled={isTyping}
                placeholder="Ask your AI advisor anything..."
                style={{ width: '100%', padding: '14px 60px 14px 20px', background: 'var(--color-bg)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12, color: 'var(--color-text)', outline: 'none', fontSize: '0.92rem' }}
              />
              <button
                onClick={() => onSend()}
                disabled={!input.trim() || isTyping}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: 10, background: 'var(--color-accent)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: input.trim() ? 1 : 0.5 }}
              >
                <Send size={18} color="white" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <style>{`@keyframes typingDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }`}</style>
    </div>
  );
}
