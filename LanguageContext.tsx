import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageInfo } from '../types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS, CATEGORY_LABELS } from '../data/languages';

interface LanguageContextType {
  currentLang: LanguageCode;
  langInfo: LanguageInfo;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
  tCategory: (catKey: string) => string;
  isRTL: boolean;
  isLangModalOpen: boolean;
  setIsLangModalOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    // 1. Check localStorage
    const saved = localStorage.getItem('egypt_explorer_lang') as LanguageCode;
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }

    // 2. Auto-detect browser language
    try {
      const browserLang = navigator.language.split('-')[0].toLowerCase() as LanguageCode;
      const matched = SUPPORTED_LANGUAGES.find(l => l.code === browserLang);
      if (matched) return matched.code;
    } catch {
      // ignore
    }

    // Default to English
    return 'en';
  });

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Check if first-time visitor to pop open language selection
  useEffect(() => {
    const hasChosen = localStorage.getItem('egypt_explorer_has_chosen_lang');
    if (!hasChosen) {
      setIsLangModalOpen(true);
    }
  }, []);

  const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[1];
  const isRTL = langInfo.dir === 'rtl';

  useEffect(() => {
    // Set document direction and language attribute
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang, isRTL]);

  const setLanguage = (code: LanguageCode) => {
    setCurrentLang(code);
    localStorage.setItem('egypt_explorer_lang', code);
    localStorage.setItem('egypt_explorer_has_chosen_lang', 'true');
  };

  const t = (key: string): string => {
    const entry = UI_TRANSLATIONS[key];
    if (!entry) return key;
    return entry[currentLang] || entry['en'] || key;
  };

  const tCategory = (catKey: string): string => {
    const entry = CATEGORY_LABELS[catKey];
    if (!entry) return catKey;
    return entry[currentLang] || entry['en'] || catKey;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        langInfo,
        setLanguage,
        t,
        tCategory,
        isRTL,
        isLangModalOpen,
        setIsLangModalOpen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
