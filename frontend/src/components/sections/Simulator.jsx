import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertCircle, ShieldCheck, Zap } from 'lucide-react';

export default function Simulator() {
  const [spendAmount, setSpendAmount] = useState(2000);
  const sectionRef = useRef(null);

  // Derive state logic directly from amount
  const stateInfo = {
    safe: { color: "text-accent2", border: "border-accent2", icon: <ShieldCheck size={24} className="text-accent2"/>, msg: "Safe to spend. Goa trip goal intact.", bg: "bg-accent2" },
    warn: { color: "text-warn", border: "border-warn", icon: <AlertCircle size={24} className="text-warn"/>, msg: "Warning: High spend. Weekend plans compromised.", bg: "bg-warn" },
    block: { color: "text-danger", border: "border-danger", icon: <Zap size={24} className="text-danger"/>, msg: "Blocked. Derails trip goal by 14 days.", bg: "bg-danger" }
  };

  const currentStatus = spendAmount < 3000 ? 'safe' : spendAmount < 4500 ? 'warn' : 'block';
  const info = stateInfo[currentStatus];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".sim-content", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 50, opacity: 0, duration: 0.8, ease: "power2.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="simulator" className="py-24 relative" ref={sectionRef}>
      <div className="section-container relative z-10">
        
        <div className="glass-card sim-content p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col - Slider */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What-If Simulator</h2>
              <p className="body-text mb-8 text-lg">Before you tap your card, drag to see how a purchase shifts your future balance and trip goal.</p>
              
              <div className="bg-surface2 p-8 rounded-2xl border border-border relative overflow-hidden group">
                <div className={`absolute top-0 left-0 right-0 h-1 ${info.bg} opacity-50`} />
                
                <div className="flex justify-between items-end mb-6">
                  <span className="text-muted font-medium">Purchase Amount</span>
                  <span className={`text-4xl font-black ${info.color} transition-colors`}>₹{spendAmount.toLocaleString()}</span>
                </div>
                
                <input 
                  type="range" 
                  min="500" 
                  max="6000" 
                  step="100" 
                  value={spendAmount} 
                  onChange={(e) => setSpendAmount(parseInt(e.target.value))}
                  className="mb-8"
                />

                <div className={`p-4 rounded-xl border flex gap-4 items-start ${info.border}/30 bg-[rgba(0,0,0,0.3)] transition-colors`}>
                  <div className="mt-1">{info.icon}</div>
                  <div>
                    <h4 className={`font-bold mb-1 ${info.color}`}>AI Intelligence</h4>
                    <p className="text-sm text-gray-300">{info.msg}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Col - Visual Impact */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm aspect-square">
                {/* Central Focus */}
                <div className="absolute inset-0 border-2 border-dashed border-border rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted text-sm mb-2 uppercase tracking-widest">End of Month</p>
                    <p className="text-5xl font-black text-white">₹{(14000 - spendAmount).toLocaleString()}</p>
                    <p className="text-sm font-medium mt-2 text-muted">Estimated Balance</p>
                  </div>
                </div>
                {/* Orbiting Elements */}
                <div className="absolute top-0 right-10 badge-safe bg-surface/80 backdrop-blur-sm -rotate-6 shadow-xl z-20 pointer-events-none transition-transform hover:scale-105">
                  Trip Goal: {(8400 - (spendAmount > 3000 ? spendAmount - 3000 : 0)).toLocaleString()} / 20k
                </div>
                <div className="absolute bottom-10 left-0 bg-surface/80 backdrop-blur-sm border px-4 py-2 rounded-lg rotate-3 shadow-xl z-20 pointer-events-none">
                  <p className="text-xs text-muted mb-1">Impact on runway</p>
                  <p className={`font-bold ${info.color}`}>
                    {spendAmount < 3000 ? 'No change' : spendAmount < 4500 ? '-3 days' : '-7 days'}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
