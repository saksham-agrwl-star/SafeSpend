import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useEffect as useReactEffect } from 'react';

function ThemeSync() {
  const { isDark } = useTheme();
  useReactEffect(() => {
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
  }, [isDark]);
  return null;
}

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

// Auth & App Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import SimulatorPage from './pages/SimulatorPage';
import InsightsPage from './pages/InsightsPage';
import ChatPage from './pages/ChatPage';
import GoalsPage from './pages/GoalsPage';
import PaymentScanPage from './pages/PaymentScanPage';
import PaymentConfirmPage from './pages/PaymentConfirmPage';

gsap.registerPlugin(ScrollTrigger);

function LandingPage() {
  useLenis();
  const appRef = useRef(null);
  const orbRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Ensure sub-text and CTA are immediately visible
      gsap.set(".hero-sub-text, .hero-cta", { opacity: 1, y: 0 });

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
    <div ref={appRef} className="relative min-h-screen">
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

// Auth Guard Wrapper
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('safespend_user_id');
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <ThemeSync />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/simulator" element={<ProtectedRoute><SimulatorPage /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><GoalsPage /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><PaymentScanPage /></ProtectedRoute>} />
          <Route path="/pay" element={<ProtectedRoute><PaymentConfirmPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
