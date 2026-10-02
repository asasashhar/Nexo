import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { NexoLogo } from './NexoLogo';
import { Send, Settings, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenContact: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenContact }) => {
  const { profile, messages, isAdminLoggedIn } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const unreadCount = messages.filter((m) => !m.read).length;

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'Work', href: '#work', id: 'work' },
    { label: 'Process', href: '#process', id: 'process' },
    { label: 'Testimonials', href: '#testimonials', id: 'testimonials' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Scroll detection & scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple scroll-spy
      const sections = ['home', 'about', 'services', 'work', 'process', 'testimonials', 'contact'];
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
          ? 'bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(31,42,55,0.06)] border-b border-[#E8F7F2]'
          : 'bg-[#F7FCFA]/90 backdrop-blur-xs border-b border-[#E8F7F2]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo (Logo mark without texts as requested) */}
        <a
          href="#home"
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          title="NEXO"
          aria-label="NEXO Home"
        >
          <NexoLogo size="md" showText={false} customLogoUrl={profile.logoUrl} />
        </a>

        {/* Navigation Links with Scroll-Spy underline */}
        <nav className="hidden md:flex items-center space-x-7" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive
                    ? 'text-[#4CC9A7] font-semibold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#4CC9A7] after:rounded-full'
                    : 'text-[#6B7280] hover:text-[#4CC9A7]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons: Admin CMS + Let's Talk */}
        <div className="flex items-center gap-2.5">
          {/* Admin Panel Portal Pill Button matching Image 1 */}
          <button
            onClick={onOpenAdmin}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D8F2E9] bg-white hover:bg-[#E8F7F2] text-xs font-bold text-[#1F2A37] hover:text-[#4CC9A7] transition-all shadow-2xs cursor-pointer group"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Settings className="w-3.5 h-3.5 text-[#4CC9A7] transition-transform group-hover:rotate-45" />
            <span>Admin</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#F2685F] animate-pulse" />
            )}
          </button>

          {/* Nav CTA "Let's Talk" */}
          <button
            onClick={onOpenContact}
            type="button"
            className="inline-flex items-center gap-1.5 bg-[#4CC9A7] hover:bg-[#37B294] text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all group cursor-pointer"
          >
            <span>Let&apos;s Talk</span>
            <Send className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#1F2A37] hover:text-[#4CC9A7] hover:bg-[#E8F7F2] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-3 pb-6 bg-white/98 border-b border-[#D8F2E9] shadow-lg animate-in fade-in duration-200">
          <div className="flex flex-col space-y-3 text-base font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1 transition-colors ${
                  activeSection === link.id
                    ? 'text-[#4CC9A7] font-bold'
                    : 'text-[#6B7280] hover:text-[#4CC9A7]'
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
