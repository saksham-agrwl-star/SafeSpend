import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Brain, MessageSquare, Target,
  HelpCircle, LogOut, Zap, ChevronRight, Sun, Moon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Simulator', icon: FlaskConical, path: '/simulator' },
  { label: 'Insights', icon: Brain, path: '/insights' },
  { label: 'AI Chat', icon: MessageSquare, path: '/chat' },
  { label: 'Goals', icon: Target, path: '/goals' },
];

export default function AppSidebar() {
  const location = useLocation();
  const { isDark, toggle } = useTheme();

  return (
    <aside className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ marginBottom: '40px' }}>
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--color-accent)', boxShadow: '0 8px 20px -6px var(--glow-accent)' }}
        >
          <Zap size={20} color="white" fill="white" />
        </div>
      </div>

      {/* Nav Items */}
      <nav className="sidebar-nav" style={{ width: '100%', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={item.label}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Theme Toggle */}
      <div className="sidebar-theme-toggle" style={{ marginBottom: '24px' }}>
        <button
          onClick={toggle}
          className="theme-toggle-pill"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ transform: 'scale(0.85)', margin: 0 }}
        >
          <span className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
            <span className={`toggle-thumb ${isDark ? 'dark' : 'light'}`}>
              {isDark
                ? <Moon size={11} color="#8B5CF6" strokeWidth={2.5} />
                : <Sun size={11} color="#F59E0B" strokeWidth={2.5} />
              }
            </span>
            <Sun size={11} color={isDark ? 'rgba(255,255,255,0.25)' : '#ffffff'} style={{ position: 'absolute', left: 7, top: '50%', transform: 'translateY(-50%)' }} />
            <Moon size={11} color={isDark ? '#ffffff' : 'rgba(0,0,0,0.2)'} style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)' }} />
          </span>
        </button>
      </div>

      {/* Bottom Links */}
      <div className="sidebar-bottom" style={{ width: '100%', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <a href="#" className="sidebar-nav-item" title="Support" style={{ display: 'flex', justifyContent: 'center' }}>
          <HelpCircle size={20} />
        </a>
        <Link to="/" className="sidebar-nav-item" title="Back to Home" style={{ display: 'flex', justifyContent: 'center' }}>
          <LogOut size={20} />
        </Link>
      </div>
    </aside>
  );
}
