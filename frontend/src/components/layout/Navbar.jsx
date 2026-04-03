import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'Simulator', href: '#simulator' },
    { label: 'Pricing', href: '#cta' },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <a href="#hero" className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
          Spend<span style={{ color: 'var(--color-accent)' }}>Sense</span>
        </span>
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((l) => (
          <a
            key={l.label}
            href={l.href}
            style={{
              color: 'var(--color-muted)',
              fontSize: '0.9rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--color-text)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--color-muted)')}
          >
            {l.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="hidden md:flex items-center gap-3">
        <button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
          Sign In
        </button>
        <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
          Get Started Free
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden"
        style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(2, 2, 5, 0.98)',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            borderBottom: '1px solid rgba(108, 99, 255, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{ color: 'var(--color-muted)', textDecoration: 'none', fontWeight: 500 }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Get Started Free
          </button>
        </div>
      )}
    </nav>
  );
}
