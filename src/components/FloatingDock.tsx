import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Grid, Tv, Star, HelpCircle, Image as ImageIcon, Volume2, VolumeX, Sparkles
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FloatingDockProps {
  viewMode: 'cinema' | 'bento';
  onToggleViewMode: (mode: 'cinema' | 'bento') => void;
  onNavigate: (index: number) => void;
  onOpenSecretHint: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  viewMode,
  onToggleViewMode,
  onNavigate,
  onOpenSecretHint,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleToggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) soundEngine.playClick();
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="glass-pill bg-[#0f051d]/90 border border-amber-400/30 px-4 py-2.5 rounded-full flex items-center gap-2 sm:gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-3xl"
      >
        {/* Cinema Mode Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleViewMode('cinema');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
            viewMode === 'cinema'
              ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-black shadow-[0_0_15px_rgba(212,175,55,0.6)]'
              : 'text-pink-200/80 hover:text-white hover:bg-white/10'
          }`}
          title="Switch to Story Cinema Mode"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cinema</span>
        </button>

        {/* Bento Hub Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleViewMode('bento');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all ${
            viewMode === 'bento'
              ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-black shadow-[0_0_15px_rgba(212,175,55,0.6)]'
              : 'text-pink-200/80 hover:text-white hover:bg-white/10'
          }`}
          title="Switch to Bento Grid Hub"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bento Hub</span>
        </button>

        <div className="w-px h-5 bg-white/20" />

        {/* July 9th Met Day Special Link */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate(20);
            onToggleViewMode('cinema');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold text-amber-200 border border-amber-400/40 bg-amber-500/15 hover:bg-amber-500/30 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] active:scale-95"
          title="July 9th Met Day Special"
        >
          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span className="font-bold">July 9th</span>
        </button>

        {/* Interactive Quiz Link */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate(10);
            onToggleViewMode('cinema');
          }}
          className="p-2 rounded-full text-pink-200 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          title="Love Quiz & Games"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Memory Gallery Link */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate(22);
            onToggleViewMode('cinema');
          }}
          className="p-2 rounded-full text-pink-200 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          title="Memory Museum Gallery"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Secrets Modal */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenSecretHint();
          }}
          className="p-2 rounded-full text-amber-300 hover:bg-white/10 transition-all active:scale-95"
          title="Secret Hints"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Audio Toggle */}
        <button
          onClick={handleToggleMute}
          className={`p-2 rounded-full transition-all active:scale-95 ${
            isMuted ? 'text-slate-500' : 'text-amber-300 hover:text-white'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
        </button>
      </motion.div>
    </div>
  );
};

export default FloatingDock;
