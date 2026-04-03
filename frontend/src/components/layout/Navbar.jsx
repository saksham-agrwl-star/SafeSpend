import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Simulator', href: '/simulator' },
    { label: 'Goals', href: '/goals' },
    { label: 'Insights', href: '/insights' },
    { label: 'AI Chat', href: '/chat' },
  ];

  return (
    <nav className="navbar" style={{ background: isDark ? 'rgba(2, 2, 5, 0.8)' : 'rgba(244, 245, 251, 0.8)', justifyContent: 'flex-start', gap: '24px' }}>
      
      {/* Unified Hamburger Toggle (Far Left) */}
      <button
        style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', zIndex: 1000, display: 'flex' }}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
          Spend<span style={{ color: 'var(--color-accent)' }}>Sense</span>
        </span>
      </Link>

      {/* CTA (Far Right) */}
      <div className="hidden md:flex items-center gap-4" style={{ marginLeft: 'auto' }}>
        <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
          Sign In
        </button>
        <Link
          to="/dashboard"
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          <LayoutDashboard size={15} />
          Launch App
        </Link>
      </div>

      {/* Sidebar Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          background: 'var(--color-surface)',
          backdropFilter: 'blur(20px)',
          borderRight: `1px solid ${isDark ? 'rgba(108, 99, 255, 0.12)' : 'rgba(228, 230, 240, 1)'}`,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 24px 24px',
          gap: '24px',
          zIndex: 999,
          boxShadow: open ? '10px 0 30px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        {navLinks.map((l) => (
          <Link
            key={l.label}
            to={l.href}
            style={{ color: 'var(--color-text)', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 700 }}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        
        <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0' }} />

        {/* Mobile Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 600 }}>Theme</span>
          <button onClick={toggle} className="theme-toggle-pill" aria-label="Toggle theme">
            <span className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
              <span className={`toggle-thumb ${isDark ? 'dark' : 'light'}`}>
                {isDark ? <Moon size={11} color="#8B5CF6" strokeWidth={2.5} /> : <Sun size={11} color="#F59E0B" strokeWidth={2.5} />}
              </span>
              <Sun size={11} color={isDark ? 'rgba(255,255,255,0.25)' : '#ffffff'} style={{ position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)' }} />
              <Moon size={11} color={isDark ? '#ffffff' : 'rgba(0,0,0,0.2)'} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)' }} />
            </span>
          </button>
        </div>

        <div style={{ flex: 1 }} />

        <Link
          to="/dashboard"
          className="btn-primary"
          onClick={() => setOpen(false)}
          style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '14px' }}
        >
          <LayoutDashboard size={18} />
          Launch App
        </Link>
      </div>
      
      {/* Drawer Overlay */}
      {open && (
        <div 
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 998 }}
        />
      )}
    </nav>
  );
}
