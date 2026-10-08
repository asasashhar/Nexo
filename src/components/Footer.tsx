import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { NexoLogo } from './NexoLogo';
import { ArrowUp, Mail, Instagram, Globe } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenContact?: () => void;
  onSelectService?: (serviceId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenContact,
}) => {
  const { profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070B] border-t border-slate-800/80 py-14 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Left: Brand Logo & Mission */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-3">
              <NexoLogo size="md" showText={true} showTagline={true} customLogoUrl={profile.logoUrl} />
            </div>
            <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
              Creative digital studio turning ambitious ideas into polished websites, striking posters, and viral video ads.
            </p>
          </div>

          {/* Centre: Quick Navigation */}
          <div className="md:col-span-4 flex justify-center">
            <div className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-xs font-semibold text-slate-400">
              <a href="#home" className="hover:text-[#00E599] transition-colors py-0.5">
                Home
              </a>
              <a href="#services" className="hover:text-[#00E599] transition-colors py-0.5">
                Services
              </a>
              <a href="#why-us" className="hover:text-[#00E599] transition-colors py-0.5">
                Why NEXO
              </a>
              <a href="#work" className="hover:text-[#00E599] transition-colors py-0.5">
                Portfolio Work
              </a>
              <a href="#process" className="hover:text-[#00E599] transition-colors py-0.5">
                Our Workflow
              </a>
              <a href="#about" className="hover:text-[#00E599] transition-colors py-0.5">
                About Studio
              </a>
              <a href="#testimonials" className="hover:text-[#00E599] transition-colors py-0.5">
                Client Reviews
              </a>
              <a href="#contact" className="hover:text-[#00E599] transition-colors py-0.5">
                Get in Touch
              </a>
            </div>
          </div>

          {/* Right: Direct Info & Back to Top */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${profile.email || 'nexo@creative.com'}`}
                className="w-9 h-9 rounded-full bg-[#0F1522] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#00E599] hover:border-[#00E599]/40 transition-colors"
                title="Email NEXO"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#0F1522] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#FF5A36] hover:border-[#FF5A36]/40 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={scrollToTop}
                className="w-9 h-9 rounded-full bg-[#0F1522] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-600 transition-colors cursor-pointer"
                title="Back to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>

            <span className="font-mono text-[11px] text-slate-500">
              nexo.vercel.app · Worldwide
            </span>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-[11px] font-semibold text-slate-500 hover:text-[#00E599] transition-colors cursor-pointer mt-1"
              >
                Admin CMS Portal →
              </button>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {currentYear} NEXO Creative Digital Studio. All rights reserved.</p>
          <p className="font-mono text-[#00E599]/80">Creative Solutions for a Stronger Tomorrow</p>
        </div>
      </div>
    </footer>
  );
};
