import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, VolumeX, Sparkles, ChevronLeft, ChevronRight, Grid, X
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export interface PageInfo {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
}

export const PAGES_LIST: PageInfo[] = [
  { id: 1, title: 'Biometric Access', subtitle: 'Identity Protocol', icon: '🔐' },
  { id: 2, title: 'Kernel Boot', subtitle: 'Initializing RelationshipOS', icon: '💻' },
  { id: 3, title: 'Sunrise Flower Valley', subtitle: 'Welcome Dhvani', icon: '🌸' },
  { id: 4, title: 'Love Envelope', subtitle: '3D Unread Letter', icon: '💌' },
  { id: 5, title: 'Blooming Rose', subtitle: 'Blossom on Tap', icon: '🌹' },
  { id: 6, title: 'Shooting Star', subtitle: 'Starlit Wish', icon: '🌠' },
  { id: 7, title: 'Heart Sync', subtitle: 'BPM Synchronization', icon: '💓' },
  { id: 8, title: 'Milestone Story Tree', subtitle: 'Our Story Timeline', icon: '📜' },
  { id: 9, title: 'Love Terminal', subtitle: 'Developer CLI', icon: '⌨️' },
  { id: 10, title: 'System Controls', subtitle: 'Interactive Buttons', icon: '🎛️' },
  { id: 11, title: 'Enchanted Quiz Pathway', subtitle: 'Interactive Questions', icon: '❓' },
  { id: 12, title: 'Rainy Forest Apology', subtitle: 'Rain to Sunlight Paradise', icon: '🌧️' },
  { id: 13, title: 'Night Sky Letter', subtitle: 'Typewriter Heart Note', icon: '🌌' },
  { id: 14, title: 'Our Universe', subtitle: 'Cosmic Journey', icon: '🌍' },
  { id: 15, title: 'Love DNA Scanner', subtitle: 'Compatibility Analysis', icon: '🧬' },
  { id: 16, title: 'Commit History', subtitle: 'Love GitHub Repo', icon: '💻' },
  { id: 17, title: 'Relationship DB', subtitle: 'SQL Heart Queries', icon: '🗄️' },
  { id: 18, title: 'LoveGPT Chat', subtitle: 'AI Romance Chatbot', icon: '🤖' },
  { id: 19, title: 'Enchanted Kingdom', subtitle: 'Flower Garden', icon: '🌸' },
  { id: 20, title: 'Lotus Lake', subtitle: 'Floating Lanterns & Koi', icon: '🪷' },
  { id: 21, title: 'Royal Flower Celebration', subtitle: 'July 9th, 2026 Met Day ❤️', icon: '👑' },
  { id: 22, title: 'World Heart Sky Reveal', subtitle: 'Grand Finale & Sky View', icon: '🎆' },
  { id: 23, title: 'Memory Forest Museum', subtitle: 'Our Gallery', icon: '🖼️' },
];

