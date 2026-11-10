import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationsDirectory } from './components/DestinationsDirectory';
import { MuseumsSection } from './components/MuseumsSection';
import { InteractiveMap } from './components/InteractiveMap';
import { HieroglyphicsCenter } from './components/HieroglyphicsCenter';
import { AITouristAssistant } from './components/AITouristAssistant';
import { AITranslator } from './components/AITranslator';
import { CultureHeritageSection } from './components/CultureHeritageSection';
import { AdminDashboard } from './components/AdminDashboard';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Footer } from './components/Footer';
import { Compass, Landmark, Sparkles, MapPin, ArrowRight, BookOpen } from 'lucide-react';
import { VERIFIED_DESTINATIONS } from './data/destinations';

const AppContent: React.FC = () => {
  const { currentLang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveTab('directory');
    }
  };

  const handleSelectDestination = (id: string) => {
    setActiveTab('directory');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Section with Search and Trust Strip */}
            <HeroSection
              onSearch={handleHeroSearch}
              searchQuery={searchQuery}
              onExplore={setActiveTab}
            />

            {/* Featured Attractions Showcase */}
            <section className="py-16 bg-white dark:bg-stone-900 border-b border-stone-200/60 dark:border-stone-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 font-cinzel">
                      Curated National Highlights
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
                      Must-Visit Egyptian Wonders
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 transition-colors"
                  >
                    <span>View All 27 Governorates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {VERIFIED_DESTINATIONS.slice(0, 3).map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => setActiveTab('directory')}
                      className="group bg-stone-50 dark:bg-stone-950 rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative h-56 w-full overflow-hidden">
                        <img
                          src={dest.images[0]}
                          alt={dest.nameEn}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span className="capitalize">{dest.governorate}</span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-base font-bold font-cinzel text-stone-900 dark:text-stone-100 group-hover:text-amber-700 transition-colors">
                          {currentLang === 'ar' ? dest.nameAr : dest.nameEn}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-2 leading-relaxed">
                          {currentLang === 'ar' ? dest.descriptionAr : dest.descriptionEn}
                        </p>
                        <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-semibold">
                          <span>Explore Details & Audio Guide</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Hieroglyphics Spotlight Tease */}
            <section className="py-16 bg-stone-950 text-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 font-cinzel">
                      <span>𓋹</span>
                      <span>Ancient Egyptian Language Center</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-white leading-tight">
                      Write Your Name in Hieroglyphs Inside a Pharaonic Cartouche
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                      Experience the sacred script of ancient Egypt. Enter your name in English or Arabic to generate its Gardiner phonetic transliteration inside a royal protective cartouche.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab('hieroglyphs')}
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg"
                      >
                        Enter Language Center
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center">
                    <div className="royal-cartouche px-8 py-6 w-72 text-center text-stone-900 shadow-2xl">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-amber-800 mb-1">
                        ROYAL CARTOUCHE
                      </div>
                      <div className="text-4xl sm:text-5xl my-2 text-amber-950 font-serif">
                        𓂋𓄿𓅓𓋴𓋴
                      </div>
                      <div className="text-xs font-cinzel font-bold text-amber-900">
                        RAMSES
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Interactive Map Teaser */}
            <section className="py-16 bg-white dark:bg-stone-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 font-cinzel">
                    Geospatial Discovery
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
                    Interactive Map of Egypt
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2">
                    OpenStreetMap engine with exact coordinates for historical monuments, pyramids, temples, and museums across Egypt.
                  </p>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="mt-4 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Open Fullscreen Interactive Map
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'directory' && (
          <DestinationsDirectory searchQuery={searchQuery} />
        )}

        {activeTab === 'museums' && <MuseumsSection />}

        {activeTab === 'map' && <InteractiveMap />}

        {activeTab === 'hieroglyphs' && <HieroglyphicsCenter />}

        {activeTab === 'assistant' && <AITouristAssistant />}

        {activeTab === 'translator' && <AITranslator />}

        {activeTab === 'culture' && <CultureHeritageSection />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer onNavClick={setActiveTab} />

      {/* 15 Languages Selection Modal */}
      <LanguageSelectorModal />

      {/* User Profile & Favorites Modal */}
      <UserProfileModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectDestination={handleSelectDestination}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
