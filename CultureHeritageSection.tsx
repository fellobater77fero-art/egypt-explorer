import React, { useState } from 'react';
import { HERITAGE_CRAFTS } from '../data/crafts';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, MapPin, History, Users, Utensils, Scissors, Music } from 'lucide-react';

export const CultureHeritageSection: React.FC = () => {
  const { currentLang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'craft' | 'food' | 'tradition'>('all');

  const filteredCrafts = HERITAGE_CRAFTS.filter(
    (c) => activeCategory === 'all' || c.category === activeCategory
  );

  return (
    <section className="py-14 bg-stone-100 dark:bg-stone-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 font-cinzel">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Intangible Cultural Heritage & Living Traditions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
            {t('navCulture')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
            The soul of Egypt lives in its master craftsmen: hand-appliqued Khayamiya textiles, high-knot Saqqara silk carpets, porous Qena clay jars, Nubian architecture, and centuries of culinary rituals.
          </p>

          {/* Category Filter */}
          <div className="mt-8 flex justify-center gap-2">
            {[
              { id: 'all', label: 'All Heritage Traditions' },
              { id: 'craft', label: 'Artisanal Crafts & Textiles' },
              { id: 'food', label: 'Traditional Cuisine' },
              { id: 'tradition', label: 'Nubian Culture & Architecture' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 border border-stone-200 dark:border-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Crafts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCrafts.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-950 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-60 w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
                  <img
                    src={item.image}
                    alt={item.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {item.category}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-xs text-white font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{currentLang === 'ar' ? item.regionAr : item.regionEn}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
                    {currentLang === 'ar' ? item.titleAr : item.titleEn}
                  </h3>
                  {currentLang !== 'ar' && (
                    <div className="text-xs text-amber-800 dark:text-amber-400 font-cairo font-semibold mb-2">
                      {item.titleAr}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mt-2">
                    {currentLang === 'ar' ? item.descriptionAr : item.descriptionEn}
                  </p>

                  {/* Historical Lineage */}
                  <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-100 dark:border-stone-800 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                      <History className="w-3.5 h-3.5" />
                      <span>Historical Roots</span>
                    </div>
                    <div className="text-stone-500 dark:text-stone-400">
                      {currentLang === 'ar' ? item.historicalRootsAr : item.historicalRootsEn}
                    </div>
                  </div>
                </div>
              </div>

              {/* Artisan Note */}
              {item.artisanInfoEn && (
                <div className="px-6 pb-6 pt-2 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 border-t border-stone-100 dark:border-stone-800/80">
                  <Users className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{currentLang === 'ar' ? item.artisanInfoAr : item.artisanInfoEn}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
