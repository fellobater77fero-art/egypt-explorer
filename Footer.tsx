import React from 'react';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const { currentLang, langInfo, setIsLangModalOpen, t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-3">
            <BrandLogo />
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed mt-2">
              Egypt Explorer is an open, authentic cultural tourism platform dedicated to tourists from all over the world. Documenting 27 governorates, world-class museums, ancient hieroglyphic learning, and living cultural crafts.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified data sources: Ministry of Tourism and Antiquities & UNESCO.</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-cinzel mb-3">
              Explore Egypt
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavClick('directory')} className="hover:text-white transition-colors">
                  {t('navDirectory')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('museums')} className="hover:text-white transition-colors">
                  {t('navMuseums')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('map')} className="hover:text-white transition-colors">
                  {t('navMap')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('hieroglyphs')} className="hover:text-white transition-colors">
                  {t('navHieroglyphs')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('culture')} className="hover:text-white transition-colors">
                  {t('navCulture')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Smart AI Tools & Languages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-cinzel mb-3">
              Smart Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavClick('assistant')} className="hover:text-white transition-colors">
                  {t('navAIAssistant')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('translator')} className="hover:text-white transition-colors">
                  {t('navTranslator')}
                </button>
              </li>
              <li>
                <button onClick={() => setIsLangModalOpen(true)} className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors">
                  <Globe className="w-3.5 h-3.5" />
                  <span>15 Global Languages ({langInfo.nativeName})</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026 Egypt Explorer. Crafted for the Egyptian National Innovation Tourism Competition.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <a
              href="https://egymonuments.gov.eg"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              <span>Ministry Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://whc.unesco.org/en/statesparties/eg"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1"
            >
              <span>UNESCO Sites</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
