import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Bookmark,
  Clock,
  LogOut,
  Globe,
  Shield,
  X,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (id: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectDestination,
}) => {
  const { user, isAdmin, isGuest, favorites, recentlyViewed, signInGoogle, continueAsGuest, logout, toggleFavorite } =
    useAuth();
  const { currentLang, langInfo, setIsLangModalOpen, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              {user ? (
                user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.displayName?.charAt(0) || 'U'
                )
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-cinzel text-stone-900 dark:text-stone-100">
                  {user ? user.displayName || 'Explorer' : 'Guest Explorer'}
                </h3>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-md flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-500">{user?.email || 'Public explorer session'}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Auth Status & Login Action if guest */}
          {!user && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-1 font-cinzel">
                Sign in with Google
              </h4>
              <p className="text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">
                Sync your favorite destinations, custom travel itineraries, and hieroglyphic cartouches across all your devices with Cloud Firestore.
              </p>
              <button
                onClick={signInGoogle}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>{t('loginWithGoogle')}</span>
              </button>
            </div>
          )}

          {/* User Settings Strip */}
          <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-600" />
              <span>Language Preference:</span>
              <span className="font-bold text-stone-900 dark:text-stone-100">
                {langInfo.flag} {langInfo.nativeName}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                setIsLangModalOpen(true);
              }}
              className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
            >
              Change
            </button>
          </div>

          {/* Saved Favorites Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-cinzel flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Saved Favorites ({favorites.length})</span>
              </h4>
            </div>

            {favorites.length === 0 ? (
              <div className="p-6 text-center bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-100 dark:border-stone-800 text-stone-400">
                No saved places yet. Click the bookmark icon on any destination or museum to save it here.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    onClick={() => {
                      onSelectDestination(fav.itemId);
                      onClose();
                    }}
                    className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200/70 dark:border-stone-700 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-800 dark:text-amber-300 font-bold">
                        {fav.itemType === 'museum' ? '🏛️' : '𓉐'}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-stone-100">{fav.title}</div>
                        <div className="text-[10px] text-stone-400 capitalize">{fav.governorate}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite({ id: fav.itemId, type: fav.itemType, title: fav.title });
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recently Viewed Places */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-cinzel mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Recently Viewed ({recentlyViewed.length})</span>
            </h4>

            {recentlyViewed.length === 0 ? (
              <div className="text-stone-400 text-center py-4">No recent browsing history.</div>
            ) : (
              <div className="space-y-1.5">
                {recentlyViewed.map((recent) => (
                  <div
                    key={recent.id}
                    onClick={() => {
                      onSelectDestination(recent.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer text-stone-700 dark:text-stone-300 transition-colors"
                  >
                    <span className="font-medium truncate">{recent.title}</span>
                    <span className="text-[10px] text-stone-400 tabular-nums">{recent.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        {user && (
          <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-900 flex justify-end">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl font-semibold transition-colors text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
