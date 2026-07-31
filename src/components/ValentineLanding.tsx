import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, VolumeX, ArrowRight, Star, Flower2, Gift, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface ValentineLandingProps {
  onNext?: () => void;
  onOpenGallery?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  emoji: string;
}

const TYPEWRITER_MESSAGES = [
  "To Dhvani, The Girl Who Turned My Entire Universe Into Poetry ❤️",
  "Every Single Day With You Is My Favorite Memory 💕",
  "Handcrafted With Love & Care By Om ✨",
];

const LOVE_CARDS = [
  {
    icon: '✨',
    title: 'Pure Magic & Peace',
    description: 'No matter how chaotic the world gets, one look at your smile brings instant peace to my mind.',
    color: 'from-pink-500/10 to-rose-500/10',
    border: 'border-pink-300/40',
  },
  {
    icon: '🌸',
    title: 'Beautiful Memories',
    description: 'Every laugh shared, every quiet moment, every late-night conversation stitched together with pure love.',
    color: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-300/40',
  },
  {
    icon: '💖',
    title: 'Irreplaceable Soulmate',
    description: 'Out of 8 billion people in this universe, you will always be my absolute favorite person.',
    color: 'from-rose-500/10 to-red-500/10',
    border: 'border-rose-300/40',
  },
];

