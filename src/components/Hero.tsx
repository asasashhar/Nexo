import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Star } from 'lucide-react';

interface HeroProps {
  onStartProject?: () => void;
  onSeeProcess?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onSeeProcess }) => {
  const { profile, socialProfiles } = usePortfolio();

  const enabledSocials = socialProfiles.filter((s) => s.enabled);

  return (
    <section
      id="home"
      className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-[#FAF9F5]"
    >
      {/* Subtle decorative dot pattern top left */}
      <div className="absolute top-8 left-8 text-[#A1E8D2] pointer-events-none opacity-80">
        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 80 80">
          <circle cx="10" cy="10" r="3" />
          <circle cx="30" cy="10" r="3" />
          <circle cx="50" cy="10" r="3" />
          <circle cx="10" cy="30" r="3" />
          <circle cx="30" cy="30" r="3" />
          <circle cx="50" cy="30" r="3" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Details (Left Column) - Matches Image 1 */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* 1. Playful Greeting Script Callout with Waving Hand */}
            <div className="inline-flex items-center gap-2 font-script text-3xl sm:text-4xl lg:text-5xl text-[#4CC9A7] font-semibold mb-2 select-none">
              <span>{profile.greetingText || "Hi, I'm"}</span>
              <span className="animate-wave text-3xl sm:text-4xl inline-block origin-[70%_70%]">
                👋
              </span>
            </div>

            {/* 2. Main Bold Name & Brand Title: "Ashhar" in dark charcoal, "Designs" in teal */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#1F2A37] font-sans leading-[1.04] mb-3">
              <span>{profile.name || 'Ashhar'}</span>{' '}
              <span className="text-[#4CC9A7]">{profile.brandSuffix || 'Designs'}</span>
            </h1>

            {/* 3. Role Subtitle with Outline Coral Heart: "UI/UX Designer ♡" */}
            <div className="inline-flex items-center justify-center lg:justify-start gap-2.5 text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-[#F2685F] tracking-wide mb-6">
              <span>{profile.roleSubtitle || 'UI/UX Designer'}</span>
              <span
                className="text-2xl sm:text-3xl select-none inline-block hover:scale-125 transition-transform duration-200 cursor-default"
                title="Made with love"
              >
                ♡
              </span>
            </div>

            {/* 4. Bio Pitch Paragraph */}
            <p className="text-base sm:text-lg md:text-xl text-[#6B7280] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal mb-8">
              {profile.heroPitch ||
                'I design intuitive, user-friendly digital experiences that are beautiful, functional and meaningful.'}
            </p>

            {/* 5. Single CTA Button: View My Work -> (Resume Download button deleted as requested) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
              <a
                href={profile.ctaPrimaryLink || '#work'}
                className="inline-flex items-center justify-center gap-2.5 bg-[#F2685F] hover:bg-[#E0524A] text-white font-bold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all duration-200 shadow-[0_10px_24px_-4px_rgba(242,104,95,0.4)] hover:shadow-[0_14px_28px_-4px_rgba(242,104,95,0.5)] hover:-translate-y-0.5 cursor-pointer group"
              >
                <span>{profile.ctaPrimaryText || 'View My Work'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              {onStartProject && (
                <button
                  type="button"
                  onClick={onStartProject}
                  className="hidden"
                />
              )}
            </div>

            {/* 6. "Let's connect: [Bē] [in] [ig] [dr]" Social Circle Pills matching Image 1 */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 text-xs text-[#6B7280]">
              <span className="font-medium text-[#6B7280] mr-1">Let&apos;s connect:</span>
              {(enabledSocials.length > 0
                ? enabledSocials
                : [
                    { id: '1', label: 'Bē', platform: 'Behance', url: 'https://behance.net' },
                    { id: '2', label: 'in', platform: 'LinkedIn', url: 'https://linkedin.com' },
                    { id: '3', label: 'ig', platform: 'Instagram', url: 'https://instagram.com' },
                    { id: '4', label: 'dr', platform: 'Dribbble', url: 'https://dribbble.com' },
                  ]
              ).map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-[#D8F2E9] bg-white text-[#4CC9A7] hover:bg-[#4CC9A7] hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-2xs hover:scale-110"
                  title={soc.label || soc.platform}
                >
                  {soc.label || (soc.platform ? soc.platform.slice(0, 2) : '•')}
                </a>
              ))}
            </div>
          </div>

          {/* Hero Visual Presentation (Right Column) - Square Studio Team */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Outline Coral Heart Floating Top Right */}
            <div className="absolute -top-3 -right-2 sm:-right-4 text-[#F2685F] text-3xl font-light select-none z-20 animate-pulse">
              ♡
            </div>

            {/* Square Container with Rounded Corners (Square Size as requested) */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[450px] aspect-square rounded-3xl bg-[#111615] overflow-hidden flex items-center justify-center border-4 border-white shadow-[0_20px_50px_rgba(17,22,21,0.2)] group transition-all duration-300 hover:shadow-[0_25px_60px_rgba(76,201,167,0.25)]">
              <img
                src={profile.heroImageUrl || '/nexo-studio-team.jpg'}
                alt="NEXO Creative Studio Team"
                className="w-full h-full object-cover object-center select-none transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gentle bottom gradient for visual contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />
            </div>

            {/* Experience tag removed as requested */}

            {/* Floating Speech Bubble Bottom Left: "We turn ideas into delightful user experiences ♡" */}
            <div className="absolute -bottom-4 sm:bottom-4 -left-2 sm:-left-5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-[#D8F2E9] max-w-[240px] z-20 animate-float text-left">
              <p className="text-xs font-semibold text-[#1F2A37] leading-snug">
                {(profile.speechBubbleText || 'We turn ideas into delightful user experiences').replace(
                  /^I turn ideas/i,
                  'We turn ideas'
                )}{' '}
                <span className="text-[#F2685F] text-xs select-none">♡</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
