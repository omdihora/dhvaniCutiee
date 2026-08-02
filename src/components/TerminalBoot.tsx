import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TerminalBootProps {
  onComplete: () => void;
}

export const TerminalBoot: React.FC<TerminalBootProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [currentLine, setCurrentLine] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const runBootSequence = async () => {
      // Line 1
      await typeString('Booting RelationshipOS Kernel v3.0...', 28);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Booting RelationshipOS Kernel v3.0...']);
      setCurrentLine('');

      await delay(300);

      // Line 2
      await typeString('Loading High-Fidelity Love Engine...', 28);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Loading High-Fidelity Love Engine...']);
      setCurrentLine('');

      await delay(300);

      // Line 3
      await typeString('Establishing Secure Heart Connection...', 25);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Establishing Secure Heart Connection...']);
      setCurrentLine('');

      await delay(250);

      // Loading Bar 0% to 100%
      setShowProgress(true);
      for (let p = 0; p <= 100; p += 5) {
        if (isCancelled) return;
        setProgress(p);
        if (p % 20 === 0) soundEngine.playClick();
        await delay(20);
      }

      await delay(300);

      // Line 4
      await typeString('Searching Biometric Database for User...', 25);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Searching Biometric Database for User...']);
      setCurrentLine('');

      await delay(350);

      // Line 5
      await typeString('✔ User Identified: Dhvani ❤️', 35);
      if (isCancelled) return;
      setLogs((prev) => [...prev, '✔ User Identified: Dhvani ❤️']);
      setCurrentLine('');
      soundEngine.playHeartPop();

      await delay(450);

      // Line 6
      await typeString('Kernel Initialized Successfully. Welcome Home Dhvani ❤️', 32);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Kernel Initialized Successfully. Welcome Home Dhvani ❤️']);
      setCurrentLine('');
      soundEngine.playSuccess();

      await delay(600);
      setIsDone(true);
    };

    const typeString = (text: string, speed: number) => {
      return new Promise<void>((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
          if (i <= text.length) {
            setCurrentLine(text.slice(0, i));
            if (i % 3 === 0) soundEngine.playTerminalType();
            i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, speed);
      });
    };

    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    runBootSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleNext = () => {
    soundEngine.playPageSwitch();
    soundEngine.startAmbientBGM();
    onComplete();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden my-auto bg-[#0f051d]">
      {/* Aurora backdrop */}
      <div className="absolute w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[140px] pointer-events-none animate-aurora top-1/4 left-1/4" />

      {/* Terminal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl glass-card-luxury rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(212,175,55,0.2)] border border-[#f7e7ce]/30 relative z-10 font-mono"
      >
        {/* Header */}
        <div className="bg-[#0f051d]/90 backdrop-blur-xl px-5 py-4 border-b border-[#f7e7ce]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-400/90 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-300/90 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
          <div className="text-xs text-[#f7e7ce] font-mono tracking-widest uppercase flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#d4af37]" />
            PAGE 2 // relationship_os_v3.0.sh
          </div>
          <div className="text-xs text-[#d4af37] font-mono">bash</div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 sm:p-9 space-y-4 text-sm sm:text-base text-pink-100/90 leading-relaxed min-h-[340px] flex flex-col justify-start">
          {logs.map((log, index) => {
            const isDhvani = log.includes('Dhvani');
            const isSuccess = log.includes('Kernel Initialized');
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  isDhvani
                    ? 'text-emerald-300 font-semibold text-base sm:text-lg drop-shadow-sm'
                    : isSuccess
                    ? 'text-[#f7e7ce] font-bold text-base sm:text-lg glow-text-gold'
                    : 'text-pink-100/80'
                }`}
              >
                <span className="text-[#d4af37] select-none font-bold">$</span>
                <span>{log}</span>
              </div>
            );
          })}

          {/* Active typing line */}
          {currentLine && (
            <div className="flex items-start gap-3 text-pink-200">
              <span className="text-[#d4af37] select-none font-bold">$</span>
              <span>{currentLine}</span>
              <span className="inline-block w-2.5 h-5 bg-[#f7e7ce] animate-pulse ml-0.5" />
            </div>
          )}

          {/* Loading Progress Bar */}
          {showProgress && progress <= 100 && (
            <div className="my-4 space-y-2">
              <div className="flex justify-between text-xs text-[#f7e7ce] font-mono">
                <span>[MEMORY_INDEXING]</span>
                <span className="font-bold text-[#d4af37]">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-[#f7e7ce]/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#d4af37] via-[#f7e7ce] to-[#b76e79] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Next Step Button */}
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6 flex justify-center border-t border-[#f7e7ce]/20"
            >
              <button
                onClick={handleNext}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b76e79] text-[#0f051d] font-semibold font-serif-luxury text-base flex items-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#0f051d] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Continue to Welcome Page</span>
                <ArrowRight className="w-4 h-4 text-[#0f051d]" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TerminalBoot;
