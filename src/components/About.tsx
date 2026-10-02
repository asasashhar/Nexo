import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  MapPin,
  GraduationCap,
  Heart,
  Coffee,
  Sparkles,
  Award,
  Star,
} from 'lucide-react';

export const About: React.FC = () => {
  const { profile, infoChips } = usePortfolio();
  const [plantState, setPlantState] = useState<'happy' | 'loved' | 'watered'>('happy');
  const [bubbleText, setBubbleText] = useState('Hi!');

  const handlePlantClick = () => {
    if (plantState === 'happy') {
      setPlantState('loved');
      setBubbleText('Yay! ♡');
    } else if (plantState === 'loved') {
      setPlantState('watered');
      setBubbleText('🌱✨');
    } else {
      setPlantState('happy');
      setBubbleText('Hi!');
    }
  };

  const renderChipIcon = (iconName: string, color?: string) => {
    const isAmber = color === 'amber';
    const isCoral = color === 'coral';
    const baseColor = isAmber ? 'text-amber-600' : isCoral ? 'text-[#F2685F]' : 'text-[#4CC9A7]';

    switch (iconName) {
      case 'MapPin':
        return <MapPin className={`w-5 h-5 ${baseColor}`} />;
      case 'GraduationCap':
        return <GraduationCap className={`w-5 h-5 ${baseColor}`} />;
      case 'Heart':
        return <Heart className={`w-5 h-5 fill-current ${baseColor}`} />;
      case 'Coffee':
        return <Coffee className={`w-5 h-5 ${baseColor}`} />;
      case 'Star':
        return <Star className={`w-5 h-5 fill-current text-[#F5B301]`} />;
      case 'Award':
        return <Award className={`w-5 h-5 ${baseColor}`} />;
      default:
        return <Sparkles className={`w-5 h-5 ${baseColor}`} />;
    }
  };

  return (
    <section id="about" className="py-20 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title: Two-tone with Caveat teal and tiny coral heart */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2A37]">
            {profile.aboutTitle || 'About'}{' '}
            <span className="font-script text-[#4CC9A7] text-4xl sm:text-5xl">
              {profile.aboutHighlightedWord || 'Us'}
            </span>{' '}
            <span className="text-[#F2685F] text-2xl select-none inline-block animate-pulse">♡</span>
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2">
            {profile.aboutSubtitle || 'A little glimpse into who we are and what drives our studio craft.'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Mascot & Bio Container */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            {/* Cute Smiling Plant Mascot in Teal Pot */}
            <div
              onClick={handlePlantClick}
              title="Click to interact with Ashhar's studio plant!"
              className="w-36 h-36 flex-shrink-0 bg-[#E8F7F2] rounded-3xl p-4 flex items-center justify-center shadow-inner relative group cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
            >
              <div className="absolute -top-2 -right-2 bg-white text-xs px-2.5 py-0.5 rounded-full border border-[#4CC9A7] text-[#4CC9A7] font-bold shadow-sm transition-all animate-bounce">
                {bubbleText}
              </div>

              <svg className="w-24 h-24 text-[#4CC9A7]" fill="none" viewBox="0 0 100 100">
                {/* Pot */}
                <path
                  d="M28 55L34 85C34.5 87.5 36.5 89 39 89H61C63.5 89 65.5 87.5 66 85L72 55H28Z"
                  fill="#37B294"
                />
                <rect fill="#4CC9A7" height="7" rx="3.5" width="50" x="25" y="50" />

                {/* Pot Face */}
                {plantState === 'loved' ? (
                  <>
                    <path
                      d="M40 68Q43 65 46 68"
                      stroke="#1F2A37"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M54 68Q57 65 60 68"
                      stroke="#1F2A37"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <>
                    <circle cx="43" cy="68" fill="#1F2A37" r="2.5" />
                    <circle cx="57" cy="68" fill="#1F2A37" r="2.5" />
                  </>
                )}

                {/* Smile */}
                <path
                  d="M48 74C49.5 76 50.5 76 52 74"
                  stroke="#1F2A37"
                  strokeLinecap="round"
                  strokeWidth="2"
                />

                {/* Blush cheeks */}
                <ellipse cx="38" cy="71" fill="#F2685F" opacity="0.6" rx="2" ry="1" />
                <ellipse cx="62" cy="71" fill="#F2685F" opacity="0.6" rx="2" ry="1" />

                {/* Plant Leaves */}
                <path d="M50 50V35" stroke="#248A71" strokeLinecap="round" strokeWidth="3" />
                <path
                  d="M50 35C45 22 26 25 32 38C35 44 47 42 50 35Z"
                  fill={plantState === 'watered' ? '#4ade80' : '#75DBBC'}
                />
                <path
                  d="M50 32C56 18 76 22 70 35C66 42 54 40 50 32Z"
                  fill={plantState === 'watered' ? '#22c55e' : '#4CC9A7'}
                />
                <path
                  d="M50 25C47 16 53 10 50 8C47 10 53 16 50 25Z"
                  fill={plantState === 'watered' ? '#86efac' : '#A1E8D2'}
                />
              </svg>
            </div>

            {/* Bio Text */}
            <div className="text-center md:text-left">
              <p className="text-base sm:text-lg text-[#6B7280] leading-relaxed">
                {profile.aboutBio}
              </p>
              <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-xs text-[#9CA3AF]">
                <Sparkles className="w-3.5 h-3.5 text-[#4CC9A7]" />
                <span>{profile.aboutPlantTip || 'Tip: Click the studio plant to give it some love!'}</span>
              </div>
            </div>
          </div>

          {/* Highlight Info Chips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infoChips.map((chip) => (
              <div
                key={chip.id}
                className="bg-[#F7FCFA] border border-[#D8F2E9] rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    chip.color === 'coral'
                      ? 'bg-[#FDECEA]'
                      : chip.color === 'amber'
                      ? 'bg-amber-50'
                      : 'bg-[#E8F7F2]'
                  }`}
                >
                  {renderChipIcon(chip.icon, chip.color)}
                </div>
                <div className="text-xs">
                  <span className="text-[#9CA3AF] block font-medium">{chip.label}</span>
                  <strong className="text-[#1F2A37] font-semibold">{chip.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
