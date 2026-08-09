import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Calendar, Gift, Stars, ArrowRight, Clock, Award, Music, MessageCircle } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { AnimatedBouquet } from './AnimatedBouquet';

interface July9thSpecialProps {
  onNext: () => void;
}

type Phase = 'intro' | 'counter' | 'memories' | 'bouquet' | 'gift' | 'finale';

const JULY_9TH_MESSAGES = [
  "July 9th, 2026 — The exact day the universe aligned and brought us together ✨",
  "July 9th, 2026 started a brand new chapter filled with endless laughter, warmth, and love 💫",
  "Out of all 365 days in the year, July 9th, 2026 will forever be my absolute favorite ❤️",
  "Every single second since July 9th, 2026 has been a blessing I hold close to my heart 🌸",
  "July 9th, 2026 wasn't just a date on the calendar — it was the eternal beginning of US 💕",
];

const POLAROID_HERO_PHOTOS = [
  {
    src: '/gallery/photo6.jpg',
    title: 'July 9th, 2026 — The First Spark ✨',
    note: 'The exact day our paths crossed. Looking back, July 9th, 2026 was the best day of my life ❤️',
    rotation: -4,
  },
  {
    src: '/gallery/photo7.jpg',
    title: 'Unforgettable Journey 🌸',
    note: 'From July 9th, 2026 to infinity, every conversation and memory with you is pure magic 💕',
    rotation: 3,
  },
];

