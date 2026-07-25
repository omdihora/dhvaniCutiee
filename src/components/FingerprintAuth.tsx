import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FingerprintAuthProps {
  onAuthenticated: () => void;
}

export const FingerprintAuth: React.FC<FingerprintAuthProps> = ({ onAuthenticated }) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'verifying' | 'verified'>('idle');
  const [statusText, setStatusText] = useState('Press & hold fingerprint to authenticate');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFiredRef = useRef(false);

  const startHold = useCallback(() => {
    if (phase === 'verified' || phase === 'verifying') return;
    setIsHolding(true);
    setPhase('scanning');
    setStatusText('Scanning Biometrics...');
    soundEngine.playScanSound();
    hasFiredRef.current = false;

    let p = 0;
    intervalRef.current = setInterval(() => {
      p += 1.2;
      if (p >= 100 && !hasFiredRef.current) {
        hasFiredRef.current = true;
        setProgress(100);
        setPhase('verifying');
        setStatusText('Verifying Identity Signature...');
        if (intervalRef.current) clearInterval(intervalRef.current);

        setTimeout(() => {
          setStatusText('Heart Frequency Matched 100% ❤️');
          soundEngine.playHeartPop();
        }, 700);

        setTimeout(() => {
          setPhase('verified');
          setStatusText('Identity Verified ❤️ Welcome, Dhvani.');
          soundEngine.playSuccess();
        }, 1600);
      } else if (p < 100) {
        setProgress(p);
        if (Math.floor(p) % 12 === 0) soundEngine.playClick();
        if (p > 25 && p < 30) setStatusText('Reading Heartbeat Pattern...');
        if (p > 55 && p < 60) setStatusText('Matching Love Frequency...');
        if (p > 80 && p < 85) setStatusText('Decrypting Heart Kernel...');
      }
    }, 30);
  }, [phase]);

  const stopHold = useCallback(() => {
    if (phase === 'verified' || phase === 'verifying') return;
    setIsHolding(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progress < 100) {
      setProgress(0);
      setPhase('idle');
      setStatusText('Press & hold fingerprint to authenticate');
    }
  }, [phase, progress]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleContinue = () => {
    soundEngine.playPageSwitch();
    soundEngine.startAmbientBGM();
    onAuthenticated();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden my-auto">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[160px] pointer-events-none animate-aurora top-1/4 left-1/4" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none animate-aurora bottom-1/4 right-1/4" />

      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-10 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>PAGE 1 // BIOMETRIC_SECURITY_GATEWAY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
          RelationshipOS Security Scanner
        </h1>
        <p className="text-pink-200/70 text-sm mt-3 font-code">
          Hold sensor for 3 seconds to prove you are Dhvani ❤️
        </p>
      </motion.div>

      {/* Fingerprint Scanner Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative flex items-center justify-center my-4"
      >
        {/* Radiating Pulse Rings */}
        {isHolding && (
          <>
            <div className="absolute w-52 h-52 rounded-full border-2 border-pink-400/40 fingerprint-pulse-ring" />
            <div className="absolute w-64 h-64 rounded-full border border-pink-400/30 fingerprint-pulse-ring" style={{ animationDelay: '0.4s' }} />
            <div className="absolute w-72 h-72 rounded-full border border-pink-400/20 fingerprint-pulse-ring" style={{ animationDelay: '0.8s' }} />
          </>
        )}

        {/* Circular Progress SVG */}
        <svg className="absolute w-52 h-52 -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="rgba(236, 72, 153, 0.15)"
            strokeWidth="5"
          />
          <motion.circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={565.48}
            strokeDashoffset={565.48 * (1 - progress / 100)}
            style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.7))' }}
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Touch Button */}
        <button
          onMouseDown={startHold}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={startHold}
          onTouchEnd={stopHold}
          className={`relative w-44 h-44 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer z-10 ${
            phase === 'verified'
              ? 'bg-emerald-500/25 border-2 border-emerald-400 shadow-[0_0_70px_rgba(52,211,153,0.6)]'
              : isHolding
              ? 'bg-pink-500/25 border-2 border-pink-400 shadow-[0_0_70px_rgba(236,72,153,0.7)] scale-95'
              : 'bg-white/5 border-2 border-pink-300/30 shadow-[0_0_40px_rgba(236,72,153,0.2)] hover:border-pink-400/60 hover:shadow-[0_0_50px_rgba(236,72,153,0.4)]'
          }`}
          disabled={phase === 'verified' || phase === 'verifying'}
        >
          {/* Scanning line laser */}
          {isHolding && phase === 'scanning' && (
            <div className="absolute inset-4 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent fingerprint-scan-line" />
            </div>
          )}

          {phase === 'verified' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-6xl drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]"
            >
              ❤️
            </motion.div>
          ) : (
            <Fingerprint
              className={`w-20 h-20 transition-colors duration-300 ${
                isHolding ? 'text-pink-300 fingerprint-glow' : 'text-pink-400/60'
              }`}
            />
          )}
        </button>
      </motion.div>

      {/* Dynamic Status Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={statusText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-8 text-center z-10"
        >
          <p className={`text-xl sm:text-2xl font-semibold tracking-wide ${
            phase === 'verified'
              ? 'text-emerald-300 glow-text-gold font-cursive text-3xl'
              : 'text-pink-100'
          }`}>
            {statusText}
          </p>

          {phase === 'scanning' && (
            <p className="text-xs font-code text-pink-300/80 mt-2 font-bold">
              {Math.floor(progress)}% AUTHENTICATED
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Verified Entry Button */}
      {phase === 'verified' && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8 z-20"
        >
          <button
            onClick={handleContinue}
            className="glass-button-romantic px-8 py-4 rounded-full text-white font-semibold text-lg flex items-center gap-3 shadow-[0_0_40px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Enter RelationshipOS</span>
            <ArrowRight className="w-5 h-5 text-pink-300" />
          </button>
        </motion.div>
      )}

      {/* Instruction hint */}
      {phase === 'idle' && (
        <motion.p
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-6 text-xs font-code text-pink-300/60 z-10"
        >
          Press and hold the glowing sensor for 3s ☝️
        </motion.p>
      )}
    </div>
  );
};
