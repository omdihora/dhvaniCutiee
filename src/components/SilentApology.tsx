import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface SilentApologyProps {
  onNext?: () => void;
}

const APOLOGY_PARAGRAPHS = [
  "Dhvani...",
  "Before anything else, I just want to say...",
  "I'm sorry.",
  "I'm sorry for every moment I've unintentionally hurt you.",
  "I know I make mistakes sometimes, and I know I can't erase them with a website or a few words.",
  "But if there's one thing I hope you always believe... it's that my love for you has never been fake.",
  "You are incredibly important to me.",
  "And losing you is one of my biggest fears.",
  "Thank you for staying.",
  "Thank you for caring.",
  "Thank you for laughing with me.",
  "Thank you for being the most beautiful part of my life.",
  "I don't promise perfection... because I'm still learning every day.",
  "But I promise I'll keep trying to become someone who makes you smile more than cry...",
  "Someone who understands you better...",
  "And someone who chooses you every single day.",
  "If I could rewrite every line of my life...",
  "My favorite part would still be the chapter where I met you.",
  "Thank you for being my happiness, my peace, and my favorite person.",
  "I love you more than words, more than code, and more than anything I could ever build.",
  "❤️ — Om."
];

export const SilentApology: React.FC<SilentApologyProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<'dimming' | 'typing' | 'bloom'>('dimming');
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [currentParaIdx, setCurrentParaIdx] = useState(0);
  const [heartScale, setHeartScale] = useState(1);

  // Phase 1: Dimming — silence, fade to near black, single heart
  useEffect(() => {
    soundEngine.stopAmbientBGM();

    const timer = setTimeout(() => {
      setPhase('typing');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Phase 2: Typing the apology letter
  useEffect(() => {
    if (phase !== 'typing') return;
    let isCancelled = false;

    const typeAllParagraphs = async () => {
      for (let pIdx = 0; pIdx < APOLOGY_PARAGRAPHS.length; pIdx++) {
        if (isCancelled) return;
        const paragraph = APOLOGY_PARAGRAPHS[pIdx];
        setCurrentParaIdx(pIdx);

        // Type character by character
        for (let charIdx = 0; charIdx <= paragraph.length; charIdx++) {
          if (isCancelled) return;
          setCurrentLine(paragraph.slice(0, charIdx));
          // Slower typing for emotional impact
          const delay = paragraph === "I'm sorry." ? 60 : 28;
          await new Promise((r) => setTimeout(r, delay));
        }

        // Add completed paragraph
        setTypedParagraphs((prev) => [...prev, paragraph]);
        setCurrentLine('');

        // Longer pauses at emotional moments
        const isEmotionalPause = [
          "Dhvani...",
          "I'm sorry.",
          "And losing you is one of my biggest fears.",
          "My favorite part would still be the chapter where I met you.",
        ].includes(paragraph);

        await new Promise((r) => setTimeout(r, isEmotionalPause ? 1200 : 500));
      }

      // All done — bloom phase
      if (!isCancelled) {
        setTimeout(() => {
          setPhase('bloom');
          soundEngine.playHeartPop();
          soundEngine.playCelebration();

          // Gentle confetti
          confetti({
            particleCount: 80,
            spread: 120,
            origin: { y: 0.7 },
            colors: ['#fadadd', '#f8c8dc', '#ec4899', '#f43f5e', '#c084fc'],
            gravity: 0.6,
          });
        }, 1500);
      }
    };

    typeAllParagraphs();
    return () => { isCancelled = true; };
  }, [phase]);

  // Heart pulse
  useEffect(() => {
    if (phase !== 'dimming' && phase !== 'typing') return;
    const interval = setInterval(() => {
      setHeartScale((prev) => (prev === 1 ? 1.12 : 1));
    }, 800);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto">
      {/* Dark overlay that dims everything */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'dimming' ? 0.95 : 0.85 }}
        className="fixed inset-0 bg-black z-0 pointer-events-none"
      />

      {/* Dimming phase — single heart */}
      <AnimatePresence>
        {phase === 'dimming' && (
          <motion.div
            key="dimming"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.5 }}
            className="z-10 flex flex-col items-center text-center"
          >
            {/* Soft glow behind heart */}
            <div className="absolute w-40 h-40 rounded-full bg-pink-500/10 blur-[60px]" />

            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="text-6xl sm:text-7xl drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]"
            >
              ❤️
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5 }}
              className="text-pink-200/40 text-xs font-code mt-6 tracking-widest"
            >
              ...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typing phase — the heartfelt message */}
      {(phase === 'typing' || phase === 'bloom') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="z-10 w-full max-w-xl flex flex-col items-center"
        >
          {/* Small heart at top */}
          <motion.div
            style={{ scale: heartScale }}
            transition={{ duration: 0.4 }}
            className="text-3xl mb-8 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]"
          >
            ❤️
          </motion.div>

          {/* Letter Container */}
          <div className="w-full space-y-4 max-h-[60vh] overflow-y-auto px-2 custom-scrollbar">
            {typedParagraphs.map((para, idx) => {
              const isShort = para === "Dhvani..." || para === "I'm sorry." || para === "❤️ — Om.";
              const isSignature = para === "❤️ — Om.";

              return (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className={`leading-relaxed ${
                    isSignature
                      ? 'text-right text-xl font-handwritten text-pink-300 pr-4 pt-4'
                      : isShort
                      ? 'text-center text-xl sm:text-2xl font-semibold text-white'
                      : 'text-center text-base sm:text-lg text-pink-100/90 font-light'
                  }`}
                >
                  {para}
                </motion.p>
              );
            })}

            {/* Currently typing line */}
            {currentLine && (
              <p className={`leading-relaxed text-center ${
                APOLOGY_PARAGRAPHS[currentParaIdx] === "Dhvani..." ||
                APOLOGY_PARAGRAPHS[currentParaIdx] === "I'm sorry." ||
                APOLOGY_PARAGRAPHS[currentParaIdx] === "❤️ — Om."
                  ? 'text-xl sm:text-2xl font-semibold text-white'
                  : 'text-base sm:text-lg text-pink-100/90 font-light'
              }`}>
                {currentLine}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  className="inline-block w-0.5 h-5 bg-pink-400/80 ml-1 align-middle"
                />
              </p>
            )}
          </div>

          {/* Bloom phase — soft bloom of hearts and butterflies */}
          <AnimatePresence>
            {phase === 'bloom' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 pointer-events-none z-20 overflow-hidden"
              >
                {/* Floating hearts bloom */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`heart-${i}`}
                    initial={{
                      opacity: 0,
                      scale: 0,
                      x: window.innerWidth / 2 - 12,
                      y: window.innerHeight / 2,
                    }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0.5],
                      x: window.innerWidth / 2 + (Math.random() - 0.5) * 600,
                      y: Math.random() * window.innerHeight * 0.5,
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      delay: i * 0.15,
                      ease: 'easeOut',
                    }}
                    className="absolute text-xl sm:text-2xl"
                  >
                    {['❤️', '💖', '💕', '🦋', '🌸', '✨'][i % 6]}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button — only in bloom */}
          {phase === 'bloom' && onNext && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-10"
            >
              <button
                onClick={() => {
                  soundEngine.playPageSwitch();
                  onNext();
                }}
                className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Forever Begins Now</span>
                <ArrowRight className="w-4 h-4 text-pink-300" />
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SilentApology;
