import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const badges = [
  {
    emoji: '🔥',
    label: '7-Day Streak',
    sublabel: 'No impulse buys this week',
    accentColor: 'rgba(212,145,58,0.15)',
    borderColor: 'rgba(212,145,58,0.3)',
    offset: '',
  },
  {
    Icon: Target,
    label: 'Goal Crusher',
    sublabel: 'Saved ₹2,000 for Goa Trip',
    accentColor: 'rgba(184,132,90,0.15)',
    borderColor: 'rgba(184,132,90,0.3)',
    iconColor: 'var(--color-accent2)',
    offset: 'translate-x-4',
  },
  {
    Icon: Shield,
    label: 'Discipline Check',
    sublabel: 'Top 23% among peers',
    accentColor: 'rgba(192,102,90,0.15)',
    borderColor: 'rgba(192,102,90,0.3)',
    iconColor: 'var(--color-accent)',
    offset: '',
  },
];

export default function HealthScore() {
  const sectionRef = useRef(null);
  const scoreRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
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
      gsap.fromTo(".badge-card",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, stagger: 0.15, duration: 0.6, ease: "back.out(1.5)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16 relative" ref={sectionRef}>
      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-headline mb-4" style={{ color: 'var(--color-text)' }}>Financial Health Engine</h2>
          <p className="body-text text-lg max-w-2xl mx-auto">
            Gamified tracking that rewards spend discipline, goal progress, and risk behavior.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-16 lg:gap-32">

          {/* Score Ring */}
          <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
            {/* Outer neumorphic ring */}
            <div className="absolute inset-0 rounded-full"
              style={{ boxShadow: '12px 12px 30px var(--shadow-dark), -12px -12px 30px var(--shadow-light)' }} />

            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" fill="none"
                stroke="var(--shadow-dark)" strokeWidth="12" />
              <circle cx="50%" cy="50%" r="45%" fill="none"
                stroke="var(--color-accent)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray="283%" strokeDashoffset={`${283 - 283 * 0.78}%`}
                style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
            </svg>

            <div className="text-center z-10">
              <p className="font-medium mb-2 uppercase tracking-wide text-sm" style={{ color: 'var(--color-muted)' }}>Daily Score</p>
              <div className="text-7xl font-black flex items-start justify-center" style={{ color: 'var(--color-text)' }}>
                <span ref={scoreRef}>0</span>
                <span className="text-3xl mt-2" style={{ color: 'var(--color-muted)' }}>/100</span>
              </div>
              <p className="font-bold mt-4" style={{ color: 'var(--color-accent2)' }}>+12 from last week</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-4">
            {badges.map(({ emoji, Icon, label, sublabel, accentColor, borderColor, iconColor, offset }, i) => (
              <div key={i} className={`skeuo-card badge-card p-4 flex items-center gap-4 w-72 ${offset}`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: accentColor, border: `1px solid ${borderColor}` }}>
                  {emoji
                    ? <span className="text-2xl">{emoji}</span>
                    : <Icon size={22} color={iconColor} />
                  }
                </div>
                <div>
                  <p className="font-bold" style={{ color: 'var(--color-text)' }}>{label}</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{sublabel}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
