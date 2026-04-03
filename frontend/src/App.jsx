import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Layout & UI
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FeatherOrb from './components/ui/FeatherOrb';
import ParticleCanvas from './components/ui/ParticleCanvas';

// Landing sections
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import Solution from './components/sections/Solution';
import Dashboard from './components/sections/Dashboard';
import Features from './components/sections/Features';
import Simulator from './components/sections/Simulator';
import HealthScore from './components/sections/HealthScore';
import DemoFlow from './components/sections/DemoFlow';
import CTA from './components/sections/CTA';

// App Pages
import DashboardPage from './pages/DashboardPage';
import SimulatorPage from './pages/SimulatorPage';
import InsightsPage from './pages/InsightsPage';
import ChatPage from './pages/ChatPage';
import GoalsPage from './pages/GoalsPage';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  useLenis();
  const appRef = useRef(null);
  const orbRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(orbRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, ease: "power3.out", delay: 0.2 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      tl.to(orbRef.current, {
        x: "-45vw",
        y: "-30vh",
        scale: 0.5,
        rotation: -45,
        ease: "none",
        duration: 1
      }, 0);

      tl.to(".hero-word:not(.lit)", {
        color: isDark ? "#F0F0FF" : "#1A1B2E",
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

      tl.to(orbRef.current, {
        opacity: 0,
        scale: 0,
        ease: "power2.in",
        duration: 0.3
      }, 0.8);

    }, appRef);

    return () => ctx.revert();
  }, [isDark]);

  return (
    <div ref={appRef} className={`relative min-h-screen ${!isDark ? 'light-theme' : ''}`}>
      <div className="noise-overlay" />
      <Navbar />
      <FeatherOrb ref={orbRef} />
      <ParticleCanvas orbRef={orbRef} />
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

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/simulator" element={<SimulatorPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/goals" element={<GoalsPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
