"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import Calculator from '@/components/Calculator';
import History, { HistoryEntry } from '@/components/History';
import AIChat from '@/components/AIChat';

/**
 * AI-Powered Futuristic Calculator
 * Features: Basic/Scientific calc, AI natural language queries, history tracking
 */

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculator-history', JSON.stringify(history));
  }, [history]);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle new calculation
  const handleCalculation = (expression: string, result: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, newEntry]);
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculator-history');
  };

  // Reuse calculation from history
  const reuseCalculation = (entry: HistoryEntry) => {
    // This would set the calculator display - for now just log
    console.log('Reusing:', entry);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-black' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl ${
            darkMode ? 'bg-purple-600/20' : 'bg-purple-400/30'
          }`}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${
            darkMode ? 'bg-blue-600/20' : 'bg-blue-400/30'
          }`}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Calculator
              </span>
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Futuristic math with natural language AI
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Sound toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-xl transition-all border ${
                darkMode
                  ? 'bg-gray-800/50 border-white/10 hover:bg-gray-800'
                  : 'bg-white/50 border-gray-200 hover:bg-white'
              }`}
              title={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? (
                <Volume2 className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              ) : (
                <VolumeX className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
            </motion.button>

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all border ${
                darkMode
                  ? 'bg-gray-800/50 border-white/10 hover:bg-gray-800'
                  : 'bg-white/50 border-gray-200 hover:bg-white'
              }`}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </motion.button>
          </div>
        </motion.header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Calculator 
              onCalculation={handleCalculation}
              soundEnabled={soundEnabled}
            />
          </div>

          {/* History sidebar */}
          <div>
            <History
              entries={history}
              onClear={clearHistory}
              onReuse={reuseCalculation}
            />
          </div>

          {/* AI Chat - full width */}
          <div className="lg:col-span-3">
            <AIChat onCalculation={handleCalculation} />
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-12 text-center text-sm ${
            darkMode ? 'text-gray-500' : 'text-gray-600'
          }`}
        >
          <p>Built with React, Tailwind CSS, and Framer Motion ✨</p>
          <p className="mt-1">Powered by AI natural language processing 🤖</p>
          <p>Built By Anayolico!!  No:+234 7083030637</p>
        </motion.footer>
      </div>
    </div>
  );
}