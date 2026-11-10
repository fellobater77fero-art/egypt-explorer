import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Compass, MapPin, Sparkles, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onExplore: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchQuery, onExplore }) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background Hero Image with measured contrast scrim */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/images/hero_egypt_pyramids_1794312588988.jpg"
          alt="Great Pyramids of Giza at Golden Hour"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/75 to-stone-950/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
        <div className="max-w-3xl">
          {/* Natural Editorial Kicker (No Pill) */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-300 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Official Cultural Heritage & Tourism Portal</span>
            <span aria-hidden="true">·</span>
            <span>All 27 Governorates</span>
          </div>

          {/* Main Title in Cinzel Royal Font */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-bold tracking-tight text-white leading-tight mb-5 text-balance">
            {t('appName')}
          </h1>

          <p className="text-base sm:text-xl text-stone-200 font-light leading-relaxed mb-8 max-w-2xl">
            {t('appTagline')}. Journey through 5,000 years of living history, from the monumental Giza Plateau and the Grand Egyptian Museum to Sinai sanctuaries, ancient hieroglyphics, and timeless Nubian traditions.
          </p>

          {/* Omnipresent Search Bar */}
          <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-amber-500/30 max-w-2xl mb-8 transition-all">
            <div className="flex items-center gap-3 px-3 py-1">
              <Search className="w-5 h-5 text-amber-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full py-2.5 bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => onExplore('directory')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-colors whitespace-nowrap shrink-0 shadow-md"
              >
                {t('navDirectory')}
              </button>
            </div>
          </div>

          {/* Quick Segmented Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-medium">
            <button
              onClick={() => onExplore('directory')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore 27 Governorates</span>
            </button>
            <button
              onClick={() => onExplore('museums')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Grand Egyptian Museum (GEM)</span>
            </button>
            <button
              onClick={() => onExplore('map')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Egypt Map</span>
            </button>
            <button
              onClick={() => onExplore('hieroglyphs')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 backdrop-blur-sm transition-colors"
            >
              <span className="text-base leading-none">𓋹</span>
              <span>Name in Royal Cartouche</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column KPI Trust Strip below hero */}
      <div className="border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-stone-300">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-cinzel text-amber-400 tabular-nums">27</div>
              <div className="text-xs text-stone-400 font-medium">Governorates Documented</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-cinzel text-amber-400 tabular-nums">100,000+</div>
              <div className="text-xs text-stone-400 font-medium">Museum Artifacts Recorded</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-cinzel text-amber-400 tabular-nums">7</div>
              <div className="text-xs text-stone-400 font-medium">UNESCO World Heritage Sites</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-cinzel text-amber-400 tabular-nums">15</div>
              <div className="text-xs text-stone-400 font-medium">Global Languages & Audio Guides</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
