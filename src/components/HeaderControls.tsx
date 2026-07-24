import React, { useState } from 'react';
import { Volume2, VolumeX, Heart, Terminal, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderControlsProps {
  currentStage: string;
  onOpenSecretHint?: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({ currentStage, onOpenSecretHint }) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  const handleToggleSound = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:px-8 sm:py-5 flex items-center justify-between pointer-events-auto">
      {/* Apple-Style Glass Status Badge */}
      <div className="flex items-center gap-3 glass-pill px-4 py-2 text-xs font-code text-pink-100 shadow-[0_8px_32px_rgba(236,72,153,0.15)] border border-white/20 backdrop-blur-xl">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-400"></span>
        </div>
        <span className="font-semibold text-white/90 tracking-wide flex items-center gap-1.5 font-outfit">
          <Terminal className="w-3.5 h-3.5 text-pink-300" />
          RelationshipOS v1.0
        </span>
        <span className="text-pink-300/40 hidden sm:inline">|</span>
        <span className="text-pink-200/90 hidden sm:inline flex items-center gap-1.5 font-medium">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" /> Dhvani ❤️ Om
        </span>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Easter Egg hint button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            if (onOpenSecretHint) onOpenSecretHint();
          }}
          className="glass-pill hover:bg-white/15 px-4 py-2 text-xs text-pink-100 font-medium transition-all flex items-center gap-2 border border-white/20 active:scale-95 shadow-[0_4px_20px_rgba(216,180,254,0.15)]"
          title="Secret Hints"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '7s' }} />
          <span className="hidden sm:inline">Secret Hints</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={handleToggleSound}
          className={`glass-pill p-2.5 transition-all border ${
            isMuted
              ? 'border-white/10 text-slate-400 hover:text-slate-200'
              : 'border-pink-300/40 text-pink-200 hover:text-white shadow-[0_0_20px_rgba(248,200,220,0.3)]'
          } active:scale-95`}
          aria-label="Toggle Sound"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
