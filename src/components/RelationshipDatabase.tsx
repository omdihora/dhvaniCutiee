import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, Lock, Shield, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface RelationshipDatabaseProps {
  onNext?: () => void;
}

interface DBRecord {
  field: string;
  value: string;
  type: string;
  icon: string;
  highlight?: boolean;
}

const DB_RECORDS: DBRecord[] = [
  { field: 'user_id', value: '#000001', type: 'PRIMARY KEY', icon: '🔑' },
  { field: 'name', value: 'Dhvani', type: 'VARCHAR(❤️)', icon: '💖' },
  { field: 'status', value: 'Favorite Person', type: 'ENUM', icon: '⭐', highlight: true },
  { field: 'role', value: 'Queen of My Heart', type: 'VARCHAR(∞)', icon: '👑' },
  { field: 'access_level', value: 'Full Heart Access', type: 'ADMIN', icon: '🔓', highlight: true },
  { field: 'priority', value: '#1 Always', type: 'INTEGER', icon: '🥇' },
  { field: 'love_level', value: '∞ (INFINITY)', type: 'BIGINT', icon: '💕' },
  { field: 'delete_permission', value: 'DENIED ❌', type: 'BOOLEAN', icon: '🔒', highlight: true },
  { field: 'backup_status', value: 'Written in Heart (Permanent)', type: 'ENUM', icon: '💾' },
  { field: 'last_thought_about', value: 'Right now', type: 'TIMESTAMP', icon: '🕐' },
  { field: 'expiry_date', value: 'NULL (Never Expires)', type: 'DATE', icon: '♾️', highlight: true },
  { field: 'license', value: 'Lifetime ♾️', type: 'VARCHAR', icon: '📜', highlight: true },
];

const QUERY_TEXT = "SELECT * FROM heart WHERE name = 'Dhvani';";

export const RelationshipDatabase: React.FC<RelationshipDatabaseProps> = ({ onNext }) => {
  const [phase, setPhase] = useState<'typing' | 'executing' | 'result'>('typing');
  const [typedQuery, setTypedQuery] = useState('');
  const [visibleRows, setVisibleRows] = useState(0);

  // Type the query
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= QUERY_TEXT.length) {
        setTypedQuery(QUERY_TEXT.slice(0, idx));
        if (idx % 3 === 0) soundEngine.playClick();
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('executing');
          soundEngine.playSuccess();
        }, 600);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Execute and show results
  useEffect(() => {
    if (phase !== 'executing') return;
    const timer = setTimeout(() => {
      setPhase('result');
      // Reveal rows one by one
      let row = 0;
      const interval = setInterval(() => {
        row++;
        setVisibleRows(row);
        soundEngine.playClick();
        if (row >= DB_RECORDS.length) {
          clearInterval(interval);
          soundEngine.playHeartPop();
        }
      }, 150);
    }, 800);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4">
          <Database className="w-3.5 h-3.5 text-blue-300" />
          <span>RELATIONSHIP DATABASE v∞</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
          Relationship Database
        </h2>
        <p className="text-blue-200/60 text-sm mt-2 font-code">
          <Shield className="w-3 h-3 inline mr-1 text-emerald-400" />
          Encrypted • Read-Only • No Delete Access
        </p>
      </motion.div>

      {/* SQL Terminal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-3xl z-10 glass-card bg-[#0d1117]/95 border border-blue-500/20 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(59,130,246,0.15)] mb-6"
      >
        {/* Terminal Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 bg-[#161b22]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-code text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3 h-3" />
            love_db@heart ~ SQL Console
          </span>
        </div>

        {/* Query Input */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 font-code text-sm font-bold select-none">❯</span>
            <div className="font-code text-sm text-blue-300 flex-1 break-all">
              {typedQuery}
              {phase === 'typing' && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-blue-400 ml-0.5 align-middle"
                />
              )}
            </div>
          </div>

          {phase === 'executing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs font-code text-amber-300/80"
            >
              ⏳ Querying heart_database... 1 record found.
            </motion.div>
          )}
        </div>

        {/* Results Table */}
        <AnimatePresence>
          {phase === 'result' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 overflow-x-auto"
            >
              <p className="text-xs font-code text-emerald-400 mb-3">
                ✅ Query executed successfully. 1 row returned:
              </p>

              <table className="w-full text-sm font-code">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-slate-400 py-2 px-3 font-normal">Field</th>
                    <th className="text-left text-xs text-slate-400 py-2 px-3 font-normal">Value</th>
                    <th className="text-left text-xs text-slate-400 py-2 px-3 font-normal hidden sm:table-cell">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {DB_RECORDS.map((record, idx) => (
                    <motion.tr
                      key={record.field}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: idx < visibleRows ? 1 : 0,
                        x: idx < visibleRows ? 0 : -10,
                      }}
                      className={`border-b border-white/5 ${record.highlight ? 'bg-pink-500/5' : ''} hover:bg-white/5 transition-colors`}
                    >
                      <td className="py-2.5 px-3 text-blue-300 whitespace-nowrap">
                        <span className="mr-1.5">{record.icon}</span>
                        {record.field}
                      </td>
                      <td className={`py-2.5 px-3 ${record.highlight ? 'text-pink-300 font-semibold' : 'text-white'}`}>
                        {record.value}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-xs hidden sm:table-cell">
                        {record.type}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {visibleRows >= DB_RECORDS.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs font-code"
                >
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Record protected
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300/70">DELETE operations: PERMANENTLY DISABLED</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-pink-300/70">❤️ License: LIFETIME</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Continue Button */}
      {onNext && visibleRows >= DB_RECORDS.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4 z-10"
        >
          <button
            onClick={() => {
              soundEngine.playPageSwitch();
              onNext();
            }}
            className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Chat with LoveGPT</span>
            <ArrowRight className="w-4 h-4 text-pink-300" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default RelationshipDatabase;