interface NavigationHeaderProps {
  currentPageIndex: number;
  onNavigate: (pageIndex: number) => void;
  onOpenSecretHint: () => void;
  onOpenRecoveryRoom?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentPageIndex,
  onNavigate,
  onOpenSecretHint,
  onOpenRecoveryRoom,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolledVisible, setIsScrolledVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const currentPage = PAGES_LIST[currentPageIndex] || PAGES_LIST[0];
  const totalPages = PAGES_LIST.length;

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 80) {
        setIsScrolledVisible(false);
      } else {
        setIsScrolledVisible(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
      {/* Top Header Bar with Smooth Hide/Reveal */}
      <motion.header
        animate={{ y: isScrolledVisible ? 0 : -80 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 px-3 py-2.5 sm:px-6 sm:py-3 flex items-center justify-between pointer-events-auto backdrop-blur-2xl bg-[#0f051d]/80 border-b border-[#f7e7ce]/20 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
      >
        {/* Page Title & Counter Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="glass-pill px-3.5 py-1.5 text-xs font-mono text-[#f7e7ce] flex items-center gap-2 hover:bg-white/15 transition-all border border-[#f7e7ce]/30 active:scale-95 shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
            title="Open Directory Menu"
          >
            <Grid className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-bold text-[#f7e7ce] font-mono">
              Page {currentPageIndex + 1}/{totalPages}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-rose-100/90">
            <span className="text-lg">{currentPage.icon}</span>
            <span className="font-serif-luxury text-base font-semibold text-white tracking-wide">{currentPage.title}</span>
            <span className="text-[#d4af37]/50">•</span>
            <span className="text-pink-200/70 font-light">{currentPage.subtitle}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Recovery Room Comfort Sanctuary Button */}
          {onOpenRecoveryRoom && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenRecoveryRoom();
              }}
              className="glass-pill px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 border border-rose-400/40 bg-rose-500/15 text-rose-200 hover:text-white hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.25)] active:scale-95 animate-pulse"
              title="Open Dhvani's Recovery Room"
            >
              <span>❤️</span>
              <span className="font-mono font-bold hidden sm:inline">Recovery Room</span>
            </button>
          )}

          {/* Quick Quiz Jump Link */}
          <button
            onClick={() => handleJumpToPage(10)}
            className={`glass-pill px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 border active:scale-95 ${
              currentPageIndex === 10
                ? 'bg-[#d4af37]/30 border-[#f7e7ce] text-white shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : 'border-[#f7e7ce]/25 text-pink-200 hover:text-white hover:border-[#f7e7ce]/60'
            }`}
            title="Jump to Interactive Quiz"
          >
            <span>❓</span>
            <span className="hidden sm:inline font-mono">Quiz</span>
          </button>

          {/* Standalone Gallery Link */}
          <button
            onClick={() => handleJumpToPage(21)}
            className={`glass-pill px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 border active:scale-95 ${
              currentPageIndex === 21
                ? 'bg-[#d4af37]/30 border-[#f7e7ce] text-white shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                : 'border-[#f7e7ce]/25 text-pink-200 hover:text-white hover:border-[#f7e7ce]/60'
            }`}
            title="Open Memory Museum Gallery"
          >
            <span>🖼️</span>
            <span className="hidden sm:inline font-mono">Gallery</span>
          </button>

          {/* Secret Hints */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenSecretHint();
            }}
            className="glass-pill hover:bg-white/15 px-3 py-1.5 text-xs text-[#f7e7ce] font-medium transition-all flex items-center gap-1.5 border border-[#f7e7ce]/30 active:scale-95 shadow-[0_4px_20px_rgba(212,175,55,0.2)]"
            title="Secret Hints"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e5c158] animate-spin" style={{ animationDuration: '7s' }} />
            <span className="hidden sm:inline font-mono">Secrets</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className={`glass-pill p-2 transition-all border ${
              isMuted
                ? 'border-white/10 text-slate-400 hover:text-slate-200'
                : 'border-[#f7e7ce]/40 text-[#f7e7ce] hover:text-white shadow-[0_0_20px_rgba(247,231,206,0.3)]'
            } active:scale-95`}
            aria-label="Toggle Sound"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#e5c158]" />}
          </button>
        </div>
      </motion.header>

      {/* Floating Bottom Navigation Bar */}
      <motion.nav
        animate={{ y: isScrolledVisible ? 0 : 90 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 glass-pill bg-[#0f051d]/90 border border-[#f7e7ce]/30 px-3 py-2 sm:px-5 sm:py-2.5 flex items-center gap-3 sm:gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        {/* Previous Page Button */}
        <button
          onClick={() => {
            if (currentPageIndex > 0) handleJumpToPage(currentPageIndex - 1);
          }}
          disabled={currentPageIndex === 0}
          className={`flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
            currentPageIndex === 0
              ? 'opacity-40 cursor-not-allowed text-slate-500'
              : 'hover:bg-white/15 text-[#f7e7ce] hover:text-white active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Dots Indicator */}
        <div className="flex items-center gap-1 sm:gap-1.5 max-w-[160px] sm:max-w-none overflow-x-auto py-1">
          {PAGES_LIST.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => handleJumpToPage(idx)}
              className={`transition-all duration-300 rounded-full flex-shrink-0 ${
                currentPageIndex === idx
                  ? 'w-5 sm:w-6 h-2 bg-gradient-to-r from-[#d4af37] to-[#fadadd] shadow-[0_0_12px_rgba(212,175,55,0.8)]'
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
          className={`flex items-center gap-1 sm:gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
            currentPageIndex === totalPages - 1
              ? 'opacity-40 cursor-not-allowed text-slate-500'
              : 'bg-gradient-to-r from-[#d4af37] to-[#b76e79] hover:from-[#e5c158] hover:to-[#f4a0b5] text-white shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95'
          }`}
        >
          <span className="font-semibold">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.nav>

      {/* Directory Menu Modal */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card-luxury bg-[#0f051d]/95 border-2 border-[#f7e7ce]/30 rounded-3xl p-6 max-w-xl w-full shadow-[0_0_90px_rgba(212,175,55,0.25)] space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#f7e7ce]/20 pb-3">
                <div className="flex items-center gap-2 text-[#f7e7ce] font-serif-luxury text-lg font-semibold">
                  <Grid className="w-4 h-4 text-[#d4af37]" />
                  <span>RelationshipOS Interactive Directory</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-pink-300/60 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Special Recovery Room Banner in Directory */}
              {onOpenRecoveryRoom && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsMenuOpen(false);
                    onOpenRecoveryRoom();
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/25 via-amber-500/15 to-purple-500/20 border-2 border-rose-400/50 hover:border-rose-300 text-left transition-all shadow-[0_0_25px_rgba(244,63,94,0.25)] group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">❤️</span>
                    <div>
                      <div className="text-[10px] font-mono text-rose-300 font-bold tracking-wider uppercase">
                        SPECIAL COZY HAVEN
                      </div>
                      <div className="text-sm font-semibold text-white font-serif-luxury">
                        Dhvani's Recovery Room
                      </div>
                      <div className="text-[11px] text-rose-200/70 font-light">
                        Calm, peaceful comfort virtual room for fever rest
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-500/30 border border-rose-300/50 text-[11px] font-mono font-bold text-white">
                    Enter ✨
                  </span>
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {PAGES_LIST.map((page, idx) => {
                  const isActive = currentPageIndex === idx;
                  return (
                    <button
                      key={page.id}
                      onClick={() => handleJumpToPage(idx)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                        isActive
                          ? 'bg-[#d4af37]/25 border-[#f7e7ce]/60 text-white shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                          : 'bg-white/5 border-pink-300/15 hover:border-[#f7e7ce]/40 text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl">{page.icon}</span>
                      <div>
                        <div className="text-[10px] font-mono text-[#d4af37] font-bold">
                          PAGE {page.id}
                        </div>
                        <div className="text-sm font-semibold text-white font-serif-luxury">
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

export default NavigationHeader;
