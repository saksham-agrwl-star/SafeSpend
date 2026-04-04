import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { features } from '../../data/demoData';

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" className="py-24 relative bg-surface2/50 border-y border-border" ref={sectionRef}>
      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="section-headline mb-4">Complete Suite.<br/>Unmatched Control.</h2>
            <p className="body-text text-lg">10 exclusive AI features designed to govern your finances automatically.</p>
          </div>
          <button className="btn-secondary whitespace-nowrap">View Architecture Details</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, i) => (
            <div key={i} className={`glass-card feature-card p-6 flex flex-col hover:border-${feature.color}/40 transition-colors cursor-default`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl filter drop-shadow-md">{feature.icon}</span>
                <span className={`text-xs font-black text-${feature.color}/70 tracking-widest`}>{feature.number}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-tight flex-grow">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
