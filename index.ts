export type LanguageCode =
  | 'ar'
  | 'en'
  | 'de'
  | 'fr'
  | 'es'
  | 'it'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'tr'
  | 'pt'
  | 'ko'
  | 'el'
  | 'nl'
  | 'hi';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export type DestinationCategory =
  | 'archaeological_site'
  | 'temple'
  | 'tomb_pyramid'
  | 'museum'
  | 'islamic_monument'
  | 'coptic_site'
  | 'natural_reserve'
  | 'coastal'
  | 'desert_oasis'
  | 'cultural_entertainment'
  | 'traditional_village';

export interface Destination {
  id: string;
  nameEn: string;
  nameAr: string;
  category: DestinationCategory;
  governorate: string;
  descriptionEn: string;
  descriptionAr: string;
  historicalPeriod: string;
  latitude: number;
  longitude: number;
  address: string;
  visitingHours: string;
  ticketPrices: string;
  officialWebsite?: string;
  audioGuideUrl?: string;
  audioGuideNarrativeEn?: string;
  audioGuideNarrativeAr?: string;
  accessibility?: string;
  howToGetThere?: string;
  relatedAttractions?: string[];
  images: string[];
  featured?: boolean;
  source: string;
  verifiedDate: string;
}

export interface MuseumHighlight {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image?: string;
}

export interface Museum {
  id: string;
  nameEn: string;
  nameAr: string;
  governorate: string;
  descriptionEn: string;
  descriptionAr: string;
  location: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  ticketPrice: string;
  officialWebsite?: string;
  highlights: MuseumHighlight[];
  audioGuideLanguages: string[];
  images: string[];
  featured?: boolean;
  source: string;
  verifiedDate: string;
}

export interface HieroglyphSign {
  gardinerCode: string;
  glyph: string;
  phonetic: string;
  meaningEn: string;
  meaningAr: string;
  category: string;
  descriptionEn: string;
  descriptionAr: string;
  usageExample?: string;
}

export interface HieroglyphLesson {
  id: string;
  titleEn: string;
  titleAr: string;
  summaryEn: string;
  summaryAr: string;
  contentEn: string[];
  contentAr: string[];
  signsShowcase: { glyph: string; code: string; sound: string; meaning: string }[];
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionAr: string;
  glyphPrompt?: string;
  optionsEn: string[];
  optionsAr: string[];
  correctIndex: number;
  explanationEn: string;
  explanationAr: string;
}

export interface HeritageCraft {
  id: string;
  titleEn: string;
  titleAr: string;
  category: 'craft' | 'food' | 'tradition' | 'music';
  regionEn: string;
  regionAr: string;
  descriptionEn: string;
  descriptionAr: string;
  historicalRootsEn: string;
  historicalRootsAr: string;
  artisanInfoEn?: string;
  artisanInfoAr?: string;
  image: string;
}

export interface TouristPhrase {
  category: 'courtesy' | 'hotel' | 'taxi' | 'restaurant' | 'bazaar' | 'emergency';
  english: string;
  arabicScript: string;
  masriPhonetic: string;
  audioText?: string;
}

export interface UserFavorite {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'destination' | 'museum';
  title: string;
  category?: string;
  governorate?: string;
  image?: string;
  createdAt: string;
}
