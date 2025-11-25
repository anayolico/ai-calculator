"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Trash2, RotateCcw } from 'lucide-react';

/**
 * History Component
 * Displays calculation history with localStorage persistence
 */

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

interface HistoryProps {
  entries: HistoryEntry[];
  onClear: () => void;
  onReuse: (entry: HistoryEntry) => void;
}

export default function History({ entries, onClear, onReuse }: HistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 dark:from-gray-950/90 dark:to-black/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/20 p-2 rounded-xl">
            <HistoryIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <h2 className="text-xl font-bold text-white">History</h2>
        </div>
        {entries.length > 0 && (
          <button
            onClick={onClear}
            className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors border border-red-500/30"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* History list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-8"
            >
              <HistoryIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No calculations yet</p>
            </motion.div>
          ) : (
            entries.slice().reverse().map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
                onClick={() => onReuse(entry)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-400 dark:text-gray-500 break-all">
                      {entry.expression}
                    </div>
                    <div className="text-lg font-bold text-white mt-1 break-all">
                      = {entry.result}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                    title="Reuse calculation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Entry count */}
      {entries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
          {entries.length} calculation{entries.length !== 1 ? 's' : ''}
        </div>
      )}
    </motion.div>
  );
}
