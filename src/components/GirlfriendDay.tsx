import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { AnimatedBouquet } from './AnimatedBouquet';

interface GirlfriendDayProps {
  onNext: () => void;
}

type Phase = 'intro' | 'hero' | 'messages' | 'bouquet' | 'gift' | 'heartwall' | 'finale';

const HEARTFELT_MESSAGES = [
  "You are the reason I believe in true magic ✨",
  "Every sunrise reminds me of your gentle smile 🌅",
  "In a world full of noise, your voice is my favorite melody 💫",
  "My absolute favorite place in the whole universe is right next to you ❤️",
  "You don't just make my day brighter — you make my entire life meaningful 🌸",
  "Distance may keep us miles apart, but our hearts beat in total harmony 💕",
  "Thank you for being the most incredible person in my life 💗",
];

const POLAROID_HERO_PHOTOS = [
  {
    src: '/gallery/photo6.jpg',
    title: 'Our Magical First Date ✨',
    note: 'Standing beside you under the glowing tree lights... the exact moment I fell in love ❤️',
    rotation: -4,
  },
  {
    src: '/gallery/photo7.jpg',
    title: 'Unforgettable Moments 🌸',
    note: 'Every laugh, every smile, every quiet second spent with you is a memory I treasure forever 💕',
    rotation: 3,
  },
];

const PHOTOS = [
  '/gallery/photo1.jpg', '/gallery/photo2.jpg', '/gallery/photo3.jpg',
  '/gallery/photo4.jpg', '/gallery/photo5.jpg', '/gallery/photo6.jpg',
  '/gallery/photo7.jpg', '/gallery/photo8.jpg', '/gallery/photo9.jpg',
];

