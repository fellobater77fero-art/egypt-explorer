import React, { useState, useRef } from 'react';
import {
  HIEROGLYPHIC_DICTIONARY,
  HIEROGLYPHIC_LESSONS,
  HIEROGLYPH_QUIZ,
  transliterateNameToHieroglyphs,
} from '../data/hieroglyphs';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  Camera,
  Search,
  Sparkles,
  Download,
  Copy,
  Check,
  HelpCircle,
  Award,
  AlertTriangle,
  Upload,
  RefreshCw,
  Info,
} from 'lucide-react';

export const HieroglyphicsCenter: React.FC = () => {
  const { currentLang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dictionary' | 'cartouche' | 'learning' | 'scanner'>('cartouche');

  // Cartouche Transliteration state
  const [inputName, setInputName] = useState<string>('Ramses');
  const [copied, setCopied] = useState<boolean>(false);

  // Dictionary Search state
  const [dictSearch, setDictSearch] = useState<string>('');
  const [dictCategory, setDictCategory] = useState<string>('all');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Scanner state
  const [scannerImage, setScannerImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute transliteration
  const { glyphs, breakdown } = transliterateNameToHieroglyphs(inputName);

  const handleCopyCartouche = () => {
    navigator.clipboard.writeText(glyphs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter dictionary
  const filteredSigns = HIEROGLYPHIC_DICTIONARY.filter((sign) => {
    if (dictCategory !== 'all' && !sign.category.includes(dictCategory)) return false;
    if (dictSearch.trim()) {
      const q = dictSearch.toLowerCase();
      const matchCode = sign.gardinerCode.toLowerCase().includes(q);
      const matchPhonetic = sign.phonetic.toLowerCase().includes(q);
      const matchEn = sign.meaningEn.toLowerCase().includes(q);
      const matchAr = sign.meaningAr.includes(q);
      return matchCode || matchPhonetic || matchEn || matchAr;
    }
    return true;
  });

  // Handle Image Upload for Hieroglyphic Scanner
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setScannerImage(base64);
      setScanResult(null);
      setIsScanning(true);

      try {
        const res = await fetch('/api/gemini/hieroglyph', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, mimeType: file.type }),
        });
        const data = await res.json();
        setScanResult(data.analysis || 'Analysis completed with inconclusive findings.');
      } catch (err) {
        console.error('Scan error:', err);
        setScanResult('Error connecting to recognition backend. Please inspect image clarity or retry.');
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Calculate Quiz Score
  const calculateScore = () => {
    let score = 0;
    HIEROGLYPH_QUIZ.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <section className="py-12 bg-stone-50 dark:bg-stone-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 font-cinzel">
            <span className="text-base">𓋹</span>
            <span>Ancient Egyptian Language Center · Medu Neter</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
            {t('navHieroglyphs')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
            Discover the sacred writing of ancient Egypt: Gardiner sign codes, phonetics, royal cartouches, interactive lessons, and AI inscription analysis.
          </p>

          {/* Segmented Feature Tabs */}
          <div className="mt-8 inline-flex p-1 bg-stone-200/80 dark:bg-stone-800/90 rounded-2xl shadow-inner max-w-full overflow-x-auto">
            <button
              onClick={() => setActiveTab('cartouche')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'cartouche'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <span>𓍹𓍺</span>
              <span>Royal Cartouche</span>
            </button>
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'dictionary'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Hieroglyphic Dictionary</span>
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'learning'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Lessons & Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'scanner'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Inscription Scanner</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ROYAL CARTOUCHE TRANSLITERATION */}
        {activeTab === 'cartouche' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-xl">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
                  {t('transliterateNameTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-2">
                  Enter any modern name in English or Arabic to generate its Gardiner phonetic transliteration inside a pharaonic golden cartouche loop.
                </p>

                {/* Input box */}
                <div className="mt-6 flex items-center gap-3">
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Enter your name (e.g. Ramses, Cleopatra, فاطمة, Sarah)..."
                    maxLength={20}
                    className="w-full px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold focus:outline-none focus:border-amber-500 text-center text-lg"
                  />
                  {inputName && (
                    <button
                      onClick={() => setInputName('')}
                      className="px-3 py-3 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* The Royal Golden Cartouche Display */}
              <div className="flex flex-col items-center justify-center py-6">
                <div className="royal-cartouche px-10 py-8 min-w-[260px] max-w-[480px] flex flex-col items-center justify-center text-center shadow-2xl transition-all">
                  {/* Decorative Solar Disc on top of Cartouche */}
                  <div className="w-6 h-6 rounded-full bg-amber-400/80 mb-2 border border-amber-600/50 flex items-center justify-center shadow-inner">
                    <span className="text-[10px] text-amber-900">𓇳</span>
                  </div>

                  {/* Hieroglyphic Glyphs inside Cartouche */}
                  <div className="text-4xl sm:text-6xl text-amber-950 font-serif tracking-widest my-3 select-all drop-shadow-sm flex flex-wrap justify-center gap-1">
                    {glyphs || '𓀀'}
                  </div>

                  {/* Modern Name label */}
                  <div className="text-xs uppercase font-cinzel tracking-widest text-amber-800/90 font-bold border-t border-amber-600/30 pt-2 px-4">
                    {inputName || 'PHARAOH'}
                  </div>
                </div>

                {/* Copy / Save Actions */}
                <div className="flex items-center gap-3 mt-8">
                  <button
                    onClick={handleCopyCartouche}
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 hover:bg-amber-700 dark:hover:bg-amber-400 text-white dark:text-stone-900 text-xs font-semibold rounded-xl transition-colors shadow-md"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Hieroglyphs'}</span>
                  </button>
                </div>
              </div>

              {/* Phonetic Breakdown Table */}
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 font-cinzel">
                  Gardiner Phonetic Sign Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/60 dark:border-stone-800 text-center"
                    >
                      <div className="text-2xl text-stone-900 dark:text-stone-100 mb-1">{item.glyph}</div>
                      <div className="text-xs font-bold text-amber-700 dark:text-amber-400">{item.code}</div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        "{item.char}" = {item.sound}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crucial Scholarly Accuracy Note */}
              <div className="mt-6 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Historical Accuracy Mandate: </span>
                  {t('scholarlyDisclaimer')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HIEROGLYPHIC DICTIONARY */}
        {activeTab === 'dictionary' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search and Category Filter Bar */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  value={dictSearch}
                  onChange={(e) => setDictSearch(e.target.value)}
                  placeholder="Search code (S34, R8), sound, or meaning..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-stone-100 dark:bg-stone-800 rounded-xl border border-transparent focus:border-amber-500 focus:outline-none text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="text-xs text-stone-500 dark:text-stone-400">
                Documented Gardiner Signs: <span className="font-bold text-stone-900 dark:text-stone-100 tabular-nums">{filteredSigns.length}</span>
              </div>
            </div>

            {/* Dictionary Sign Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSigns.map((sign) => (
                <div
                  key={sign.gardinerCode}
                  className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold font-cinzel rounded-md">
                        {sign.gardinerCode}
                      </span>
                      <span className="text-[11px] text-stone-400">{sign.category}</span>
                    </div>

                    <div className="flex items-center gap-4 my-2">
                      <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-4xl text-stone-900 dark:text-stone-100 select-all shadow-inner">
                        {sign.glyph}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-amber-700 dark:text-amber-400 font-serif">
                          {sign.phonetic}
                        </div>
                        <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {currentLang === 'ar' ? sign.meaningAr : sign.meaningEn}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                      {currentLang === 'ar' ? sign.descriptionAr : sign.descriptionEn}
                    </p>
                  </div>

                  {sign.usageExample && (
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      Example: {sign.usageExample}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HIEROGLYPHIC LEARNING & QUIZZES */}
        {activeTab === 'learning' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
            {/* Interactive Lessons */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
                Interactive Hieroglyphic Curricular Modules
              </h3>
              {HIEROGLYPHIC_LESSONS.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm"
                >
                  <h4 className="text-lg font-bold font-cinzel text-amber-700 dark:text-amber-400 mb-2">
                    {currentLang === 'ar' ? lesson.titleAr : lesson.titleEn}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-stone-500 dark:text-stone-400 mb-4">
                    {currentLang === 'ar' ? lesson.summaryAr : lesson.summaryEn}
                  </p>

                  <div className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-5">
                    {(currentLang === 'ar' ? lesson.contentAr : lesson.contentEn).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {/* Sign Showcase in lesson */}
                  <div className="flex flex-wrap gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                    {lesson.signsShowcase.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/70 rounded-xl border border-stone-200/80 dark:border-stone-700 text-xs"
                      >
                        <span className="text-xl">{s.glyph}</span>
                        <div>
                          <span className="font-bold text-amber-700 dark:text-amber-400">{s.code}</span>
                          <span className="text-stone-500"> ({s.sound}) - {s.meaning}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Quiz */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
                    Hieroglyphics Proficiency Quiz
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Test your understanding of Gardiner codes, cartouches, and decipherment.
                  </p>
                </div>
                {quizSubmitted && (
                  <div className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold tabular-nums">
                    Score: {calculateScore()} / {HIEROGLYPH_QUIZ.length}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {HIEROGLYPH_QUIZ.map((q, qIndex) => {
                  const selected = quizAnswers[q.id];
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/70 dark:border-stone-800"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {currentLang === 'ar' ? q.questionAr : q.questionEn}
                          </div>
                          {q.glyphPrompt && (
                            <div className="text-4xl my-2 text-amber-600">{q.glyphPrompt}</div>
                          )}
                        </div>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        {(currentLang === 'ar' ? q.optionsAr : q.optionsEn).map((opt, optIdx) => {
                          let optStyle = 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900';
                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                            } else if (selected === optIdx) {
                              optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                            }
                          } else if (selected === optIdx) {
                            optStyle = 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${optStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation when submitted */}
                      {quizSubmitted && (
                        <div className="mt-3 pt-3 border-t border-stone-200/80 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300">
                          <span className="font-bold text-amber-700 dark:text-amber-400">Explanation: </span>
                          {currentLang === 'ar' ? q.explanationAr : q.explanationEn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Quiz button */}
              <div className="mt-6 flex items-center justify-between">
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length === 0}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                  >
                    Submit Quiz & See Evaluation
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl text-xs font-semibold"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retake Quiz</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HIEROGLYPHIC INSCRIPTION SCANNER */}
        {activeTab === 'scanner' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl">
              <div className="text-center max-w-lg mx-auto mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
                  Inscription & Stele Scanner
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                  Upload a photograph of an ancient Egyptian wall relief, papyrus, or stele to analyze visible hieroglyphic signs with epigraphic intelligence.
                </p>
              </div>

              {/* Upload Dropzone */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-stone-800/40"
              >
                {scannerImage ? (
                  <div className="relative max-h-72 w-full overflow-hidden rounded-xl inline-block">
                    <img src={scannerImage} alt="Uploaded inscription" className="max-h-72 mx-auto object-contain" />
                    <div className="text-xs text-amber-600 font-semibold mt-2">
                      Click to upload different photo
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                    <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                      Upload Inscription Image
                    </div>
                    <div className="text-xs text-stone-400">
                      Supports JPG, PNG, WEBP (Temple relief, papyrus, tomb carving)
                    </div>
                  </div>
                )}
              </div>

              {/* Scanning status */}
              {isScanning && (
                <div className="py-6 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-amber-600 animate-spin mx-auto" />
                  <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Consulting Gardiner epigraphic database...
                  </div>
                </div>
              )}

              {/* Scan Results */}
              {scanResult && !isScanning && (
                <div className="mt-6 p-5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-cinzel mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Epigraphic Decipherment Report</span>
                  </div>
                  <div className="prose dark:prose-invert text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                    {scanResult}
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-[11px] text-stone-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Scholarly Note: Weathered relief readings require verification against physical squeeze casts.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
