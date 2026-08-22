import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Grid, Tv, Star, HelpCircle, Image as ImageIcon, Volume2, VolumeX, Sparkles, Heart
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FloatingDockProps {
  viewMode: 'cinema' | 'bento';
  onToggleViewMode: (mode: 'cinema' | 'bento') => void;
  onNavigate: (index: number) => void;
  onOpenSecretHint: () => void;
  onOpenRecoveryRoom?: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  viewMode,
  onToggleViewMode,
  onNavigate,
  onOpenSecretHint,
  onOpenRecoveryRoom,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleToggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) soundEngine.playClick();
  };

  return (
    <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="glass-dock px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl border border-amber-400/40 relative overflow-hidden"
      >
        {/* Subtle Laser Shimmer Beam */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          <div className="w-12 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-laser-shimmer" />
        </div>

        {/* Cinema Mode Toggle */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onToggleViewMode('cinema');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all active:scale-95 ${
            viewMode === 'cinema'
              ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.7)]'
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all active:scale-95 ${
            viewMode === 'bento'
              ? 'bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.7)]'
              : 'text-pink-200/80 hover:text-white hover:bg-white/10'
          }`}
          title="Switch to 3D Bento Grid Hub"
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">3D Hub</span>
        </button>

        <div className="w-px h-5 bg-white/20" />

        {/* Dhvani's Recovery Room Link */}
        {onOpenRecoveryRoom && (
          <button
            onClick={() => {
              soundEngine.playHeartbeat();
              onOpenRecoveryRoom();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-rose-200 border border-rose-400/50 bg-rose-500/20 hover:bg-rose-500/35 transition-all shadow-[0_0_18px_rgba(244,63,94,0.4)] active:scale-95 animate-pulse"
            title="Dhvani's Recovery Room (Cozy Care Sanctuary)"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-bounce" />
            <span className="font-bold hidden sm:inline">Recovery</span>
          </button>
        )}

        {/* July 9th Met Day Special Link */}
        <button
          onClick={() => {
            soundEngine.playOrchestraSwell();
            onNavigate(20);
            onToggleViewMode('cinema');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-amber-200 border border-amber-400/40 bg-amber-500/20 hover:bg-amber-500/35 transition-all shadow-[0_0_18px_rgba(212,175,55,0.35)] active:scale-95"
          title="July 9th Met Day Special"
        >
          <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="font-bold hidden sm:inline">July 9th</span>
        </button>

        {/* Interactive Quiz Link */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onNavigate(10);
            onToggleViewMode('cinema');
          }}
          className="p-2 rounded-full text-pink-200 hover:text-white hover:bg-white/15 transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(255,46,140,0.5)]"
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
          className="p-2 rounded-full text-pink-200 hover:text-white hover:bg-white/15 transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(255,46,140,0.5)]"
          title="Memory Museum Gallery"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Secrets Modal */}
        <button
          onClick={() => {
            soundEngine.playSparkle();
            onOpenSecretHint();
          }}
          className="p-2 rounded-full text-amber-300 hover:text-white hover:bg-white/15 transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(212,175,55,0.6)]"
          title="Secret Hints & Shortcuts"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-white/20" />

        {/* Audio Toggle & Equalizer Waveform */}
        <button
          onClick={handleToggleMute}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all active:scale-95 ${
            isMuted ? 'text-slate-500 hover:text-slate-300' : 'text-amber-300 bg-amber-400/10 hover:bg-amber-400/20'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-300" />
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-amber-400 rounded-full animate-audio-bar-1" />
                <span className="w-0.5 bg-rose-400 rounded-full animate-audio-bar-2" />
                <span className="w-0.5 bg-pink-400 rounded-full animate-audio-bar-3" />
              </div>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default FloatingDock;
