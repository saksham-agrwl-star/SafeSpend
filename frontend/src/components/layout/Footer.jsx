import { Zap, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-20 pb-10"
      style={{ background: 'var(--color-surface2)', borderTop: '1px solid rgba(255,255,255,0.6)' }}>
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#hero" className="flex items-center gap-2 mb-4" style={{ textDecoration: 'none' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--color-bg)', boxShadow: '4px 4px 10px var(--shadow-dark), -3px -3px 8px var(--shadow-light)' }}>
                <Zap size={17} color="var(--color-accent)" fill="var(--color-accent)" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
                Safe<span style={{ color: 'var(--color-accent)' }}>Spend</span>
              </span>
            </a>
            <p className="max-w-sm text-sm leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
              SafeSpend is built for Devcation 2026. AI that stops bad financial decisions before they happen.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-xl transition-all"
                  style={{
                    background: 'var(--color-bg)',
                    boxShadow: '3px 3px 8px var(--shadow-dark), -2px -2px 6px var(--shadow-light)',
                    border: '1px solid rgba(255,255,255,0.5)',
                    color: 'var(--color-muted)'
                  }}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-6" style={{ color: 'var(--color-text)' }}>Product</h4>
            <ul className="space-y-4">
              {['Features', 'Integrations (AA)', 'Pricing', 'Changelog'].map(l => (
                <li key={l}>
                  <a href="#" style={{ color: 'var(--color-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseOver={e => e.target.style.color = 'var(--color-accent)'}
                    onMouseOut={e => e.target.style.color = 'var(--color-muted)'}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-6" style={{ color: 'var(--color-text)' }}>Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Data Security'].map(l => (
                <li key={l}>
                  <a href="#" style={{ color: 'var(--color-muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                    onMouseOver={e => e.target.style.color = 'var(--color-accent)'}
                    onMouseOut={e => e.target.style.color = 'var(--color-muted)'}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(201,176,168,0.4)' }}>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>© 2026 SafeSpend Team. Built for Devcation2026.</p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
            Status:
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--color-accent2)' }} />
            All Systems Operational
          </p>
        </div>
      </div>
    </footer>
  );
}
