import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserFavorite } from '../types';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isGuest: boolean;
  isLoading: boolean;
  favorites: UserFavorite[];
  recentlyViewed: { id: string; type: 'destination' | 'museum'; title: string; image?: string; date: string }[];
  signInGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  toggleFavorite: (item: { id: string; type: 'destination' | 'museum'; title: string; governorate?: string; image?: string }) => Promise<void>;
  isFavorite: (id: string) => boolean;
  addRecentlyViewed: (item: { id: string; type: 'destination' | 'museum'; title: string; image?: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('egypt_explorer_guest') === 'true';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<UserFavorite[]>(() => {
    try {
      const saved = localStorage.getItem('egypt_explorer_local_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<
    { id: string; type: 'destination' | 'museum'; title: string; image?: string; date: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem('egypt_explorer_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin email check: fellobater77fero@gmail.com is designated competition author & admin
  const isAdmin = Boolean(
    user?.email?.toLowerCase() === 'fellobater77fero@gmail.com' ||
    (user?.email && user.email.includes('admin'))
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fireUser) => {
      setUser(fireUser);
      setIsLoading(false);

      if (fireUser) {
        setIsGuest(false);
        localStorage.removeItem('egypt_explorer_guest');

        // Sync or register user document
        const userDocRef = doc(db, 'users', fireUser.uid);
        try {
          const userSnap = await getDoc(userDocRef);
          if (!userSnap.exists()) {
            await setDoc(userDocRef, {
              email: fireUser.email || '',
              displayName: fireUser.displayName || 'Explorer',
              photoURL: fireUser.photoURL || '',
              role: fireUser.email?.toLowerCase() === 'fellobater77fero@gmail.com' ? 'admin' : 'user',
              preferredLanguage: localStorage.getItem('egypt_explorer_lang') || 'en',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${fireUser.uid}`);
        }

        // Attach Firestore favorites listener
        const favsPath = `users/${fireUser.uid}/favorites`;
        const favsRef = collection(db, 'users', fireUser.uid, 'favorites');
        const unsubFavs = onSnapshot(
          favsRef,
          (snapshot) => {
            const list: UserFavorite[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...(d.data() as any) });
            });
            setFavorites(list);
            localStorage.setItem('egypt_explorer_local_favorites', JSON.stringify(list));
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, favsPath);
          }
        );

        return () => unsubFavs();
      }
    });

    return () => unsubscribe();
  }, []);

  const signInGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn('Google sign-in completed or cancelled:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('egypt_explorer_guest', 'true');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGuest(true);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const toggleFavorite = async (item: {
    id: string;
    type: 'destination' | 'museum';
    title: string;
    governorate?: string;
    image?: string;
  }) => {
    const existingIndex = favorites.findIndex((f) => f.itemId === item.id);

    if (existingIndex > -1) {
      // Remove
      const newFavs = favorites.filter((f) => f.itemId !== item.id);
      setFavorites(newFavs);
      localStorage.setItem('egypt_explorer_local_favorites', JSON.stringify(newFavs));

      if (user) {
        try {
          await deleteDoc(doc(db, 'users', user.uid, 'favorites', item.id));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/favorites/${item.id}`);
        }
      }
    } else {
      // Add
      const newFav: UserFavorite = {
        id: item.id,
        userId: user ? user.uid : 'guest',
        itemId: item.id,
        itemType: item.type,
        title: item.title,
        governorate: item.governorate,
        image: item.image,
        createdAt: new Date().toISOString(),
      };
      const newFavs = [newFav, ...favorites];
      setFavorites(newFavs);
      localStorage.setItem('egypt_explorer_local_favorites', JSON.stringify(newFavs));

      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid, 'favorites', item.id), newFav);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/favorites/${item.id}`);
        }
      }
    }
  };

  const isFavorite = (id: string): boolean => {
    return favorites.some((f) => f.itemId === id);
  };

  const addRecentlyViewed = (item: { id: string; type: 'destination' | 'museum'; title: string; image?: string }) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      const updated = [
        {
          ...item,
          date: new Date().toLocaleDateString(),
        },
        ...filtered,
      ].slice(0, 10);
      localStorage.setItem('egypt_explorer_recent', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isGuest,
        isLoading,
        favorites,
        recentlyViewed,
        signInGoogle,
        continueAsGuest,
        logout,
        toggleFavorite,
        isFavorite,
        addRecentlyViewed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
