import React, { useState } from 'react';
import { Museum } from '../types';
import { VERIFIED_MUSEUMS } from '../data/museums';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Landmark,
  Clock,
  Ticket,
  MapPin,
  ExternalLink,
  Volume2,
  Sparkles,
  Globe,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';

export const MuseumsSection: React.FC = () => {
  const { currentLang, t } = useLanguage();
  const { toggleFavorite, isFavorite, addRecentlyViewed } = useAuth();
  const [selectedMuseum, setSelectedMuseum] = useState<Museum>(VERIFIED_MUSEUMS[0]);

  return (
    <section className="py-14 bg-stone-100 dark:bg-stone-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curatorial Section Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 font-cinzel">
            <Landmark className="w-4 h-4" />
            <span>National Treasury of Antiquities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
            {t('navMuseums')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
            Explore Egypt\'s world-renowned museum institutions. From the colossal Grand Egyptian Museum overlooking the Pyramids to the historic mothership in Tahrir and the royal mummies of Fustat.
          </p>
        </div>

        {/* Featured Master Museum Marquee Hero (GEM or selected) */}
        <div className="bg-white dark:bg-stone-950 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xl overflow-hidden mb-12 grid grid-cols-1 lg:grid-cols-12">
          {/* Visual Presentation (Left/Top) */}
          <div className="relative lg:col-span-7 h-72 sm:h-96 lg:h-auto min-h-[350px]">
            <img
              src={selectedMuseum.images[0]}
              alt={selectedMuseum.nameEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-stone-950" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-md">
                Featured Museum
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
              <h3 className="text-xl font-bold font-cinzel">
                {currentLang === 'ar' ? selectedMuseum.nameAr : selectedMuseum.nameEn}
              </h3>
            </div>
          </div>

          {/* Institutional Information & Curatorial Highlights (Right) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="hidden lg:block mb-3">
                <div className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-1">
                  {selectedMuseum.governorate.toUpperCase()} GOVERNORATE
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
                  {currentLang === 'ar' ? selectedMuseum.nameAr : selectedMuseum.nameEn}
                </h3>
                <p className="text-xs font-cairo text-amber-700 dark:text-amber-300 font-medium mt-0.5">
                  {currentLang === 'ar' ? selectedMuseum.nameEn : selectedMuseum.nameAr}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
                {currentLang === 'ar' ? selectedMuseum.descriptionAr : selectedMuseum.descriptionEn}
              </p>

              {/* Museum Collection Highlights */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-cinzel flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Key Exhibition Highlights</span>
                </h4>
                {selectedMuseum.highlights.map((h, i) => (
                  <div key={i} className="p-3 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200/60 dark:border-stone-800">
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {currentLang === 'ar' ? h.titleAr : h.titleEn}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                      {currentLang === 'ar' ? h.descriptionAr : h.descriptionEn}
                    </div>
                  </div>
                ))}
              </div>

              {/* Operational Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-6">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{selectedMuseum.openingHours}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Ticket className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{selectedMuseum.ticketPrice.split('|')[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">{selectedMuseum.location}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Audio Guides: {selectedMuseum.audioGuideLanguages.length} Languages</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  toggleFavorite({
                    id: selectedMuseum.id,
                    type: 'museum',
                    title: currentLang === 'ar' ? selectedMuseum.nameAr : selectedMuseum.nameEn,
                    governorate: selectedMuseum.governorate,
                    image: selectedMuseum.images[0],
                  });
                }}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  isFavorite(selectedMuseum.id)
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isFavorite(selectedMuseum.id) ? t('saved') : t('saveToFavorites')}</span>
              </button>

              {selectedMuseum.officialWebsite && (
                <a
                  href={selectedMuseum.officialWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Museum Catalog Selector Grid */}
        <h3 className="text-base font-bold font-cinzel text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-5">
          Select Verified Museum Institution
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VERIFIED_MUSEUMS.map((museum) => {
            const isSelected = selectedMuseum.id === museum.id;
            return (
              <button
                key={museum.id}
                onClick={() => {
                  setSelectedMuseum(museum);
                  addRecentlyViewed({
                    id: museum.id,
                    type: 'museum',
                    title: currentLang === 'ar' ? museum.nameAr : museum.nameEn,
                    image: museum.images[0],
                  });
                }}
                className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                    {museum.governorate}
                  </div>
                  <h4 className="text-sm font-bold font-cinzel text-stone-900 dark:text-stone-100 line-clamp-1">
                    {currentLang === 'ar' ? museum.nameAr : museum.nameEn}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                    {currentLang === 'ar' ? museum.descriptionAr : museum.descriptionEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
                  <span>{museum.highlights.length} Highlights</span>
                  {isSelected && <span className="text-amber-600 font-bold">Selected</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
