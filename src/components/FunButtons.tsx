import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, ShieldAlert, Lock, AlertTriangle, X, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FunButtonsProps {
  onNext?: () => void;
}

export const FunButtons: React.FC<FunButtonsProps> = ({ onNext }) => {
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'failed'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [deleteState, setDeleteState] = useState<'idle' | 'denied'>('idle');

  const handleDownload = () => {
    if (downloadState !== 'idle') return;
    setDownloadState('downloading');
    setDownloadProgress(0);
    soundEngine.playClick();

    let p = 0;
    const interval = setInterval(() => {
      p += 1.2;
      setDownloadProgress(Math.floor(p));

      if (p >= 99) {
        clearInterval(interval);
        setTimeout(() => {
          setDownloadState('failed');
          soundEngine.playHeartPop();
        }, 400);
      }
    }, 28);
  };

  const handleDelete = () => {
    soundEngine.playErrorSound();
    setDeleteState('denied');

    setTimeout(() => {
      setDeleteState('idle');
    }, 4000);
  };

  const resetDownload = () => {
    setDownloadState('idle');
    setDownloadProgress(0);
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
        className="text-center mb-10 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-sm">
          <span>⚙️</span>
          <span>PAGE 10 // SYSTEM_SECURITY_CONTROLS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-200 via-rose-200 to-purple-200 bg-clip-text text-transparent">
          Playful System Controls
        </h2>
        <p className="text-pink-200/70 text-sm mt-2 font-light">
          Test system permissions and download controls
        </p>
      </motion.div>

      {/* Buttons Grid */}
      <div className="w-full max-w-lg space-y-6 z-10">
        {/* Download My Heart Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-apple rounded-[24px] p-5 sm:p-6 border border-pink-300/30 shadow-[0_10px_30px_rgba(236,72,153,0.15)]"
        >
          {downloadState === 'idle' && (
            <button
              onClick={handleDownload}
              className="w-full glass-button-romantic py-4 px-6 rounded-full text-white font-medium text-base sm:text-lg flex items-center justify-center gap-3 border border-pink-300/30 active:scale-95 transition-transform"
            >
              <Download className="w-5 h-5 text-pink-300" />
              <span>Download My Heart ❤️</span>
            </button>
          )}

          {downloadState === 'downloading' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-code">
                <span className="text-pink-200 flex items-center gap-2">
                  <Download className="w-4 h-4 animate-bounce text-pink-300" />
                  Downloading heart.exe...
                </span>
                <span className="text-pink-300 font-bold">{downloadProgress}%</span>
              </div>
              <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden border border-pink-300/20">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <p className="text-xs font-code text-pink-300/60">
                {downloadProgress < 30 ? 'Packaging feelings...' :
                 downloadProgress < 60 ? 'Compressing memories...' :
                 downloadProgress < 90 ? 'Almost there...' : 'Finalizing transfer...'}
              </p>
            </div>
          )}

          <AnimatePresence>
            {downloadState === 'failed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-3 relative"
              >
                <button
                  onClick={resetDownload}
                  className="absolute top-0 right-0 text-pink-300/60 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7 text-rose-400" />
                </div>
                <div className="font-code text-rose-300 font-bold text-sm">
                  ❌ DOWNLOAD FAILED
                </div>
                <p className="text-lg font-medium text-pink-100">
                  Download Failed — Heart Already Belongs to Dhvani ❤️
                </p>
                <p className="text-xs font-code text-pink-300/60">
                  Error: EXCLUSIVE_OWNERSHIP — Cannot export protected asset
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Delete Om Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card-apple rounded-[24px] p-5 sm:p-6 border border-red-300/20 shadow-[0_10px_30px_rgba(244,63,94,0.15)]"
        >
          {deleteState === 'idle' && (
            <button
              onClick={handleDelete}
              className="w-full py-4 px-6 rounded-full text-white font-medium text-base sm:text-lg flex items-center justify-center gap-3 border border-red-400/30 bg-red-500/10 hover:bg-red-500/20 active:scale-95 transition-all backdrop-blur-xl"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
              <span>Delete Om System File</span>
            </button>
          )}

          <AnimatePresence>
            {deleteState === 'denied' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-3 animate-shake"
              >
                <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-7 h-7 text-red-400" />
                </div>
                <div className="font-code text-red-300 font-bold text-sm flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  🔒 ACCESS DENIED
                </div>
                <p className="text-lg font-medium text-slate-100">
                  Access Denied — Om is a protected system file ❤️
                </p>
                <p className="text-xs font-code text-red-300/60">
                  Permission: UNDELETABLE — Core dependency detected
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Progression Button */}
      {onNext && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-8 flex justify-center z-10"
        >
          <button
            onClick={handleNextPage}
            className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Proceed to Love Protocol Quiz</span>
            <ArrowRight className="w-4 h-4 text-pink-300" />
          </button>
        </motion.div>
      )}
    </div>
  );
};
