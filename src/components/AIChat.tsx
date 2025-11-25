"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Lightbulb, TrendingUp, MessageSquare } from 'lucide-react';
import { interpretQuery, getRandomMathTrick, explainLastCalculation } from '@/lib/aiHelper';

/**
 * AI Chat Component
 * Natural language math queries, explanations, and suggestions
 */

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
}

interface AIChatProps {
  onCalculation: (expression: string, result: string) => void;
}

export default function AIChat({ onCalculation }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'ai',
      content: "👋 Hi! I'm your AI math assistant. Ask me anything like:\n• What's 20% of 4500?\n• Convert 45°F to Celsius\n• What's the square root of 289?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [usagePatterns, setUsagePatterns] = useState<{[key: string]: number}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track usage patterns for suggestions
  useEffect(() => {
    const patterns = Object.entries(usagePatterns).sort((a, b) => b[1] - a[1]);
    const newSuggestions: string[] = [];

    if (patterns.some(([key]) => key.includes('percent'))) {
      newSuggestions.push('💡 Add a percentage calculator widget');
    }
    if (patterns.some(([key]) => key.includes('convert'))) {
      newSuggestions.push('💡 Add a unit converter tool');
    }
    if (patterns.some(([key]) => key.includes('sqrt') || key.includes('power'))) {
      newSuggestions.push('💡 Add a graphing calculator');
    }
    if (patterns.length > 5) {
      newSuggestions.push('💡 Save frequently used calculations');
    }

    setSuggestions(newSuggestions.slice(0, 3));
  }, [usagePatterns]);

  // Handle sending message
  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Track usage pattern
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('percent') || lowerInput.includes('%')) {
      setUsagePatterns(prev => ({ ...prev, percent: (prev.percent || 0) + 1 }));
    }
    if (lowerInput.includes('convert')) {
      setUsagePatterns(prev => ({ ...prev, convert: (prev.convert || 0) + 1 }));
    }
    if (lowerInput.includes('sqrt') || lowerInput.includes('square root')) {
      setUsagePatterns(prev => ({ ...prev, sqrt: (prev.sqrt || 0) + 1 }));
    }
    if (lowerInput.includes('power') || lowerInput.includes('^')) {
      setUsagePatterns(prev => ({ ...prev, power: (prev.power || 0) + 1 }));
    }

    // Process with AI
    setTimeout(() => {
      const response = interpretQuery(input);
      
      let aiContent = '';
      if (response.success) {
        aiContent = `✅ ${response.result}\n\n`;
        if (response.explanation) {
          aiContent += `📝 ${response.explanation}`;
        }
        if (response.formula) {
          aiContent += `\n\n🧮 ${response.formula}`;
        }

        // Add to calculation history if it's a number result
        if (typeof response.result === 'number' && response.formula) {
          onCalculation(response.formula, response.result.toString());
        }
      } else {
        aiContent = `❌ ${response.result}\n\nTry asking something like:\n• "What's 15% of 200?"\n• "Convert 100°C to Fahrenheit"\n• "Square root of 144"`;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiContent,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  // Handle "Teach Me Something Cool"
  const handleTeachMe = () => {
    const trick = getRandomMathTrick();
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `🎓 ${trick.title}\n\n${trick.content}`,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 dark:from-gray-950/90 dark:to-black/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/20 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white">AI Assistant</h2>
        </div>
        <button
          onClick={handleTeachMe}
          className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium transition-colors border border-amber-500/30 flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          Teach Me
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-4 min-h-[300px] max-h-[500px]">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-600/80 text-white'
                      : 'bg-black/30 text-gray-100 border border-white/10'
                  }
                `}
              >
                <div className="whitespace-pre-wrap break-words text-sm">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
              <div className="flex gap-2">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestions Panel */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">AI Suggestions</span>
          </div>
          <div className="space-y-1">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="text-sm text-gray-300">
                {suggestion}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me a math question..."
          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-medium transition-all shadow-lg shadow-purple-500/20"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