export const GirlfriendDay: React.FC<GirlfriendDayProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [giftOpened, setGiftOpened] = useState(false);
  const [heartWallFormed, setHeartWallFormed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Phase sequencing
  useEffect(() => {
    soundEngine.playOrchestraSwell();

    // Fire celebration confetti
    const fireConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.3 },
        colors: ['#f7e7ce', '#fadadd', '#f8c8dc', '#ec4899', '#d4af37', '#ffffff'],
      });
    };

    fireConfetti();
    setTimeout(fireConfetti, 800);

    const t1 = setTimeout(() => setPhase('hero'), 3000);
    return () => clearTimeout(t1);
  }, []);

  // Auto-advance through messages
  useEffect(() => {
    if (phase !== 'messages') return;
    const interval = setInterval(() => {
      setVisibleMessages(prev => {
        if (prev >= HEARTFELT_MESSAGES.length) {
          clearInterval(interval);
          setTimeout(() => setPhase('bouquet'), 1500);
          return prev;
        }
        soundEngine.playClick();
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [phase]);

  // Heart wall formation
  useEffect(() => {
    if (phase !== 'heartwall') return;
    setTimeout(() => setHeartWallFormed(true), 500);
  }, [phase]);

  const handleOpenGift = () => {
    if (giftOpened) return;
    soundEngine.playGiftUnwrap();
    setGiftOpened(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f7e7ce', '#fadadd', '#d4af37', '#ec4899'],
    });
    setTimeout(() => setPhase('heartwall'), 4000);
  };

  // Heart wall positions
  const getHeartPosition = (index: number) => {
    const heartPoints: [number, number][] = [
      [50, 75],
      [30, 50], [70, 50],
      [20, 35], [80, 35],
      [28, 22], [72, 22],
      [40, 15], [60, 15],
    ];
    const p = heartPoints[index % heartPoints.length];
    return { x: p[0], y: p[1] };
  };

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden overflow-y-auto bg-[#0f051d]"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f051d] via-[#2d0a10] to-[#0f051d] pointer-events-none" />

      {/* Falling Petals Throughout */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={`petal-${i}`}
          className="absolute pointer-events-none animate-petal-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
            animationDelay: `${Math.random() * 12}s`,
            animationDuration: `${10 + Math.random() * 8}s`,
            zIndex: 5,
          }}
        >
          <div
            className="w-3 h-4 rounded-full opacity-60 filter blur-[0.2px]"
            style={{
              background: ['#f7e7ce', '#fadadd', '#f8c8dc', '#b76e79'][i % 4],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}

      {/* Floating Butterflies */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={`gd-butterfly-${i}`}
          animate={{
            x: [0, 80 + i * 30, -40, 60, 0],
            y: [0, -40, -80, -30, 0],
          }}
          transition={{ duration: 15 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute pointer-events-none text-xl sm:text-2xl filter drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]"
          style={{ left: `${15 + i * 20}%`, top: `${20 + i * 15}%`, zIndex: 6 }}
        >
          <span className="animate-butterfly-wings inline-block">🦋</span>
        </motion.div>
      ))}

      {/* ─── PHASE: INTRO (Flowers blooming & Title) ─── */}
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1 }}
            className="h-screen flex items-center justify-center relative z-10"
          >
            {/* Blooming flowers background */}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
                className="absolute text-2xl sm:text-4xl filter drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                style={{
                  left: `${10 + (i * 17) % 80}%`,
                  top: `${10 + (i * 23) % 75}%`,
                }}
              >
                {['🌸', '🌹', '🌷', '🌺', '🌻', '💐'][i % 6]}
              </motion.div>
            ))}

            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1, type: 'spring' }}
              className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold text-white text-center glow-text-gold relative z-10 px-4"
            >
              Happy Girlfriend's Day ❤️
            </motion.h1>
          </motion.div>
        )}

        {/* ─── PHASE: HERO (Polaroid Photos with Cute Notes) ─── */}
        {phase === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-12"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center glow-text-gold mb-6"
            >
              Happy Girlfriend's Day ❤️
            </motion.h2>

            {/* Comforting Note Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="glass-card-luxury p-5 sm:p-6 max-w-xl text-center mb-8 shadow-2xl border border-[#f7e7ce]/30"
            >
              <div className="text-3xl mb-2">🌸✨💕</div>
              <p className="font-handwritten text-lg sm:text-xl text-[#f7e7ce] leading-relaxed">
                "I know seeing all of this might feel a little overwhelming right now, but every single line of code, every memory, and every petal here was created just to make you feel cherished, celebrated, and loved beyond measure. You deserve all the happiness in this universe ❤️"
              </p>
            </motion.div>

            {/* Polaroid Photo Cards inside Crystal Frames */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 max-w-4xl w-full mb-8">
              {POLAROID_HERO_PHOTOS.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, rotate: photo.rotation * 2 }}
                  animate={{ opacity: 1, y: 0, rotate: photo.rotation }}
                  transition={{ delay: 0.6 + i * 0.3, duration: 0.8, type: 'spring', stiffness: 120 }}
                  className="polaroid-frame p-3 sm:p-4 w-72 sm:w-80 shadow-2xl relative border-2 border-[#f7e7ce]/40"
                >
                  <div className="overflow-hidden rounded-md aspect-[4/3] mb-3">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-serif-luxury text-base font-bold text-gray-800 mb-1">
                      {photo.title}
                    </h4>
                    <p className="font-handwritten text-sm text-rose-800 leading-snug">
                      "{photo.note}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              onClick={() => setPhase('messages')}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b76e79] text-[#0f051d] text-sm font-semibold shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all font-serif-luxury cursor-pointer"
            >
              Read My Heart ❤️
            </motion.button>
          </motion.div>
        )}

        {/* ─── PHASE: MESSAGES (One by one) ─── */}
        {phase === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-12"
          >
            <div className="max-w-lg space-y-4">
              {HEARTFELT_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="glass-card-luxury p-4 border border-[#f7e7ce]/30"
                >
                  <p className="font-handwritten text-lg sm:text-xl text-[#f7e7ce]">
                    {msg}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── PHASE: BOUQUET ─── */}
        {phase === 'bouquet' && (
          <motion.div
            key="bouquet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-8"
          >
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2 text-center glow-text-gold"
            >
              A Bouquet Just for You 💐
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-handwritten text-lg sm:text-xl text-[#f7e7ce] text-center mb-2"
            >
              "Every flower in this bouquet represents a reason I love you"
            </motion.p>

            <AnimatedBouquet />

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
              onClick={() => setPhase('gift')}
              className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b76e79] text-[#0f051d] text-sm font-semibold shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all font-serif-luxury cursor-pointer"
            >
              Open Your Gift 🎁
            </motion.button>
          </motion.div>
        )}

        {/* ─── PHASE: GIFT BOX WRAPPED WITH SILK RIBBONS ─── */}
        {phase === 'gift' && (
          <motion.div
            key="gift"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4"
          >
            <div className="relative cursor-pointer" onClick={handleOpenGift}>
              <motion.div
                animate={giftOpened ? { scale: 0.8, opacity: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="relative"
                style={{ perspective: '600px' }}
              >
                <div
                  className="w-44 h-44 sm:w-56 sm:h-56 rounded-3xl relative flex items-center justify-center border-2 border-[#f7e7ce]/50"
                  style={{
                    background: 'linear-gradient(135deg, #d4af37, #b76e79)',
                    boxShadow: '0 20px 60px rgba(212, 175, 55, 0.4), inset 0 2px 4px rgba(255,255,255,0.4)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-5 bg-[#f7e7ce]/80 absolute" />
                    <div className="w-5 h-full bg-[#f7e7ce]/80 absolute" />
                  </div>

                  <div className="absolute -top-7 text-4xl sm:text-5xl filter drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">🎀</div>

                  {!giftOpened && (
                    <motion.p
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative z-10 font-serif-luxury text-[#0f051d] text-sm font-bold tracking-wide"
                    >
                      Tap to Open ✨
                    </motion.p>
                  )}
                </div>
              </motion.div>

              <AnimatePresence>
                {giftOpened && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
                    className="glass-card-luxury p-6 text-center max-w-sm border-2 border-[#f7e7ce]/40"
                  >
                    <img
                      src="/gallery/photo7.jpg"
                      alt="Surprise memory"
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                    <p className="font-handwritten text-lg text-[#f7e7ce]">
                      "This is us — imperfect, beautiful, and completely in love. I wouldn't change a single thing about our story. ❤️"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ─── PHASE: HEART WALL (Polaroids → Heart Shape) ─── */}
        {phase === 'heartwall' && (
          <motion.div
            key="heartwall"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-12"
          >
            <motion.h3
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-8 text-center glow-text-gold"
            >
              Our Wall of Memories 💕
            </motion.h3>

            <div className="relative w-80 h-80 sm:w-96 sm:h-96">
              {PHOTOS.map((src, i) => {
                const pos = getHeartPosition(i);
                const randomPos = { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 };
                const targetPos = heartWallFormed ? pos : randomPos;

                return (
                  <motion.div
                    key={i}
                    initial={{
                      left: `${randomPos.x}%`,
                      top: `${randomPos.y}%`,
                      rotate: -10 + Math.random() * 20,
                      scale: 0,
                    }}
                    animate={{
                      left: `${targetPos.x}%`,
                      top: `${targetPos.y}%`,
                      rotate: heartWallFormed ? -5 + (i % 3) * 5 : -10 + Math.random() * 20,
                      scale: 1,
                    }}
                    transition={{
                      delay: i * 0.15,
                      duration: 1.2,
                      type: 'spring',
                      stiffness: 80,
                    }}
                    className="absolute w-16 h-20 sm:w-20 sm:h-24 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="polaroid-frame p-1 w-full h-full border border-[#f7e7ce]/40">
                      <img
                        src={src}
                        alt={`Memory ${i + 1}`}
                        className="w-full h-full object-cover rounded-sm"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              onClick={() => setPhase('finale')}
              className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b76e79] text-[#0f051d] text-sm font-semibold shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all font-serif-luxury cursor-pointer"
            >
              See the Finale ✨
            </motion.button>
          </motion.div>
        )}

        {/* ─── PHASE: FINALE ─── */}
        {phase === 'finale' && (
          <motion.div
            key="finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 py-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, type: 'spring' }}
              className="text-center mb-8"
            >
              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white glow-text-gold leading-tight">
                Happy Girlfriend's Day
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7e7ce] via-[#d4af37] to-[#fadadd]">
                  ❤️ Dhvani
                </span>
              </h2>

              <div className="flex justify-center gap-2 mt-4 text-2xl sm:text-3xl">
                {['🌸', '🌹', '🌷', '💐', '🌺', '🌻', '🌼', '🪷'].map((f, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 200 }}
                  >
                    {f}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
              className="glass-card-luxury p-6 sm:p-8 max-w-lg text-center border-2 border-[#f7e7ce]/40"
            >
              <p className="font-handwritten text-lg sm:text-xl text-[#f7e7ce] leading-relaxed">
                "Thank you for being the most beautiful chapter of my life. No matter how many flowers bloom in this world, none could ever compare to you.
              </p>
              <p className="font-handwritten text-lg sm:text-xl text-[#f7e7ce] mt-4">
                Happy Girlfriend's Day ❤️
              </p>
              <p className="font-handwritten text-xl sm:text-2xl text-white mt-4 font-bold">
                — Om"
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
              onClick={() => { soundEngine.playPageSwitch(); onNext(); }}
              className="mt-8 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b76e79] text-[#0f051d] text-sm font-semibold shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all font-serif-luxury cursor-pointer"
            >
              Continue the Journey 💌
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rising lanterns throughout */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`lantern-${i}`}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: '-20vh', opacity: [0, 0.6, 0.6, 0] }}
          transition={{
            delay: 2 + i * 3,
            duration: 15,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute text-xl sm:text-2xl pointer-events-none z-10 filter drop-shadow-[0_0_12px_rgba(255,183,77,0.6)]"
          style={{ left: `${10 + i * 15}%` }}
        >
          🏮
        </motion.div>
      ))}
    </section>
  );
};

export default GirlfriendDay;
