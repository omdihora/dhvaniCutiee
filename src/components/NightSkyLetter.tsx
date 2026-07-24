import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Moon, Flower2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NightSkyLetterProps {
  onOneLastClick: () => void;
}

const LETTER_PARAGRAPHS = [
  "Dear Dhvani ❤️,",
  "People usually give flowers. Some write letters. Some buy gifts. But I wanted to give you something only an IT guy could. So instead of buying something... I built something.",
  "Every animation. Every button. Every transition. Every tiny detail... was created while thinking about you.",
  "This website isn't just code. It's hundreds of little thoughts stitched together with love.",
  "Whenever life gets difficult, remember this... there will always be one developer whose favorite project will never be an app, a website, or a program... it will always be you.",
  "Thank you for making ordinary days feel extraordinary. I don't promise a perfect life. There will always be bugs. There will always be unexpected errors. But I promise... we'll debug everything together.",
  "Thank you for existing. Thank you for being you.",
  "With all my heart... ❤️ Om."
];

export const NightSkyLetter: React.FC<NightSkyLetterProps> = ({ onOneLastClick }) => {
  const [currentParaIdx, setCurrentParaIdx] = useState(0);
  const [typedTexts, setTypedTexts] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [isFinishedTyping, setIsFinishedTyping] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const startTypingLetter = async () => {
      for (let pIdx = 0; pIdx < LETTER_PARAGRAPHS.length; pIdx++) {
        if (isCancelled) return;
        const targetParagraph = LETTER_PARAGRAPHS[pIdx];
        setCurrentParaIdx(pIdx);

        for (let charIdx = 0; charIdx <= targetParagraph.length; charIdx++) {
          if (isCancelled) return;
          setCurrentLineText(targetParagraph.slice(0, charIdx));
          if (charIdx % 4 === 0) soundEngine.playClick();
          await new Promise((r) => setTimeout(r, 26));
        }

        setTypedTexts((prev) => [...prev, targetParagraph]);
        setCurrentLineText('');
        await new Promise((r) => setTimeout(r, 420));
      }

      setIsFinishedTyping(true);
      soundEngine.playHeartPop();
    };

    startTypingLetter();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleClickFinal = () => {
    soundEngine.playHeartPop();
    onOneLastClick();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 relative z-10 my-8">
      {/* Soft Moonlight Glow */}
      <div className="absolute top-10 right-10 sm:right-24 w-52 h-52 sm:w-72 sm:h-72 rounded-full bg-amber-100/15 blur-[90px] pointer-events-none" />

      {/* Crescent Moon Icon */}
      <div className="absolute top-12 right-12 text-amber-200/50 pointer-events-none hidden sm:block">
        <Moon className="w-14 h-14 stroke-[1.5] drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
      </div>

      {/* Floating Sky Lanterns Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="absolute rounded-t-full bg-amber-300/70 border border-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.9)]"
            style={{
              width: `${22 + (idx % 3) * 8}px`,
              height: `${30 + (idx % 3) * 10}px`,
              left: `${8 + idx * 9.5}%`,
              animation: `floatLantern ${13 + (idx % 4) * 4}s linear infinite`,
              animationDelay: `${idx * 1.6}s`,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-amber-100 mx-auto mt-auto mb-1 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Drifting Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, idx) => (
          <div
            key={`petal-${idx}`}
            className="absolute text-rose-300/70 text-lg animate-float-slow"
            style={{
              left: `${(idx * 8) % 95}%`,
              top: `${(idx * 11) % 85}%`,
              animationDuration: `${5.5 + (idx % 3) * 2}s`,
              animationDelay: `${idx * 0.35}s`,
            }}
          >
            <Flower2 className="w-5 h-5 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]" />
          </div>
        ))}
      </div>

      {/* Main Glass Apple Letter Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl glass-card-apple bg-[#170a24]/85 backdrop-blur-2xl rounded-[36px] p-6 sm:p-12 border border-white/20 shadow-[0_20px_100px_rgba(236,72,153,0.3)] relative overflow-hidden"
      >
        {/* Letter Header */}
        <div className="flex items-center justify-between border-b border-pink-300/20 pb-4 mb-6 text-xs font-code text-pink-200">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>LETTER_TO_DHVANI.TXT</span>
          </div>
          <div className="text-amber-200/90 flex items-center gap-1 font-serif italic text-sm">
            <span>For My Favorite Person</span>
          </div>
        </div>

        {/* Typed Paragraphs */}
        <div className="space-y-4 text-slate-100/95 leading-relaxed font-sans text-base sm:text-lg min-h-[380px]">
          {typedTexts.map((paragraph, index) => {
            const isSalutation = index === 0;
            const isSignature = paragraph.includes('With all my heart');

            return (
              <p
                key={index}
                className={`${
                  isSalutation
                    ? 'font-cursive text-3xl sm:text-4xl text-pink-200 font-bold mb-4 drop-shadow-sm'
                    : isSignature
                    ? 'font-cursive text-2xl sm:text-3xl text-rose-300 font-semibold pt-4'
                    : 'text-slate-100 font-light'
                }`}
              >
                {paragraph}
              </p>
            );
          })}

          {/* Active line typing cursor */}
          {currentLineText && (
            <p
              className={`${
                currentParaIdx === 0
                  ? 'font-cursive text-3xl sm:text-4xl text-pink-200 font-bold'
                  : currentParaIdx === LETTER_PARAGRAPHS.length - 1
                  ? 'font-cursive text-2xl sm:text-3xl text-rose-300 font-semibold'
                  : 'text-slate-100 font-light'
              }`}
            >
              {currentLineText}
              <span className="inline-block w-2.5 h-5 bg-pink-300 animate-pulse ml-1 align-middle" />
            </p>
          )}
        </div>

        {/* Action Button revealed after typing finishes */}
        {isFinishedTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="pt-8 flex justify-center border-t border-pink-300/20 mt-8"
          >
            <button
              onClick={handleClickFinal}
              className="relative group overflow-hidden rounded-full p-0.5 font-semibold text-lg transition-all duration-300 active:scale-95 shadow-[0_0_45px_rgba(236,72,153,0.6)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 rounded-full animate-pulse-glow" />
              <span className="relative px-9 py-4 rounded-full bg-[#1b0a29] text-white flex items-center gap-3 transition-all duration-300 group-hover:bg-transparent">
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>One Last Click ❤️</span>
              </span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
