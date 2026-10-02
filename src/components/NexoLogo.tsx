import React from 'react';

interface NexoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  customLogoUrl?: string;
  className?: string;
}

export const NexoLogo: React.FC<NexoLogoProps> = ({
  size = 'md',
  showText = false,
  showTagline = false,
  customLogoUrl,
  className = '',
}) => {
  if (customLogoUrl) {
    const imgHeight =
      size === 'sm' ? 'h-7' : size === 'lg' ? 'h-14' : size === 'xl' ? 'h-18' : 'h-10';
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src={customLogoUrl}
          alt="Nexo Logo"
          className={`${imgHeight} w-auto object-contain`}
        />
        {showText && (
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-[#1F2A37] font-sans">
              NEXO
            </span>
            {showTagline && (
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C9793]">
                Ideas to Impact
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  const markDimensions =
    size === 'sm'
      ? 'w-8 h-8'
      : size === 'lg'
      ? 'w-14 h-14'
      : size === 'xl'
      ? 'w-20 h-20'
      : 'w-11 h-11';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Signature Folded Ribbon "N" Mark (Matches Image 2) */}
      <div className={`${markDimensions} relative flex-shrink-0 flex items-center justify-center transition-transform hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(76,201,167,0.18)]"
          aria-label="NEXO Logo"
        >
          <defs>
            {/* Coral-Orange Upward Wing Gradient */}
            <linearGradient id="nexoCoralRibbon" x1="20%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#FFA695" />
              <stop offset="45%" stopColor="#F2685F" />
              <stop offset="100%" stopColor="#DF4C42" />
            </linearGradient>

            {/* Mint-Teal Main Curved Body Gradient */}
            <linearGradient id="nexoTealRibbon" x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#84EBD8" />
              <stop offset="35%" stopColor="#4CC9A7" />
              <stop offset="70%" stopColor="#2E9E80" />
              <stop offset="100%" stopColor="#1B6D56" />
            </linearGradient>

            {/* Inner Shadow where Teal overlaps Coral */}
            <filter id="nexoOverlapShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.5" floodColor="#111615" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* 1. Coral Upper-Right Wing (Right pillar of the "N") */}
          <path
            d="M58 35.5L76 24C77.5 23 79.5 24.2 79.5 26V59.5C79.5 61 78.2 62.2 76.8 61.5L58 51.5V35.5Z"
            fill="url(#nexoCoralRibbon)"
          />

          {/* 2. Soft Ambient Shadow on the fold */}
          <path
            d="M58 38L70 48.5C65.5 53.5 59.5 56 58 56V38Z"
            fill="#164E43"
            opacity="0.28"
          />

          {/* 3. Mint-Teal Curved Left Leg & Diagonal Sweep (Main Ribbon) */}
          <path
            d="M22 71.5V43C22 33.5 29.5 27.5 38.5 28.5C43.5 29 48 32 51.5 36.5L73.5 65.5C76 69 75 73.8 71.2 76.2C67.5 78.5 62.8 77.5 60 74L38 45.5C37 44 35.2 43 33.5 43.5C31.2 44 29.5 46 29.5 48.5V71.5C29.5 73.8 27.8 75.5 25.7 75.5C23.6 75.5 22 73.8 22 71.5Z"
            fill="url(#nexoTealRibbon)"
            filter="url(#nexoOverlapShadow)"
          />
        </svg>
      </div>

      {/* Optional Wordmark only when explicitly requested (defaults to false as requested: "not add teh texts") */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-widest text-[#1F2A37] font-sans">
            NEXO
          </span>
          {showTagline && (
            <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8C9793] mt-1">
              Ideas to Impact
            </span>
          )}
        </div>
      )}
    </div>
  );
};
