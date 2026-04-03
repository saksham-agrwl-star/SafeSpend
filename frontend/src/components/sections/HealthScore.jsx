import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, TrendingUp, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HealthScore() {
  const sectionRef = useRef(null);
  const scoreRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Counter animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => {
          gsap.to(scoreRef.current, {
            innerHTML: 78,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: "circ.out"
          });
        },
        once: true
      });

      // Badges reveal
      gsap.from(".badge-card", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        scale: 0.8, opacity: 0, stagger: 0.15, duration: 0.6, ease: "back.out(1.5)"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 relative" ref={sectionRef}>
      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-headline mb-4">Financial Health Engine</h2>
          <p className="body-text text-lg max-w-2xl mx-auto">
            Gamified tracking that rewards spend discipline, goal progress, and risk behavior.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-32">
          
          {/* Main Score Ring */}
          <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
            {/* Background glowing rings */}
            <div className="absolute inset-0 rounded-full animate-pulse-slow" style={{ boxShadow: '0 0 60px rgba(108, 99, 255, 0.2)' }} />
            <div className="absolute inset-4 border border-accent/30 rounded-full border-dashed animate-spin-slow" />
            
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" fill="none" stroke="rgba(108, 99, 255, 0.1)" strokeWidth="12" />
              <circle 
                cx="50%" cy="50%" r="45%" fill="none" 
                stroke="#8B5CF6" strokeWidth="12" strokeLinecap="round" 
                strokeDasharray="283%" strokeDashoffset={283 - (283 * 0.78) + "%"} 
                style={{ transition: 'stroke-dashoffset 2s ease-out' }}
              />
            </svg>
            
            <div className="text-center z-10">
              <p className="text-muted font-medium mb-2 uppercase tracking-wide">Daily Score</p>
              <div className="text-7xl font-black text-white drop-shadow-lg flex items-start justify-center">
                <span ref={scoreRef}>0</span><span className="text-3xl text-muted mt-2">/100</span>
              </div>
              <p className="text-accent2 font-bold mt-4">+12 from last week</p>
            </div>
          </div>

          {/* Badges Column */}
          <div className="flex flex-col gap-4">
            <div className="glass-card badge-card p-4 flex items-center gap-4 w-72">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <p className="font-bold text-white">7-Day Streak</p>
                <p className="text-xs text-muted">No impulse buys this week</p>
              </div>
            </div>

            <div className="glass-card badge-card p-4 flex items-center gap-4 w-72 translate-x-4">
              <div className="w-12 h-12 rounded-xl bg-accent2/20 flex items-center justify-center border border-accent2/30">
                <Target size={24} className="text-accent2" />
              </div>
              <div>
                <p className="font-bold text-white">Goal Crusher</p>
                <p className="text-xs text-muted">Saved ₹2,000 for Goa Trip</p>
              </div>
            </div>

            <div className="glass-card badge-card p-4 flex items-center gap-4 w-72">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                <Shield size={24} className="text-accent" />
              </div>
              <div>
                <p className="font-bold text-white">Discipline Check</p>
                <p className="text-xs text-muted">Top 23% among peers</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
