import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Heart,
  Zap,
  Lightbulb,
  Edit3,
  Monitor,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const Process: React.FC = () => {
  const { profile, processSteps } = usePortfolio();

  const sortedSteps = [...processSteps].sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-6 h-6 stroke-[1.9]" />;
      case 'Zap':
        return <Zap className="w-6 h-6 stroke-[1.9]" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6 stroke-[1.9]" />;
      case 'Edit3':
      case 'Pen':
        return <Edit3 className="w-6 h-6 stroke-[1.9]" />;
      case 'Monitor':
        return <Monitor className="w-6 h-6 stroke-[1.9]" />;
      case 'CheckCircle2':
      case 'Check':
        return <CheckCircle2 className="w-6 h-6 stroke-[1.9]" />;
      default:
        return <Sparkles className="w-6 h-6 stroke-[1.9]" />;
    }
  };

  return (
    <section
      id="process"
      className="py-20 md:py-28 bg-[#FAF9F5] border-t border-[#E8E6DF]/70 relative overflow-hidden"
    >
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#E8F7F2]/60 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#FDECEA]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: "Our Design Process ♡" as requested */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D8F2E9] text-[#2D9A7A] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#4CC9A7] animate-pulse" />
            <span>Workflow &amp; Methodology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1F2A37] tracking-tight">
            {profile.processTitle || 'Our Design'}{' '}
            <span className="font-script text-[#4CC9A7] text-4xl sm:text-5xl md:text-6xl font-normal">
              {profile.processHighlightedWord || 'Process'}
            </span>{' '}
            <span className="text-[#F2685F] text-2xl sm:text-3xl select-none inline-block animate-pulse">
              ♡
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] mt-3 max-w-xl mx-auto leading-relaxed">
            {profile.processSubtitle || 'A clear and collaborative approach from idea to impact.'}
          </p>
        </div>

        {/* Process Steps Horizontal Timeline Container */}
        <div className="relative">
          {/* Desktop Connecting Horizontal Dashed Line */}
          <div className="hidden lg:block absolute top-[4.5rem] left-16 right-16 h-0.5 border-t-2 border-dashed border-[#A1E8D2] -z-0" />

          {/* Steps Grid: 6 columns on desktop, 2-3 on tablet/mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {sortedSteps.map((step, idx) => {
              const isCoral = step.ringColor === 'coral';

              return (
                <div
                  key={step.id}
                  className="group bg-white/90 backdrop-blur-xs rounded-3xl p-5 border border-[#E8F7F2] hover:border-[#4CC9A7]/60 shadow-[0_8px_24px_-4px_rgba(76,201,167,0.06),0_2px_6px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_-6px_rgba(76,201,167,0.18)] transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
                >
                  {/* Subtle Top Gradient Bar */}
                  <div
                    className={`absolute top-0 inset-x-0 h-1 transition-opacity opacity-0 group-hover:opacity-100 ${
                      isCoral
                        ? 'bg-gradient-to-r from-transparent via-[#F2685F] to-transparent'
                        : 'bg-gradient-to-r from-transparent via-[#4CC9A7] to-transparent'
                    }`}
                  />

                  {/* Step Phase Pill */}
                  <div className="mb-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                        isCoral
                          ? 'bg-[#FDECEA] text-[#F2685F]'
                          : 'bg-[#E8F7F2] text-[#2D9A7A]'
                      }`}
                    >
                      Step {step.number}
                    </span>
                  </div>

                  {/* Circular Icon Badge */}
                  <div
                    className={`w-16 h-16 rounded-full bg-white border-2 flex items-center justify-center shadow-xs transition-all duration-300 group-hover:scale-110 mb-4 ${
                      isCoral
                        ? 'border-[#F2685F] text-[#F2685F] group-hover:bg-[#F2685F] group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(242,104,95,0.3)]'
                        : 'border-[#4CC9A7] text-[#4CC9A7] group-hover:bg-[#4CC9A7] group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(76,201,167,0.3)]'
                    }`}
                  >
                    {renderIcon(step.icon)}
                  </div>

                  {/* Step Title */}
                  <h3 className="text-base font-bold text-[#1F2A37] group-hover:text-[#111615] transition-colors mb-1.5">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Step index sequence indicator at bottom */}
                  <div className="mt-4 pt-3 w-full border-t border-gray-100/80 flex items-center justify-center text-[10px] font-medium text-[#9CA3AF]">
                    <span>Phase 0{idx + 1} of 0{sortedSteps.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
