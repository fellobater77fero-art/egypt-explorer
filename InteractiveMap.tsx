import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { VERIFIED_DESTINATIONS } from '../data/destinations';
import { VERIFIED_MUSEUMS } from '../data/museums';
import { ALL_GOVERNORATES } from '../data/governorates';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Compass, Layers, ExternalLink, Navigation, Search } from 'lucide-react';

export const InteractiveMap: React.FC = () => {
  const { currentLang, t, tCategory } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterGov, setFilterGov] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'destinations' | 'museums'>('all');
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Egypt geographic center: Lat 26.8206, Lon 30.8025
    const map = L.map(mapContainerRef.current, {
      center: [26.8206, 30.8025],
      zoom: 6,
      minZoom: 5,
      maxZoom: 18,
      scrollWheelZoom: true,
    });

    // OpenStreetMap free tile server
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | Egypt Explorer',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers whenever filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Custom Egyptian Gold & Royal Blue Marker Icon generator
    const createCustomIcon = (isMuseum: boolean) => {
      const bgColor = isMuseum ? '#0f2b5c' : '#c59b27';
      const borderColor = isMuseum ? '#e0b84c' : '#0f2b5c';
      const iconSymbol = isMuseum ? '🏛️' : '𓉐';

      return L.divIcon({
        className: 'custom-egypt-marker',
        html: `
          <div style="
            background: ${bgColor};
            color: #fff;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid ${borderColor};
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ">
            <span style="transform: rotate(45deg); font-size: 14px; line-height: 1;">${iconSymbol}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    };

    // 1. Destinations
    if (filterType === 'all' || filterType === 'destinations') {
      VERIFIED_DESTINATIONS.forEach((dest) => {
        if (filterGov !== 'all' && dest.governorate !== filterGov) return;

        const marker = L.marker([dest.latitude, dest.longitude], {
          icon: createCustomIcon(false),
        });

        marker.on('click', () => {
          setSelectedPlace({ ...dest, isMuseum: false });
        });

        const title = currentLang === 'ar' ? dest.nameAr : dest.nameEn;
        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px;">
            <div style="font-size: 10px; color: #b45309; font-weight: bold; text-transform: uppercase;">
              ${tCategory(dest.category)} · ${dest.governorate}
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #1c1917; margin: 2px 0;">
              ${title}
            </div>
            <div style="font-size: 11px; color: #78716c;">
              ${dest.visitingHours.split('(')[0]}
            </div>
          </div>
        `);

        markersLayerRef.current?.addLayer(marker);
      });
    }

    // 2. Museums
    if (filterType === 'all' || filterType === 'museums') {
      VERIFIED_MUSEUMS.forEach((museum) => {
        if (filterGov !== 'all' && museum.governorate !== filterGov) return;

        const marker = L.marker([museum.latitude, museum.longitude], {
          icon: createCustomIcon(true),
        });

        marker.on('click', () => {
          setSelectedPlace({ ...museum, isMuseum: true });
        });

        const title = currentLang === 'ar' ? museum.nameAr : museum.nameEn;
        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 180px;">
            <div style="font-size: 10px; color: #1e3a8a; font-weight: bold; text-transform: uppercase;">
              Museum · ${museum.governorate}
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #1c1917; margin: 2px 0;">
              ${title}
            </div>
            <div style="font-size: 11px; color: #78716c;">
              ${museum.openingHours.split('(')[0]}
            </div>
          </div>
        `);

        markersLayerRef.current?.addLayer(marker);
      });
    }
  }, [filterGov, filterType, currentLang]);

  // Fly to selected place
  const handleSelectFlyTo = (place: any) => {
    setSelectedPlace(place);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.latitude, place.longitude], 13, { duration: 1.5 });
    }
  };

  return (
    <section className="py-10 bg-stone-50 dark:bg-stone-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5 font-cinzel">
              <Compass className="w-4 h-4" />
              <span>Cartographic Tourism Engine · OpenStreetMap</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
              {t('navMap')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Interactive map of Egypt with verified GPS coordinates for archaeological sites, pyramids, temples, and national museums.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by type */}
            <div className="flex items-center bg-stone-200/80 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'all'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                All Sites
              </button>
              <button
                onClick={() => setFilterType('destinations')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'destinations'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Antiquities (𓉐)
              </button>
              <button
                onClick={() => setFilterType('museums')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === 'museums'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Museums (🏛️)
              </button>
            </div>

            {/* Filter by Governorate */}
            <select
              value={filterGov}
              onChange={(e) => setFilterGov(e.target.value)}
              className="py-1.5 px-3 text-xs bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
            >
              <option value="all">All Governorates (27)</option>
              {ALL_GOVERNORATES.map((g) => (
                <option key={g.id} value={g.id}>
                  {currentLang === 'ar' ? g.nameAr : g.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Map & Sidebar Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-lg p-2 sm:p-4">
          {/* Main Map Canvas */}
          <div className="lg:col-span-8 h-[500px] sm:h-[600px] rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 relative z-0">
            <div ref={mapContainerRef} className="w-full h-full" />
          </div>

          {/* Places Quick Sidebar */}
          <div className="lg:col-span-4 flex flex-col h-[500px] sm:h-[600px]">
            <div className="p-3 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-cinzel">
                Map Locations
              </span>
              <span className="text-xs text-stone-400">
                Click pin or row to navigate
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {/* Selected Place Card if active */}
              {selectedPlace && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl mb-3 shadow-sm animate-fadeIn">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {selectedPlace.isMuseum ? 'Museum Institution' : tCategory(selectedPlace.category)}
                  </div>
                  <h4 className="text-base font-bold font-cinzel text-stone-900 dark:text-stone-100 mt-1">
                    {currentLang === 'ar' ? selectedPlace.nameAr : selectedPlace.nameEn}
                  </h4>
                  <div className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                    {currentLang === 'ar' ? selectedPlace.descriptionAr : selectedPlace.descriptionEn}
                  </div>
                  <div className="mt-3 pt-2 border-t border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs">
                    <span className="text-stone-500 tabular-nums">
                      {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}
                    </span>
                    <a
                      href={`https://www.openstreetmap.org/directions?to=${selectedPlace.latitude}%2C${selectedPlace.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-semibold text-amber-800 dark:text-amber-300 hover:underline"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              )}

              {/* List of Destinations & Museums */}
              {VERIFIED_DESTINATIONS.filter((d) => filterGov === 'all' || d.governorate === filterGov).map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => handleSelectFlyTo(dest)}
                  className="w-full text-left p-3 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-amber-300 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex items-start gap-3"
                >
                  <span className="text-base shrink-0 mt-0.5">𓉐</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {currentLang === 'ar' ? dest.nameAr : dest.nameEn}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 capitalize">
                      {dest.governorate} · {tCategory(dest.category)}
                    </div>
                  </div>
                </button>
              ))}

              {VERIFIED_MUSEUMS.filter((m) => filterGov === 'all' || m.governorate === filterGov).map((museum) => (
                <button
                  key={museum.id}
                  onClick={() => handleSelectFlyTo({ ...museum, isMuseum: true })}
                  className="w-full text-left p-3 rounded-xl border border-stone-100 dark:border-stone-800 hover:border-blue-300 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors flex items-start gap-3"
                >
                  <span className="text-base shrink-0 mt-0.5">🏛️</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {currentLang === 'ar' ? museum.nameAr : museum.nameEn}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 capitalize">
                      {museum.governorate} · Museum
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
