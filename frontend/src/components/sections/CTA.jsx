import { CheckCircle2 } from 'lucide-react';

export default function CTA() {
  return (
    <section id="cta" className="py-32 relative bg-surface2 border-t border-border overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent opacity-20 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent2 opacity-10 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6">Stop Reacting.<br/>Start Governing.</h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Take back control of your financial future with the world's first AI active governor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Free Tier */}
          <div className="glass-card p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <div className="text-4xl font-black mb-6">₹0<span className="text-lg text-muted font-normal">/mo</span></div>
            <p className="text-muted mb-8 text-sm">Perfect for passive tracking.</p>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent2" /> manual entries</li>
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent2" /> Budget setup</li>
              <li className="flex gap-3 text-sm text-muted line-through"><CheckCircle2 size={18} className="opacity-50" /> AI Interventions</li>
            </ul>
            <button className="btn-secondary w-full justify-center">Get Started</button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="glass-card p-8 flex flex-col border-accent/40 relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(108,99,255,0.15)]">
            <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-[15px]">POPULAR</div>
            <h3 className="text-2xl font-bold mb-2 text-accent">AI Twin</h3>
            <div className="text-4xl font-black mb-6">₹99<span className="text-lg text-muted font-normal">/mo</span></div>
            <p className="text-muted mb-8 text-sm">Full behavioral analysis and active intervention.</p>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent" /> AI Pre-spend Interventions</li>
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent" /> 30-Day Predictor Engine</li>
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent" /> What-If Simulator</li>
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent" /> RBI Account Aggregator</li>
            </ul>
            <button className="btn-primary w-full justify-center text-lg animate-glow-pulse">Start 14-Day Free Trial</button>
          </div>

          {/* B2B Tier */}
          <div className="glass-card p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">B2B API</h3>
            <div className="text-4xl font-black mb-6">Custom</div>
            <p className="text-muted mb-8 text-sm">For banks and neobanks wanting to embed our AI.</p>
            <ul className="flex flex-col gap-4 mb-8 flex-grow">
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent2" /> White-label AI engine</li>
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent2" /> Federated learning</li>
              <li className="flex gap-3 text-sm"><CheckCircle2 size={18} className="text-accent2" /> Dedicated support</li>
            </ul>
            <button className="btn-secondary w-full justify-center">Contact Sales</button>
          </div>

        </div>
      </div>
    </section>
  );
}
