import React from 'react';

interface CetsLogoProps {
  variant?: 'full' | 'horizontal' | 'badge' | 'emblem' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  showSlogan?: boolean;
}

export const CetsLogo: React.FC<CetsLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'auto',
  className = '',
  showSlogan = true,
}) => {
  // Size mapping for emblem dimensions
  const emblemSizes = {
    xs: { w: 32, h: 32, textClass: 'text-xs', subClass: 'text-[8px]' },
    sm: { w: 42, h: 42, textClass: 'text-base', subClass: 'text-[9px]' },
    md: { w: 54, h: 54, textClass: 'text-xl', subClass: 'text-[11px]' },
    lg: { w: 72, h: 72, textClass: 'text-3xl', subClass: 'text-xs' },
    xl: { w: 96, h: 96, textClass: 'text-4xl', subClass: 'text-sm' },
    hero: { w: 130, h: 130, textClass: 'text-5xl md:text-6xl', subClass: 'text-base md:text-lg' },
  };

  const { w, h, textClass, subClass } = emblemSizes[size];

  // The precise circular emblem matching the uploaded logo:
  // - Luminous cyan/blue double crescent orbiting arcs
  // - Bold Red Cross on left
  // - Glossy red nurse figure with nurse cap and heart on chest
  // - Dynamic red ECG heartbeat waveform to the right
  const renderEmblem = () => (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none ${
        theme === 'dark' ? 'drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]' : 'drop-shadow-md'
      }`}
      style={{ width: w, height: h }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue/Cyan metallic gradients for crescent rings */}
          <linearGradient id="cetsRingCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0055FF" />
            <stop offset="35%" stopColor="#00D4FF" />
            <stop offset="70%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0033AA" />
          </linearGradient>

          <linearGradient id="cetsRingDark" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#001F7A" />
            <stop offset="50%" stopColor="#0044CC" />
            <stop offset="100%" stopColor="#00D2FF" />
          </linearGradient>

          {/* Glossy Red gradient for nurse and cross */}
          <linearGradient id="cetsRedGloss" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FF2A4B" />
            <stop offset="45%" stopColor="#DC143C" />
            <stop offset="100%" stopColor="#99001A" />
          </linearGradient>

          {/* Inner background glow */}
          <radialGradient id="cetsInnerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="75%" stopColor="#F0F8FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.95" />
          </radialGradient>

          {/* Soft shadow */}
          <filter id="cetsShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Inner solid circular disc */}
        <circle cx="100" cy="100" r="74" fill="url(#cetsInnerGlow)" />

        {/* Outer Orbiting Crescent Rings (Double metallic curves) */}
        {/* Top/Left outer swoosh */}
        <path
          d="M 30,100 C 30,55 68,18 115,20 C 158,22 188,52 185,55 C 182,58 152,38 115,36 C 75,34 46,65 46,100 C 46,135 75,166 115,164 C 152,162 182,142 185,145 C 188,148 158,178 115,180 C 68,182 30,145 30,100 Z"
          fill="url(#cetsRingCyan)"
        />
        {/* Secondary inner contour ring */}
        <path
          d="M 20,100 C 20,45 65,5 125,8 C 100,18 42,50 42,100 C 42,150 100,182 125,192 C 65,195 20,155 20,100 Z"
          fill="url(#cetsRingDark)"
        />

        {/* ================= INSIDE THE EMBLEM ================= */}

        {/* 1. Red Medical Cross on the left */}
        <g filter="url(#cetsShadow)">
          <path
            d="M 44,88 L 52,88 L 52,80 L 60,80 L 60,88 L 68,88 L 68,96 L 60,96 L 60,104 L 52,104 L 52,96 L 44,96 Z"
            fill="url(#cetsRedGloss)"
            stroke="#99001A"
            strokeWidth="0.5"
          />
          {/* Subtle 3D highlight on cross */}
          <path
            d="M 45,89 L 51,89 L 51,81 L 59,81 L 59,89 L 67,89"
            stroke="#FFA0B0"
            strokeWidth="1"
            fill="none"
          />
        </g>

        {/* 2. Red ECG Heartbeat Waveform (pulsing to the right) */}
        <path
          d="M 108,100 L 122,100 L 126,88 L 132,118 L 138,78 L 144,112 L 148,96 L 152,102 L 168,102"
          stroke="url(#cetsRedGloss)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* 3. Central Stylized Nurse Icon */}
        <g id="nurseFigure" filter="url(#cetsShadow)">
          {/* Nurse Cap / Hat */}
          <path
            d="M 88,48 C 94,44 106,44 112,48 L 115,55 L 85,55 Z"
            fill="url(#cetsRedGloss)"
          />
          {/* White cross/stripe on cap */}
          <line x1="97" y1="50" x2="103" y2="50" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="100" y1="47" x2="100" y2="53" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

          {/* Nurse Head */}
          <circle cx="100" cy="62" r="10" fill="url(#cetsRedGloss)" />

          {/* Stylized Body & Raised Welcoming Arms */}
          <path
            d="M 100,74 C 91,74 80,78 72,66 C 70,63 68,66 70,69 C 76,82 87,88 94,92 L 91,128 C 88,140 80,154 74,162 C 77,162 84,152 93,138 L 98,130 L 98,162 C 98,165 102,165 102,162 L 102,130 L 107,138 C 116,152 123,162 126,162 C 120,154 112,140 109,128 L 106,92 C 113,88 124,82 130,69 C 132,66 130,63 128,66 C 120,78 109,74 100,74 Z"
            fill="url(#cetsRedGloss)"
          />

          {/* Heart Emblem on Nurse's Chest */}
          <path
            d="M 100,87 C 98,82 91,82 91,87 C 91,92 100,98 100,98 C 100,98 109,92 109,87 C 109,82 102,82 100,87 Z"
            fill="#FFFFFF"
          />

          {/* Red shadow/reflection on floor */}
          <ellipse cx="100" cy="166" rx="20" ry="3.5" fill="#DC143C" opacity="0.3" />
        </g>
      </svg>
    </div>
  );

  // Variant: Emblem only
  if (variant === 'emblem') {
    return renderEmblem();
  }

  // Variant: Icon only
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-4 select-none ${className}`}>
      {/* Visual Emblem */}
      {renderEmblem()}

      {/* Text Brand Section */}
      <div className="flex flex-col justify-center">
        {/* Main CETS Wordmark with Serif Accent Styling */}
        <div className="flex items-center">
          <span
            className={`font-black tracking-tight leading-none ${textClass} ${
              isDark
                ? 'text-white drop-shadow-[0_2px_8px_rgba(0,102,255,0.5)]'
                : 'text-[#002B99] dark:text-white'
            }`}
            style={{
              fontFamily: "'Cinzel', 'Times New Roman', 'Playfair Display', Georgia, serif",
              letterSpacing: '0.04em',
            }}
          >
            <span className="text-[#0055D4] dark:text-[#38BDF8] font-serif font-light mr-0.5">((</span>
            CETS
          </span>
        </div>

        {/* Subtitle: CENTRO DE ENSINO TÉCNICO EM SAÚDE */}
        <div
          className={`font-black uppercase tracking-wider leading-tight mt-0.5 ${subClass} ${
            isDark ? 'text-red-400 drop-shadow-sm' : 'text-[#CC0000] dark:text-red-400'
          }`}
          style={{ letterSpacing: '0.06em' }}
        >
          Centro de Ensino Técnico em Saúde
        </div>

        {/* Slogan: Formação que você precisa, Qualidade que você Merece! */}
        {(variant === 'full' || showSlogan) && (
          <div
            className={`font-bold italic leading-tight mt-0.5 text-[9px] sm:text-[11px] md:text-xs ${
              isDark ? 'text-cyan-300' : 'text-[#0033CC] dark:text-cyan-300'
            }`}
          >
            Formação que você precisa, Qualidade que você Merece!
          </div>
        )}
      </div>
    </div>
  );
};

export default CetsLogo;
