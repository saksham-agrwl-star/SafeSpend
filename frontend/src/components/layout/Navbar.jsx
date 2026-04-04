import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, LogIn, Sun, Moon, QrCode } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  return (
    <button className="theme-toggle-pill" onClick={toggle} title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
        <div className={`toggle-thumb ${isDark ? 'dark' : 'light'}`}>
          {isDark ? <Moon size={14} color="#8B5CF6" /> : <Sun size={14} color="#F59E0B" />}
        </div>
      </div>
    </button>
  );
};

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Simulator', href: '/simulator' },
  { label: 'Goals', href: '/goals' },
  { label: 'Insights', href: '/insights' },
  { label: 'AI Chat', href: '/chat' },
];

const handleLogout = () => {
  localStorage.removeItem('safespend_user_id');
  localStorage.removeItem('safespend_user_name');
  window.location.href = '/';
};

export default function Navbar() {
  const [openMobile, setOpenMobile] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('safespend_user_id');

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="navbar">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo.png" alt="SafeSpend Logo" style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'cover', boxShadow: '0 0 16px rgba(139,92,246,0.4)' }} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Safe<span style={{ color: 'var(--color-accent)' }}>Spend</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn && navLinks.map((l) => (
            <Link key={l.label} to={l.href} style={{
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive(l.href) ? 'var(--color-accent)' : 'var(--color-muted)',
              transition: 'color 0.2s',
            }}
              onMouseOver={e => !isActive(l.href) && (e.target.style.color = 'var(--color-text)')}
              onMouseOut={e => !isActive(l.href) && (e.target.style.color = 'var(--color-muted)')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Sign Up
              </Link>
              <Link to="/login" className="btn-primary" style={{
                padding: '8px 18px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <LogIn size={15} />
                Login
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#EF4444' }}>
              Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpenMobile(!openMobile)}
          style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', padding: 6 }}
        >
          {openMobile ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {openMobile && (
        <div className="skeuo-card" style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          borderTopLeftRadius: 0, borderTopRightRadius: 0,
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 16,
          zIndex: 99
        }}>
          {isLoggedIn && navLinks.map((l) => (
            <Link key={l.label} to={l.href}
              style={{ color: 'var(--color-text)', textDecoration: 'none', fontSize: '1.05rem', fontWeight: 600 }}
              onClick={() => setOpenMobile(false)}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '4px 0' }} />
          <div style={{ display: 'flex', gap: 10 }}>
            {!isLoggedIn ? (
              <>
                <Link to="/signup" className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                  onClick={() => setOpenMobile(false)}
                >
                  Sign Up
                </Link>
                <Link to="/login" className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                  onClick={() => setOpenMobile(false)}
                >
                  <LogIn size={16} /> Login
                </Link>
              </>
            ) : (
              <button 
                onClick={() => { setOpenMobile(false); handleLogout(); }} 
                className="btn-secondary" 
                style={{ flex: 1, justifyContent: 'center', color: '#EF4444' }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
