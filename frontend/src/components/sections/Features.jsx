import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { features } from '../../data/demoData';

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".feature-card",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.08, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" className="py-16 relative" ref={sectionRef}
      style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="section-headline mb-4" style={{ color: 'var(--color-text)' }}>
              Complete Suite.<br />Unmatched Control.
            </h2>
            <p className="body-text text-lg">10 exclusive AI features designed to govern your finances automatically.</p>
          </div>
          <button className="btn-secondary whitespace-nowrap">View Architecture Details</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, i) => (
            <div key={i} className="skeuo-card feature-card p-6 flex flex-col cursor-default">
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{feature.icon}</span>
                <span className="text-xs font-black tracking-widest" style={{ color: 'var(--color-muted)' }}>
                  {feature.number}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 leading-tight flex-grow" style={{ color: 'var(--color-text)' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--color-muted)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