export const ValentineLanding: React.FC<ValentineLandingProps> = ({ onNext, onOpenGallery }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [heartBursts, setHeartBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // 3D Tilt Effect on Couple Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotX(-((y - centerY) / centerY) * 12);
    setRotY(((x - centerX) / centerX) * 12);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  // Heart burst on click
  const handleButtonClick = (e: React.MouseEvent, callback?: () => void) => {
    soundEngine.playHeartPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const newBurst = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setHeartBursts((prev) => [...prev.slice(-6), newBurst]);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FFD6E8', '#F8C8DC', '#FF4F7B', '#FF5C7A', '#EBD8FF'],
    });

    if (callback) callback();
  };

  // Typewriter animation loop
  useEffect(() => {
    const fullText = TYPEWRITER_MESSAGES[typewriterIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
          if (currentText.length === fullText.length) {
            setTimeout(() => setIsDeleting(true), 2500);
          }
        } else {
          setCurrentText(fullText.slice(0, currentText.length - 1));
          if (currentText.length === 0) {
            setIsDeleting(false);
            setTypewriterIndex((prev) => (prev + 1) % TYPEWRITER_MESSAGES.length);
          }
        }
      },
      isDeleting ? 30 : 65
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, typewriterIndex]);

  // Audio Toggle
  const toggleAudio = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) soundEngine.startAmbientBGM();
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-[#FFD6E8] via-[#F8C8DC] to-[#EBD8FF] text-slate-800 overflow-x-hidden font-sans select-none pb-24">
      {/* Soft Animated Background Bokeh Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#FF4F7B]/20 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-[#EBD8FF]/40 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], y: [0, -50, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 4 }}
          className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-[#FF5C7A]/15 blur-[110px]"
        />

        {/* Floating Rose Petals & Feathers */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: ['-10vh', '110vh'],
              x: [0, Math.sin(i) * 50, Math.cos(i) * 30, 0],
              rotate: [0, 360],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 8 + (i % 5) * 2,
              delay: i * 0.8,
              ease: 'linear',
            }}
            className="absolute text-xl pointer-events-none"
            style={{ left: `${(i * 7) % 95}%` }}
          >
            {['🌸', '🌹', '🪶', '✨', '💖', '🌺'][i % 6]}
          </motion.div>
        ))}

        {/* Floating Butterflies */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`bf-${i}`}
            animate={{
              x: [0, 40 * Math.sin(i), -30, 20, 0],
              y: [0, -35, 20, -20, 0],
              rotate: [0, 15, -10, 0],
            }}
            transition={{ repeat: Infinity, duration: 7 + i * 2, ease: 'easeInOut', delay: i }}
            className="absolute text-2xl pointer-events-none drop-shadow-[0_0_10px_rgba(255,79,123,0.4)]"
            style={{ top: `${20 + i * 15}%`, left: `${10 + i * 18}%` }}
          >
            🦋
          </motion.div>
        ))}
      </div>

      {/* Floating Heart Bursts */}
      {heartBursts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, scale: 0.5, y: h.y, x: h.x - 12 }}
          animate={{ opacity: 0, scale: 2, y: h.y - 100, x: h.x + (Math.random() * 40 - 20) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          onAnimationComplete={() =>
            setHeartBursts((prev) => prev.filter((item) => item.id !== h.id))
          }
          className="fixed z-50 text-3xl pointer-events-none"
        >
          💖
        </motion.div>
      ))}

      {/* Floating Ambient Music Control Button */}
      <div className="fixed top-5 right-5 z-40">
        <button
          onClick={toggleAudio}
          className="glass-pill p-3 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-[#FF4F7B] shadow-[0_8px_25px_rgba(255,79,123,0.25)] hover:scale-110 active:scale-95 transition-all flex items-center gap-2"
          title={isMuted ? 'Play Romantic Music' : 'Mute Music'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
          <span className="hidden sm:inline text-xs font-code font-bold text-[#FF5C7A]">
            {isMuted ? 'Muted' : 'Piano BGM'}
          </span>
        </button>
      </div>

      {/* Glassmorphism Navigation Bar */}
      <nav className="w-full max-w-6xl mx-auto px-4 pt-6 z-20 relative">
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-full px-6 py-3.5 flex items-center justify-between shadow-[0_10px_30px_rgba(255,79,123,0.12)]">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF4F7B] to-[#FF5C7A] flex items-center justify-center text-white text-lg shadow-md">
              💖
            </div>
            <span className="font-display font-bold text-lg sm:text-xl text-[#8A1C40] tracking-tight">
              Dhvani <span className="text-[#FF4F7B] font-cursive text-2xl font-normal">Love Edition</span>
            </span>
          </div>

          {/* Nav Badges & CTAs */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-400/30 text-xs font-code text-[#FF4F7B] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4F7B]" />
              <span>HANDCRAFTED BY OM</span>
            </span>

            {onOpenGallery && (
              <button
                onClick={(e) => handleButtonClick(e, onOpenGallery)}
                className="px-4 py-1.5 rounded-full bg-white/70 hover:bg-white text-[#FF4F7B] text-xs font-semibold border border-[#FF4F7B]/30 shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>🖼️ Our Gallery</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION — MAIN SOFT WHITE CARD SYSTEM */}
      <main className="w-full max-w-5xl mx-auto px-4 pt-8 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-2xl border-2 border-white/90 rounded-[40px] p-6 sm:p-12 lg:p-16 shadow-[0_25px_80px_rgba(255,79,123,0.18)] relative overflow-hidden"
        >
          {/* Subtle Ambient Card Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FFD6E8]/40 to-[#F8C8DC]/40 rounded-full blur-3xl pointer-events-none" />

          {/* Grid Layout: Text Left, Couple Illustration Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Romantic Ribbon Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD6E8] border border-[#FF4F7B]/30 text-[#8A1C40] text-xs font-code font-bold shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 text-[#FF4F7B] fill-[#FF4F7B] animate-pulse" />
                <span>VALENTINE'S SPECIAL EDITION</span>
              </motion.div>

              {/* Typewriter Hero Heading */}
              <div className="min-h-[120px] sm:min-h-[140px] flex items-center">
                <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#4A1026] leading-tight tracking-tight">
                  {currentText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="inline-block w-1.5 h-10 bg-[#FF4F7B] ml-1 align-middle"
                  />
                </h1>
              </div>

              {/* Subtitle Description */}
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light max-w-xl">
                This digital landing page was designed with pure love, soft blush-pink gradients, floating petals, and countless thoughts about you. Every detail here is meant to make you smile.
              </p>

              {/* Romantic CTA Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={(e) => handleButtonClick(e, onNext)}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF4F7B] to-[#FF5C7A] text-white font-bold text-base shadow-[0_10px_30px_rgba(255,79,123,0.4)] hover:shadow-[0_15px_40px_rgba(255,79,123,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <Heart className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
                  <span>Begin Love Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {onOpenGallery && (
                  <button
                    onClick={(e) => handleButtonClick(e, onOpenGallery)}
                    className="px-7 py-4 rounded-full bg-white text-[#FF4F7B] font-bold text-base border-2 border-[#FF4F7B]/30 hover:border-[#FF4F7B] shadow-sm hover:bg-pink-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>🖼️ Memory Museum</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: 3D Tilt Vector Couple Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="relative w-full max-w-sm aspect-square rounded-[36px] bg-gradient-to-br from-[#FFD6E8]/60 via-[#F8C8DC]/60 to-[#EBD8FF]/60 border-2 border-white/80 p-8 shadow-[0_20px_50px_rgba(255,79,123,0.2)] flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                {/* Glowing Circle Aura */}
                <div className="absolute inset-4 rounded-full bg-white/60 blur-xl group-hover:bg-white/80 transition-all" />

                {/* Vector Hugging Couple Emojis & Artwork */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="relative z-10 space-y-4"
                >
                  <div className="text-8xl sm:text-9xl drop-shadow-[0_10px_20px_rgba(255,79,123,0.3)]">
                    👩‍❤️‍👨
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-[#8A1C40] text-xs font-code font-bold shadow-md">
                    <span>Om & Dhvani</span>
                    <Heart className="w-3.5 h-3.5 text-[#FF4F7B] fill-[#FF4F7B]" />
                  </div>
                </motion.div>

                {/* Orbiting Sparkles around Couple */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                >
                  <div className="w-64 h-64 border border-dashed border-[#FF4F7B]/30 rounded-full relative">
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-lg">✨</span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-lg">🌸</span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-lg">💖</span>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-lg">🌹</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* LOWER SECTION: THREE FEATURE LOVE CARDS */}
          <div className="mt-16 pt-12 border-t border-pink-200/60 grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOVE_CARDS.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                onClick={() => {
                  soundEngine.playHeartPop();
                  setSelectedCard(selectedCard === idx ? null : idx);
                }}
                className={`p-6 rounded-3xl bg-gradient-to-br ${card.color} border ${card.border} hover:shadow-[0_15px_35px_rgba(255,79,123,0.15)] hover:-translate-y-1 transition-all cursor-pointer relative group`}
              >
                <div className="text-3xl mb-3 group-hover:scale-125 transition-transform">
                  {card.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-[#4A1026] mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* FOOTER ROMANTIC QUOTE */}
          <div className="mt-12 text-center pt-8 border-t border-pink-100">
            <p className="font-handwritten text-2xl sm:text-3xl text-[#FF4F7B]">
              "If I had a flower for every time I thought of you, I could walk through my garden forever." 🌸
            </p>
            <p className="text-xs font-code text-slate-400 mt-2">
              DESIGNED WITH UNLIMITED LOVE BY OM • FOR DHVANI ❤️
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ValentineLanding;
