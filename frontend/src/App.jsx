import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis';

// Layout & UI
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FeatherOrb from './components/ui/FeatherOrb';
import ParticleCanvas from './components/ui/ParticleCanvas';

// Sections
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import Solution from './components/sections/Solution';
import Dashboard from './components/sections/Dashboard';
import Features from './components/sections/Features';
import Simulator from './components/sections/Simulator';
import HealthScore from './components/sections/HealthScore';
import DemoFlow from './components/sections/DemoFlow';
import CTA from './components/sections/CTA';

export default function App() {
  useLenis();
  const appRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Orb entrance animation (on load)
      gsap.fromTo(orbRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, ease: "power3.out", delay: 0.2 }
      );

      // 2. The Main Scroll Timeline (Broadway Feather Effect)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      // Orb drifts to center and shrinks
      tl.to(orbRef.current, {
        x: "-45vw", // Move left toward center
        y: "-30vh", // Move up
        scale: 0.5,
        rotation: -45, // Add rotation to symbol
        ease: "none",
        duration: 1
      }, 0); // start at 0

      // Text characters light up
      tl.to(".hero-word:not(.lit)", {
        color: "#F0F0FF",
        stagger: 0.1,
        ease: "none",
        duration: 0.5
      }, 0);

      tl.to(".hero-sub-text, .hero-cta", {
        opacity: 1,
        y: -10,
        stagger: 0.2,
        ease: "power2.out",
        duration: 0.3
      }, 0.2);

      // Orb fades out when entering Problem section
      tl.to(orbRef.current, {
        opacity: 0,
        scale: 0,
        ease: "power2.in",
        duration: 0.3
      }, 0.8);

    }, appRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={appRef} className="relative min-h-screen">
      {/* Global Elements */}
      <div className="noise-overlay" />
      <Navbar />
      <FeatherOrb ref={orbRef} />
      <ParticleCanvas orbRef={orbRef} />

      {/* Pages / Sections */}
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Dashboard />
        <Features />
        <Simulator />
        <HealthScore />
        <DemoFlow />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
