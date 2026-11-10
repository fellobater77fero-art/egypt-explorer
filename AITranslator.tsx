import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { TOURIST_PHRASES } from '../data/phrases';
import { LanguageCode } from '../types';
import {
  Languages,
  ArrowRightLeft,
  Volume2,
  Copy,
  Check,
  Sparkles,
  Mic,
  MicOff,
  BookMarked,
  Share2,
} from 'lucide-react';

export const AITranslator: React.FC = () => {
  const { currentLang, t } = useLanguage();
  const [fromLang, setFromLang] = useState<LanguageCode>('en');
  const [toLang, setToLang] = useState<LanguageCode>('ar');
  const [inputText, setInputText] = useState('How much is the ticket to the Grand Egyptian Museum?');
  const [translatedText, setTranslatedText] = useState('بكام تذكرة دخول المتحف المصري الكبير؟ (Bikam tazkarat dokhool el-Mathaf el-Masri el-Kibeer?)');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activePhraseCategory, setActivePhraseCategory] = useState<string>('all');
  const [translationMode, setTranslationMode] = useState<'live' | 'demo'>('live');

  const handleSwap = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInputText(translatedText.split('(')[0].trim());
    setTranslatedText('');
  };

  const handleTranslate = async (overrideText?: string) => {
    const textToRun = overrideText || inputText;
    if (!textToRun.trim() || isTranslating) return;

    setIsTranslating(true);
    try {
      const res = await fetch('/api/gemini/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToRun,
          fromLang,
          toLang,
        }),
      });
      const data = await res.json();
      setTranslatedText(data.translatedText || '');
      if (data.mode) setTranslationMode(data.mode);
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedText('Translation unavailable. Please verify network connectivity.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'ar' ? 'ar-EG' : langCode === 'de' ? 'de-DE' : langCode === 'fr' ? 'fr-FR' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Speech Recognition (Voice Input)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser version.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = fromLang === 'ar' ? 'ar-EG' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setInputText(spoken);
        setIsListening(false);
        handleTranslate(spoken);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const filteredPhrases = TOURIST_PHRASES.filter(
    (p) => activePhraseCategory === 'all' || p.category === activePhraseCategory
  );

  return (
    <section className="py-12 bg-stone-50 dark:bg-stone-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 font-cinzel">
            <Languages className="w-4 h-4" />
            <span>Smart Neural Travel Translator · Egyptian Masri & Standard Arabic</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
            {t('navTranslator')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-lg mx-auto">
            Accurate tourist translations with Egyptian colloquial dialect (Masri) phonetic guides, audio pronunciation, and essential phrasebooks.
          </p>
        </div>

        {/* Translation Studio Container */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden mb-12">
          {/* Language Selector Bar */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 flex items-center justify-between gap-3">
            {/* From Lang */}
            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value as LanguageCode)}
              className="py-2 px-3 text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
              title="Swap Languages"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* To Lang */}
            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value as LanguageCode)}
              className="py-2 px-3 text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Dual Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x dark:divide-stone-800">
            {/* Input Box */}
            <div className="p-5 flex flex-col justify-between min-h-[220px]">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste phrase to translate..."
                className="w-full h-32 bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(inputText, fromLang)}
                    disabled={!inputText.trim()}
                    className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40"
                    title="Pronounce text"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                    title="Voice dictation"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={() => handleTranslate()}
                  disabled={!inputText.trim() || isTranslating}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  {isTranslating ? 'Translating...' : 'Translate'}
                </button>
              </div>
            </div>

            {/* Translation Output Box */}
            <div className="p-5 flex flex-col justify-between min-h-[220px] bg-stone-50/50 dark:bg-stone-900/40">
              <div>
                <div className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center justify-between">
                  <span>Translation ({toLang.toUpperCase()})</span>
                  {translationMode === 'demo' && (
                    <span className="text-[10px] text-stone-400 font-normal">
                      Verified Tourist Phrasebook
                    </span>
                  )}
                </div>
                <div className="text-base sm:text-lg font-medium text-stone-900 dark:text-stone-100 select-all whitespace-pre-wrap leading-relaxed">
                  {translatedText || <span className="text-stone-400 text-sm">Translation will appear here...</span>}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                <button
                  onClick={() => handleSpeak(translatedText.split('(')[0], toLang)}
                  disabled={!translatedText}
                  className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40"
                  title="Speak translation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!translatedText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 text-xs font-medium disabled:opacity-40"
                  title="Copy translation"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tourist Emergency & Everyday Phrasebook */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-cinzel text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-amber-600" />
              <span>Essential Egyptian Travel Phrasebook</span>
            </h3>

            {/* Category tabs */}
            <div className="flex gap-1 overflow-x-auto text-xs">
              {['all', 'courtesy', 'taxi', 'hotel', 'restaurant', 'bazaar', 'emergency'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActivePhraseCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    activePhraseCategory === cat
                      ? 'bg-amber-600 text-white font-medium'
                      : 'bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPhrases.map((phrase, i) => (
              <div
                key={i}
                onClick={() => {
                  setInputText(phrase.english);
                  setTranslatedText(`${phrase.arabicScript} (${phrase.masriPhonetic})`);
                }}
                className="p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                    {phrase.english}
                  </div>
                  <div className="text-sm font-bold text-amber-800 dark:text-amber-300 font-cairo mt-1">
                    {phrase.arabicScript}
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                    {phrase.masriPhonetic}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400 capitalize">{phrase.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(phrase.audioText || phrase.arabicScript, 'ar');
                    }}
                    className="p-1 hover:text-amber-600 text-stone-400"
                    title="Audio"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
