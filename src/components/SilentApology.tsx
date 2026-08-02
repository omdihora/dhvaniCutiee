import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Sun, CloudRain } from 'lucide-react';
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
  const [phase, setPhase] = useState<'rain' | 'clearing' | 'sunlight'>('rain');
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [, setCurrentParaIdx] = useState(0);

  useEffect(() => {
    soundEngine.stopAmbientBGM();
    let isCancelled = false;

    const typeAllParagraphs = async () => {
      for (let pIdx = 0; pIdx < APOLOGY_PARAGRAPHS.length; pIdx++) {
        if (isCancelled) return;
        const paragraph = APOLOGY_PARAGRAPHS[pIdx];
        setCurrentParaIdx(pIdx);

        // Environment shifts from rain to clearing halfway through
        if (pIdx === Math.floor(APOLOGY_PARAGRAPHS.length * 0.4)) {
          setPhase('clearing');
        }

        // Type character by character
        for (let charIdx = 0; charIdx <= paragraph.length; charIdx++) {
          if (isCancelled) return;
          setCurrentLine(paragraph.slice(0, charIdx));
          const delay = paragraph === "I'm sorry." ? 60 : 28;
          await new Promise((r) => setTimeout(r, delay));
        }

        setTypedParagraphs((prev) => [...prev, paragraph]);
        setCurrentLine('');

        const isEmotionalPause = [
          "Dhvani...",
          "I'm sorry.",
          "And losing you is one of my biggest fears.",
          "My favorite part would still be the chapter where I met you.",
        ].includes(paragraph);

        await new Promise((r) => setTimeout(r, isEmotionalPause ? 1200 : 500));
      }

      // All done — full sunlight bloom
      if (!isCancelled) {
        setPhase('sunlight');
        soundEngine.playHeartPop();
        soundEngine.playCelebration();
        soundEngine.startAmbientBGM();

        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.7 },
          colors: ['#f7e7ce', '#fadadd', '#f8c8dc', '#d4af37', '#e5c158'],
        });
      }
    };

    typeAllParagraphs();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 sm:p-8 select-none transition-colors duration-1000 overflow-hidden bg-[#0f051d]">
      {/* Dynamic Weather Background */}
      <AnimatePresence mode="wait">
        {phase === 'rain' && (
          <motion.div
            key="rain-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-[#111827] via-[#1f2937] to-[#0f051d] z-0"
          >
            {/* Rainy drops */}
            {Array.from({ length: 40 }, (_, i) => (
              <div
                key={`rain-${i}`}
                className="absolute w-0.5 h-6 bg-slate-400/40 rounded-full animate-petal-fall"
                style={{
                  left: `${(i * 2.5) % 100}%`,
                  top: '-10%',
                  animationDuration: `${1 + Math.random() * 0.8}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </motion.div>
        )}

        {phase === 'clearing' && (
          <motion.div
            key="clearing-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-[#2d0a10] via-[#3b0914] to-[#0f051d] z-0"
          />
        )}

        {phase === 'sunlight' && (
          <motion.div
            key="sunlight-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-b from-[#5c1325] via-[#2d0a10] to-[#0f051d] z-0"
          >
            {/* Golden Sunlight Rays */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/20 rounded-full blur-3xl animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Apology Letter Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl z-10 glass-card-luxury bg-[#0f051d]/90 border-2 border-[#f7e7ce]/40 rounded-[36px] p-6 sm:p-10 shadow-[0_20px_80px_rgba(212,175,55,0.3)] my-auto relative"
      >
        {/* Weather Indicator Header */}
        <div className="flex items-center justify-between border-b border-[#f7e7ce]/20 pb-4 mb-6">
          <div className="flex items-center gap-2 text-[#f7e7ce] font-serif-luxury text-sm">
            {phase === 'rain' ? (
              <CloudRain className="w-4 h-4 text-slate-400 animate-bounce" />
            ) : (
              <Sun className="w-4 h-4 text-[#e5c158] animate-spin" style={{ animationDuration: '8s' }} />
            )}
            <span>{phase === 'rain' ? 'Rainy Quiet Forest' : 'Sunlight Breaking Through'}</span>
          </div>

          <div className="text-xs font-mono text-[#d4af37]">CHAPTER: HEAVENLY_APOLOGY</div>
        </div>

        {/* Typed Paragraphs */}
        <div className="space-y-4 text-left font-handwritten text-xl sm:text-2xl text-[#f7e7ce] leading-relaxed min-h-[300px]">
          {typedParagraphs.map((para, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={para.includes('Om') ? 'text-2xl sm:text-3xl font-bold text-[#d4af37] text-right mt-4 font-serif-luxury' : ''}
            >
              {para}
            </motion.p>
          ))}

          {currentLine && (
            <p className="text-pink-100">
              {currentLine}
              <span className="inline-block w-2 h-5 bg-[#f7e7ce] animate-pulse ml-1" />
            </p>
          )}
        </div>

        {/* Sunlight Climax Continue Button */}
        {phase === 'sunlight' && onNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="pt-6 border-t border-[#f7e7ce]/20 flex justify-center"
          >
            <button
              onClick={() => {
                soundEngine.playPageSwitch();
                onNext();
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b76e79] text-[#0f051d] text-sm font-semibold flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all font-serif-luxury cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0f051d]" />
              <span>Sunlight Restored — Continue Journey ❤️</span>
              <ArrowRight className="w-4 h-4 text-[#0f051d]" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SilentApology;
