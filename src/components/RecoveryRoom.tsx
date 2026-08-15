import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  CloudRain,
  CloudSun,
  Sparkles,
  Smile,
  Disc,
  Play,
  Pause,
  Coffee,
  Soup,
  Droplets,
  Flower2,
  Activity,
  ArrowLeft,
  X,
  Upload,
} from 'lucide-react';
import { recoveryAudio } from '../utils/recoveryAudio';

interface RecoveryRoomProps {
  onBackToMain: () => void;
}

type MoodWeather = 'better' | 'okay' | 'not_good' | 'tired';

const EMERGENCY_SMILES = [
  'Breaking News: Dhvani is still ridiculously cute.',
  'Your boyfriend has officially prescribed one hug. Prescription cannot be refused. 🫂',
  'Reminder: you are still my favorite person in the entire universe. 🌟',
  'System Alert: Om is thinking about you again. (Status: Always) ❤️',
  'Smile detected as missing. Initiating cute message protocol ❤️.',
  'Bug report: Fever detected in Dhvani. Patching with 10,000 warm kisses & unlimited head pats 💆‍♀️💖',
  'Official notice: You are under strict orders to stay wrapped in soft blankets and do zero chores today 🧸☕',
];

export const RecoveryRoom: React.FC<RecoveryRoomProps> = ({ onBackToMain }) => {
  // ─── Audio State ───
  const [isMuted, setIsMuted] = useState(recoveryAudio.getMuted());

  // ─── Cinematic & Scene States ───
  const [hasEnteredRoom, setHasEnteredRoom] = useState(false);
  const [imHereActive, setImHereActive] = useState(false);
  const [imHereMessage, setImHereMessage] = useState<string | null>(null);

  // ─── Virtual Hug Press-and-Hold ───
  const [isHoldingHug, setIsHoldingHug] = useState(false);
  const [hugProgress, setHugProgress] = useState(0);
  const [hugDelivered, setHugDelivered] = useState(false);
  const hugTimerRef = useRef<number | null>(null);

  // ─── Care Package Selected Item ───
  const [selectedCareItem, setSelectedCareItem] = useState<{
    title: string;
    message: string;
    icon: string;
  } | null>(null);

  // ─── Mood Weather ───
  const [moodWeather, setMoodWeather] = useState<MoodWeather>('not_good');

  // ─── Growing Flower ───
  const [flowerStage, setFlowerStage] = useState<number>(() => {
    const saved = localStorage.getItem('dhvani_flower_stage');
    return saved ? Math.min(4, Math.max(0, parseInt(saved, 10))) : 2; // Default to bud stage
  });
  const [flowerNurtured, setFlowerNurtured] = useState(false);

  // ─── Sleep / Rest Mode ───
  const [isRestMode, setIsRestMode] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'hold' | 'out'>('in');

  // ─── Cassette Player ───
  const [isPlayingCassette, setIsPlayingCassette] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ─── Emergency Smile ───
  const [smileMessage, setSmileMessage] = useState<string | null>(null);

  // ─── Final Scene & Goodnight Screen ───
  const [isWindowFocus, setIsWindowFocus] = useState(false);
  const [isGoodnightScreen, setIsGoodnightScreen] = useState(false);

  // ─── Lightning flash state ───
  const [lightningFlash, setLightningFlash] = useState(false);

  // Initialize Room Ambient Audio on Mount
  useEffect(() => {
    // Start procedural rain & ambient piano chords
    recoveryAudio.startRain();
    recoveryAudio.startAmbientPiano();

    // Occasional subtle distant lightning flash (without loud scary sounds)
    const lightningInterval = setInterval(() => {
      if (moodWeather === 'not_good' || moodWeather === 'tired') {
        if (Math.random() > 0.4) {
          setLightningFlash(true);
          setTimeout(() => setLightningFlash(false), 200);
          setTimeout(() => {
            setLightningFlash(true);
            setTimeout(() => setLightningFlash(false), 120);
          }, 350);
        }
      }
    }, 14000);

    return () => {
      clearInterval(lightningInterval);
      recoveryAudio.cleanup();
    };
  }, [moodWeather]);

  // Handle Mood Weather Audio / Lighting Changes
  useEffect(() => {
    if (moodWeather === 'better') {
      recoveryAudio.setRainIntensity('silent');
    } else if (moodWeather === 'okay') {
      recoveryAudio.setRainIntensity('soft');
    } else if (moodWeather === 'not_good') {
      recoveryAudio.setRainIntensity('normal');
    } else if (moodWeather === 'tired') {
      recoveryAudio.setRainIntensity('soft');
    }
  }, [moodWeather]);

  // Breathing Loop for Rest Mode
  useEffect(() => {
    if (!isRestMode) return;
    const interval = setInterval(() => {
      setBreathingPhase((prev) => {
        if (prev === 'in') return 'hold';
        if (prev === 'hold') return 'out';
        return 'in';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isRestMode]);

  // Toggle Sound
  const handleToggleSound = () => {
    const nextMuted = recoveryAudio.toggleMute();
    setIsMuted(nextMuted);
  };

  // ─── "I'm Here ❤️" Button Action ───
  const handleImHere = () => {
    recoveryAudio.playHeartBeat();
    setImHereActive(true);
    setImHereMessage("Then that's all you need to know. I'm right here. ❤️");
    setTimeout(() => {
      setImHereActive(false);
    }, 6000);
  };

  // ─── Virtual Hug Press & Hold Logic ───
  const startHugHold = () => {
    if (hugDelivered) {
      setHugDelivered(false);
      setHugProgress(0);
    }
    setIsHoldingHug(true);
    recoveryAudio.playHeartBeat();

    let current = 0;
    hugTimerRef.current = window.setInterval(() => {
      current += 4;
      setHugProgress(current);
      if (current >= 100) {
        if (hugTimerRef.current) clearInterval(hugTimerRef.current);
        setIsHoldingHug(false);
        setHugDelivered(true);
        recoveryAudio.playHugComplete();
      }
    }, 50);
  };

  const cancelHugHold = () => {
    if (hugTimerRef.current) clearInterval(hugTimerRef.current);
    setIsHoldingHug(false);
    if (hugProgress < 100) {
      setHugProgress(0);
    }
  };

  // ─── Care Package Item Click ───
  const handleCareItem = (item: { title: string; message: string; icon: string }) => {
    recoveryAudio.playCareItemClick();
    setSelectedCareItem(item);
  };

  // ─── Growing Flower Logic ───
  const handleNurtureFlower = () => {
    recoveryAudio.playBloomGently();
    setFlowerNurtured(true);
    setFlowerStage((prev) => {
      const next = Math.min(prev + 1, 4);
      localStorage.setItem('dhvani_flower_stage', next.toString());
      return next;
    });
    setTimeout(() => setFlowerNurtured(false), 3000);
  };

  // ─── Cassette Player Logic ───
  const toggleCassette = () => {
    if (customAudioUrl && customAudioRef.current) {
      if (isPlayingCassette) {
        customAudioRef.current.pause();
        setIsPlayingCassette(false);
      } else {
        customAudioRef.current.play();
        setIsPlayingCassette(true);
      }
      return;
    }

    if (isPlayingCassette) {
      recoveryAudio.stopCassetteLullaby();
      setIsPlayingCassette(false);
    } else {
      setIsPlayingCassette(true);
      recoveryAudio.startCassetteLullaby(() => {
        setIsPlayingCassette(false);
      });
    }
  };

  // Handle Voice Note File Upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setIsPlayingCassette(false);
    }
  };

  // ─── Emergency Smile Generator ───
  const handleEmergencySmile = () => {
    recoveryAudio.playCareItemClick();
    const randomIndex = Math.floor(Math.random() * EMERGENCY_SMILES.length);
    setSmileMessage(EMERGENCY_SMILES[randomIndex]);
  };

  // Flower labels and stages
  const flowerStages = [
    { title: 'Planted Seed 🌱', text: 'Resting safely in warm soil, gathering strength.' },
    { title: 'Tender Sprout 🌿', text: 'Peeking out into the sunlight. Recharging day by day.' },
    { title: 'Delicate Bud 🌷', text: 'Almost there! Cozy blankets and rest work wonders.' },
    { title: 'Soft Blossom 🌸', text: 'Petals unfurling with every hour of peaceful sleep.' },
    { title: 'Full Radiance 🌺', text: 'You got better, and my little flower bloomed with you. 🌸❤️' },
  ];

  return (
    <div className="min-h-screen w-full relative bg-[#130d1e] text-[#f7e7ce] overflow-x-hidden font-sans select-none flex flex-col justify-between">
      {/* ═══════════════════════════════════════════════════════════════
          BACKGROUND AMBIENCE & WEATHER ENVIRONMENT
          ═══════════════════════════════════════════════════════════════ */}
      {/* Dynamic Background Room Gradient based on Mood & Rest Mode */}
      <div
        className={`fixed inset-0 transition-all duration-1000 pointer-events-none z-0 ${
          isRestMode
            ? 'bg-gradient-to-b from-[#08040d] via-[#0d0718] to-[#050209]'
            : moodWeather === 'better'
            ? 'bg-gradient-to-b from-[#2a172c] via-[#211124] to-[#120817]'
            : moodWeather === 'okay'
            ? 'bg-gradient-to-b from-[#1f142b] via-[#170e22] to-[#0f0917]'
            : moodWeather === 'tired'
            ? 'bg-gradient-to-b from-[#0e071a] via-[#090412] to-[#05020a]'
            : 'bg-gradient-to-b from-[#180e24] via-[#12091d] to-[#0a0512]'
        }`}
      />

      {/* Lightning Flash Overlay (Far in distance) */}
      <div
        className={`fixed inset-0 bg-[#e4daf0]/15 pointer-events-none z-1 transition-opacity duration-100 ${
          lightningFlash ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Cozy Warm Bedside Lighting Glow */}
      <div
        className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          isRestMode
            ? 'w-72 h-72 bg-[#f59e0b]/5'
            : moodWeather === 'better'
            ? 'w-[550px] h-[550px] bg-[#f59e0b]/20'
            : 'w-[450px] h-[450px] bg-[#d4af37]/15'
        }`}
      />

      {/* Secondary Soft Blush/Lavender Glow */}
      <div className="fixed bottom-1/4 right-1/4 w-[380px] h-[380px] bg-[#c9899e]/12 rounded-full blur-[130px] pointer-events-none" />

      {/* Floating Gentle Dust Particles & Fireflies in Room Light */}
      <div className="fixed inset-0 pointer-events-none z-2 overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0
                ? 'bg-[#f7e7ce]/40 w-1.5 h-1.5 shadow-[0_0_8px_#f7e7ce]'
                : i % 2 === 0
                ? 'bg-[#f59e0b]/50 w-1 h-1 shadow-[0_0_6px_#f59e0b]'
                : 'bg-[#c9899e]/30 w-1 h-1'
            }`}
            style={{
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 95}%`,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 7 + (i % 5) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PERSISTENT TOP HEADER & CONTROLS
          ═══════════════════════════════════════════════════════════════ */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-4 flex items-center justify-between backdrop-blur-md bg-[#130d1e]/60 border-b border-[#f7e7ce]/15">
        {/* Back Button */}
        <button
          onClick={onBackToMain}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#f7e7ce]/80 hover:text-white bg-white/5 hover:bg-white/10 border border-[#f7e7ce]/20 transition-all active:scale-95 shadow-sm"
          title="Return to Romantic Journey"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Back to Main Site</span>
        </button>

        {/* Center Room Badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#c9899e]">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
          <span className="font-semibold tracking-wider uppercase text-[#f7e7ce]/90">
            Dhvani's Recovery Room
          </span>
          <span className="text-[#f7e7ce]/40 hidden sm:inline">•</span>
          <span className="text-[#f7e7ce]/60 text-[11px] hidden sm:inline">Cozy Care Sanctuary</span>
        </div>

        {/* Right Controls: Audio & Rest Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rest Mode Quick Toggle */}
          <button
            onClick={() => {
              recoveryAudio.playRestModeTone();
              setIsRestMode(!isRestMode);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all active:scale-95 border ${
              isRestMode
                ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#f7e7ce] shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-white/5 border-[#f7e7ce]/20 text-[#f7e7ce]/70 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Rest Mode"
          >
            <Moon className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="hidden sm:inline">{isRestMode ? 'Resting...' : 'Rest Mode'}</span>
          </button>

          {/* Sound Mute Button */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-full transition-all border ${
              isMuted
                ? 'border-white/10 text-slate-400 bg-black/20'
                : 'border-[#f7e7ce]/30 text-[#f59e0b] bg-white/5 hover:bg-white/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
            } active:scale-95`}
            title={isMuted ? 'Unmute Ambient Rain & Piano' : 'Mute Ambient Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN RECOVERY ROOM CONTENT AREA
          ═══════════════════════════════════════════════════════════════ */}
      <main className="relative z-20 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center justify-center space-y-8">
        {/* ─── CINEMATIC OPENING HERO ─── */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9899e]/15 border border-[#c9899e]/30 text-[#f7e7ce] text-xs font-mono shadow-[0_0_20px_rgba(201,137,158,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>SPECIAL COMFORT HAVEN // FOR DHVANI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif text-[#faf5eb] tracking-tight leading-snug">
            Welcome to your little recovery room, Dhvani ❤️
          </h1>

          <p className="text-[#f7e7ce]/80 text-sm sm:text-base font-light italic leading-relaxed">
            No questions today. No missions. You just need to rest.
          </p>

          {/* Glowing "I'm Here ❤️" Button */}
          <div className="pt-2 flex flex-col items-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleImHere}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#c9899e] via-[#d4af37] to-[#e4daf0] text-[#1a0c24] font-semibold text-sm font-mono flex items-center gap-2.5 shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.7)] transition-all"
            >
              <Heart className={`w-4 h-4 fill-[#1a0c24] ${imHereActive ? 'animate-ping' : ''}`} />
              <span>I'm Here ❤️</span>
            </motion.button>

            <AnimatePresence>
              {imHereMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-3 px-4 py-2 rounded-2xl bg-[#1e132e]/90 border border-[#f59e0b]/40 text-[#faf5eb] text-xs font-serif italic shadow-xl text-center"
                >
                  {imHereMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ─── COZY BEDROOM SCENE GRAPH (Interactive 2-Column Bento Room) ─── */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: Rainy Window & Virtual Hug Bedside Area (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* 1. Large Rainy Window Illustration & Bed View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-[#f7e7ce]/20 bg-[#160d24]/90 p-5 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col justify-between min-h-[340px]"
            >
              {/* Rainy Window Glass Frame (Top Half) */}
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a0515] to-[#140b20] border border-white/10 shadow-inner flex items-center justify-center">
                {/* Moving Clouds */}
                <motion.div
                  animate={{ x: [-20, 30, -20] }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300 via-transparent to-transparent"
                />

                {/* Animated Rain Drops on Glass */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-blue-200/50 to-transparent rounded-full"
                      style={{
                        height: `${25 + (i % 4) * 15}px`,
                        left: `${(i * 5.2) % 100}%`,
                        top: '-20px',
                      }}
                      animate={{
                        y: ['0px', '220px'],
                        opacity: [0.1, 0.7, 0],
                      }}
                      transition={{
                        duration: 1.1 + (i % 3) * 0.4,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                </div>

                {/* Swaying Linen Curtains */}
                <motion.div
                  animate={{ rotate: [-1.5, 1.5, -1.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-[#c9899e]/30 to-transparent pointer-events-none border-r border-[#c9899e]/20"
                />
                <motion.div
                  animate={{ rotate: [1.5, -1.5, 1.5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-[#c9899e]/30 to-transparent pointer-events-none border-l border-[#c9899e]/20"
                />

                {/* Warm Heart drawn on foggy window glass */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 p-3 rounded-full bg-black/30 border border-white/10 backdrop-blur-sm cursor-pointer flex items-center gap-2 text-xs font-serif text-[#faf5eb]/90 shadow-md"
                  onClick={() => {
                    recoveryAudio.playCareItemClick();
                    setIsWindowFocus(!isWindowFocus);
                  }}
                >
                  <Heart className="w-4 h-4 text-[#c9899e] fill-[#c9899e]/40 animate-pulse" />
                  <span className="hidden sm:inline">Rain softly tapping on the glass...</span>
                </motion.div>
              </div>

              {/* Bedside Area & Teddy Virtual Hug Interaction */}
              <div className="mt-5 pt-4 border-t border-[#f7e7ce]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Teddy Bear & Bed Description */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c9899e]/20 to-[#f59e0b]/20 border border-[#f7e7ce]/30 flex items-center justify-center text-3xl shadow-inner relative">
                    <span className={`transition-transform duration-300 ${isHoldingHug ? 'scale-125' : ''}`}>
                      🧸
                    </span>
                    {hugDelivered && (
                      <span className="absolute -top-1 -right-1 text-xs">💖</span>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-[#faf5eb] font-serif">
                      Your Bedside Teddy Bear
                    </div>
                    <div className="text-xs text-[#f7e7ce]/70 font-light">
                      {hugDelivered
                        ? 'Arms open wide! Hug delivered 🫂❤️'
                        : isHoldingHug
                        ? 'Holding your hand tight... Keep holding...'
                        : 'Press & hold to receive a warm virtual hug'}
                    </div>
                  </div>
                </div>

                {/* Hold My Hand Hug Button */}
                <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                  <button
                    onMouseDown={startHugHold}
                    onMouseUp={cancelHugHold}
                    onMouseLeave={cancelHugHold}
                    onTouchStart={startHugHold}
                    onTouchEnd={cancelHugHold}
                    className={`relative overflow-hidden px-5 py-2.5 rounded-full font-mono text-xs font-semibold transition-all border active:scale-95 shadow-md ${
                      hugDelivered
                        ? 'bg-[#c9899e]/30 border-[#c9899e] text-[#faf5eb]'
                        : 'bg-gradient-to-r from-[#c9899e]/30 via-[#f59e0b]/20 to-[#c9899e]/30 border-[#f7e7ce]/40 text-[#faf5eb] hover:border-[#f7e7ce]'
                    }`}
                  >
                    {/* Filling Progress Indicator Bar */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-[#c9899e] to-[#f59e0b] opacity-40 transition-all duration-75"
                      style={{ width: `${hugProgress}%` }}
                    />
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span>🫂</span>
                      <span>{hugDelivered ? 'Hug Sent! Tap again ❤️' : 'Hold My Hand ❤️'}</span>
                    </span>
                  </button>

                  {isHoldingHug && (
                    <span className="text-[10px] text-[#f59e0b] font-mono mt-1">
                      {hugProgress}% charged...
                    </span>
                  )}
                </div>
              </div>

              {/* Hug Delivery Message Toast */}
              <AnimatePresence>
                {hugDelivered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#c9899e]/25 to-[#f59e0b]/25 border border-[#f59e0b]/50 text-center font-serif text-xs text-[#faf5eb] shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>🫂❤️</span>
                    <span>
                      Hug delivered successfully 🫂❤️ — temporary replacement until Om can give you a real one.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 2. Virtual Care Package (Bedside Table Items) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl border border-[#f7e7ce]/20 bg-[#160d24]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f7e7ce]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#f59e0b]" />
                  <h3 className="font-serif text-base font-semibold text-[#faf5eb]">
                    Virtual Care Package on Bedside Table
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#f7e7ce]/60">Tap any item</span>
              </div>

              {/* 6 Clickable Care Package Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* 1. Water */}
                <button
                  onClick={() =>
                    handleCareItem({
                      title: 'Glass of Fresh Water 💧',
                      message:
                        'Please stay hydrated, madam. Your developer has issued an important system update. 💧',
                      icon: '💧',
                    })
                  }
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-300/50 hover:bg-cyan-500/10 transition-all text-left group active:scale-95"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">💧</div>
                  <div className="text-xs font-semibold text-white">Glass of Water</div>
                  <div className="text-[10px] text-[#f7e7ce]/60">Hydration update</div>
                </button>

                {/* 2. Warm Tea */}
                <button
                  onClick={() =>
                    handleCareItem({
                      title: 'Warm Chamomile Tea 🍵',
                      message: 'Warm comfort, delivered virtually. ☕❤️',
                      icon: '🍵',
                    })
                  }
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-300/50 hover:bg-amber-500/10 transition-all text-left group active:scale-95 relative overflow-hidden"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🍵</div>
                  <div className="text-xs font-semibold text-white">Warm Tea</div>
                  <div className="text-[10px] text-[#f7e7ce]/60">Steaming warmth</div>
                </button>

                {/* 3. Hot Soup */}
                <button
                  onClick={() =>
                    handleCareItem({
                      title: 'Bowl of Fresh Soup 🍲',
                      message: 'Warm comfort, delivered virtually. ☕❤️ (Packed with virtual vitamins and affection)',
                      icon: '🍲',
                    })
                  }
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-300/50 hover:bg-orange-500/10 transition-all text-left group active:scale-95"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🍲</div>
                  <div className="text-xs font-semibold text-white">Bowl of Soup</div>
                  <div className="text-[10px] text-[#f7e7ce]/60">Easy to eat</div>
                </button>

                {/* 4. Teddy Bear */}
                <button
                  onClick={() =>
                    handleCareItem({
                      title: 'Bedside Teddy Bear 🧸',
                      message: 'Temporary replacement until Om can give you a real hug. 🧸',
                      icon: '🧸',
                    })
                  }
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-300/50 hover:bg-rose-500/10 transition-all text-left group active:scale-95"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🧸</div>
                  <div className="text-xs font-semibold text-white">Teddy Bear</div>
                  <div className="text-[10px] text-[#f7e7ce]/60">Always on duty</div>
                </button>

                {/* 5. Flower */}
                <button
                  onClick={() =>
                    handleCareItem({
                      title: 'Fresh Garden Flower 🌸',
                      message: 'This is for the prettiest patient. 🌸',
                      icon: '🌸',
                    })
                  }
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-300/50 hover:bg-pink-500/10 transition-all text-left group active:scale-95"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🌸</div>
                  <div className="text-xs font-semibold text-white">Fresh Flower</div>
                  <div className="text-[10px] text-[#f7e7ce]/60">For pretty patient</div>
                </button>

                {/* 6. Heart-shaped Note */}
                <button
                  onClick={() =>
                    handleCareItem({
                      title: 'Heart-shaped Note 💌',
                      message:
                        'To Dhvani: Don\'t worry about replying to messages or doing anything productive today. Your only job is resting. Love, Om ❤️',
                      icon: '💌',
                    })
                  }
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-300/50 hover:bg-amber-500/10 transition-all text-left group active:scale-95"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">💌</div>
                  <div className="text-xs font-semibold text-white">Handwritten Note</div>
                  <div className="text-[10px] text-[#f7e7ce]/60">From Om ❤️</div>
                </button>
              </div>

              {/* Care Item Popup Display */}
              <AnimatePresence>
                {selectedCareItem && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-[#201233] border border-[#f59e0b]/40 shadow-xl flex items-start gap-3 relative"
                  >
                    <div className="text-2xl">{selectedCareItem.icon}</div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-[#f59e0b] font-mono">
                        {selectedCareItem.title}
                      </div>
                      <div className="text-xs text-[#faf5eb] font-serif mt-0.5 leading-relaxed">
                        {selectedCareItem.message}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCareItem(null)}
                      className="text-[#f7e7ce]/50 hover:text-white p-1 rounded-full hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* RIGHT: Health System, Mood Weather, Growing Flower, Cassette Player (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* 3. Dhvani Health System (Playful Developer Telemetry) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-3xl border border-[#f7e7ce]/20 bg-[#160d24]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#f7e7ce]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#c9899e]" />
                  <h3 className="font-mono text-xs font-bold uppercase text-[#faf5eb] tracking-wider">
                    Dhvani Health System // v2.6
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/20 border border-rose-400/40 text-rose-200 animate-pulse font-bold">
                  REST REQUIRED ❤️
                </span>
              </div>

              {/* Fictional Metrics Bars */}
              <div className="space-y-3 font-mono text-xs">
                {/* Energy */}
                <div>
                  <div className="flex justify-between text-[#f7e7ce]/80 mb-1">
                    <span>⚡ Energy Battery</span>
                    <span className="text-amber-300">Recharging (42%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[42%] transition-all duration-500" />
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <div className="flex justify-between text-[#f7e7ce]/80 mb-1">
                    <span>🛡️ Mood Protection</span>
                    <span className="text-pink-300">Protected by Love (95%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-400 rounded-full w-[95%] transition-all duration-500" />
                  </div>
                </div>

                {/* Comfort */}
                <div>
                  <div className="flex justify-between text-[#f7e7ce]/80 mb-1">
                    <span>☁️ Blanket Fluff Level</span>
                    <span className="text-lavender-200 text-purple-300">Max Cozy (99%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full w-[99%] transition-all duration-500" />
                  </div>
                </div>

                {/* Om's Concern */}
                <div>
                  <div className="flex justify-between text-[#f7e7ce]/80 mb-1">
                    <span>❤️ Om's Concern</span>
                    <span className="text-rose-400 font-bold">100% (Constant)</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full w-full" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4. Mood Weather Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-[#f7e7ce]/20 bg-[#160d24]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#f7e7ce]/15 pb-2">
                <div className="text-xs font-mono text-[#faf5eb] font-semibold">
                  How are you feeling right now?
                </div>
                <span className="text-[10px] text-[#f7e7ce]/50">Adapts room vibe</span>
              </div>

              {/* 4 Weather Pills */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    recoveryAudio.playCareItemClick();
                    setMoodWeather('better');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                    moodWeather === 'better'
                      ? 'bg-amber-500/20 border-amber-300 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-[#f7e7ce]/70 hover:bg-white/10'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>☀️ Feeling Better</span>
                </button>

                <button
                  onClick={() => {
                    recoveryAudio.playCareItemClick();
                    setMoodWeather('okay');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                    moodWeather === 'okay'
                      ? 'bg-indigo-500/20 border-indigo-300 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-[#f7e7ce]/70 hover:bg-white/10'
                  }`}
                >
                  <CloudSun className="w-3.5 h-3.5 text-indigo-300" />
                  <span>🌤️ I'm Okay</span>
                </button>

                <button
                  onClick={() => {
                    recoveryAudio.playCareItemClick();
                    setMoodWeather('not_good');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                    moodWeather === 'not_good'
                      ? 'bg-rose-500/20 border-rose-300 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-[#f7e7ce]/70 hover:bg-white/10'
                  }`}
                >
                  <CloudRain className="w-3.5 h-3.5 text-rose-300" />
                  <span>🌧️ Not Feeling Good</span>
                </button>

                <button
                  onClick={() => {
                    recoveryAudio.playCareItemClick();
                    setMoodWeather('tired');
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                    moodWeather === 'tired'
                      ? 'bg-purple-500/20 border-purple-300 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-[#f7e7ce]/70 hover:bg-white/10'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-purple-300" />
                  <span>🌙 Just Tired</span>
                </button>
              </div>

              {/* Supportive Non-Pressuring Feedback Message */}
              <div className="text-[11px] font-serif italic text-[#f7e7ce]/80 pt-1 text-center">
                {moodWeather === 'better' && "So glad to hear it! Keep resting and don't rush it. ☀️"}
                {moodWeather === 'okay' && "Take it easy and keep drinking warm water. 🌤️"}
                {moodWeather === 'not_good' && "You don't have to be okay right now. I'm here. ❤️."}
                {moodWeather === 'tired' && "Sleep as much as you want. Resting is your only task. 🌙"}
              </div>
            </motion.div>

            {/* 5. Growing Flower Recovery Journey */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="rounded-3xl border border-[#f7e7ce]/20 bg-[#160d24]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#f7e7ce]/15 pb-2">
                <div className="flex items-center gap-2">
                  <Flower2 className="w-4 h-4 text-[#c9899e]" />
                  <h3 className="font-serif text-sm font-semibold text-[#faf5eb]">
                    Growing Recovery Flower
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#f59e0b]">
                  Stage {flowerStage + 1}/5
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {flowerStage === 0 && '🌱'}
                  {flowerStage === 1 && '🌿'}
                  {flowerStage === 2 && '🌷'}
                  {flowerStage === 3 && '🌸'}
                  {flowerStage === 4 && '🌺'}
                </div>

                <div className="flex-1">
                  <div className="text-xs font-semibold text-white">
                    {flowerStages[flowerStage].title}
                  </div>
                  <div className="text-[11px] text-[#f7e7ce]/70 font-light mt-0.5 leading-snug">
                    {flowerStages[flowerStage].text}
                  </div>
                </div>

                {/* Nurture / Water Button */}
                <button
                  onClick={handleNurtureFlower}
                  disabled={flowerStage >= 4}
                  className={`p-2.5 rounded-full border text-xs font-mono transition-all active:scale-95 ${
                    flowerStage >= 4
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                      : 'bg-white/5 hover:bg-white/15 border-[#f7e7ce]/30 text-[#f7e7ce]'
                  }`}
                  title="Nurture Flower with Water & Warmth"
                >
                  {flowerStage >= 4 ? '🌺 Bloomed!' : '💧 Nurture'}
                </button>
              </div>

              {flowerStage === 4 && (
                <div className="text-[11px] text-pink-300 font-serif italic text-center pt-1 border-t border-white/10">
                  "You got better, and my little flower bloomed with you. 🌸❤️"
                </div>
              )}
            </motion.div>

            {/* 6. Vintage Cassette Player ("Om Left You a Message 🎙️") */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-[#f7e7ce]/20 bg-[#160d24]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#f7e7ce]/15 pb-2">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-[#f59e0b]" />
                  <h3 className="font-serif text-sm font-semibold text-[#faf5eb]">
                    Om Left You a Message 🎙️
                  </h3>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[10px] font-mono text-[#f7e7ce]/60 hover:text-white flex items-center gap-1"
                  title="Upload / Replace with real voice note"
                >
                  <Upload className="w-3 h-3" />
                  <span>{customAudioUrl ? 'Custom Voice' : 'Upload Memo'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>

              {/* Vintage Cassette Deck Visual */}
              <div className="p-3.5 rounded-2xl bg-[#0e0717] border border-[#f7e7ce]/20 flex items-center justify-between shadow-inner">
                {/* Spinning Cassette Reels */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#1b0e2d] px-3 py-1.5 rounded-xl border border-white/10">
                    <motion.div
                      animate={{ rotate: isPlayingCassette ? 360 : 0 }}
                      transition={{ duration: 2, repeat: isPlayingCassette ? Infinity : 0, ease: 'linear' }}
                      className="w-5 h-5 rounded-full border-2 border-dashed border-[#f59e0b] flex items-center justify-center text-[8px]"
                    >
                      ⚙️
                    </motion.div>
                    <div className="w-8 h-1 bg-[#f59e0b]/40 rounded-full" />
                    <motion.div
                      animate={{ rotate: isPlayingCassette ? 360 : 0 }}
                      transition={{ duration: 2, repeat: isPlayingCassette ? Infinity : 0, ease: 'linear' }}
                      className="w-5 h-5 rounded-full border-2 border-dashed border-[#f59e0b] flex items-center justify-center text-[8px]"
                    >
                      ⚙️
                    </motion.div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white font-serif">
                      A little message from Om ❤️
                    </div>
                    <div className="text-[10px] text-[#f7e7ce]/60 font-mono">
                      {isPlayingCassette ? '▶️ Playing peaceful lullaby...' : '⏸️ Tap play to listen'}
                    </div>
                  </div>
                </div>

                {/* Play / Pause Toggle Button */}
                <button
                  onClick={toggleCassette}
                  className="p-3 rounded-full bg-[#f59e0b] text-[#130d1e] hover:bg-[#ffd700] transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95"
                >
                  {isPlayingCassette ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>

              {customAudioUrl && (
                <audio
                  ref={customAudioRef}
                  src={customAudioUrl}
                  onEnded={() => setIsPlayingCassette(false)}
                />
              )}
            </motion.div>

            {/* 7. Emergency Smile 🚨❤️ Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="rounded-3xl border border-[#f7e7ce]/20 bg-[#160d24]/90 p-4 sm:p-5 shadow-xl backdrop-blur-xl flex flex-col items-center text-center space-y-2"
            >
              <button
                onClick={handleEmergencySmile}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-amber-500/20 border border-rose-300/40 hover:border-rose-300 text-[#faf5eb] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Smile className="w-4 h-4 text-rose-300" />
                <span>Emergency Smile 🚨❤️</span>
              </button>

              <AnimatePresence>
                {smileMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3 rounded-2xl bg-[#231238] border border-pink-300/30 text-xs font-serif text-[#faf5eb] leading-relaxed italic text-center w-full"
                  >
                    "{smileMessage}"
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            FINAL SCENE: RAINY WINDOW HEARTFELT MESSAGE
            ═══════════════════════════════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full max-w-3xl rounded-3xl border border-[#f7e7ce]/25 bg-gradient-to-b from-[#180e28]/95 to-[#0f071a]/95 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-center space-y-6 my-6"
        >
          <div className="w-12 h-12 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center mx-auto text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            🕯️
          </div>

          <div className="space-y-3 font-serif text-[#faf5eb] text-sm sm:text-base leading-relaxed max-w-xl mx-auto italic">
            <p>If I could be there right now...</p>
            <p className="text-[#f7e7ce]/90">
              I'd bring you flowers, make sure you had everything you needed, give you the biggest hug, and tell you to stop worrying about everything.
            </p>
            <p className="text-[#c9899e] font-normal">
              Until I can do that in person, this little corner of the internet is yours.
            </p>
            <p className="text-base sm:text-lg font-semibold text-[#faf5eb] pt-2">
              Get well soon, Dhvani. ❤️
            </p>
            <p className="text-xs font-mono text-[#f59e0b] not-italic">
              Your favorite IT guy is waiting for you.
            </p>
          </div>

          {/* "Now Go Rest ❤️" Action Button */}
          <div className="pt-4">
            <button
              onClick={() => {
                recoveryAudio.playRestModeTone();
                setIsGoodnightScreen(true);
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#c9899e] via-[#f59e0b] to-[#c9899e] text-[#130d1e] font-mono text-sm font-bold shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:scale-105 transition-all active:scale-95"
            >
              Now Go Rest ❤️
            </button>
          </div>
        </motion.section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════
          REST MODE SLEEP OVERLAY & BREATHING CYCLE
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isRestMode && !isGoodnightScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#07030d]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Stars Outside */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white animate-pulse"
                  style={{
                    width: `${1 + (i % 3)}px`,
                    height: `${1 + (i % 3)}px`,
                    top: `${(i * 13) % 100}%`,
                    left: `${(i * 19) % 100}%`,
                    animationDuration: `${2 + (i % 4)}s`,
                  }}
                />
              ))}
            </div>

            {/* Calming Breathing Visualizer */}
            <div className="relative z-10 flex flex-col items-center space-y-6">
              <motion.div
                animate={{
                  scale: breathingPhase === 'in' ? 1.4 : breathingPhase === 'hold' ? 1.4 : 0.85,
                  opacity: breathingPhase === 'in' ? 0.9 : breathingPhase === 'hold' ? 1 : 0.5,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-[#c9899e]/30 via-[#f59e0b]/20 to-[#e4daf0]/30 border-2 border-[#f7e7ce]/40 flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.3)]"
              >
                <span className="font-serif text-lg text-[#faf5eb] font-semibold">
                  {breathingPhase === 'in' && 'Breathe In...'}
                  {breathingPhase === 'hold' && 'Hold gently...'}
                  {breathingPhase === 'out' && 'Breathe Out...'}
                </span>
              </motion.div>

              <div className="space-y-2 max-w-md">
                <h3 className="font-serif text-xl sm:text-2xl text-[#faf5eb]">
                  Okay, now put your phone down and rest. Seriously. ❤️
                </h3>
                <p className="text-xs text-[#f7e7ce]/70 font-light font-sans">
                  The screen is dimmed, the rain is soft, and someone is wishing you sweet dreams.
                </p>
              </div>

              <button
                onClick={() => setIsRestMode(false)}
                className="px-5 py-2 rounded-full border border-white/20 text-xs font-mono text-[#f7e7ce]/70 hover:text-white hover:bg-white/10 transition-all mt-4"
              >
                Exit Sleep Mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          GOODNIGHT FINAL FADE SCREEN
          ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isGoodnightScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 bg-[#050209] flex flex-col items-center justify-center p-6 text-center select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="space-y-6 max-w-lg"
            >
              <div className="text-5xl animate-bounce">🌙</div>

              <h2 className="text-2xl sm:text-4xl font-serif text-[#faf5eb] leading-snug">
                Goodnight, Dhvani. ❤️
              </h2>

              <p className="text-sm sm:text-base font-serif italic text-[#f7e7ce]/90 leading-relaxed">
                Close your eyes, get some rest, and remember that someone is thinking about you.
              </p>

              <p className="text-xs font-mono text-[#f59e0b] tracking-wider uppercase pt-2">
                I'll be here when you wake up.
              </p>

              <div className="pt-6 flex justify-center gap-4">
                <button
                  onClick={() => setIsGoodnightScreen(false)}
                  className="px-5 py-2 rounded-full border border-white/20 text-xs font-mono text-[#f7e7ce]/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  Return to Room
                </button>
                <button
                  onClick={onBackToMain}
                  className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-[#f7e7ce]/30 text-xs font-mono text-[#faf5eb] transition-all"
                >
                  Main Website
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecoveryRoom;
