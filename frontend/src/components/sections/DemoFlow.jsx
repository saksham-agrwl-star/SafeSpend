import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, CreditCard, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DemoFlow() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".demo-container",
        start: "top 20%",
        end: "bottom 80%",
        pin: ".demo-pinned",
      });
      gsap.utils.toArray('.demo-step').forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          toggleClass: "active-step",
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="demo" className="py-16 relative" ref={sectionRef}>
      <div className="section-container demo-container relative z-10 hidden md:block">

        <div className="text-center mb-24">
          <h2 className="section-headline mb-4" style={{ color: 'var(--color-text)' }}>The Winning Moment</h2>
          <p className="body-text text-lg max-w-2xl mx-auto">
            Experience the exact sequence that proves SafeSpend isn't just a tracker—it's an active financial governor.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-20">

          {/* Pinned Left */}
          <div className="demo-pinned h-[60vh] flex flex-col justify-center">
            <div className="skeuo-card p-10 relative overflow-hidden" style={{ borderColor: 'rgba(192,80,74,0.2)' }}>
              <div className="absolute inset-0 rounded-2xl" style={{ background: 'rgba(192,80,74,0.03)' }} />
              <ShieldAlert size={48} color="var(--color-danger)" style={{ marginBottom: '1.5rem' }} />
              <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Target Scenario</h3>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
                You've set a ₹15,000 monthly budget and a Goa Trip goal. It's 11:45 PM. You're scrolling Swiggy for a ₹2,800 order.
              </p>
              <div className="p-4 rounded-xl"
                style={{ background: 'var(--color-surface2)', boxShadow: 'inset 3px 3px 8px var(--shadow-dark), inset -2px -2px 6px var(--shadow-light)' }}>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--color-text)' }}>Food Budget</span>
                  <span style={{ color: 'var(--color-warn)', fontWeight: 700 }}>84% Used</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--shadow-dark)' }}>
                  <div className="h-full rounded-full" style={{ width: '84%', background: 'var(--color-warn)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling steps */}
          <div className="space-y-[30vh] pb-[30vh]">

            <div className="demo-step transition-opacity duration-500 skeuo-card p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ background: 'var(--color-bg)', boxShadow: '3px 3px 8px var(--shadow-dark), -2px -2px 6px var(--shadow-light)', color: 'var(--color-text)' }}>1</div>
                <h4 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>The Intent</h4>
              </div>
              <p style={{ color: 'var(--color-muted)' }}>User hits "Pay via UPI" on a ₹2,800 order from a premium burger joint at 11:45 PM.</p>
              <div className="mt-4 p-4 rounded-lg flex items-center gap-3"
                style={{ background: 'var(--color-surface2)', boxShadow: 'inset 2px 2px 6px var(--shadow-dark), inset -1px -1px 4px var(--shadow-light)' }}>
                <CreditCard color="var(--color-accent)" />
                <span className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>SWIGGY*ORDER_90210 — ₹2,800</span>
              </div>
            </div>

            <div className="demo-step transition-opacity duration-500 skeuo-card p-8" style={{ borderColor: 'rgba(192,80,74,0.3)' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: 'var(--color-danger)' }}>2</div>
                <h4 className="text-xl font-bold" style={{ color: 'var(--color-danger)' }}>The Intervention</h4>
              </div>
              <p className="mb-4" style={{ color: 'var(--color-muted)' }}>Before the transaction goes to the bank, the AI pauses it and fires a contextual alert.</p>
              <div className="p-4 rounded-lg"
                style={{ background: 'rgba(192,80,74,0.08)', border: '1px solid rgba(192,80,74,0.2)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>
                  ⚠️ Late-night impulse detected. Your food budget is at 84%. Proceeding delays your Goa trip by 2 weeks.
                </p>
              </div>
            </div>

            <div className="demo-step transition-opacity duration-500 skeuo-card p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ background: 'var(--color-bg)', boxShadow: '3px 3px 8px var(--shadow-dark), -2px -2px 6px var(--shadow-light)', color: 'var(--color-text)' }}>3</div>
                <h4 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>The Alternative</h4>
              </div>
              <p className="mb-4" style={{ color: 'var(--color-muted)' }}>AI suggests an alternative to satisfy the craving without destroying the goal.</p>
              <button className="w-full flex items-center justify-between p-4 rounded-lg transition-colors"
                style={{ background: 'var(--color-surface2)', boxShadow: 'inset 2px 2px 6px var(--shadow-dark), inset -1px -1px 4px var(--shadow-light)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                <span className="text-sm font-medium">Use Zomato Gold coupon (Save ₹600) instead</span>
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.active-step { opacity: 1 !important; transform: scale(1.02); }` }} />
    </section>
  );
}
