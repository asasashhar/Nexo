import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

interface ContactBannerProps {
  onOpenContact: () => void;
  onShowToast?: (title: string, msg: string) => void;
}

export const ContactBanner: React.FC<ContactBannerProps> = ({ onOpenContact }) => {
  const { profile } = usePortfolio();

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#FAF9F5] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Soft Teal Banner Container matching Image 1 */}
        <div className="bg-[#E8F5F1] rounded-3xl p-8 sm:p-12 border border-[#C2ECE0] shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: White Card with Envelope & Heart */}
            <div className="lg:col-span-2 flex justify-center lg:justify-start">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-xs border border-[#C2ECE0] flex items-center justify-center p-4">
                <div className="w-14 h-14 relative flex items-center justify-center">
                  {/* Clean SVG Envelope with teal outline & coral heart */}
                  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                    <rect x="4" y="10" width="40" height="28" rx="4" fill="#F7FCFA" stroke="#4CC9A7" strokeWidth="2.5" />
                    <path d="M4 12L24 26L44 12" stroke="#4CC9A7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Floating coral heart above envelope */}
                    <circle cx="24" cy="23" r="3.5" fill="#F2685F" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Center: Headline & Subtext */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1F2A37] tracking-tight leading-tight">
                {profile.ctaHeadline || "Let's create something amazing"}{' '}
                <span className="text-[#F2685F] whitespace-nowrap">
                  {profile.ctaHighlightedWord || 'together! 💕'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed max-w-md mx-auto lg:mx-0">
                {profile.ctaSubtext ||
                  "Have a project in mind or just want to say hi? I'd love to hear from you."}
              </p>
            </div>

            {/* Right: Contact Details & Let's Talk Button */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end gap-3.5 text-xs text-[#1F2A37]">
              <div className="space-y-1.5 text-center lg:text-right font-medium text-[#4B5563]">
                <p className="flex items-center justify-center lg:justify-end gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#4CC9A7]" />
                  <a href={`mailto:${profile.email}`} className="hover:text-[#4CC9A7] transition-colors">
                    {profile.email || 'hello@ashhar.com'}
                  </a>
                </p>
                <p className="flex items-center justify-center lg:justify-end gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#4CC9A7]" />
                  <a href={`tel:${profile.phone}`} className="hover:text-[#4CC9A7] transition-colors">
                    {profile.phone || '+91 98765 43210'}
                  </a>
                </p>
                <p className="flex items-center justify-center lg:justify-end gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#4CC9A7]" />
                  <span>{profile.location || 'Bangalore, India'}</span>
                </p>
              </div>

              {/* Coral "Let's Talk ↗" Button */}
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2 bg-[#F2685F] hover:bg-[#E0524A] text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95"
              >
                <span>Let&apos;s Talk</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
