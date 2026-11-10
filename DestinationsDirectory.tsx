import React, { useState } from 'react';
import { Destination, DestinationCategory } from '../types';
import { VERIFIED_DESTINATIONS } from '../data/destinations';
import { ALL_GOVERNORATES } from '../data/governorates';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Clock,
  Ticket,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  Navigation,
  Accessibility,
  X,
  Search,
  Filter,
} from 'lucide-react';

interface DestinationsDirectoryProps {
  searchQuery?: string;
}

export const DestinationsDirectory: React.FC<DestinationsDirectoryProps> = ({ searchQuery = '' }) => {
  const { currentLang, t, tCategory, isRTL } = useLanguage();
  const { toggleFavorite, isFavorite, addRecentlyViewed } = useAuth();

  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Available categories
  const categories: { id: string; key: DestinationCategory }[] = [
    { id: 'archaeological_site', key: 'archaeological_site' },
    { id: 'temple', key: 'temple' },
    { id: 'tomb_pyramid', key: 'tomb_pyramid' },
    { id: 'islamic_monument', key: 'islamic_monument' },
    { id: 'coptic_site', key: 'coptic_site' },
    { id: 'natural_reserve', key: 'natural_reserve' },
    { id: 'coastal', key: 'coastal' },
    { id: 'desert_oasis', key: 'desert_oasis' },
  ];

  // Filter logic
  const filtered = VERIFIED_DESTINATIONS.filter((d) => {
    // Governorate filter
    if (selectedGovernorate !== 'all' && d.governorate !== selectedGovernorate) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && d.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNameEn = d.nameEn.toLowerCase().includes(q);
      const matchNameAr = d.nameAr.includes(q);
      const matchDesc = d.descriptionEn.toLowerCase().includes(q) || d.descriptionAr.includes(q);
      const matchGov = d.governorate.toLowerCase().includes(q);
      if (!matchNameEn && !matchNameAr && !matchDesc && !matchGov) {
        return false;
      }
    }
    return true;
  });

  const handleOpenDetails = (dest: Destination) => {
    setActiveDestination(dest);
    setIsPlayingAudio(false);
    window.speechSynthesis?.cancel();
    addRecentlyViewed({
      id: dest.id,
      type: 'destination',
      title: currentLang === 'ar' ? dest.nameAr : dest.nameEn,
      image: dest.images[0],
    });
  };

  const handleToggleAudio = () => {
    if (!activeDestination) return;

    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak =
          currentLang === 'ar'
            ? activeDestination.audioGuideNarrativeAr || activeDestination.descriptionAr
            : activeDestination.audioGuideNarrativeEn || activeDestination.descriptionEn;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLang === 'ar' ? 'ar-EG' : 'en-US';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  return (
    <section className="py-12 bg-stone-50 dark:bg-stone-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            Egyptian Cultural & Archaeological Directory
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
            {t('navDirectory')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-2 max-w-3xl">
            Verified archaeological sites, royal pyramids, Pharaonic temples, Islamic & Coptic monuments, natural reserves, and desert oases across all 27 governorates.
          </p>
        </div>

        {/* Filter Controls (Segmented, no pill cards) */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Governorate selector dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label htmlFor="gov-select" className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('filterByGovernorate')}:</span>
              </label>
              <select
                id="gov-select"
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full md:w-64 py-2 px-3 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="all">{t('allGovernorates')}</option>
                {ALL_GOVERNORATES.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {currentLang === 'ar' ? gov.nameAr : gov.nameEn} ({currentLang === 'ar' ? gov.capitalAr : gov.capitalEn})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400">
              Showing <span className="font-semibold text-stone-900 dark:text-stone-100 tabular-nums">{filtered.length}</span> verified sites
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {t('allCategories')}
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {tCategory(cat.key)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8">
            <div className="text-3xl mb-3">🏛️</div>
            <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-200">No destinations found</h3>
            <p className="text-sm text-stone-500 mt-1">Try resetting your governorate or category filters.</p>
            <button
              onClick={() => {
                setSelectedGovernorate('all');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((dest) => {
              const isFav = isFavorite(dest.id);
              const govInfo = ALL_GOVERNORATES.find((g) => g.id === dest.governorate);
              const govName = currentLang === 'ar' ? govInfo?.nameAr : govInfo?.nameEn;

              return (
                <div
                  key={dest.id}
                  className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image Slot with Fallback */}
                  <div className="relative h-56 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={dest.images[0]}
                      alt={dest.nameEn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay for Top Badges */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                    {/* Category Label Overlay */}
                    <div className="absolute top-3 left-3 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {tCategory(dest.category)}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite({
                          id: dest.id,
                          type: 'destination',
                          title: currentLang === 'ar' ? dest.nameAr : dest.nameEn,
                          governorate: govName,
                          image: dest.images[0],
                        });
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav
                          ? 'bg-amber-500 text-white'
                          : 'bg-black/50 text-white hover:bg-black/80'
                      }`}
                      aria-label="Toggle favorite"
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Governorate Tag at bottom of image */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 drop-shadow-sm font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{govName}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Unboxed Metadata (Zero-Pill Discipline) */}
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
                        <span>{dest.historicalPeriod}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold font-cinzel text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                        {currentLang === 'ar' ? dest.nameAr : dest.nameEn}
                      </h3>
                      {currentLang !== 'ar' && (
                        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 font-cairo mb-2 font-medium">
                          {dest.nameAr}
                        </p>
                      )}

                      {/* Description snippet */}
                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mt-1">
                        {currentLang === 'ar' ? dest.descriptionAr : dest.descriptionEn}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span className="truncate max-w-[130px]">{dest.visitingHours.split('(')[0]}</span>
                      </div>

                      <button
                        onClick={() => handleOpenDetails(dest)}
                        className="px-3.5 py-1.5 bg-stone-900 hover:bg-amber-700 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-amber-400 rounded-lg text-xs font-semibold transition-colors"
                      >
                        {t('viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Destination Details Modal */}
      {activeDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="relative h-64 sm:h-80 w-full shrink-0">
              <img
                src={activeDestination.images[0]}
                alt={activeDestination.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-transparent" />

              <button
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsPlayingAudio(false);
                  setActiveDestination(null);
                }}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors z-10"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1.5">
                  <span>{tCategory(activeDestination.category)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeDestination.historicalPeriod}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-white drop-shadow-md">
                  {currentLang === 'ar' ? activeDestination.nameAr : activeDestination.nameEn}
                </h2>
                <div className="text-sm font-cairo text-amber-200 font-medium">
                  {currentLang === 'ar' ? activeDestination.nameEn : activeDestination.nameAr}
                </div>
              </div>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="p-6 overflow-y-auto space-y-6 text-stone-800 dark:text-stone-200">
              {/* Audio Guide Bar */}
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 font-cinzel">
                      Official Audio Guide Narration
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      Spoken historical commentary in {currentLang === 'ar' ? 'العربية' : 'English'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleToggleAudio}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md animate-pulse'
                      : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Play Narration</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-2 font-cinzel">
                  Historical & Architectural Overview
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
                  {currentLang === 'ar' ? activeDestination.descriptionAr : activeDestination.descriptionEn}
                </p>
              </div>

              {/* Visiting Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Visiting Hours</span>
                  </div>
                  <div className="text-xs text-stone-900 dark:text-stone-100 font-medium">
                    {activeDestination.visitingHours}
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
                    <Ticket className="w-4 h-4 text-amber-600" />
                    <span>Admission & Ticket Prices</span>
                  </div>
                  <div className="text-xs text-stone-900 dark:text-stone-100 font-medium">
                    {activeDestination.ticketPrices}
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
                    <Navigation className="w-4 h-4 text-amber-600" />
                    <span>How to Get There</span>
                  </div>
                  <div className="text-xs text-stone-900 dark:text-stone-100 font-medium">
                    {activeDestination.howToGetThere || 'Accessible via taxi, tour convoy, or private transport.'}
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1">
                    <Accessibility className="w-4 h-4 text-amber-600" />
                    <span>Accessibility & Pathways</span>
                  </div>
                  <div className="text-xs text-stone-900 dark:text-stone-100 font-medium">
                    {activeDestination.accessibility || 'Paved paths and guided assistance available.'}
                  </div>
                </div>
              </div>

              {/* Direct Route Navigation Link */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${activeDestination.latitude}&mlon=${activeDestination.longitude}#map=16/${activeDestination.latitude}/${activeDestination.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold hover:underline"
                >
                  <MapPin className="w-4 h-4" />
                  <span>GPS: {activeDestination.latitude.toFixed(4)}, {activeDestination.longitude.toFixed(4)} (Open on Map)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {activeDestination.officialWebsite && (
                  <a
                    href={activeDestination.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                  >
                    <span>Ministry Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Official Verification Footer */}
              <div className="bg-stone-100 dark:bg-stone-800/40 p-3.5 rounded-xl text-xs text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">{t('officialSource')}: </span>
                  <span>{activeDestination.source}</span>
                </div>
                <div>
                  <span className="font-semibold">{t('lastVerified')}: </span>
                  <span className="tabular-nums">{activeDestination.verifiedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
