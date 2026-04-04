import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertCircle, Clock, SearchX, LineChart, Target } from 'lucide-react';

const painPoints = [
  { icon: <AlertCircle className="text-danger" size={32}/>, title: "No Boundaries", desc: "Apps give you unlimited rope. Nobody stops you until the bill arrives." },
  { icon: <Clock className="text-warn" size={32}/>, title: "Zero Real-Time Awareness", desc: "You only find out you overspent after the transaction clears." },
  { icon: <SearchX className="text-accent2" size={32}/>, title: "No Context", desc: "Is it a planned purchase or a midnight stress response? Apps don't know." },
  { icon: <LineChart className="text-purple-400" size={32}/>, title: "No Future Visibility", desc: "Nobody warns you: 'buy this today, run out of money in 8 days.'" },
  { icon: <Target className="text-blue-400" size={32}/>, title: "Dead Goals", desc: "You set a goal in Jan. By Feb your spending kills it. And nobody tells you." },
];

export default function Problem() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".pain-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" className="py-32 relative" ref={sectionRef}>
      <div className="section-container relative z-10">
        <h2 className="section-headline mb-4 max-w-2xl">
          Tracking the past <br/>is <span className="text-danger">useless</span>.
        </h2>
        <p className="body-text text-lg mb-16 max-w-xl">
          Every finance app tells you what already happened. SpendSense is the first app built to govern the present and protect the future.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <div key={i} className="glass-card pain-card p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="mb-6 bg-surface2 w-14 h-14 rounded-2xl flex items-center justify-center border border-border">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
              <p className="text-muted leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
