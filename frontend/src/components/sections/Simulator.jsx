import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertCircle, ShieldCheck, Zap } from 'lucide-react';

export default function Simulator() {
  const [spendAmount, setSpendAmount] = useState(2000);
  const sectionRef = useRef(null);

  const statusMap = {
    safe: {
      color: 'var(--color-accent2)',
      Icon: ShieldCheck,
      msg: 'Safe to spend. Goa trip goal intact.',
      bg: 'rgba(184,132,90,0.1)',
      border: 'rgba(184,132,90,0.3)',
    },
    warn: {
      color: 'var(--color-warn)',
      Icon: AlertCircle,
      msg: 'Warning: High spend. Weekend plans compromised.',
      bg: 'rgba(212,145,58,0.1)',
      border: 'rgba(212,145,58,0.3)',
    },
    block: {
      color: 'var(--color-danger)',
      Icon: Zap,
      msg: 'Blocked. Derails trip goal by 14 days.',
      bg: 'rgba(192,80,74,0.1)',
      border: 'rgba(192,80,74,0.3)',
    },
  };

  const currentStatus = spendAmount < 3000 ? 'safe' : spendAmount < 4500 ? 'warn' : 'block';
  const info = statusMap[currentStatus];

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.sim-content',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="simulator" className="py-16 relative" ref={sectionRef}>
      <div className="section-container relative z-10">
        <div className="skeuo-card sim-content p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Slider side */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                What-If Simulator
              </h2>
              <p className="body-text mb-8 text-lg">
                Before you tap your card, drag to see how a purchase shifts your future balance and trip goal.
              </p>

              <div className="p-8 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'var(--color-surface2)',
                  boxShadow: 'inset 4px 4px 12px var(--shadow-dark), inset -3px -3px 8px var(--shadow-light)',
                  border: '1px solid var(--color-border)'
                }}>
                {/* Top accent stripe */}
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: info.color, opacity: 0.5 }} />

                <div className="flex justify-between items-end mb-6">
                  <span style={{ color: 'var(--color-muted)', fontWeight: 500 }}>Purchase Amount</span>
                  <span className="text-4xl font-black transition-colors" style={{ color: info.color }}>
                    ₹{spendAmount.toLocaleString()}
                  </span>
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

                <div className="p-4 rounded-xl flex gap-4 items-start transition-colors"
                  style={{ background: info.bg, border: `1px solid ${info.border}` }}>
                  <info.Icon size={22} color={info.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: info.color }}>AI Intelligence</h4>
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{info.msg}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Impact */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-sm aspect-square">
                {/* Outer neumorphic ring */}
                <div className="absolute inset-0 rounded-full"
                  style={{ boxShadow: '10px 10px 24px var(--shadow-dark), -10px -10px 24px var(--shadow-light)', background: 'var(--color-bg)' }} />

                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm mb-2 uppercase tracking-widest" style={{ color: 'var(--color-muted)' }}>End of Month</p>
                    <p className="text-5xl font-black" style={{ color: 'var(--color-text)' }}>
                      ₹{(14000 - spendAmount).toLocaleString()}
                    </p>
                    <p className="text-sm font-medium mt-2" style={{ color: 'var(--color-muted)' }}>Estimated Balance</p>
                  </div>
                </div>

                {/* Floating badge: Trip Goal */}
                <div className="absolute top-0 right-6 badge-safe -rotate-6 pointer-events-none">
                  Trip Goal: {(8400 - (spendAmount > 3000 ? spendAmount - 3000 : 0)).toLocaleString()} / 20k
                </div>

                {/* Floating badge: Impact */}
                <div className="absolute bottom-8 left-0 px-4 py-2 rounded-lg rotate-3 pointer-events-none"
                  style={{
                    background: 'var(--color-bg)',
                    boxShadow: '4px 4px 10px var(--shadow-dark), -3px -3px 8px var(--shadow-light)',
                    border: '1px solid var(--color-border)'
                  }}>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Impact on runway</p>
                  <p className="font-bold" style={{ color: info.color }}>
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
