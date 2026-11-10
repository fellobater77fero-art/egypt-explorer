import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { LanguageCode } from '../types';
import { Globe, Search, Check, X } from 'lucide-react';

export const LanguageSelectorModal: React.FC = () => {
  const { currentLang, setLanguage, isLangModalOpen, setIsLangModalOpen, t } = useLanguage();
  const [search, setSearch] = useState('');

  if (!isLangModalOpen) return null;

  const filtered = SUPPORTED_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsLangModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 font-cinzel">
                {t('selectLanguage')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Choose your native language / اختر لغتك المفضلة (15 Languages)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLangModalOpen(false)}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language / ابحث عن لغة (e.g. Arabic, English, Deutsch, 中文)..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-transparent focus:border-amber-400 focus:bg-white dark:focus:bg-stone-800 outline-none transition-all text-stone-900 dark:text-stone-100"
              autoFocus
            />
          </div>
        </div>

        {/* List of Languages */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                    : 'border-stone-200/80 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700/60 hover:bg-stone-50 dark:hover:bg-stone-800/50 text-stone-800 dark:text-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{lang.nativeName}</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      {lang.name} {lang.dir === 'rtl' ? '· RTL' : ''}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400">
          Full Right-to-Left (RTL) typography supported for Arabic. Automatic font switching applied.
        </div>
      </div>
    </div>
  );
};
