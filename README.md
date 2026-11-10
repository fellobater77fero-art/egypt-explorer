# 🇪🇬 Egypt Explorer — Your Smart Guide to Egypt
**Discover • Explore • Experience Egypt**

> National Competition Innovation Project: A full-stack, culturally authentic, verified Egyptian tourism and archaeological heritage platform designed for global travelers.

---

## 🏛️ Project Overview
**Egypt Explorer** is a modern, production-grade web application built to empower global tourists visiting Egypt. It bridges 5,000 years of living history with smart artificial intelligence, geospatial navigation, and an epigraphically grounded Ancient Egyptian Language Center.

### 🌟 Key Pillars
1. **Brand Identity & Royal Visual Constitution**: Custom royal Egyptian seal integrating the Great Pyramids, the Sphinx silhouette, the Ankh (Key of Life), and a modern location pin in royal blue and Egyptian gold.
2. **15 Global Languages with Full RTL Support**: Arabic, English, German, French, Spanish, Italian, Russian, Chinese, Japanese, Turkish, Portuguese, Korean, Greek, Dutch, and Hindi. Seamless auto-detection, instant switching, and Arabic font rendering (`Cairo` + `Cinzel`).
3. **Comprehensive 27-Governorate Tourism Directory**: Categorized into 11 distinct classes (Archaeological sites, Ancient temples, Pyramids & tombs, Museums, Islamic monuments, Coptic heritage & Holy Family path, Natural reserves, Coastal destinations, Desert oases, Cultural entertainment, Heritage villages).
4. **Verified Egyptian Museums Section**: Comprehensive curatorial documentation for the Grand Egyptian Museum (GEM), Egyptian Museum in Tahrir, National Museum of Egyptian Civilization (NMEC), Luxor Museum, Museum of Islamic Art, Coptic Museum, and Nubian Museum with collection highlights, visiting hours, and ticket prices.
5. **Interactive Egypt Map (Leaflet + OpenStreetMap)**: Free, open-source cartographic engine with GPS pins, coordinates, and directions.
6. **Ancient Egyptian Language Center (Hieroglyphics)**:
   - **Hieroglyphic Dictionary**: Browse Gardiner sign codes, phonetics, and meanings.
   - **Royal Cartouche Transliteration**: Type names in English or Arabic to generate phonetic transliterations within a pharaonic golden cartouche loop.
   - **Hieroglyphic Learning & Quizzes**: Structured modules on unilateral signs, ideograms, and determinatives with scoring.
   - **Hieroglyphic Inscription Scanner**: Photo upload with AI epigraphic decipherment and scholarly uncertainty notices.
7. **Egypt AI Guide (Tourist Assistant)**: Conversational travel concierge answering questions in the user's selected language regarding tipping customs (*baksheesh*), etiquette, train bookings, visiting hours, and history.
8. **AI Multilingual Translator**: Dual-language voice-enabled travel translator with speech recognition, Web Speech API text-to-speech, and authentic colloquial Egyptian Masri phrasebooks.
9. **Egyptian Culture & Living Traditions**: Dedicated spotlights on handmade Khayamiya appliqué textiles, Saqqara/Fowa carpets, Qena clay pottery (*Qullah*), Nubian culture, and traditional cuisine (Koshari, Ful, Taameya).
10. **Cloud Firestore & Firebase Authentication**: Role-based access control (RBAC), user profiles, persistent saved favorites, and admin management.
11. **Admin Dashboard**: Secure administrative console for managing destinations, museums, verification dates, and exporting data in JSON.

---

## 🏗️ Technology Stack & Architecture

- **Frontend Framework**: React 19, TypeScript, Vite
- **Styling & Design System**: Tailwind CSS v4, Cinzel serif typography, Cairo Arabic font, Plus Jakarta Sans, Motion
- **Database & Auth**: Google Cloud Firestore & Firebase Authentication (Google Sign-In + Guest Mode)
- **Maps**: Leaflet & OpenStreetMap (Free, open-source, no paid billing required)
- **Artificial Intelligence**: Server-Side Google Gemini API (`gemini-3.8-flash`) via `@google/genai` TypeScript SDK for text, translation, and multimodal inscription analysis
- **Server**: Express / Node.js backend proxy with secure environment variable isolation

---

## 🗄️ Database Architecture (Cloud Firestore)

Defined in `firebase-blueprint.json` and secured by `firestore.rules`:
- `/users/{userId}`: Private user profile, preferred language, role (`user` or `admin`).
- `/users/{userId}/favorites/{favoriteId}`: User saved destinations and museums.
- `/destinations/{destinationId}`: Public verified archaeological sites across Egypt.
- `/museums/{museumId}`: Public museum records, opening hours, ticket rates, collection highlights.
- `/hieroglyphs/{signId}`: Public Gardiner sign dictionary entries.

---

## 🚀 Setup & Local Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables** in `.env`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   PORT=3000
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Production Build & Serving**:
   ```bash
   npm run build
   npm start
   ```

---

## 🧪 Testing Checklist
- [x] Multi-language switching across all 15 languages
- [x] Arabic Right-to-Left (RTL) layout and Cairo typography
- [x] Royal Cartouche name generator with Gardiner phonetic breakdown
- [x] Audio guide narration playback via speech synthesis
- [x] Leaflet OpenStreetMap interactive pins and coordinates
- [x] AI Assistant and AI Translator server-side Gemini API routing with demo fallback
- [x] User favorites and persistent state sync
- [x] Admin console permissions and export functionality
