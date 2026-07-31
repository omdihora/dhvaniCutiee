import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, Heart, Terminal, Sparkles, ChevronLeft, ChevronRight, Grid, X
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export interface PageInfo {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const PAGES_LIST: PageInfo[] = [
  { id: 1, title: 'Biometric Auth', subtitle: 'Identity Scan', icon: '🔐' },
  { id: 2, title: 'Kernel Boot', subtitle: 'Initializing RelationshipOS', icon: '💻' },
  { id: 3, title: 'Welcome Dhvani', subtitle: 'Handcrafted Intro', icon: '💖' },
  { id: 4, title: 'Love Envelope', subtitle: 'Unread 3D Letter', icon: '💌' },
  { id: 5, title: 'Blooming Rose', subtitle: 'Tap to Blossom', icon: '🌹' },
  { id: 6, title: 'Shooting Star', subtitle: 'Catch a Wish', icon: '🌠' },
  { id: 7, title: 'Heart Sync', subtitle: 'BPM Synchronization', icon: '💓' },
  { id: 8, title: 'Our Story', subtitle: 'Milestone Timeline', icon: '📜' },
  { id: 9, title: 'Love Terminal', subtitle: 'Interactive Developer CLI', icon: '⌨️' },
  { id: 10, title: 'System Controls', subtitle: 'Download Heart & Protection', icon: '🎛️' },
  { id: 11, title: 'Love Quiz', subtitle: 'Developer Compatibility', icon: '❓' },
  { id: 12, title: 'Night Sky Letter', subtitle: 'Typewriter Heart Letter', icon: '🌌' },
  { id: 13, title: 'Our Universe', subtitle: 'Cosmic Zoom to You', icon: '🌍' },
  { id: 14, title: 'Love DNA Scanner', subtitle: 'Compatibility Analysis', icon: '🧬' },
  { id: 15, title: 'Commit History', subtitle: 'Love GitHub Repo', icon: '💻' },
  { id: 16, title: 'Relationship DB', subtitle: 'Heart SQL Query', icon: '🗄️' },
  { id: 17, title: 'LoveGPT', subtitle: 'AI Romance Chatbot', icon: '🤖' },
  { id: 18, title: 'Flower Garden', subtitle: 'Enchanted Magical Garden', icon: '🌸' },
  { id: 19, title: 'A Quiet Moment', subtitle: 'Heartfelt Message', icon: '💔' },
  { id: 20, title: 'Grand Finale', subtitle: 'Infinite Love Celebration', icon: '🎆' },
  { id: 21, title: 'Our Gallery', subtitle: 'Interactive Memory Museum', icon: '🖼️' },
  { id: 22, title: 'Valentine Edition', subtitle: 'Blush Pink Romantic Landing', icon: '💌' },
];

interface NavigationHeaderProps {
  currentPageIndex: number; // 0-indexed (0 to 13)
  onNavigate: (pageIndex: number) => void;
  onOpenSecretHint: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentPageIndex,
  onNavigate,
  onOpenSecretHint,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentPage = PAGES_LIST[currentPageIndex];
  const totalPages = PAGES_LIST.length;

  const handleToggleSound = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick();
    }
  };

  const handleJumpToPage = (index: number) => {
    soundEngine.playPageSwitch();
    onNavigate(index);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 py-2.5 sm:px-6 sm:py-4 flex items-center justify-between pointer-events-auto backdrop-blur-md bg-[#0e0716]/60 border-b border-pink-500/10">
        {/* Page Title & Counter Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="glass-pill px-3 py-1.5 text-xs font-code text-pink-100 flex items-center gap-2 hover:bg-white/15 transition-all border border-pink-300/30 active:scale-95 shadow-[0_4px_16px_rgba(236,72,153,0.2)]"
            title="Open Page Menu"
          >
            <Grid className="w-3.5 h-3.5 text-pink-300" />
            <span className="font-bold text-rose-300 font-mono">
              Page {currentPageIndex + 1}/{totalPages}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs font-code text-pink-200/90">
            <span className="text-xl">{currentPage.icon}</span>
            <span className="font-semibold text-white">{currentPage.title}</span>
            <span className="text-pink-300/40">•</span>
            <span className="text-pink-200/70 font-light">{currentPage.subtitle}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Standalone Gallery Link */}
          <button
            onClick={() => handleJumpToPage(13)}
            className={`glass-pill px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 border active:scale-95 ${
              currentPageIndex === 13
                ? 'bg-pink-500/30 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                : 'border-pink-400/40 text-pink-200 hover:text-white hover:border-pink-400/80 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
            }`}
            title="Open Standalone Memory Gallery Page"
          >
            <span>🖼️</span>
            <span className="font-code">Our Gallery</span>
          </button>

          {/* Secret Hints */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenSecretHint();
            }}
            className="glass-pill hover:bg-white/15 px-3 py-1.5 text-xs text-pink-100 font-medium transition-all flex items-center gap-1.5 border border-white/20 active:scale-95 shadow-[0_4px_20px_rgba(216,180,254,0.15)]"
            title="Secret Hints"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '7s' }} />
            <span className="hidden sm:inline font-code">Secrets</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className={`glass-pill p-2 transition-all border ${
              isMuted
                ? 'border-white/10 text-slate-400 hover:text-slate-200'
                : 'border-pink-300/40 text-pink-200 hover:text-white shadow-[0_0_20px_rgba(248,200,220,0.3)]'
            } active:scale-95`}
            aria-label="Toggle Sound"
            title={isMuted ? 'Unmute Piano BGM' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-300" />}
          </button>
        </div>
      </header>

      {/* Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass-pill bg-[#170924]/85 border border-pink-400/30 px-3 py-2 sm:px-5 sm:py-2.5 flex items-center gap-3 sm:gap-6 shadow-[0_10px_35px_rgba(236,72,153,0.35)] backdrop-blur-2xl">
        {/* Previous Page Button */}
        <button
          onClick={() => {
            if (currentPageIndex > 0) handleJumpToPage(currentPageIndex - 1);
          }}
          disabled={currentPageIndex === 0}
          className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-code font-medium transition-all ${
            currentPageIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-500'
              : 'hover:bg-white/15 text-pink-200 hover:text-white active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Dots Indicator */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {PAGES_LIST.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => handleJumpToPage(idx)}
              className={`transition-all duration-300 rounded-full ${
                currentPageIndex === idx
                  ? 'w-5 sm:w-6 h-2 bg-gradient-to-r from-pink-400 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                  : 'w-2 h-2 bg-pink-300/30 hover:bg-pink-300/60'
              }`}
              title={`${page.icon} Page ${page.id}: ${page.title}`}
            />
          ))}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => {
            if (currentPageIndex < totalPages - 1) handleJumpToPage(currentPageIndex + 1);
          }}
          disabled={currentPageIndex === totalPages - 1}
          className={`flex items-center gap-1 sm:gap-2 px-3.5 py-1.5 rounded-full text-xs font-code font-medium transition-all ${
            currentPageIndex === totalPages - 1
              ? 'opacity-40 cursor-not-allowed text-slate-500'
              : 'bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-500 hover:to-rose-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] active:scale-95'
          }`}
        >
          <span className="font-semibold">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Quick Jump Page Menu Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card bg-[#14061f]/95 border-2 border-pink-500/40 rounded-3xl p-6 max-w-lg w-full shadow-[0_0_80px_rgba(236,72,153,0.4)] space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
                <div className="flex items-center gap-2 text-pink-200 font-semibold text-base font-code">
                  <Grid className="w-4 h-4 text-pink-300" />
                  <span>RelationshipOS — Page Directory</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-pink-300/60 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {PAGES_LIST.map((page, idx) => {
                  const isActive = currentPageIndex === idx;
                  return (
                    <button
                      key={page.id}
                      onClick={() => handleJumpToPage(idx)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                        isActive
                          ? 'bg-pink-500/25 border-pink-400/60 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                          : 'bg-white/5 border-pink-300/15 hover:border-pink-300/40 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl">{page.icon}</span>
                      <div>
                        <div className="text-xs font-code text-pink-300/80 font-bold">
                          PAGE {page.id}
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {page.title}
                        </div>
                        <div className="text-[11px] text-pink-200/60 font-light truncate max-w-[140px]">
                          {page.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
