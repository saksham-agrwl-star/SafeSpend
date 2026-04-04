import { useState, useRef, useEffect } from 'react';
import AppSidebar from '../components/layout/AppSidebar';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Brain, MessageSquare, Target,
  HelpCircle, LogOut, Zap, ChevronRight, Send, Cpu, Sparkles
} from 'lucide-react';



const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    content: "Hey! I'm your AI Financial Command System. I've analyzed your 1,422 transactions and have real-time access to your spending DNA. Ask me anything — from \"can I afford this?\" to \"why am I always broke before payday.\"",
    time: '9:00 PM',
  },
  {
    id: 2,
    role: 'user',
    content: 'Can I afford a ₹3,000 Swiggy order tonight?',
    time: '9:02 PM',
  },
  {
    id: 3,
    role: 'ai',
    content: "Technically? Yes. Wisely? No.\n\n**Your current status:**\n• Food budget remaining: ₹1,160 (₹3,840 spent of ₹5,000)\n• Days left this month: 12\n• Goa Trip goal deficit: ₹2,800\n\nA ₹3,000 order tonight blows 258% of your remaining food budget and adds 4 days to your Goa goal delay.\n\n**AI Recommendation:** Order from Swiggy for max ₹600. Cook at home for 2 days. You'll recover by Day 18 and your calorie-to-cost ratio improves by 22%.",
    time: '9:02 PM',
  },
];

const AI_RESPONSES = {
  default: [
    "Based on your spending DNA, you tend to overspend on weekends. Your Friday-to-Sunday average is ₹4,200 vs ₹1,800 on weekdays. Want me to set up a weekend budget lock?",
    "Your financial health score is 74/100. The main drag is your Food category at 84% of budget with 12 days remaining. Cutting Swiggy by ₹500 this week puts you back to green.",
    "Comparing you to peers in your income bracket (₹60k-₹70k/month): you're saving 23% less than the median. The gap is primarily in Food (₹1,600 above average) and Shopping (₹1,600 above budget).",
    "Your Goa Trip goal is on track to be delayed by 42 days at current spend. The fastest fix: reduce Shopping by ₹400/week. Goal achieved by March 31.",
    "Pattern detected: You spend 2.4x more during high-stress weeks. I see 3 deadlines next week in your calendar integration. Pre-emptively locking your Swiggy impulse purchases? Tap to confirm.",
  ],
};

const SUGGESTIONS = [
  "How's my Food budget doing?",
  "When will I hit my Goa goal?",
  "Am I spending more than peers?",
  "Analyze my worst spending day",
  "What should I cut this week?",
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '14px 18px', background: 'rgba(108,99,255,0.08)', borderRadius: 14, borderBottomLeftRadius: 4, width: 'fit-content', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)',
          animation: `typingDot 1.2s ease-in-out infinite`,
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

const financialContext = [
  { label: 'Health Score', value: '74/100', color: '#F59E0B' },
  { label: 'Budget Left', value: '₹9,160', color: '#00D4AA' },
  { label: 'Food Used', value: '84%', color: '#EF4444' },
  { label: 'Goal ETA', value: '+42 days', color: '#8B5CF6' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg = { id: Date.now(), role: 'user', content: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const responses = AI_RESPONSES.default;
      const aiReply = responses[Math.floor(Math.random() * responses.length)];
      const aiMsg = { id: Date.now() + 1, role: 'ai', content: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const formatContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 700, color: 'var(--color-text)', margin: '8px 0 4px' }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.startsWith('• ')) {
        return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}><span style={{ color: 'var(--color-accent)' }}>•</span><span>{line.slice(2)}</span></div>;
      }
    });
  };
  const { isDark } = useTheme();

  return (
    <div className={`dashboard-layout ${!isDark ? 'light-theme' : ''}`}>
      <AppSidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', maxHeight: '100vh' }}>
        {/* Header */}
        <div className="dashboard-header" style={{ flexShrink: 0 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text)' }}>AI COMMAND CHAT</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>
              Neural Financial Intelligence · Context-aware · 1,422 data points loaded
            </p>
          </div>
          <div className="badge-safe">
            <Sparkles size={14} /> AI Online
          </div>
        </div>

        {/* Financial Context Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '0 32px 16px', flexShrink: 0 }}>
          {financialContext.map((ctx) => (
            <div key={ctx.label} style={{
              background: '#FFFFFF',
              border: '1px solid #E4E6F0',
              boxShadow: '0 1px 4px rgba(108,99,255,0.06)',
              borderRadius: 10,
              padding: '10px 14px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                {ctx.label}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: ctx.color }}>
                {ctx.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px', scrollbarWidth: 'thin', scrollbarColor: 'var(--color-accent) var(--color-bg)' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
              {msg.role === 'ai' && (
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Cpu size={16} color="white" />
                </div>
              )}
              <div style={{ maxWidth: '72%' }}>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: 14,
                  borderBottomLeftRadius: msg.role === 'ai' ? 4 : 14,
                  borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, var(--color-accent), #4B42CC)'
                    : '#F0F1F8',
                  border: msg.role === 'ai' ? '1px solid #E0E2EF' : 'none',
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  color: msg.role === 'user' ? '#fff' : 'var(--color-text)',
                }}>
                  {formatContent(msg.content)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left', padding: '0 4px' }}>
                  {msg.role === 'ai' ? '🧠 SpendSense AI' : 'You'} · {msg.time}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #8B5CF6, #00D4AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Cpu size={16} color="white" />
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        <div style={{ padding: '12px 32px 8px', display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0 }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => sendMessage(s)} style={{
              padding: '7px 14px',
              background: 'rgba(108,99,255,0.08)',
              border: '1px solid rgba(108,99,255,0.2)',
              borderRadius: 20,
              color: 'var(--color-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: 500,
            }}
              onMouseEnter={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.color = 'var(--color-text)'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(108,99,255,0.2)'; e.target.style.color = 'var(--color-muted)'; }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '12px 32px 24px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#FFFFFF', border: '1px solid #E4E6F0', boxShadow: '0 2px 8px rgba(108,99,255,0.06)', borderRadius: 14, padding: '8px 8px 8px 18px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your AI financial advisor anything..."
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="btn-primary"
              style={{ padding: '10px 16px', borderRadius: 10, opacity: input.trim() ? 1 : 0.5 }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