export const July9thSpecial: React.FC<July9thSpecialProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [giftOpened, setGiftOpened] = useState(false);
  const [clickSparkles, setClickSparkles] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Real-time counter logic for July 9th, 2026
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });

  useEffect(() => {
    const startDate = new Date('2026-07-09T00:00:00');

    const updateTimer = () => {
      const now = new Date();
      const diffMs = now.getTime() - startDate.getTime();
      const isPast = diffMs >= 0;
      const absMs = Math.abs(diffMs);

      const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absMs % (1000 * 60)) / 1000);
      setTimeElapsed({ days, hours, minutes, seconds, isPast });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Phase sequencing on mount
  useEffect(() => {
    soundEngine.playOrchestraSwell();

    // Fire golden celebration confetti
    const fireConfetti = () => {
      confetti({
        particleCount: 120,
        spread: 130,
        origin: { y: 0.35 },
        colors: ['#f7e7ce', '#fadadd', '#f8c8dc', '#ec4899', '#d4af37', '#ffffff'],
      });
    };

    fireConfetti();
    const tConfetti = setTimeout(fireConfetti, 900);
    const t1 = setTimeout(() => setPhase('counter'), 2500);

    return () => {
      clearTimeout(tConfetti);
      clearTimeout(t1);
    };
  }, []);

  // Auto-advance through messages in 'memories' phase
  useEffect(() => {
    if (phase !== 'memories') return;
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev >= JULY_9TH_MESSAGES.length) {
          clearInterval(interval);
          setTimeout(() => setPhase('bouquet'), 1500);
          return prev;
        }
        soundEngine.playClick();
        return prev + 1;
      });
    }, 1300);
    return () => clearInterval(interval);
  }, [phase]);

  const handleOpenGift = () => {
    if (giftOpened) return;
    soundEngine.playGiftUnwrap();
    setGiftOpened(true);
    confetti({
      particleCount: 160,
      spread: 140,
      origin: { y: 0.5 },
      colors: ['#f7e7ce', '#fbbf24', '#f43f5e', '#d4af37', '#ffffff'],
    });
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    soundEngine.playHeartbeat();

    const quotes = [
      'July 9th Special ✨',
      'The Day We Met ❤️',
      'Eternal Magic 💖',
      'You & Me 💫',
      'Best Date Ever 🌟',
    ];
    const text = quotes[Math.floor(Math.random() * quotes.length)];

    setClickSparkles((prev) => [...prev.slice(-6), { id: Date.now(), x, y, text }]);
  };

  const handleProceedNext = () => {
    soundEngine.playPageSwitch();
    onNext();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleScreenClick}
      className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden select-none my-auto bg-gradient-to-b from-[#0f051d] via-[#1a0b2e] to-[#0f051d]"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-rose-500/5 to-transparent pointer-events-none" />

      {/* Floating Click Sparkles */}
      {clickSparkles.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{ opacity: 1, scale: 0.5, y: 0 }}
          animate={{ opacity: 0, scale: 1.4, y: -40 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ left: sp.x, top: sp.y }}
          className="absolute z-50 pointer-events-none flex items-center gap-1 bg-[#0f051d]/90 border border-amber-300/40 text-amber-200 px-3 py-1 rounded-full text-xs font-mono shadow-[0_0_20px_rgba(245,158,11,0.5)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>{sp.text}</span>
        </motion.div>
      ))}

      {/* Top Badge Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-amber-100 text-xs font-code mb-3 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
          <Calendar className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>PAGE 20 // JULY 9TH MET DAY SPECIAL</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 bg-clip-text text-transparent tracking-tight">
          July 9th — The Day Our Universe Aligned
        </h1>
        <p className="text-amber-200/70 text-xs sm:text-sm mt-1.5 font-light">
          Celebrating the special day we met & the journey that followed ❤️
        </p>
      </motion.div>

      {/* Main Interactive Stage */}
      <div className="w-full max-w-4xl min-h-[480px] flex items-center justify-center my-6 relative z-10">
        <AnimatePresence mode="wait">
          {/* Phase 1: Intro Announcement */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6 glass-card-luxury p-8 sm:p-12 rounded-[36px] border border-amber-400/40 shadow-[0_0_60px_rgba(212,175,55,0.25)] max-w-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/30 to-rose-500/30 border border-amber-300/50 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(245,158,11,0.4)] text-4xl"
              >
                🌟
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif-luxury text-amber-100 font-bold">
                  July 9th ❤️
                </h2>
                <p className="text-pink-100/90 text-sm leading-relaxed font-light">
                  A day carved into infinity. The moment our story officially began.
                </p>
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setPhase('counter');
                }}
                className="glass-button-romantic px-6 py-3 rounded-full text-white font-medium text-sm inline-flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Explore July 9th Counter & Magic</span>
              </button>
            </motion.div>
          )}

          {/* Phase 2: Live Met-Day Counter */}
          {phase === 'counter' && (
            <motion.div
              key="counter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center space-y-8"
            >
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-amber-300 uppercase tracking-widest bg-amber-500/10 px-4 py-1 rounded-full border border-amber-400/30">
                  ⚡ Live Cosmic Counter
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif-luxury">
                  Time Since We First Met (July 9th)
                </h2>
              </div>

              {/* Counter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                {[
                  { label: 'Days', value: timeElapsed.days, icon: '🗓️' },
                  { label: 'Hours', value: timeElapsed.hours, icon: '⏳' },
                  { label: 'Minutes', value: timeElapsed.minutes, icon: '💫' },
                  { label: 'Seconds', value: timeElapsed.seconds, icon: '💓' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card-apple p-5 rounded-2xl border border-amber-400/30 text-center shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:border-amber-300/60 transition-all"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-amber-200 font-mono">
                      {item.value}
                    </div>
                    <div className="text-xs text-pink-200/70 font-mono mt-1 uppercase tracking-wider">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setPhase('memories');
                  }}
                  className="glass-button-romantic px-7 py-3 rounded-full text-white font-medium text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:scale-105 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-pink-300" />
                  <span>Reveal July 9th Notes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Heartfelt Messages */}
          {phase === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-amber-200 font-serif-luxury">
                  Why July 9th Is Eternal ❤️
                </h3>
                <p className="text-xs text-pink-200/70 mt-1">Tap through or let the messages flow</p>
              </div>

              <div className="space-y-3">
                {JULY_9TH_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card-apple p-4 rounded-2xl border border-rose-400/30 text-slate-100 text-sm font-light flex items-center gap-3 shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                  >
                    <span className="text-amber-300 text-lg">✨</span>
                    <span>{msg}</span>
                  </motion.div>
                ))}
              </div>

              {visibleMessages >= JULY_9TH_MESSAGES.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-4 text-center"
                >
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setPhase('bouquet');
                    }}
                    className="glass-button-romantic px-6 py-2.5 rounded-full text-white text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    <span>View July 9th Bouquet</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Phase 4: Animated Bouquet */}
          {phase === 'bouquet' && (
            <motion.div
              key="bouquet"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-amber-100 font-serif-luxury">
                  A Royal Bouquet for July 9th 💐
                </h3>
                <p className="text-xs text-pink-200/70 mt-1">Tap flowers to uncover secret love notes</p>
              </div>

              <AnimatedBouquet />

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setPhase('gift');
                }}
                className="glass-button-romantic px-7 py-3 rounded-full text-white text-sm font-medium inline-flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 transition-all"
              >
                <Gift className="w-4 h-4 text-amber-300" />
                <span>Open July 9th Special Gift</span>
              </button>
            </motion.div>
          )}

          {/* Phase 5: Gift Unboxing & Letter */}
          {phase === 'gift' && (
            <motion.div
              key="gift"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6 max-w-md w-full"
            >
              {!giftOpened ? (
                <div className="glass-card-luxury p-8 rounded-3xl border border-amber-400/40 text-center space-y-6 shadow-[0_0_60px_rgba(212,175,55,0.3)]">
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    onClick={handleOpenGift}
                    className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/30 to-rose-500/30 border-2 border-amber-300 flex items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(245,158,11,0.5)] group hover:scale-110 transition-all text-5xl"
                  >
                    🎁
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold text-amber-100 font-serif-luxury">
                      July 9th Surprise Box
                    </h3>
                    <p className="text-xs text-pink-200/70 mt-1">Tap the gift box to unwrap your message</p>
                  </div>

                  <button
                    onClick={handleOpenGift}
                    className="glass-button-romantic px-6 py-2.5 rounded-full text-white text-xs font-medium inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unwrap Surprise</span>
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card-luxury p-6 sm:p-8 rounded-3xl border border-amber-400/50 space-y-4 text-left shadow-[0_0_60px_rgba(212,175,55,0.4)]"
                >
                  <div className="flex items-center gap-2 text-amber-300 font-mono text-xs border-b border-amber-400/20 pb-2">
                    <Stars className="w-4 h-4 text-amber-300" />
                    <span>JULY 9TH, 2026 CONFIDENTIAL LETTER</span>
                  </div>

                  <div className="space-y-3 font-light text-sm text-slate-100 leading-relaxed font-serif-luxury">
                    <p className="text-amber-200 font-bold text-base">Dearest Dhvani,</p>
                    <p>
                      July 9th, 2026 will forever hold a sacred place in my heart. That was the day
                      fate stepped in and introduced me to the most incredible person in the universe.
                    </p>
                    <p>
                      Every single moment since July 9th, 2026 has been brighter, warmer, and full of pure purpose because of you.
                      Thank you for your warmth, your smile, and for being my favorite person in the world.
                    </p>
                    <p className="text-right text-pink-300 font-semibold pt-2">
                      With all my love, Om ❤️
                    </p>
                  </div>

                  <div className="pt-4 text-center">
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setPhase('finale');
                      }}
                      className="glass-button-romantic px-7 py-3 rounded-full text-white text-sm font-medium inline-flex items-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 transition-all"
                    >
                      <span>Complete July 9th Special</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Phase 6: Finale / Next Chapter */}
          {phase === 'finale' && (
            <motion.div
              key="finale"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 glass-card-luxury p-8 sm:p-12 rounded-[36px] border border-amber-400/50 shadow-[0_0_80px_rgba(212,175,55,0.4)] max-w-lg"
            >
              <div className="text-4xl sm:text-5xl">🎆 ❤️ 🌟</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 font-serif-luxury">
                July 9th Special Complete!
              </h2>
              <p className="text-xs sm:text-sm text-pink-200/80 leading-relaxed font-light">
                Our story started on July 9th and continues into infinity. Ready to proceed to the Grand Finale?
              </p>

              <button
                onClick={handleProceedNext}
                className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-semibold text-sm inline-flex items-center gap-3 shadow-[0_0_40px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Proceed to Grand Finale</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Phase Selector Dots */}
      <div className="flex items-center gap-2 z-10 pb-2">
        {(['intro', 'counter', 'memories', 'bouquet', 'gift', 'finale'] as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => {
              soundEngine.playClick();
              setPhase(p);
            }}
            className={`transition-all duration-300 rounded-full ${
              phase === p
                ? 'w-6 h-2 bg-gradient-to-r from-amber-400 to-rose-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                : 'w-2 h-2 bg-white/20 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default July9thSpecial;
