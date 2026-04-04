import { Zap, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border pt-20 pb-10">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <a href="#hero" className="flex items-center gap-2 no-underline mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Zap size={16} color="white" fill="white" />
              </div>
              <span className="font-bold text-xl text-text">
                Spend<span className="text-accent">Sense</span>
              </span>
            </a>
            <p className="text-muted max-w-sm text-sm leading-relaxed mb-6">
              SpendSense is built for Hackathon 2025. We believe credit cards give you rope, but AI should stop you from hanging yourself with it.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-border rounded-lg bg-surface hover:border-accent transition-colors text-muted"><Twitter size={18}/></a>
              <a href="#" className="p-2 border border-border rounded-lg bg-surface hover:border-accent transition-colors text-muted"><Github size={18}/></a>
              <a href="#" className="p-2 border border-border rounded-lg bg-surface hover:border-accent transition-colors text-muted"><Linkedin size={18}/></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted hover:text-accent transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-muted hover:text-accent transition-colors text-sm">Integrations (AA)</a></li>
              <li><a href="#" className="text-muted hover:text-accent transition-colors text-sm">Pricing</a></li>
              <li><a href="#" className="text-muted hover:text-accent transition-colors text-sm">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted hover:text-accent transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-muted hover:text-accent transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-muted hover:text-accent transition-colors text-sm">Data Security</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs">© 2025 SpendSense Team. Built for HackTheMind.</p>
          <p className="text-muted text-xs flex items-center gap-1">Status: <span className="w-2 h-2 rounded-full bg-accent2 inline-block"></span> All Systems Operational</p>
        </div>
      </div>
    </footer>
  );
}
