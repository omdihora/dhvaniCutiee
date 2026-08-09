import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Calendar, Grid, Play, Layers, Star, Zap, Search, Lock } from 'lucide-react';
import { PAGES_LIST, PageInfo } from './NavigationHeader';
import { soundEngine } from '../utils/audio';

interface ExperienceBentoHubProps {
  currentPageIndex: number;
  onSelectChapter: (index: number) => void;
  onCloseHub: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Chapters 🌟', icon: '✨' },
  { id: 'auth', label: 'Identity & Boot 🔐', range: [0, 2] },
  { id: 'romance', label: 'Interactive Love 💌', range: [3, 6] },
  { id: 'memories', label: 'Timeline & Logs 📜', range: [7, 12] },
  { id: 'cosmic', label: 'Cosmic & AI 🧬', range: [13, 17] },
  { id: 'special', label: 'Met Day & World 🌸', range: [18, 22] },
];

export const ExperienceBentoHub: React.FC<ExperienceBentoHubProps> = ({
  currentPageIndex,
  onSelectChapter,
  onCloseHub,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPages = PAGES_LIST.filter((page, idx) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;

    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    if (!cat || !cat.range) return true;
    return idx >= cat.range[0] && idx <= cat.range[1];
  });

  const handleLaunch = (index: number) => {
    soundEngine.playPageSwitch();
    onSelectChapter(index);
    onCloseHub();
  };

  return (
    <div className="min-h-screen w-full relative z-30 pt-20 pb-28 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center select-none">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-amber-200 text-xs font-mono border border-amber-400/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <Grid className="w-3.5 h-3.5 text-amber-300" />
          <span>RELATIONSHIP OS // BENTO EXPERIENCE HUB</span>
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 bg-clip-text text-transparent tracking-tight">
          Explore Our Digital Fairytale
        </h1>

        <p className="text-pink-100/70 text-xs sm:text-base font-light max-w-2xl mx-auto">
          22 handcrafted interactive chapters. Tap any card to launch its 3D environment instantly.
        </p>
      </motion.div>

      {/* Filter Category Tabs & Search Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500/30 to-rose-500/30 border-amber-300 text-white shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 border-white/10 text-pink-200/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-amber-300/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters..."
            className="w-full bg-[#0f051d]/90 border border-amber-400/30 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-pink-200/40 focus:outline-none focus:border-amber-300 shadow-inner"
          />
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {filteredPages.map((page) => {
          const originalIndex = PAGES_LIST.findIndex((p) => p.id === page.id);
          const isActive = currentPageIndex === originalIndex;
          const isJuly9th = page.id === 21;

          return (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              onClick={() => handleLaunch(originalIndex)}
              className={`relative cursor-pointer rounded-3xl p-6 border transition-all duration-300 overflow-hidden group ${
                isJuly9th
                  ? 'bg-gradient-to-br from-amber-500/25 via-rose-500/15 to-[#180929]/90 border-amber-400/60 shadow-[0_0_40px_rgba(212,175,55,0.35)]'
                  : isActive
                  ? 'bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-[#180929]/90 border-rose-400/50 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
                  : 'bg-[#180929]/80 border-white/10 hover:border-amber-300/40 hover:bg-[#230d3a]/90 shadow-xl'
              }`}
            >
              {/* Highlight ribbon for July 9th 2026 */}
              {isJuly9th && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-black font-mono text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-black animate-spin" style={{ animationDuration: '6s' }} />
                  <span>JULY 9TH, 2026</span>
                </div>
              )}

              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {page.icon}
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-amber-300">
                    CH {page.id.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-bold text-white font-serif-luxury group-hover:text-amber-200 transition-colors">
                  {page.title}
                </h3>
                <p className="text-xs text-pink-200/70 font-light truncate">
                  {page.subtitle}
                </p>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-200">
                  {isActive ? '● Currently Active' : 'Tap to Launch'}
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-200 group-hover:bg-amber-400 group-hover:text-black transition-all">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperienceBentoHub;
