import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Globe, User as UserIcon, Shield, Menu, X, Bookmark } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { langInfo, setIsLangModalOpen, t } = useLanguage();
  const { user, isAdmin, favorites } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', labelKey: 'navHome' },
    { id: 'directory', labelKey: 'navDirectory' },
    { id: 'museums', labelKey: 'navMuseums' },
    { id: 'map', labelKey: 'navMap' },
    { id: 'hieroglyphs', labelKey: 'navHieroglyphs' },
    { id: 'assistant', labelKey: 'navAIAssistant' },
    { id: 'translator', labelKey: 'navTranslator' },
    { id: 'culture', labelKey: 'navCulture' },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', labelKey: 'navAdmin' });
  }

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 lg:gap-8">
          {/* Zone 1: Brand Wordmark (Single line element) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-none shrink-0"
          >
            <BrandLogo />
          </button>

          {/* Zone 2: Navigation Links (Single line, text-led, no pills) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-amber-800 dark:text-amber-400 font-semibold'
                      : 'hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {t(item.labelKey)}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language trigger, Saved favorites, Account) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Language Selector Button */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 rounded-lg border border-stone-200/60 dark:border-stone-700/60 transition-colors"
              title="Change Language (15 Available)"
            >
              <span className="text-base leading-none">{langInfo.flag}</span>
              <span className="hidden sm:inline whitespace-nowrap">{langInfo.nativeName}</span>
              <Globe className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Saved items quick indicator */}
            <button
              onClick={onOpenAuth}
              className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              title="Saved Favorites"
            >
              <Bookmark className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* User Account / Sign In */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                user
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                  : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200'
              }`}
            >
              {isAdmin ? (
                <Shield className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <UserIcon className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline whitespace-nowrap">
                {user ? user.displayName?.split(' ')[0] || 'Profile' : t('loginWithGoogle')}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-lg"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 dark:border-stone-800 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-2.5 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
