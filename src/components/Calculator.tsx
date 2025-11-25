"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Divide, X, Minus, Plus, Delete, RotateCcw } from 'lucide-react';

/**
 * Calculator Component
 * Features: Basic & Scientific operations, glowing buttons, smooth animations
 */

interface CalculatorProps {
  onCalculation: (expression: string, result: string) => void;
  soundEnabled?: boolean;
}

export default function Calculator({ onCalculation, soundEnabled = false }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [memory, setMemory] = useState(0);

  // Play sound feedback
  const playSound = () => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIG2m98OScTgwOU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwOU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7k9n0y3ktBS1+zPLaizsKGWS56+mjUBALTKXh8LdjHQU7lNn0y3ktBTCA0PLaiDYIG2i88OScTgwNU6rn77dmHAU7');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }
  };

  // Handle number input
  const handleNumber = (num: string) => {
    playSound();
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  // Handle operator input
  const handleOperator = (op: string) => {
    playSound();
    if (display !== 'Error') {
      setExpression(display + ' ' + op + ' ');
      setDisplay('0');
    }
  };

  // Calculate result
  const calculate = () => {
    playSound();
    try {
      const fullExpression = expression + display;
      // Safe evaluation with proper parsing
      const result = evaluateExpression(fullExpression);
      
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
        return;
      }

      const resultString = result.toString();
      setDisplay(resultString);
      setExpression('');
      
      // Save to history
      onCalculation(fullExpression, resultString);
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  // Safe expression evaluator
  const evaluateExpression = (expr: string): number => {
    // Replace symbols
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
    
    // Remove spaces
    expr = expr.replace(/\s+/g, '');
    
    // Validate expression (only numbers, operators, parentheses, decimal points)
    if (!/^[0-9+\-*/.()]+$/.test(expr)) {
      throw new Error('Invalid expression');
    }

    // Use Function for safe evaluation
    return new Function('return ' + expr)();
  };

  // Clear display
  const clear = () => {
    playSound();
    setDisplay('0');
    setExpression('');
  };

  // Delete last character
  const deleteLast = () => {
    playSound();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Scientific operations
  const handleScientific = (func: string) => {
    playSound();
    try {
      const num = parseFloat(display);
      let result: number;

      switch (func) {
        case 'sin':
          result = Math.sin(num * Math.PI / 180);
          break;
        case 'cos':
          result = Math.cos(num * Math.PI / 180);
          break;
        case 'tan':
          result = Math.tan(num * Math.PI / 180);
          break;
        case 'sqrt':
          result = Math.sqrt(num);
          break;
        case 'square':
          result = num * num;
          break;
        case 'log':
          result = Math.log10(num);
          break;
        case 'ln':
          result = Math.log(num);
          break;
        case 'exp':
          result = Math.exp(num);
          break;
        case 'abs':
          result = Math.abs(num);
          break;
        case '1/x':
          result = 1 / num;
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          result = num;
      }

      const resultString = result.toFixed(8).replace(/\.?0+$/, '');
      setDisplay(resultString);
      onCalculation(`${func}(${num})`, resultString);
    } catch (error) {
      setDisplay('Error');
    }
  };

  // Basic calculator buttons
  const basicButtons = [
    { label: 'C', onClick: clear, className: 'bg-red-500/20 hover:bg-red-500/30 text-red-400' },
    { label: <Delete className="w-5 h-5" />, onClick: deleteLast, className: 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400' },
    { label: <Divide className="w-5 h-5" />, onClick: () => handleOperator('÷'), className: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' },
    { label: <X className="w-5 h-5" />, onClick: () => handleOperator('×'), className: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' },
    { label: '7', onClick: () => handleNumber('7') },
    { label: '8', onClick: () => handleNumber('8') },
    { label: '9', onClick: () => handleNumber('9') },
    { label: <Minus className="w-5 h-5" />, onClick: () => handleOperator('-'), className: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' },
    { label: '4', onClick: () => handleNumber('4') },
    { label: '5', onClick: () => handleNumber('5') },
    { label: '6', onClick: () => handleNumber('6') },
    { label: <Plus className="w-5 h-5" />, onClick: () => handleOperator('+'), className: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' },
    { label: '1', onClick: () => handleNumber('1') },
    { label: '2', onClick: () => handleNumber('2') },
    { label: '3', onClick: () => handleNumber('3') },
    { label: '=', onClick: calculate, className: 'bg-green-500/20 hover:bg-green-500/30 text-green-400 row-span-2' },
    { label: '0', onClick: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', onClick: () => handleNumber('.') },
  ];

  // Scientific calculator buttons
  const scientificButtons = [
    { label: 'sin', onClick: () => handleScientific('sin') },
    { label: 'cos', onClick: () => handleScientific('cos') },
    { label: 'tan', onClick: () => handleScientific('tan') },
    { label: '√', onClick: () => handleScientific('sqrt') },
    { label: 'x²', onClick: () => handleScientific('square') },
    { label: 'log', onClick: () => handleScientific('log') },
    { label: 'ln', onClick: () => handleScientific('ln') },
    { label: 'eˣ', onClick: () => handleScientific('exp') },
    { label: '|x|', onClick: () => handleScientific('abs') },
    { label: '1/x', onClick: () => handleScientific('1/x') },
    { label: 'π', onClick: () => handleScientific('pi') },
    { label: 'e', onClick: () => handleScientific('e') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 dark:from-gray-950/90 dark:to-black/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10"
    >
      {/* Display */}
      <div className="mb-6">
        {expression && (
          <div className="text-sm text-gray-400 dark:text-gray-500 mb-1 h-6 overflow-hidden">
            {expression}
          </div>
        )}
        <motion.div
          key={display}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          className="bg-black/30 rounded-2xl p-6 text-right border border-white/5"
        >
          <div className="text-4xl md:text-5xl font-bold text-white break-all">
            {display}
          </div>
        </motion.div>
      </div>

      {/* Scientific mode toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsScientific(!isScientific)}
          className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-sm font-medium transition-colors border border-purple-500/30"
        >
          {isScientific ? 'Basic' : 'Scientific'} Mode
        </button>
      </div>

      {/* Scientific buttons (if enabled) */}
      {isScientific && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-4 gap-2 mb-4"
        >
          {scientificButtons.map((btn, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={btn.onClick}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl p-3 font-medium transition-all border border-indigo-500/20 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              {btn.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Basic calculator buttons */}
      <div className="grid grid-cols-4 gap-3">
        {basicButtons.map((btn, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={btn.onClick}
            className={`
              ${btn.className || 'bg-gray-700/40 hover:bg-gray-700/60 text-white'}
              rounded-2xl p-4 text-xl font-semibold transition-all
              border border-white/10 hover:border-white/20
              hover:shadow-xl hover:shadow-current/20
              flex items-center justify-center
              ${btn.className?.includes('row-span-2') ? 'row-span-2' : ''}
              ${btn.className?.includes('col-span-2') ? 'col-span-2' : ''}
            `}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>

      {/* Memory display (optional) */}
      {memory !== 0 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          Memory: {memory}
        </div>
      )}
    </motion.div>
  );
}
