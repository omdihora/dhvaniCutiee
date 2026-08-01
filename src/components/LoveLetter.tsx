import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Page 8: Love Letter — Handwritten letter with envelope opening

interface LoveLetterProps {
  onNext: () => void;
}

const LETTER_PARAGRAPHS = [
  "Dear Dhvani ❤️,",
  "People usually give flowers. Some write letters. Some buy gifts. But I wanted to give you something only a dedicated developer could. So instead of just buying something... I built this whole digital world for you.",
  "Every animation. Every button. Every transition. Every tiny detail... was handcrafted while thinking about you.",
  "This website isn't just code. It's hundreds of little thoughts stitched together with pure love.",
  "Whenever life gets difficult, remember this... there will always be one developer whose favorite project will never be an app, a website, or a program... it will always be you.",
  "Thank you for making ordinary days feel extraordinary. I don't promise a perfect life without bugs or errors. But I promise... we'll debug everything together.",
  "Thank you for existing. Thank you for being you.",
  "With all my heart... ❤️ Om.",
];

export const LoveLetter: React.FC<LoveLetterProps> = ({ onNext }) => {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentParaIdx, setCurrentParaIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Open envelope
  const handleOpenEnvelope = () => {
    if (envelopeOpen) return;
    soundEngine.playClick();
    setEnvelopeOpen(true);
    setTimeout(() => setShowLetter(true), 1200);
  };

  // Typewriter effect for letter
  useEffect(() => {
    if (!showLetter) return;
    let isCancelled = false;

    const typeLetter = async () => {
      for (let pIdx = 0; pIdx < LETTER_PARAGRAPHS.length; pIdx++) {
        if (isCancelled) return;
        const paragraph = LETTER_PARAGRAPHS[pIdx];
        setCurrentParaIdx(pIdx);

        for (let charIdx = 0; charIdx <= paragraph.length; charIdx++) {
          if (isCancelled) return;
          setCurrentText(paragraph.slice(0, charIdx));
          await new Promise(r => setTimeout(r, 25));
        }

        setTypedParagraphs(prev => [...prev, paragraph]);
        setCurrentText('');
        await new Promise(r => setTimeout(r, 400));
      }

      setIsFinished(true);
      soundEngine.playFlowerBloom();
    };

    typeLetter();
    return () => { isCancelled = true; };
  }, [showLetter]);

  return (
    <section
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden px-4 py-8"
      style={{ background: 'linear-gradient(180deg, #1a0a2e 0%, #0f051d 100%)' }}
    >
      {/* Floating petals */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="absolute pointer-events-none animate-petal-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${10 + Math.random() * 6}s`,
            zIndex: 1,
          }}
        >
          <div
            className="w-2 h-3 rounded-full opacity-40"
            style={{ background: ['#fadadd', '#ffd6e8', '#e6d5ff'][i % 3] }}
          />
        </div>
      ))}

      <div className="relative z-10 w-full max-w-lg">
        {/* Envelope (before opening) */}
        <AnimatePresence>
          {!showLetter && (
            <motion.div
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="envelope-perspective"
                onClick={handleOpenEnvelope}
              >
                <div
                  className="w-64 h-44 sm:w-80 sm:h-52 relative rounded-lg overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 30px rgba(251,191,36,0.15)',
                    border: '1px solid rgba(251,191,36,0.3)',
                  }}
                >
                  {/* Envelope flap */}
                  <motion.div
                    animate={envelopeOpen ? { rotateX: -180 } : {}}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute top-0 left-0 right-0 h-1/2 origin-top"
                    style={{
                      background: 'linear-gradient(180deg, #fcd34d, #fde68a)',
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      zIndex: envelopeOpen ? 0 : 2,
                    }}
                  />

                  {/* Wax seal */}
                  {!envelopeOpen && (
                    <div
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        boxShadow: '0 4px 12px rgba(185, 28, 28, 0.5)',
                        zIndex: 3,
                      }}
                    >
                      ❤️
                    </div>
                  )}

                  {/* Heart pattern */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20 text-4xl" style={{ zIndex: 1 }}>
                    💌
                  </div>
                </div>
              </motion.div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-6 font-body text-white/50 text-sm"
              >
                {envelopeOpen ? 'Opening...' : 'Tap the envelope to open 💌'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letter content */}
        <AnimatePresence>
          {showLetter && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="w-full"
            >
              <div
                className="p-6 sm:p-8 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #fffef9, #fef7ed, #fffdf5)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 30px rgba(251,191,36,0.1)',
                  border: '1px solid rgba(251,191,36,0.2)',
                }}
              >
                {/* Paper texture */}
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.03) 28px, rgba(0,0,0,0.03) 29px)`,
                  }}
                />

                {/* Letter text */}
                <div className="relative z-10 space-y-3">
                  {typedParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="font-handwritten text-base sm:text-lg leading-relaxed"
                      style={{
                        color: i === 0 ? '#9f1239' : '#44403c',
                        fontWeight: i === 0 || i === LETTER_PARAGRAPHS.length - 1 ? 600 : 400,
                      }}
                    >
                      {para}
                    </p>
                  ))}

                  {/* Currently typing line */}
                  {!isFinished && currentText && (
                    <p
                      className="font-handwritten text-base sm:text-lg leading-relaxed"
                      style={{
                        color: currentParaIdx === 0 ? '#9f1239' : '#44403c',
                        fontWeight: currentParaIdx === 0 ? 600 : 400,
                      }}
                    >
                      {currentText}
                      <span className="typewriter-cursor" />
                    </p>
                  )}
                </div>

                {/* Decorative flowers in corners */}
                <div className="absolute top-3 right-3 text-xl opacity-60">🌸</div>
                <div className="absolute bottom-3 left-3 text-xl opacity-60">🌹</div>
              </div>

              {/* Continue button */}
              {isFinished && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mt-6"
                >
                  <button
                    onClick={() => { soundEngine.playPageSwitch(); onNext(); }}
                    className="glass-button text-sm"
                  >
                    The Grand Finale ✨
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
