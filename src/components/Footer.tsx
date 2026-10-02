import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { NexoLogo } from './NexoLogo';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenContact?: () => void;
  onSelectService?: (serviceId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenContact,
  onSelectService,
}) => {
  const { profile, services, socialProfiles } = usePortfolio();

  const enabledSocials = socialProfiles.filter((s) => s.enabled);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#E8F7F2]/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Brand Logo without texts */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <div className="mb-2">
              <NexoLogo size="md" showText={false} customLogoUrl={profile.logoUrl} />
            </div>
            <p className="text-xs text-[#6B7280] text-center md:text-left">
              Crafting intuitive &amp; delightful interfaces.
            </p>
          </div>

          {/* Centre: Quick Links in two columns */}
          <div className="md:col-span-5 flex justify-center">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-medium text-[#6B7280]">
              <a href="#home" className="hover:text-[#4CC9A7] transition-colors py-0.5">
                Home
              </a>
              <a href="#about" className="hover:text-[#4CC9A7] transition-colors py-0.5">
                About Us
              </a>
              <a href="#services" className="hover:text-[#4CC9A7] transition-colors py-0.5">
                Services
              </a>
              <a href="#work" className="hover:text-[#4CC9A7] transition-colors py-0.5">
                Selected Work
              </a>
              <a href="#process" className="hover:text-[#4CC9A7] transition-colors py-0.5">
                Our Process
              </a>
              <a href="#testimonials" className="hover:text-[#4CC9A7] transition-colors py-0.5">
                Testimonials
              </a>
              {onOpenContact ? (
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-[#4CC9A7] transition-colors py-0.5 text-left cursor-pointer"
                >
                  Contact
                </button>
              ) : (
                <a href="#contact" className="hover:text-[#4CC9A7] transition-colors py-0.5">
                  Contact
                </a>
              )}
              {onOpenAdmin ? (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-[#4CC9A7] transition-colors py-0.5 text-left cursor-pointer"
                >
                  Studio Admin
                </button>
              ) : (
                <a href="#work" className="hover:text-[#4CC9A7] transition-colors py-0.5">
                  Case Studies
                </a>
              )}
            </div>
          </div>

          {/* Right: Social Circles, Copyright & Back to Top */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end gap-3">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
              <span className="text-xs font-semibold text-[#1F2A37] mr-1">Let's Connect:</span>
              {enabledSocials.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#4CC9A7]/50 text-[#4CC9A7] hover:bg-[#4CC9A7] hover:text-white flex items-center justify-center text-xs font-bold transition-all hover:scale-105"
                  title={soc.platform}
                >
                  {soc.label || soc.platform.slice(0, 2)}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
              <span>© {currentYear} {profile.name}. All rights reserved.</span>
              <button
                type="button"
                onClick={scrollToTop}
                className="w-7 h-7 rounded-full bg-[#4CC9A7] text-white flex items-center justify-center hover:bg-[#37B294] transition-all cursor-pointer shadow-xs ml-1"
                title="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
