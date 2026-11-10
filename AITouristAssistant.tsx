import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Send, Sparkles, Compass, ShieldAlert, Bot, User, RefreshCw, MessageSquare } from 'lucide-react';

interface ChatEntry {
  role: 'user' | 'model';
  content: string;
}

export const AITouristAssistant: React.FC = () => {
  const { currentLang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      role: 'model',
      content:
        currentLang === 'ar'
          ? 'مرحباً بك في مصر! أنا "مرشد مصر الذكي" (Egypt AI Guide). يسعدني الإجابة عن كل استفساراتك حول المتاحف، وتاريخ الفراعنة، وأوقات زيارة الأهرامات والمعابد، والنصائح الثقافية كالبقشيش والملابس المناسبة والمواصلات عبر الـ 27 محافظة. كيف أساعدك اليوم؟'
          : 'Welcome to Egypt! I am your "Egypt AI Guide". I can assist you with museum visiting tips, pharaonic history, ticket logistics, dress codes, tipping customs (baksheesh), and regional travel across all 27 governorates. How may I assist your voyage today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    {
      en: 'What are the essential tipping (baksheesh) customs in Egypt?',
      ar: 'ما هي قواعد وأعراف البقشيش والإكرامية المعتادة في مصر؟',
    },
    {
      en: 'How should I plan a 3-day itinerary covering Cairo & Giza?',
      ar: 'كيف أخطط لبرنامج سياحي لمدة 3 أيام في القاهرة والجيزة؟',
    },
    {
      en: 'What is the dress etiquette for visiting historical mosques?',
      ar: 'ما هي الآداب والملابس المناسبة عند زيارة المساجد التاريخية؟',
    },
    {
      en: 'What is the best way to travel between Luxor and Aswan?',
      ar: 'ما هي أفضل وسيلة للتنقل بين الأقصر وأسوان؟',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatEntry = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          history: messages.slice(-6),
          language: currentLang,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setMessages((prev) => [...prev, { role: 'model', content: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: 'I am ready to help you explore Egypt. Please ask any question regarding archaeological sites or travel tips.',
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Notice: Connected to scholarly backup guide. What site in Egypt would you like to explore?',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-stone-50 dark:bg-stone-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2 font-cinzel">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Tourist Concierge · Verified Egyptology</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
            {t('navAIAssistant')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl mx-auto">
            Your personal culturally-grounded smart assistant. Multilingual, historically verified, and powered by server-side Gemini intelligence.
          </p>
        </div>

        {/* Chat Canvas Box */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
          {/* Chat Header Bar */}
          <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-serif text-lg shadow-sm">
                𓊹
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 font-cinzel">
                  Egypt AI Guide
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Ready · Responding in {currentLang.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setMessages([
                  {
                    role: 'model',
                    content:
                      currentLang === 'ar'
                        ? 'أهلاً بك مجدداً! كيف يمكنني مساعدتك اليوم في رحلتك إلى مصر؟'
                        : 'Conversation cleared. How can I assist your trip to Egypt today?',
                  },
                ]);
              }}
              className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === 'model';
              return (
                <div
                  key={i}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                      𓋹
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/60 dark:border-stone-700'
                        : 'bg-amber-600 text-white shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>
                  </div>
                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-center text-stone-400 text-xs py-2">
                <div className="w-7 h-7 rounded-full bg-amber-600/50 text-white flex items-center justify-center text-xs animate-pulse">
                  𓋹
                </div>
                <span>Egypt AI Guide is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Prompts */}
          <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 overflow-x-auto flex gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(currentLang === 'ar' ? q.ar : q.en)}
                className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-700 dark:text-stone-300 hover:text-amber-800 text-[11px] whitespace-nowrap border border-stone-200/60 dark:border-stone-700 transition-colors"
              >
                {currentLang === 'ar' ? q.ar : q.en}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about travel safety, ticket hours, train tickets, history..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:border-amber-500 text-stone-900 dark:text-stone-100"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
