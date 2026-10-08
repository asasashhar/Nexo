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
} from 'lucide-react';

export const Process: React.FC = () => {
  const { profile, processSteps } = usePortfolio();

  const sortedSteps = [...processSteps].sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-5 h-5 stroke-[2]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 stroke-[2]" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 stroke-[2]" />;
      case 'Edit3':
      case 'Pen':
        return <Edit3 className="w-5 h-5 stroke-[2]" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5 stroke-[2]" />;
      case 'CheckCircle2':
      case 'Check':
        return <CheckCircle2 className="w-5 h-5 stroke-[2]" />;
      default:
        return <Sparkles className="w-5 h-5 stroke-[2]" />;
    }
  };

  return (
    <section
      id="process"
      className="py-24 md:py-32 bg-[#0B0F17] relative overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#00E599]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#FF5A36]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-[#00E599] mb-3">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#00E599]" />
            <span>HOW WE DELIVER RESULTS</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#00E599]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Our Studio Workflow
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            {profile.processSubtitle || 'A seamless, milestone-driven framework that takes your vision from rough sketch to high-impact execution.'}
          </p>
        </div>

        {/* Process Steps Horizontal Timeline Container */}
        <div className="relative">
          {/* Desktop Connecting Horizontal Dashed Line */}
          <div className="hidden lg:block absolute top-[3.75rem] left-16 right-16 h-0.5 border-t border-dashed border-slate-700 -z-0" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
            {sortedSteps.map((step, idx) => {
              const isCoral = step.ringColor === 'coral';
              const isEven = idx % 2 === 1;
              const accentColor = isCoral || isEven ? '#FF5A36' : '#00E599';

              return (
                <div
                  key={step.id}
                  className="bg-[#0F1522] rounded-3xl p-6 border border-slate-800 hover:border-slate-700 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
                >
                  {/* Step Number + Icon Badge */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 shadow-lg relative"
                    style={{
                      backgroundColor: `${accentColor}18`,
                      color: accentColor,
                      border: `1px solid ${accentColor}40`,
                    }}
                  >
                    {renderIcon(step.icon)}
                    <span
                      className="absolute -top-2 -right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-black shadow-xs"
                      style={{ backgroundColor: accentColor }}
                    >
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 font-sans">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
