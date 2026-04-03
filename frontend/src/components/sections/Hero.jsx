import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    // The main scroll-linked animation handled in App.jsx across all sections
    // Hero just sets up the target spans for GSAP
  }, []);

  return (
    <section id="hero" className="relative w-full h-[120vh] flex items-center" ref={containerRef}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none opacity-80" />

      <div className="section-container relative z-10 w-full mt-[-10vh]">
        <div className="max-w-[700px]">
          <h1 className="hero-headline mb-6">
            <span className="hero-word lit tracking-tighter">Set.</span><br />
            <span className="hero-word lit tracking-tighter text-accent">Track.</span><br />
            <span className="hero-word tracking-tighter">Intervene.</span>
          </h1>
          <p className="body-text text-xl md:text-2xl max-w-[500px] mb-10 hero-sub-text opacity-0">
            AI that stops bad financial decisions <span className="text-white font-medium">before</span> they happen.
          </p>
          <div className="flex gap-4 hero-cta opacity-0">
            <button className="btn-primary py-4 px-8 text-lg">See It In Action</button>
            <p className="text-muted text-sm self-center hidden sm:block">Watch how it blocks an <br/>impulse buy at 11:45 PM.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
