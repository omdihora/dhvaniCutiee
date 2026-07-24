import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../utils/audio';

interface TerminalBootProps {
  onComplete: () => void;
}

export const TerminalBoot: React.FC<TerminalBootProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [currentLine, setCurrentLine] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const runBootSequence = async () => {
      // Line 1
      await typeString('Booting RelationshipOS v1.0...', 32);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Booting RelationshipOS v1.0...']);
      setCurrentLine('');

      await delay(350);

      // Line 2
      await typeString('Loading Memories...', 32);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Loading Memories...']);
      setCurrentLine('');

      await delay(350);

      // Line 3
      await typeString('Establishing Secure Heart Connection...', 28);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Establishing Secure Heart Connection...']);
      setCurrentLine('');

      await delay(300);

      // Loading Bar 0% to 100%
      setShowProgress(true);
      for (let p = 0; p <= 100; p += 4) {
        if (isCancelled) return;
        setProgress(p);
        if (p % 20 === 0) soundEngine.playClick();
        await delay(22);
      }

      await delay(350);

      // Line 4
      await typeString('Searching for User...', 28);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Searching for User...']);
      setCurrentLine('');

      await delay(450);

      // Line 5
      await typeString('✔ Dhvani Found.', 38);
      if (isCancelled) return;
      setLogs((prev) => [...prev, '✔ Dhvani Found.']);
      setCurrentLine('');
      soundEngine.playHeartPop();

      await delay(550);

      // Line 6
      setIsAuthenticating(true);
      await typeString('Authentication Successful ❤️', 38);
      if (isCancelled) return;
      setLogs((prev) => [...prev, 'Authentication Successful ❤️']);
      setCurrentLine('');
      soundEngine.playHeartPop();

      await delay(1100);

      // Finish terminal phase and trigger main romantic app entrance
      soundEngine.startAmbientBGM();
      onComplete();
    };

    const typeString = (text: string, speed: number) => {
      return new Promise<void>((resolve) => {
        let i = 0;
        const interval = setInterval(() => {
          if (i <= text.length) {
            setCurrentLine(text.slice(0, i));
            if (i % 3 === 0) soundEngine.playClick();
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
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Soft Ambient Aurora Gradient Background Orbs */}
      <div className="absolute w-[600px] h-[600px] bg-pink-500/15 rounded-full blur-[140px] pointer-events-none animate-aurora top-1/4 left-1/4" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none animate-aurora bottom-1/4 right-1/4" />

      {/* Terminal Glass Container */}
      <div className="w-full max-w-2xl glass-card-apple rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(236,72,153,0.25)] border border-pink-300/30 relative z-10 font-code">
        {/* Terminal macOS Header */}
        <div className="bg-[#170924]/80 backdrop-blur-xl px-5 py-4 border-b border-pink-300/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-400/90 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-300/90 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
          <div className="text-xs text-pink-200/80 font-mono tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            relationship_os_kernel_v1.0.sh
          </div>
          <div className="text-xs text-pink-300/50 font-mono">bash</div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 sm:p-9 space-y-4 text-sm sm:text-base text-pink-100/90 leading-relaxed min-h-[350px] flex flex-col justify-start">
          {logs.map((log, index) => {
            const isDhvani = log.includes('Dhvani Found');
            const isSuccess = log.includes('Authentication Successful');
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  isDhvani
                    ? 'text-emerald-300 font-semibold text-lg drop-shadow-sm'
                    : isSuccess
                    ? 'text-pink-300 font-bold text-lg glow-text-blush'
                    : 'text-pink-100/80'
                }`}
              >
                <span className="text-rose-400 select-none font-bold">$</span>
                <span>{log}</span>
              </div>
            );
          })}

          {/* Active typing line */}
          {currentLine && (
            <div className="flex items-start gap-3 text-pink-200">
              <span className="text-rose-400 select-none font-bold">$</span>
              <span>{currentLine}</span>
              <span className="inline-block w-2.5 h-5 bg-pink-300 animate-pulse ml-0.5" />
            </div>
          )}

          {/* Loading Progress Bar */}
          {showProgress && progress <= 100 && (
            <div className="my-4 space-y-2">
              <div className="flex justify-between text-xs text-pink-200/80 font-mono">
                <span>[MEMORY_INDEXING]</span>
                <span className="font-bold text-pink-300">{progress}%</span>
              </div>
              <div className="w-full h-3.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-pink-300/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 rounded-full shadow-[0_0_15px_rgba(248,200,220,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {!currentLine && logs.length > 0 && logs.length < 6 && (
            <div className="flex items-center gap-3 text-pink-400">
              <span className="text-rose-400 select-none font-bold">$</span>
              <span className="inline-block w-2.5 h-5 bg-pink-300 animate-pulse" />
            </div>
          )}

          {isAuthenticating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-2xl bg-pink-500/15 border border-pink-300/30 text-center text-pink-100 font-sans text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(236,72,153,0.2)]"
            >
              <span className="animate-spin text-xl">💖</span>
              <span className="font-medium">Initializing Dreamy Love Interface...</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
