import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TerminalLine {
  type: 'input' | 'output' | 'system' | 'progress';
  text: string;
  color?: string;
}

const COMMANDS: Record<string, TerminalLine[]> = {
  help: [
    { type: 'system', text: '╔══════════════════════════════════╗' },
    { type: 'system', text: '║  💖 Love Terminal v3.0 — Help    ║' },
    { type: 'system', text: '╠══════════════════════════════════╣' },
    { type: 'system', text: '║  love    — Check love level      ║' },
    { type: 'system', text: '║  future  — Preview Marriage.exe   ║' },
    { type: 'system', text: '║  hug     — Send virtual hug      ║' },
    { type: 'system', text: '║  kiss    — Execute kiss protocol ║' },
    { type: 'system', text: '║  miss    — Check missing metric  ║' },
    { type: 'system', text: '║  date    — Reserve date night    ║' },
    { type: 'system', text: '║  clear   — Clear terminal        ║' },
    { type: 'system', text: '╚══════════════════════════════════╝' },
  ],
  love: [
    { type: 'output', text: '$ querying love_database...' },
    { type: 'output', text: '❤️ Love Level: ∞ (INFINITY)' },
    { type: 'output', text: '⚠️ Warning: Cannot be overwritten, modified, or deleted.' },
    { type: 'output', text: '📌 Status: PERMANENTLY_COMMITTED' },
  ],
  future: [
    { type: 'output', text: '$ loading future_preview.exe...' },
    { type: 'progress', text: 'Marriage.exe' },
    { type: 'output', text: '💍 Marriage.exe — Status: INEVITABLE' },
    { type: 'output', text: '🏠 Dream_Home.zip — Status: PLANNED' },
    { type: 'output', text: '✈️ Honeymoon_Destinations/ — Status: BOOKMARKED' },
    { type: 'output', text: '👶 Mini_Us.exe — Status: SOMEDAY ❤️' },
    { type: 'output', text: '⏳ Timeline: Forever — No Expiry Date' },
  ],
  hug: [
    { type: 'output', text: '$ initiating hug_protocol...' },
    { type: 'output', text: '🤗 Sending virtual hug...' },
    { type: 'output', text: '📡 Transmitting warmth across all frequencies...' },
    { type: 'output', text: '✅ Hug Delivered Successfully! 🤗❤️' },
    { type: 'output', text: '// Note: Real hug pending next meeting' },
  ],
  kiss: [
    { type: 'output', text: '$ kiss_protocol --initiate' },
    { type: 'output', text: '💋 Kiss protocol activated...' },
    { type: 'output', text: '🔐 Encryption: LIPS_TO_LIPS_256' },
    { type: 'output', text: '✅ Kiss transmitted successfully! 💋❤️' },
    { type: 'output', text: '// Bandwidth: Unlimited for Dhvani' },
  ],
  miss: [
    { type: 'output', text: '$ checking missing_you_metrics...' },
    { type: 'output', text: '📊 Missing Level: EXTREMELY HIGH' },
    { type: 'output', text: '🕐 Time Since Last Hug: TOO LONG' },
    { type: 'output', text: '💭 Thoughts About You Today: 9,999+' },
    { type: 'output', text: '❤️ Solution: See you ASAP' },
  ],
  date: [
    { type: 'output', text: '$ planning date_night.sh...' },
    { type: 'output', text: '🍕 Dinner: Reserved at your favorite spot' },
    { type: 'output', text: '🎬 Movie: Your choice (always)' },
    { type: 'output', text: '🌙 Stargazing: Location locked ⭐' },
    { type: 'output', text: '💑 Company: Om + Dhvani = Perfect Date ❤️' },
  ],
};

interface DevTerminalProps {
  onNext?: () => void;
}

