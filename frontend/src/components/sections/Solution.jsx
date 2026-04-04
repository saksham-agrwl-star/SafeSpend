import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function Solution() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".sol-column", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.2)"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="solution" className="py-32 relative bg-surface2 border-y border-border" ref={sectionRef}>
      <div className="section-container relative z-10">
        <div className="text-center mb-20">
          <h2 className="section-headline mb-4">Three Intelligent Responses</h2>
          <p className="body-text text-lg max-w-2xl mx-auto">
            Our AI knows your patterns, remaining runway, and goals. It evaluates every transaction before it happens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* SAFE */}
          <div className="glass-card glass-card-green p-8 flex flex-col sol-column group cursor-default">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[rgba(0,212,170,0.15)] flex items-center justify-center">
                <CheckCircle2 color="#00D4AA" />
              </div>
              <h3 className="text-2xl font-bold text-[#00D4AA]">Safe</h3>
            </div>
            <p className="text-muted mb-8 flex-grow">Within budget and aligned with your goals. The AI greenlights the transaction and provides a smart tip.</p>
            <div className="bg-[#020205] p-5 rounded-xl border border-[rgba(0,212,170,0.2)] opacity-80 group-hover:opacity-100 transition-opacity">
              <p className="text-sm font-medium text-white mb-2">Example Output:</p>
              <p className="text-sm text-[#00D4AA] leading-relaxed">"You're 20% under your grocery budget. Enjoy the meal! You're still on track for the Goa trip."</p>
            </div>
          </div>

          {/* WARNING */}
          <div className="glass-card glass-card-amber p-8 flex flex-col sol-column group cursor-default">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[rgba(245,158,11,0.15)] flex items-center justify-center">
                <AlertTriangle color="#F59E0B" />
              </div>
              <h3 className="text-2xl font-bold text-[#F59E0B]">Warning</h3>
            </div>
            <p className="text-muted mb-8 flex-grow">Approaching limits (60-90% used). The AI flags the spend and suggests where you might need to cut back later.</p>
            <div className="bg-[#020205] p-5 rounded-xl border border-[rgba(245,158,11,0.2)] opacity-80 group-hover:opacity-100 transition-opacity">
              <p className="text-sm font-medium text-white mb-2">Example Output:</p>
              <p className="text-sm text-[#F59E0B] leading-relaxed">"This puts your shopping budget at 85%. You'll need to skip eating out this weekend to stay balanced."</p>
            </div>
          </div>

          {/* BLOCK */}
          <div className="glass-card glass-card-red p-8 flex flex-col sol-column group cursor-default">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
                <ShieldAlert color="#EF4444" />
              </div>
              <h3 className="text-2xl font-bold text-[#EF4444]">Block</h3>
            </div>
            <p className="text-muted mb-8 flex-grow">Exceeds limits or derails your stated goals. The AI initiates a hard stop with a contextual explanation.</p>
            <div className="bg-[#020205] p-5 rounded-xl border border-[rgba(239,68,68,0.2)] opacity-80 group-hover:opacity-100 transition-opacity">
              <p className="text-sm font-medium text-white mb-2">Example Output:</p>
              <p className="text-sm text-[#EF4444] leading-relaxed">"This ₹4k purchase kills your trip savings goal. You'll run out of runway 8 days before payday. Rethink this."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
