import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { NexoLogo } from './NexoLogo';
import { Send, Settings, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenContact }) => {
  const { profile, messages } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const unreadCount = messages.filter((m) => !m.read).length;

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Why NEXO', href: '#why-us', id: 'why-us' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Process', href: '#process', id: 'process' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Scroll detection & scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['home', 'about', 'services', 'why-us', 'work', 'process', 'contact'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#080B11]/92 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-b border-slate-800/80'
          : 'bg-[#080B11]/70 backdrop-blur-xs border-b border-slate-800/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with Text */}
        <a
          href="#home"
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          title="NEXO – Ideas to Impact"
          aria-label="NEXO Home"
        >
          <NexoLogo size="md" showText={true} showTagline={true} customLogoUrl={profile.logoUrl} />
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#00E599] font-bold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#00E599] after:rounded-full after:shadow-[0_0_8px_#00E599]'
                    : 'text-slate-300 hover:text-[#00E599]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons: Admin CMS + Let's Talk */}
        <div className="flex items-center gap-2.5">
          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-700 bg-[#0F1522] hover:bg-[#1A2337] text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-xs cursor-pointer group"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Settings className="w-3.5 h-3.5 text-[#00E599] transition-transform group-hover:rotate-45" />
            <span>Admin</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
            )}
          </button>

          {/* Nav CTA "Let's Talk" */}
          <button
            onClick={onOpenContact}
            type="button"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#00E599] to-[#00B377] hover:from-[#00B377] hover:to-[#008A5B] text-black px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(0,229,153,0.3)] hover:shadow-[0_0_20px_rgba(0,229,153,0.5)] transition-all group cursor-pointer active:scale-95"
          >
            <span>Let&apos;s Talk</span>
            <Send className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-3 pb-6 bg-[#080B11]/98 border-b border-slate-800 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col space-y-3 text-base font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 transition-colors ${
                  activeSection === link.id
                    ? 'text-[#00E599] font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