export const DevTerminal: React.FC<DevTerminalProps> = ({ onNext }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', text: '╔══════════════════════════════════════╗' },
    { type: 'system', text: '║  💖 Love Terminal v3.0               ║' },
    { type: 'system', text: '║  Handcrafted with ❤️ for Dhvani      ║' },
    { type: 'system', text: '╚══════════════════════════════════════╝' },
    { type: 'system', text: '' },
    { type: 'output', text: 'Type "help" to list available commands ❤️' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, showProgress]);

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setIsProcessing(true);

    setLines(prev => [...prev, { type: 'input', text: `$ ${cmd}` }]);

    await new Promise(r => setTimeout(r, 250));

    if (trimmed === 'clear') {
      setLines([{ type: 'system', text: '// Terminal cleared ✨' }]);
      setIsProcessing(false);
      return;
    }

    const response = COMMANDS[trimmed];
    if (!response) {
      setLines(prev => [
        ...prev,
        { type: 'output', text: `❌ Command not found: "${cmd}"` },
        { type: 'output', text: '💡 Type "help" for available commands (love, future, hug, kiss, miss, date)' },
      ]);
      soundEngine.playErrorSound();
      setIsProcessing(false);
      return;
    }

    for (const line of response) {
      if (line.type === 'progress') {
        setProgressLabel(line.text);
        setShowProgress(true);
        setProgressPercent(0);

        await new Promise<void>(resolve => {
          let p = 0;
          const interval = setInterval(() => {
            p += 2.5;
            setProgressPercent(Math.min(100, p));
            if (p >= 100) {
              clearInterval(interval);
              setShowProgress(false);
              resolve();
            }
          }, 35);
        });
      } else {
        setLines(prev => [...prev, line]);
        soundEngine.playTerminalType();
        await new Promise(r => setTimeout(r, 180));
      }
    }

    soundEngine.playHeartPop();
    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isProcessing) return;
    const cmd = currentInput;
    setCurrentInput('');
    processCommand(cmd);
  };

  const handleKeyPress = () => {
    soundEngine.playTerminalType();
  };

  const handleNextPage = () => {
    soundEngine.playPageSwitch();
    if (onNext) onNext();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-sm">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>PAGE 9 // INTERACTIVE_LOVE_CLI</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200 bg-clip-text text-transparent">
          Developer Love Terminal
        </h2>
        <p className="text-emerald-200/80 text-sm mt-2 font-code">
          Try typing: love, future, hug, kiss, miss, date
        </p>
      </motion.div>

      {/* Terminal Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-2xl rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(52,211,153,0.18)] border border-emerald-300/20 relative z-10"
      >
        {/* Header */}
        <div className="bg-[#0d1117]/90 backdrop-blur-xl px-5 py-4 border-b border-emerald-300/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-400/90 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-300/90 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          </div>
          <div className="text-xs text-emerald-200/70 font-code tracking-widest flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            love_terminal_v3.0.sh
          </div>
          <div className="text-xs text-emerald-300/40 font-code">bash</div>
        </div>

        {/* Terminal Body */}
        <div
          className="bg-[#0d1117]/95 p-5 sm:p-6 h-80 sm:h-96 overflow-y-auto font-code text-sm space-y-1.5 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`${
                line.type === 'input'
                  ? 'text-emerald-300 font-semibold'
                  : line.type === 'system'
                  ? 'text-emerald-400/70'
                  : 'text-slate-200/90'
              }`}
            >
              {line.text}
            </div>
          ))}

          {showProgress && (
            <div className="my-2 space-y-1">
              <div className="text-amber-300 text-xs">
                Loading {progressLabel}... {Math.floor(progressPercent)}%
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-emerald-300/20">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300 rounded-full transition-all duration-75"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Form input line */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-bold select-none">❯</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={e => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-none outline-none text-emerald-100 font-code text-sm caret-emerald-400 placeholder:text-emerald-300/30"
              placeholder={isProcessing ? 'executing...' : 'type command...'}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="w-2.5 h-5 bg-emerald-400 terminal-cursor-blink" />
          </form>

          <div ref={terminalEndRef} />
        </div>
      </motion.div>

      {/* Progression Button */}
      {onNext && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8 flex justify-center z-10"
        >
          <button
            onClick={handleNextPage}
            className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(52,211,153,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Proceed to System Controls</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
