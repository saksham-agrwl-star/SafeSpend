import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, CreditCard, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function DemoFlow() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Pinning the left side while right side scrolls through steps
      ScrollTrigger.create({
        trigger: ".demo-container",
        start: "top 20%",
        end: "bottom 80%",
        pin: ".demo-pinned",
      });

      // Individual step highlights
      gsap.utils.toArray('.demo-step').forEach((step, i) => {
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
    <section id="demo" className="py-32 relative bg-bg" ref={sectionRef}>
      <div className="section-container demo-container relative z-10 hidden md:block">
        
        <div className="text-center mb-24">
          <h2 className="section-headline mb-4">The Winning Moment</h2>
          <p className="body-text text-lg max-w-2xl mx-auto">Experience the exact sequence that proves SpendSense isn't just a tracker—it's an active financial governor.</p>
        </div>

        <div className="grid grid-cols-2 gap-20">
          
          {/* Pinned Left Side - The Context */}
          <div className="demo-pinned h-[60vh] flex flex-col justify-center">
            <div className="glass-card p-10 border-danger/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-danger/5" />
              <ShieldAlert size={48} className="text-danger mb-6" />
              <h3 className="text-3xl font-bold mb-4 text-white">Target Scenario</h3>
              <p className="text-lg text-muted leading-relaxed mb-6">
                You've set a ₹15,000 monthly budget and a Goa Trip goal. It's 11:45 PM. You're scrolling Swiggy for a ₹2,800 order.
              </p>
              <div className="bg-surface2 p-4 rounded-xl border border-border">
                <div className="flex justify-between text-sm mb-2"><span>Food Budget</span> <span className="text-warn">84% Used</span></div>
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-warn w-[84%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Right Side - The Steps */}
          <div className="space-y-[30vh] pb-[30vh]">
            
            <div className="demo-step opacity-30 transition-opacity duration-500 glass-card p-8 bg-surface">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center font-bold">1</div>
                <h4 className="text-xl font-bold">The Intent</h4>
              </div>
              <p className="text-muted">User hits "Pay via UPI" on a ₹2,800 order from a premium burger joint at 11:45 PM.</p>
              <div className="mt-4 p-4 border border-border bg-black rounded-lg flex items-center gap-3">
                <CreditCard className="text-accent"/> <span className="font-mono text-sm shadow-md">SWIGGY*ORDER_90210 - ₹2,800</span>
              </div>
            </div>

            <div className="demo-step opacity-30 transition-opacity duration-500 glass-card p-8 border-danger/40 shadow-[0_0_40px_rgba(239,68,68,0.15)] bg-surface">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-danger text-white flex items-center justify-center font-bold">2</div>
                <h4 className="text-xl font-bold text-danger">The Intervention</h4>
              </div>
              <p className="text-muted mb-4">Before the transaction goes to the bank, the AI pauses it and fires a contextual alert.</p>
              <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg">
                <p className="text-sm font-medium text-danger">⚠️ Late-night impulse detected. Your food budget is at 84%. Proceeding delays your Goa trip by 2 weeks.</p>
              </div>
            </div>

            <div className="demo-step opacity-30 transition-opacity duration-500 glass-card p-8 bg-surface">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface2 flex items-center justify-center font-bold">3</div>
                <h4 className="text-xl font-bold">The Alternative</h4>
              </div>
              <p className="text-muted mb-4">AI suggests an alternative to satisfy the craving without destroying the goal.</p>
              <button className="w-full flex items-center justify-between p-4 bg-surface2 hover:bg-border rounded-lg transition-colors border border-border">
                <span className="text-sm font-medium">Use Zomato Gold coupon (Save ₹600) instead</span>
                <ChevronRight size={16} />
              </button>
            </div>

          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .active-step { opacity: 1 !important; transform: scale(1.02); }
      `}} />
    </section>
  );
}
