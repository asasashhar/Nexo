import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Sparkles,
  Zap,
  Target,
  Users,
  Award,
  Globe,
  Monitor,
  Palette,
  Film,
  Box,
} from 'lucide-react';

export const About: React.FC = () => {
  const { profile } = usePortfolio();

  const studioCapabilities = [
    { label: 'Web Architecture & Development', icon: Monitor, color: '#00E599' },
    { label: 'Print & Digital Poster Art', icon: Palette, color: '#FF5A36' },
    { label: 'Kinetic Motion & Reel Ads', icon: Film, color: '#06B6D4' },
    { label: '3D Commercial Product Renders', icon: Box, color: '#A855F7' },
  ];

  const tools = [
    'Figma',
    'After Effects',
    'Next.js',
    'Blender 3D',
    'Tailwind CSS',
    'Premiere Pro',
    'Illustrator',
    'React',
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-[#080B11] relative overflow-hidden">
      {/* Background glow mesh */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#00E599]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#FF5A36]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#00E599] mb-3">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#00E599]" />
            <span>BEHIND THE CREATIVE</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#00E599]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
            About NEXO Studio
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            {profile.aboutSubtitle ||
              'A passionate collective of designers, technologists, and storytellers turning visions into digital reality.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Studio Team Visual Presentation */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] group hover:border-[#00E599]/50 transition-all duration-500">
              <img
                src={profile.aboutImageUrl || '/nexo-studio-team.jpg'}
                alt="NEXO Studio Team Collaboration"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/nexo-studio-team.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B11]/90 via-transparent to-black/20 pointer-events-none" />

              {/* Floating studio caption */}
              <div className="absolute bottom-4 inset-x-4 bg-[#080B11]/90 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 text-left">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white uppercase tracking-wider">
                    NEXO CREATIVE HEADQUARTERS
                  </span>
                  <span className="text-[#00E599] font-mono text-[11px] font-bold">24/7 GLOBAL</span>
                </div>
                <p className="text-xs text-slate-300">
                  Where visionary concepts transform into polished digital products, eye-catching posters, and viral marketing ads.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Narrative & Pillars */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF5A36] uppercase tracking-[0.2em] block mb-2">
                IDEAS TO IMPACT
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-sans leading-tight">
                Creative Solutions for a Stronger Tomorrow.
              </h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {profile.aboutBio ||
                'NEXO is a multidisciplinary creative studio built for modern businesses. We combine strategic product thinking, high-end visual craftsmanship, and agile execution to deliver websites and marketing assets that stand out in crowded markets.'}
            </p>

            {/* Core Capabilities Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {studioCapabilities.map((cap, idx) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-[#0F1522] rounded-xl border border-slate-800/80 text-xs text-slate-200"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${cap.color}15`,
                        color: cap.color,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{cap.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Studio Tool Stack */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
                STUDIO PRODUCTION STACK:
              </span>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0F1522] text-slate-300 border border-slate-800 hover:border-[#00E599]/40 hover:text-[#00E599] transition-colors"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
