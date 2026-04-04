import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

const cards = [
  {
    accent: 'var(--color-accent2)',
    accentBg: 'rgba(184,132,90,0.12)',
    Icon: CheckCircle2,
    label: 'Safe',
    body: 'Within budget and aligned with your goals. The AI greenlights the transaction and provides a smart tip.',
    example: '"You\'re 20% under your grocery budget. Enjoy the meal! You\'re still on track for the Goa trip."',
  },
  {
    accent: 'var(--color-warn)',
    accentBg: 'rgba(212,145,58,0.12)',
    Icon: AlertTriangle,
    label: 'Warning',
    body: 'Approaching limits (60–90% used). The AI flags the spend and suggests where you might need to cut back later.',
    example: '"This puts your shopping budget at 85%. You\'ll need to skip eating out this weekend to stay balanced."',
  },
  {
    accent: 'var(--color-danger)',
    accentBg: 'rgba(192,80,74,0.12)',
    Icon: ShieldAlert,
    label: 'Block',
    body: 'Exceeds limits or derails your stated goals. The AI initiates a hard stop with a contextual explanation.',
    example: '"This ₹4k purchase kills your trip savings goal. You\'ll run out of runway 8 days before payday. Rethink this."',
  },
];

export default function Solution() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".sol-column",
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.2, duration: 0.9, ease: "back.out(1.2)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="solution" className="py-20 relative" ref={sectionRef}
      style={{ background: 'var(--color-surface2)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="section-container relative z-10">
        <div className="text-center mb-20">
          <h2 className="section-headline mb-4" style={{ color: 'var(--color-text)' }}>Three Intelligent Responses</h2>
          <p className="body-text text-lg max-w-2xl mx-auto">
            Our AI knows your patterns, remaining runway, and goals. It evaluates every transaction before it happens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map(({ accent, accentBg, Icon, label, body, example }) => (
            <div key={label} className="skeuo-card p-8 flex flex-col sol-column group cursor-default"
              style={{ borderColor: `${accent}33` }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: accentBg }}>
                  <Icon color={accent} />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: accent }}>{label}</h3>
              </div>
              <p className="mb-8 flex-grow" style={{ color: 'var(--color-muted)' }}>{body}</p>
              <div className="p-5 rounded-xl"
                style={{
                  background: 'var(--color-surface2)',
                  boxShadow: 'inset 3px 3px 8px var(--shadow-dark), inset -2px -2px 6px var(--shadow-light)',
                  border: `1px solid ${accent}22`
                }}>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>Example Output:</p>
                <p className="text-sm leading-relaxed" style={{ color: accent }}>{example}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
