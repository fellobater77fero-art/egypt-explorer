import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  textSize?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'h-10 w-10',
  showText = true,
  textSize = 'text-lg',
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Royal Egyptian Seal: Pyramids + Sphinx + Ankh + Modern Location Pin */}
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Royal Blue Circular Shield with Gold Bezel */}
          <circle cx="50" cy="50" r="47" fill="#0d1b2a" stroke="#c59b27" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="43" stroke="#e0b84c" strokeWidth="0.75" strokeDasharray="2 2" />

          {/* Golden Solar Disk */}
          <circle cx="50" cy="27" r="7" fill="#e0b84c" opacity="0.9" />

          {/* Modern Location Pin Silhouette (Golden Frame) */}
          <path
            d="M50 16 C37 16 27 26 27 38 C27 52 50 78 50 78 C50 78 73 52 73 38 C73 26 63 16 50 16 Z"
            fill="none"
            stroke="#c59b27"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* Great Pyramids Triangles */}
          {/* Main Khufu Pyramid */}
          <polygon points="50,32 30,68 70,68" fill="#c59b27" />
          {/* Shaded Side of Pyramid */}
          <polygon points="50,32 40,68 70,68" fill="#9d781b" />
          {/* Khafre Pyramid Background */}
          <polygon points="66,42 50,68 82,68" fill="#7d5f13" opacity="0.8" />

          {/* The Great Sphinx Silhouette at Pyramid Base */}
          <path
            d="M30 68 C32 63 35 62 37 63 C39 64 39 67 44 68 C44 68 30 68 30 68 Z"
            fill="#e0b84c"
          />
          {/* Sphinx Royal Nemes Headdress Head */}
          <circle cx="34" cy="62" r="2.5" fill="#f3d77f" />

          {/* Ancient Egyptian Ankh (Key of Life) Emblem in Foreground */}
          {/* Ankh Loop */}
          <ellipse cx="50" cy="56" rx="4.5" ry="5.5" fill="none" stroke="#fef08a" strokeWidth="1.8" />
          {/* Ankh Crossbar */}
          <line x1="43" y1="62" x2="57" y2="62" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" />
          {/* Ankh Stem */}
          <line x1="50" y1="62" x2="50" y2="76" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" />

          {/* Nile River Waves subtle base */}
          <path
            d="M20 74 Q 35 71 50 74 T 80 74"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeOpacity="0.6"
            fill="none"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-cinzel font-bold tracking-wider text-slate-900 dark:text-amber-100 ${textSize}`}>
            EGYPT EXPLORER
          </span>
          <span className="text-[10px] tracking-widest uppercase text-amber-700 dark:text-amber-400 font-medium">
            Discover · Explore · Experience
          </span>
        </div>
      )}
    </div>
  );
};
