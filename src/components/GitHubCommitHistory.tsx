import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, GitBranch, Star, Users, ArrowRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface GitHubCommitHistoryProps {
  onNext?: () => void;
}

interface Commit {
  hash: string;
  message: string;
  emoji: string;
  branch: string;
  timeAgo: string;
  additions: number;
  deletions: number;
}

const COMMITS: Commit[] = [
  { hash: 'a1b2c3d', message: 'init: Met Dhvani for the first time', emoji: '❤️', branch: 'main', timeAgo: 'A beautiful day ago', additions: 999, deletions: 0 },
  { hash: 'e4f5g6h', message: 'feat: Started Smiling More', emoji: '😊', branch: 'love-branch', timeAgo: 'Soon after', additions: 500, deletions: 0 },
  { hash: 'i7j8k9l', message: 'fix: Fixed my boring life', emoji: '✨', branch: 'love-branch', timeAgo: 'Every day since', additions: 1000, deletions: 100 },
  { hash: 'm0n1o2p', message: 'feat: First conversation that lasted hours', emoji: '💬', branch: 'love-branch', timeAgo: 'Time stopped', additions: 9999, deletions: 0 },
  { hash: 'q3r4s5t', message: 'refactor: Reorganized priorities (Dhvani = #1)', emoji: '🔄', branch: 'love-branch', timeAgo: 'Naturally', additions: 1, deletions: 0 },
  { hash: 'u6v7w8x', message: 'feat: Fell in Love (no going back)', emoji: '💖', branch: 'love-branch', timeAgo: 'Inevitable', additions: Infinity, deletions: 0 },
  { hash: 'y9z0a1b', message: 'feat: Made Beautiful Memories Together', emoji: '📸', branch: 'love-branch', timeAgo: 'Every moment', additions: 999, deletions: 0 },
  { hash: 'c2d3e4f', message: 'feat: First Date under the fairy lights', emoji: '🌟', branch: 'love-branch', timeAgo: 'Best night ever', additions: 10000, deletions: 0 },
  { hash: 'g5h6i7j', message: 'fix: Removed ability to unlove Dhvani', emoji: '🔒', branch: 'main', timeAgo: 'Permanently', additions: 0, deletions: 0 },
  { hash: 'k8l9m0n', message: 'chore: Currently Working on Forever', emoji: '♾️', branch: 'main', timeAgo: 'Right now', additions: Infinity, deletions: 0 },
];

// Generate a heart-shaped contribution grid
const generateContributionGrid = (): number[][] => {
  const weeks = 52;
  const days = 7;
  const grid: number[][] = [];

  // Heart shape pattern (7 rows x ~15 cols centered)
  const heartPattern = [
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  ];

  const heartStartWeek = Math.floor((weeks - 11) / 2);

  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const hW = w - heartStartWeek;
      if (hW >= 0 && hW < 11 && d < 7 && heartPattern[d][hW]) {
        week.push(2 + Math.floor(Math.random() * 3)); // levels 2-4
      } else {
        week.push(Math.random() > 0.75 ? 1 : 0); // sparse background
      }
    }
    grid.push(week);
  }
  return grid;
};

const CONTRIBUTION_GRID = generateContributionGrid();

const LEVEL_COLORS = [
  'bg-white/5',           // 0 - empty
  'bg-emerald-900/50',    // 1 - low
  'bg-emerald-700/70',    // 2 - medium
  'bg-emerald-500/80',    // 3 - high
  'bg-emerald-400',       // 4 - max
];

export const GitHubCommitHistory: React.FC<GitHubCommitHistoryProps> = ({ onNext }) => {
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4">
          <GitCommit className="w-3.5 h-3.5 text-emerald-300" />
          <span>LOVE COMMIT HISTORY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200 bg-clip-text text-transparent">
          om/heart
        </h2>
        <p className="text-emerald-200/60 text-sm mt-2 font-code">Public repository • Updated just now</p>
      </motion.div>

      {/* Repository Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-3xl z-10 flex flex-wrap items-center justify-center gap-3 mb-6"
      >
        {[
          { icon: <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />, label: '∞ stars' },
          { icon: <GitBranch className="w-3.5 h-3.5 text-emerald-300" />, label: '2 branches' },
          { icon: <Users className="w-3.5 h-3.5 text-blue-300" />, label: '1 contributor' },
          { icon: <GitCommit className="w-3.5 h-3.5 text-purple-300" />, label: `${COMMITS.length} commits` },
        ].map((stat, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-200 font-code"
          >
            {stat.icon}
            <span>{stat.label}</span>
          </span>
        ))}
      </motion.div>

      {/* Contribution Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-3xl z-10 glass-card bg-[#0d1117]/90 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 mb-6 overflow-x-auto"
      >
        <p className="text-xs font-code text-slate-400 mb-3">
          {COMMITS.length * 42} contributions in the last year
        </p>
        <div className="flex gap-[3px] min-w-[600px]">
          {CONTRIBUTION_GRID.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-[3px]">
              {week.map((level, dIdx) => (
                <div
                  key={dIdx}
                  className={`w-[10px] h-[10px] rounded-[2px] ${LEVEL_COLORS[level]} transition-all hover:scale-150 hover:ring-1 hover:ring-emerald-400/50`}
                  title={`${level > 0 ? level * 3 : 0} love contributions`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 mt-3 text-[10px] font-code text-slate-500 justify-end">
          <span>Less</span>
          {LEVEL_COLORS.map((c, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
          ))}
          <span>More</span>
        </div>
      </motion.div>

      {/* Commit Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-3xl z-10 glass-card bg-[#0d1117]/90 border border-emerald-500/20 rounded-2xl overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-emerald-300" />
          <span className="text-sm font-code text-white font-semibold">Commits</span>
          <span className="text-xs font-code text-slate-400">on love-branch</span>
        </div>

        <div className="divide-y divide-white/5">
          {COMMITS.map((commit, idx) => (
            <motion.div
              key={commit.hash}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.08 }}
              onClick={() => {
                soundEngine.playClick();
                setExpandedCommit(expandedCommit === commit.hash ? null : commit.hash);
              }}
              className="px-4 sm:px-6 py-3 hover:bg-white/5 cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5 flex-shrink-0">{commit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium group-hover:text-emerald-300 transition-colors truncate">
                    {commit.message}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-code text-slate-400">
                    <span className="text-emerald-400/80">{commit.branch}</span>
                    <span>•</span>
                    <span className="text-amber-300/70">{commit.hash}</span>
                    <span>•</span>
                    <span>{commit.timeAgo}</span>
                  </div>

                  <AnimatePresence>
                    {expandedCommit === commit.hash && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 pt-2 border-t border-white/5 text-xs font-code overflow-hidden"
                      >
                        <span className="text-emerald-400">
                          +{commit.additions === Infinity ? '∞' : commit.additions}
                        </span>
                        <span className="text-slate-500 mx-2">/</span>
                        <span className="text-rose-400">
                          -{commit.deletions}
                        </span>
                        <span className="text-slate-500 ml-3">
                          committed by <span className="text-pink-300">om</span> with ❤️
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue Button */}
      {onNext && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="pt-8 z-10"
        >
          <button
            onClick={() => {
              soundEngine.playPageSwitch();
              onNext();
            }}
            className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Query Relationship Database</span>
            <ArrowRight className="w-4 h-4 text-pink-300" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default GitHubCommitHistory;
