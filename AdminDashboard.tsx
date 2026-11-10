import React, { useState } from 'react';
import { VERIFIED_DESTINATIONS } from '../data/destinations';
import { VERIFIED_MUSEUMS } from '../data/museums';
import { HIEROGLYPHIC_DICTIONARY } from '../data/hieroglyphs';
import { Destination, Museum } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Save,
  Download,
  Upload,
  AlertCircle,
  Clock,
  Ticket,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [destinationsList, setDestinationsList] = useState<Destination[]>(VERIFIED_DESTINATIONS);
  const [museumsList, setMuseumsList] = useState<Museum[]>(VERIFIED_MUSEUMS);
  const [activeTab, setActiveTab] = useState<'destinations' | 'museums' | 'dictionary'>('destinations');

  // New Destination Form modal state
  const [isAddingDest, setIsAddingDest] = useState(false);
  const [newDestNameEn, setNewDestNameEn] = useState('');
  const [newDestNameAr, setNewDestNameAr] = useState('');
  const [newDestGov, setNewDestGov] = useState('cairo');
  const [newDestCat, setNewDestCat] = useState('archaeological_site');
  const [newDestHours, setNewDestHours] = useState('Daily: 09:00 AM – 05:00 PM');
  const [newDestTickets, setNewDestTickets] = useState('Foreigner 300 EGP | Egyptian 30 EGP');
  const [newDestDescEn, setNewDestDescEn] = useState('');
  const [newDestDescAr, setNewDestDescAr] = useState('');

  if (!isAdmin) {
    return (
      <div className="py-24 text-center px-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold font-cinzel text-stone-900 dark:text-stone-100">
          Admin Authorization Required
        </h2>
        <p className="text-xs text-stone-500 mt-2">
          Administrator privileges are strictly reserved for verified curators (e.g. fellobater77fero@gmail.com). You are currently browsing in read-only public explorer mode.
        </p>
      </div>
    );
  }

  const handleDeleteDestination = (id: string) => {
    if (confirm('Are you sure you want to delete this verified destination record?')) {
      setDestinationsList((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleToggleFeatured = (id: string) => {
    setDestinationsList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, featured: !d.featured } : d))
    );
  };

  const handleCreateDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestNameEn || !newDestNameAr) return;

    const newDest: Destination = {
      id: `dest_${Date.now()}`,
      nameEn: newDestNameEn,
      nameAr: newDestNameAr,
      category: newDestCat as any,
      governorate: newDestGov,
      descriptionEn: newDestDescEn,
      descriptionAr: newDestDescAr,
      historicalPeriod: 'Verified Historical Site',
      latitude: 30.0444,
      longitude: 31.2357,
      address: `${newDestGov.toUpperCase()} Governorate, Egypt`,
      visitingHours: newDestHours,
      ticketPrices: newDestTickets,
      images: ['/src/assets/images/hero_egypt_pyramids_1794312588988.jpg'],
      source: 'Ministry of Tourism and Antiquities (Verified via Admin)',
      verifiedDate: new Date().toISOString().split('T')[0],
      featured: false,
    };

    setDestinationsList([newDest, ...destinationsList]);
    setIsAddingDest(false);
    // Reset form
    setNewDestNameEn('');
    setNewDestNameAr('');
    setNewDestDescEn('');
    setNewDestDescAr('');
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ destinations: destinationsList, museums: museumsList }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'egypt_explorer_verified_catalog.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section className="py-12 bg-stone-50 dark:bg-stone-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-600 font-cinzel">
              <Shield className="w-4 h-4" />
              <span>National Curator & Administrator Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-stone-900 dark:text-stone-100 mt-1">
              Egypt Explorer Admin Portal
            </h2>
            <div className="text-xs text-stone-500 mt-0.5">
              Logged in as <span className="font-semibold text-stone-800 dark:text-stone-200">{user?.email}</span> (Administrator)
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Catalog JSON</span>
            </button>
            <button
              onClick={() => setIsAddingDest(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Destination</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'destinations'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
            }`}
          >
            Destinations Directory ({destinationsList.length})
          </button>
          <button
            onClick={() => setActiveTab('museums')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'museums'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
            }`}
          >
            Museums ({museumsList.length})
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'dictionary'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
            }`}
          >
            Hieroglyphic Dictionary ({HIEROGLYPHIC_DICTIONARY.length})
          </button>
        </div>

        {/* Destinations Table */}
        {activeTab === 'destinations' && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 font-cinzel font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Governorate</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Hours & Tickets</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                  {destinationsList.map((dest) => (
                    <tr key={dest.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                      <td className="p-4 font-semibold">
                        <div>{dest.nameEn}</div>
                        <div className="text-[11px] text-stone-400 font-cairo">{dest.nameAr}</div>
                      </td>
                      <td className="p-4 capitalize">{dest.governorate}</td>
                      <td className="p-4 capitalize">{dest.category.replace('_', ' ')}</td>
                      <td className="p-4">
                        <div className="truncate max-w-[180px]">{dest.visitingHours}</div>
                        <div className="text-stone-400 text-[11px] truncate max-w-[180px]">{dest.ticketPrices}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{dest.verifiedDate}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 truncate max-w-[160px]">{dest.source}</div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleFeatured(dest.id)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                              dest.featured
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                            }`}
                          >
                            {dest.featured ? 'Featured' : 'Standard'}
                          </button>
                          <button
                            onClick={() => handleDeleteDestination(dest.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Museums Table */}
        {activeTab === 'museums' && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 font-cinzel font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Museum</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Opening Hours</th>
                    <th className="p-4">Highlights Count</th>
                    <th className="p-4">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                  {museumsList.map((m) => (
                    <tr key={m.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                      <td className="p-4 font-semibold">
                        <div>{m.nameEn}</div>
                        <div className="text-[11px] text-stone-400 font-cairo">{m.nameAr}</div>
                      </td>
                      <td className="p-4">{m.location}</td>
                      <td className="p-4">{m.openingHours}</td>
                      <td className="p-4 tabular-nums font-semibold">{m.highlights.length} Highlights</td>
                      <td className="p-4 text-[11px] text-stone-400">{m.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hieroglyphic Dictionary Table */}
        {activeTab === 'dictionary' && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 font-cinzel font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Gardiner Code</th>
                    <th className="p-4">Symbol</th>
                    <th className="p-4">Phonetic</th>
                    <th className="p-4">Meaning (English)</th>
                    <th className="p-4">Meaning (Arabic)</th>
                    <th className="p-4">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                  {HIEROGLYPHIC_DICTIONARY.map((h) => (
                    <tr key={h.gardinerCode} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                      <td className="p-4 font-bold text-amber-700 dark:text-amber-400 font-mono">{h.gardinerCode}</td>
                      <td className="p-4 text-3xl font-serif">{h.glyph}</td>
                      <td className="p-4 font-semibold">{h.phonetic}</td>
                      <td className="p-4">{h.meaningEn}</td>
                      <td className="p-4 font-cairo">{h.meaningAr}</td>
                      <td className="p-4 text-stone-400">{h.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Destination Modal */}
      {isAddingDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold font-cinzel text-stone-900 dark:text-stone-100 mb-4">
              Add Verified Destination Record
            </h3>
            <form onSubmit={handleCreateDestination} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={newDestNameEn}
                    onChange={(e) => setNewDestNameEn(e.target.value)}
                    placeholder="e.g. Abydos Temple of Seti I"
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Name (Arabic)</label>
                  <input
                    type="text"
                    required
                    value={newDestNameAr}
                    onChange={(e) => setNewDestNameAr(e.target.value)}
                    placeholder="مثال: معبد سيتي الأول في أبيدوس"
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-none focus:border-amber-500 font-cairo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Governorate</label>
                  <select
                    value={newDestGov}
                    onChange={(e) => setNewDestGov(e.target.value)}
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-none"
                  >
                    <option value="cairo">Cairo</option>
                    <option value="giza">Giza</option>
                    <option value="alexandria">Alexandria</option>
                    <option value="luxor">Luxor</option>
                    <option value="aswan">Aswan</option>
                    <option value="sohag">Sohag</option>
                    <option value="qena">Qena</option>
                    <option value="south_sinai">South Sinai</option>
                    <option value="fayoum">Fayoum</option>
                    <option value="matrouh">Matrouh</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={newDestCat}
                    onChange={(e) => setNewDestCat(e.target.value)}
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg focus:outline-none"
                  >
                    <option value="archaeological_site">Archaeological Site</option>
                    <option value="temple">Ancient Temple</option>
                    <option value="tomb_pyramid">Pyramid or Tomb</option>
                    <option value="islamic_monument">Islamic Monument</option>
                    <option value="coptic_site">Coptic Site</option>
                    <option value="natural_reserve">Natural Reserve</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Visiting Hours</label>
                <input
                  type="text"
                  value={newDestHours}
                  onChange={(e) => setNewDestHours(e.target.value)}
                  className="w-full p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Ticket Prices</label>
                <input
                  type="text"
                  value={newDestTickets}
                  onChange={(e) => setNewDestTickets(e.target.value)}
                  className="w-full p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description (English)</label>
                <textarea
                  rows={3}
                  value={newDestDescEn}
                  onChange={(e) => setNewDestDescEn(e.target.value)}
                  placeholder="Historical and architectural summary..."
                  className="w-full p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description (Arabic)</label>
                <textarea
                  rows={3}
                  value={newDestDescAr}
                  onChange={(e) => setNewDestDescAr(e.target.value)}
                  placeholder="الوصف التاريخي والأثري..."
                  className="w-full p-2 bg-stone-50 dark:bg-stone-800 border rounded-lg font-cairo"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddingDest(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
