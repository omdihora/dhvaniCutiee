import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Star, Sparkles, Calendar, PenLine, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

const MILESTONES = [
  {
    icon: <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />,
    title: 'The Day We Met ❤️',
    description: 'The universe finally got the assignment right and introduced us.',
    color: 'rose',
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
    title: 'Our First Conversation 💬',
    description: 'From simple hellos to talking for hours without noticing time pass.',
    color: 'blue',
  },
  {
    icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" />,
    title: 'The Day You Became Special 💖',
    description: 'The moment I realized you weren\'t just anyone — you were my favorite person.',
    color: 'amber',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    title: 'Our Favorite Memories ✨',
    description: 'Every laugh, every call, every silly joke — pure irreplaceable magic.',
    color: 'purple',
  },
  {
    icon: <Calendar className="w-5 h-5 text-pink-400" />,
    title: 'Today ❤️',
    description: 'Still choosing you. Still grateful. Still falling for you every day.',
    color: 'pink',
  },
];

const colorMap: Record<string, { border: string; bg: string; glow: string; dot: string }> = {
  rose: { border: 'border-rose-400/40', bg: 'bg-rose-500/10', glow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]', dot: 'bg-rose-400' },
  blue: { border: 'border-blue-400/40', bg: 'bg-blue-500/10', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]', dot: 'bg-blue-400' },
  amber: { border: 'border-amber-400/40', bg: 'bg-amber-500/10', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]', dot: 'bg-amber-400' },
  purple: { border: 'border-purple-400/40', bg: 'bg-purple-500/10', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]', dot: 'bg-purple-400' },
  pink: { border: 'border-pink-400/40', bg: 'bg-pink-500/10', glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]', dot: 'bg-pink-400' },
};

interface OurStoryTimelineProps {
  onNext?: () => void;
}

export const OurStoryTimeline: React.FC<OurStoryTimelineProps> = ({ onNext }) => {
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
        className="text-center mb-12 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-sm">
          <PenLine className="w-3.5 h-3.5 text-pink-300" />
          <span>PAGE 8 // OUR_STORY_TIMELINE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-200 via-rose-200 to-amber-200 bg-clip-text text-transparent">
          Our Story
        </h2>
        <p className="text-pink-200/70 text-sm mt-2 font-light">
          Every chapter written with love & care
        </p>
      </motion.div>

      {/* Timeline List */}
      <div className="relative max-w-2xl w-full z-10">
        {/* Vertical connector line */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-400/50 via-purple-400/50 to-pink-400/30 rounded-full" />

        {MILESTONES.map((milestone, idx) => {
          const colors = colorMap[milestone.color];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-16 sm:pl-20 mb-8 last:mb-0"
            >
              <div className={`absolute left-4 sm:left-6 top-4 w-5 h-5 rounded-full ${colors.dot} border-4 border-[#0e0716] z-10 timeline-dot-pulse`} />

              <div className={`glass-card-apple ${colors.bg} ${colors.border} ${colors.glow} rounded-[24px] p-5 sm:p-6 transition-all duration-300 hover:scale-[1.02]`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    {milestone.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {milestone.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-200/90 font-light leading-relaxed pl-12">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Final milestone — The Next Chapter */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative pl-16 sm:pl-20 mt-8"
        >
          <div className="absolute left-4 sm:left-6 top-4 w-5 h-5 rounded-full bg-amber-400 border-4 border-[#0e0716] z-10 timeline-dot-pulse" />

          <div className="glass-card-apple bg-amber-500/10 border-amber-400/40 rounded-[24px] p-6 sm:p-8 shadow-[0_0_40px_rgba(251,191,36,0.3)] relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl"
              >
                ✨
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-amber-200 glow-text-gold tracking-tight">
                The Next Chapter...
              </h3>
            </div>
            <p className="text-base text-amber-100/90 font-cursive text-xl pl-13">
              Still being written... together ❤️
            </p>
          </div>
        </motion.div>

        {/* Progression Button */}
        {onNext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-8 flex justify-center"
          >
            <button
              onClick={handleNextPage}
              className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Proceed to Interactive Love Terminal</span>
              <ArrowRight className="w-4 h-4 text-pink-300" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
