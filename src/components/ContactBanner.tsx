import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Globe, MapPin, ArrowRight, Instagram } from 'lucide-react';

interface ContactBannerProps {
  onOpenContact: () => void;
  onShowToast?: (title: string, msg: string) => void;
}

export const ContactBanner: React.FC<ContactBannerProps> = ({ onOpenContact }) => {
  const { profile } = usePortfolio();

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#080B11] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-[#00E599]/10 via-[#FF5A36]/10 to-[#00E599]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Sleek Dark Obsidian Banner */}
        <div className="bg-gradient-to-br from-[#0F1522] via-[#141C2E] to-[#0F1522] rounded-3xl p-8 sm:p-14 border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle neon accent line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00E599] via-[#06B6D4] to-[#FF5A36]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Center: Headline & Subtext */}
            <div className="lg:col-span-8 text-center lg:text-left space-y-4">
              <span className="text-xs font-mono font-bold text-[#00E599] uppercase tracking-[0.25em] block">
                LET&apos;S CREATE SOMETHING AMAZING
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-sans">
                Ready to turn your vision into{' '}
                <span className="bg-gradient-to-r from-[#00E599] to-[#FF5A36] bg-clip-text text-transparent">
                  reality?
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Whether you need a high-converting website, an iconic poster series, viral ad reels, or hardware product showcases — NEXO delivers on time, every time.
              </p>

              {/* Direct Info Pills */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 bg-[#080B11]/80 px-3.5 py-1.5 rounded-full border border-slate-700">
                  <Mail className="w-3.5 h-3.5 text-[#00E599]" />
                  <span>{profile.email || 'nexo@creative.com'}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[#080B11]/80 px-3.5 py-1.5 rounded-full border border-slate-700">
                  <Instagram className="w-3.5 h-3.5 text-[#FF5A36]" />
                  <span>@nexo.creative</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[#080B11]/80 px-3.5 py-1.5 rounded-full border border-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Worldwide</span>
                </span>
              </div>
            </div>

            {/* Right: Let's Talk Button */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#00E599] to-[#00B377] hover:from-[#00B377] hover:to-[#008A5B] text-black font-extrabold px-8 py-4 rounded-full text-base shadow-[0_0_30px_rgba(0,229,153,0.4)] hover:shadow-[0_0_40px_rgba(0,229,153,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 mt-2">
                Fast 24h Response Time
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
