import { useRef } from 'react';

export default function Hero() {
  const containerRef = useRef(null);

  return (
    <section id="hero" className="relative w-full min-h-[75vh] flex flex-col justify-center" ref={containerRef}>
      <div className="section-container relative z-10 w-full mt-24 md:mt-16">
        <div className="max-w-[700px]">
          <h1 className="hero-headline mb-4 md:mb-6">
            <span className="hero-word lit tracking-tighter text-[#F0F0FF]">Set.</span><br />
            <span className="hero-word lit tracking-tighter" style={{ color: 'var(--color-accent)' }}>Track.</span><br />
            <span className="hero-word tracking-tighter text-[#F0F0FF]">Intervene.</span>
          </h1>
          <p className="body-text text-xl md:text-2xl max-w-[500px] mb-8 md:mb-10 hero-sub-text">
            AI that stops bad financial decisions{' '}
            <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>before</span>{' '}
            they happen.
          </p>
          <div className="flex gap-4 hero-cta">
            <button className="btn-primary py-3 md:py-4 px-6 md:px-8 text-base md:text-lg">Get Started</button>
            <p className="text-sm self-center hidden sm:block" style={{ color: 'var(--color-muted)' }}>
              Watch how it blocks an <br />impulse buy at 11:45 PM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
