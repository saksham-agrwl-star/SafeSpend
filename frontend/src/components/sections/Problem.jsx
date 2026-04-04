import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertCircle, Clock, SearchX, LineChart, Target } from 'lucide-react';

const painPoints = [
  { icon: <AlertCircle color="var(--color-danger)" size={32}/>, title: "No Boundaries", desc: "Apps give you unlimited rope. Nobody stops you until the bill arrives." },
  { icon: <Clock color="var(--color-warn)" size={32}/>, title: "Zero Real-Time Awareness", desc: "You only find out you overspent after the transaction clears." },
  { icon: <SearchX color="var(--color-accent2)" size={32}/>, title: "No Context", desc: "Is it a planned purchase or a midnight stress response? Apps don't know." },
  { icon: <LineChart color="var(--color-accent)" size={32}/>, title: "No Future Visibility", desc: "Nobody warns you: 'buy this today, run out of money in 8 days.'" },
  { icon: <Target color="var(--color-gold)" size={32}/>, title: "Dead Goals", desc: "You set a goal in Jan. By Feb your spending kills it. And nobody tells you." },
];

export default function Problem() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".pain-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.15, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" className="py-20 relative" ref={sectionRef}>
      <div className="section-container relative z-10">
        <h2 className="section-headline mb-4 max-w-2xl" style={{ color: 'var(--color-text)' }}>
          Tracking the past <br/>is <span style={{ color: 'var(--color-danger)' }}>useless</span>.
        </h2>
        <p className="body-text text-lg mb-16 max-w-xl">
          Every finance app tells you what already happened. SafeSpend is the first app built to govern the present and protect the future.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <div key={i} className="skeuo-card pain-card p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-6 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'var(--color-bg)',
                  boxShadow: '4px 4px 10px var(--shadow-dark), -3px -3px 8px var(--shadow-light)'
                }}>
                {point.icon}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>{point.title}</h3>
              <p style={{ color: 'var(--color-muted)', lineHeight: '1.7' }}>{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
