import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section id="cta" className="py-16 relative overflow-hidden"
      style={{ background: 'var(--color-surface2)', borderTop: '1px solid var(--color-border)' }}>

      {/* Subtle blobs */}
      <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'var(--color-accent)', opacity: 0.06, filter: 'blur(80px)', transform: 'translate(-50%,-50%)' }} />
      <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'var(--color-accent2)', opacity: 0.06, filter: 'blur(80px)', transform: 'translate(50%,-50%)' }} />

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6" style={{ color: 'var(--color-text)' }}>
            Stop Reacting.<br/>Start Governing.
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-muted)' }}>
            Take back control of your financial future with the world's first AI active governor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

          {/* Free Tier */}
          <div className="skeuo-card p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Basic</h3>
            <div className="text-4xl font-black mb-6" style={{ color: 'var(--color-text)' }}>
              ₹0<span className="text-lg font-normal" style={{ color: 'var(--color-muted)' }}>/mo</span>
            </div>
            <p className="mb-8 text-sm" style={{ color: 'var(--color-muted)' }}>Perfect for passive tracking.</p>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              <li className="flex gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
                <CheckCircle2 size={18} color="var(--color-accent2)" /> Manual entries
              </li>
              <li className="flex gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
                <CheckCircle2 size={18} color="var(--color-accent2)" /> Budget setup
              </li>
              <li className="flex gap-3 text-sm line-through" style={{ color: 'var(--color-muted)' }}>
                <CheckCircle2 size={18} style={{ opacity: 0.4 }} color="var(--color-muted)" /> AI Interventions
              </li>
            </ul>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</button>
          </div>

          {/* Pro Tier */}
          <div className="skeuo-card p-8 flex flex-col relative" style={{ transform: 'translateY(-8px)', borderColor: 'var(--color-accent)' }}>
            <div className="absolute top-0 right-0 text-xs font-bold px-3 py-1"
              style={{
                background: 'var(--color-accent)',
                color: 'white',
                borderBottomLeftRadius: '8px',
                borderTopRightRadius: '16px'
              }}>POPULAR</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>AI Twin</h3>
            <div className="text-4xl font-black mb-6" style={{ color: 'var(--color-text)' }}>
              ₹99<span className="text-lg font-normal" style={{ color: 'var(--color-muted)' }}>/mo</span>
            </div>
            <p className="mb-8 text-sm" style={{ color: 'var(--color-muted)' }}>Full behavioral analysis and active intervention.</p>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              {['AI Pre-spend Interventions','30-Day Predictor Engine','What-If Simulator','RBI Account Aggregator'].map(f => (
                <li key={f} className="flex gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/dashboard" className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', textDecoration: 'none' }}>
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* B2B Tier */}
          <div className="skeuo-card p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>B2B API</h3>
            <div className="text-4xl font-black mb-6" style={{ color: 'var(--color-text)' }}>Custom</div>
            <p className="mb-8 text-sm" style={{ color: 'var(--color-muted)' }}>For banks and neobanks wanting to embed our AI.</p>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              {['White-label AI engine','Federated learning','Dedicated support'].map(f => (
                <li key={f} className="flex gap-3 text-sm" style={{ color: 'var(--color-text)' }}>
                  <CheckCircle2 size={18} color="var(--color-accent2)" /> {f}
                </li>
              ))}
            </ul>
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Contact Sales</button>
          </div>

        </div>
      </div>
    </section>
  );
}
