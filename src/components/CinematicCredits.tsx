import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CinematicCreditsProps {
  onNext?: () => void;
}

interface CreditEntry {
  role: string;
  name: string;
  highlight?: boolean;
}

const CREDITS: CreditEntry[] = [
  { role: 'Written & Directed By', name: 'Om ❤️', highlight: true },
  { role: 'Starring', name: 'Dhvani', highlight: true },
  { role: 'Genre', name: 'Love Story' },
  { role: 'Runtime', name: 'Forever ♾️' },
  { role: 'Release Date', name: 'The Day We Met' },
  { role: 'Produced By', name: 'The Universe' },
  { role: 'Cinematography', name: 'Every Moment Together' },
  { role: 'Original Score', name: 'Her Laughter' },
  { role: 'Soundtrack', name: '"Every Love Song Reminds Me of You"' },
  { role: 'Costume Design', name: 'Whatever She Wears, She Looks Perfect' },
  { role: 'Visual Effects', name: 'The Way She Smiles' },
  { role: 'Sound Design', name: 'Her Voice (My Favorite Sound)' },
  { role: 'Stunt Coordinator', name: 'My Heart (Doing Backflips Daily)' },
  { role: 'Catering', name: 'Shared Meals & Sweet Treats' },
  { role: 'Best Boy', name: 'Om (Still Trying His Best)' },
  { role: 'Key Grip', name: 'Her Hand in Mine' },
  { role: 'Gaffer', name: 'The Sparkle in Her Eyes' },
  { role: 'Location Scout', name: 'Anywhere She Is = Perfect Location' },
  { role: 'Script Supervisor', name: 'Our Conversations That Never End' },
  { role: 'Special Thanks', name: 'Dhvani, for existing ❤️', highlight: true },
];

const DISCLAIMER_LINES = [
  'No animals were harmed during the making of this love story.',
  'Only hearts were stolen. ❤️',
  '',
  'One heart, specifically.',
  'And it belonged to Om.',
  'And it now permanently belongs to Dhvani.',
  '',
  'No refunds. No returns. No regrets.',
  '',
  '© Forever Productions',
  'All Rights Reserved by Love ❤️',
];

export const CinematicCredits: React.FC<CinematicCreditsProps> = ({ onNext }) => {
  const [isScrolling, setIsScrolling] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    soundEngine.startAmbientBGM();

    const timer = setTimeout(() => {
      setShowButton(true);
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative my-auto overflow-hidden">
      {/* Film grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-30 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Cinematic letterbox bars */}
      <div className="fixed top-0 left-0 right-0 h-12 sm:h-16 bg-black z-20" />
      <div className="fixed bottom-0 left-0 right-0 h-12 sm:h-16 bg-black z-20" />

      {/* Film strip borders */}
      <div className="fixed left-0 top-0 bottom-0 w-6 sm:w-10 bg-[#0a0a0a] z-20 flex flex-col items-center justify-around py-20">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-3 sm:w-5 h-3 sm:h-4 rounded-sm bg-[#1a1a1a] border border-[#333]" />
        ))}
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-6 sm:w-10 bg-[#0a0a0a] z-20 flex flex-col items-center justify-around py-20">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-3 sm:w-5 h-3 sm:h-4 rounded-sm bg-[#1a1a1a] border border-[#333]" />
        ))}
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-16 sm:top-20 z-30 inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code"
      >
        <Film className="w-3.5 h-3.5 text-amber-300" />
        <span>CINEMATIC CREDITS</span>
      </motion.div>

      {/* Scrolling Credits Container */}
      <div className="w-full max-w-xl z-10 relative" style={{ height: '70vh', overflow: 'hidden' }}>
        <motion.div
          initial={{ y: '100%' }}
          animate={isScrolling ? { y: '-180%' } : {}}
          transition={{ duration: 45, ease: 'linear' }}
          className="flex flex-col items-center text-center px-4 space-y-10 pt-[70vh]"
        >
          {/* Opening Title */}
          <div className="space-y-3">
            <p className="text-xs font-code text-amber-300/70 tracking-[0.3em] uppercase">
              A Love Story Presentation
            </p>
            <h1 className="text-4xl sm:text-6xl font-cinzel text-white tracking-wide">
              Om & Dhvani
            </h1>
            <p className="text-sm text-pink-200/60 font-light tracking-wider">
              A Digital Love Story
            </p>
          </div>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

          {/* Credit Entries */}
          {CREDITS.map((credit, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-xs font-code text-amber-300/60 tracking-[0.2em] uppercase">
                {credit.role}
              </p>
              <p className={`text-xl sm:text-2xl font-display tracking-wide ${
                credit.highlight ? 'text-pink-200 glow-text-blush' : 'text-white/90'
              }`}>
                {credit.name}
              </p>
            </div>
          ))}

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent my-8" />

          {/* Disclaimer / Footer */}
          <div className="space-y-2 pb-40">
            {DISCLAIMER_LINES.map((line, idx) => (
              <p
                key={idx}
                className={`text-sm ${
                  line === '' ? 'h-4' : 'text-slate-400/70 font-light'
                } ${line.includes('❤️') ? 'text-pink-300/80' : ''}`}
              >
                {line}
              </p>
            ))}

            {/* Final big heart */}
            <div className="pt-10 text-5xl">❤️</div>
          </div>
        </motion.div>
      </div>

      {/* Continue Button (appears after delay) */}
      {onNext && showButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-20 sm:bottom-24 z-30"
        >
          <button
            onClick={() => {
              soundEngine.playPageSwitch();
              soundEngine.stopAmbientBGM();
              onNext();
            }}
            className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>One Last Thing...</span>
            <ArrowRight className="w-4 h-4 text-pink-300" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CinematicCredits;
