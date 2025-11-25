/**
 * AI Helper Module
 * Interprets natural language math queries and converts them to executable operations
 */

export interface AIResponse {
  result: string | number;
  explanation?: string;
  formula?: string;
  success: boolean;
}

/**
 * Main AI interpreter function
 * Parses natural language input and returns calculated result with explanation
 */
export function interpretQuery(query: string): AIResponse {
  const lowerQuery = query.toLowerCase().trim();

  // Percentage calculations
  if (lowerQuery.includes('% of') || lowerQuery.includes('percent of')) {
    return handlePercentage(lowerQuery);
  }

  // Temperature conversions
  if (lowerQuery.includes('convert') && (lowerQuery.includes('celsius') || lowerQuery.includes('fahrenheit'))) {
    return handleTemperatureConversion(lowerQuery);
  }

  // Square root
  if (lowerQuery.includes('square root') || lowerQuery.includes('sqrt')) {
    return handleSquareRoot(lowerQuery);
  }

  // Power/Exponent
  if (lowerQuery.includes('power') || lowerQuery.includes('^') || lowerQuery.includes('to the')) {
    return handlePower(lowerQuery);
  }

  // Basic arithmetic with words
  if (lowerQuery.includes('plus') || lowerQuery.includes('add')) {
    return handleBasicArithmetic(lowerQuery, 'add');
  }
  if (lowerQuery.includes('minus') || lowerQuery.includes('subtract')) {
    return handleBasicArithmetic(lowerQuery, 'subtract');
  }
  if (lowerQuery.includes('times') || lowerQuery.includes('multiply') || lowerQuery.includes('multiplied by')) {
    return handleBasicArithmetic(lowerQuery, 'multiply');
  }
  if (lowerQuery.includes('divided by') || lowerQuery.includes('divide')) {
    return handleBasicArithmetic(lowerQuery, 'divide');
  }

  // Trigonometry
  if (lowerQuery.includes('sin') || lowerQuery.includes('cos') || lowerQuery.includes('tan')) {
    return handleTrigonometry(lowerQuery);
  }

  // Logarithms
  if (lowerQuery.includes('log') || lowerQuery.includes('ln')) {
    return handleLogarithm(lowerQuery);
  }

  // Direct mathematical expression evaluation
  try {
    const result = evaluateMathExpression(query);
    if (!isNaN(result)) {
      return {
        result,
        explanation: `Evaluated the expression: ${query}`,
        formula: query,
        success: true
      };
    }
  } catch (e) {
    // Continue to fallback
  }

  return {
    result: "I couldn't understand that query. Try something like 'What's 20% of 500?' or 'Convert 32°F to Celsius'",
    success: false
  };
}

function handlePercentage(query: string): AIResponse {
  const match = query.match(/(\d+\.?\d*)\s*%?\s*of\s*(\d+\.?\d*)/);
  if (match) {
    const percent = parseFloat(match[1]);
    const number = parseFloat(match[2]);
    const result = (percent / 100) * number;
    return {
      result: result,
      explanation: `To find ${percent}% of ${number}, multiply ${number} by ${percent/100}`,
      formula: `${number} × ${percent/100} = ${result}`,
      success: true
    };
  }
  return { result: "Couldn't parse percentage query", success: false };
}

function handleTemperatureConversion(query: string): AIResponse {
  const fahrenheitMatch = query.match(/(\d+\.?\d*)\s*°?f/i);
  const celsiusMatch = query.match(/(\d+\.?\d*)\s*°?c/i);

  if (fahrenheitMatch && query.includes('celsius')) {
    const fahrenheit = parseFloat(fahrenheitMatch[1]);
    const celsius = (fahrenheit - 32) * 5 / 9;
    return {
      result: celsius.toFixed(2) + '°C',
      explanation: `To convert Fahrenheit to Celsius: (F - 32) × 5/9`,
      formula: `(${fahrenheit} - 32) × 5/9 = ${celsius.toFixed(2)}°C`,
      success: true
    };
  }

  if (celsiusMatch && query.includes('fahrenheit')) {
    const celsius = parseFloat(celsiusMatch[1]);
    const fahrenheit = (celsius * 9 / 5) + 32;
    return {
      result: fahrenheit.toFixed(2) + '°F',
      explanation: `To convert Celsius to Fahrenheit: (C × 9/5) + 32`,
      formula: `(${celsius} × 9/5) + 32 = ${fahrenheit.toFixed(2)}°F`,
      success: true
    };
  }

  return { result: "Couldn't parse temperature conversion", success: false };
}

function handleSquareRoot(query: string): AIResponse {
  const match = query.match(/(\d+\.?\d*)/);
  if (match) {
    const number = parseFloat(match[1]);
    const result = Math.sqrt(number);
    return {
      result: result,
      explanation: `The square root of ${number} is the number that, when multiplied by itself, equals ${number}`,
      formula: `√${number} = ${result}`,
      success: true
    };
  }
  return { result: "Couldn't parse square root query", success: false };
}

function handlePower(query: string): AIResponse {
  const match = query.match(/(\d+\.?\d*)\s*(?:to the power of|\^|power)\s*(\d+\.?\d*)/);
  if (match) {
    const base = parseFloat(match[1]);
    const exponent = parseFloat(match[2]);
    const result = Math.pow(base, exponent);
    return {
      result: result,
      explanation: `${base} raised to the power of ${exponent}`,
      formula: `${base}^${exponent} = ${result}`,
      success: true
    };
  }
  return { result: "Couldn't parse power query", success: false };
}

function handleBasicArithmetic(query: string, operation: string): AIResponse {
  const numbers = query.match(/(\d+\.?\d*)/g);
  if (numbers && numbers.length >= 2) {
    const num1 = parseFloat(numbers[0]);
    const num2 = parseFloat(numbers[1]);
    let result: number;
    let operationSymbol: string;

    switch (operation) {
      case 'add':
        result = num1 + num2;
        operationSymbol = '+';
        break;
      case 'subtract':
        result = num1 - num2;
        operationSymbol = '-';
        break;
      case 'multiply':
        result = num1 * num2;
        operationSymbol = '×';
        break;
      case 'divide':
        result = num1 / num2;
        operationSymbol = '÷';
        break;
      default:
        return { result: "Unknown operation", success: false };
    }

    return {
      result: result,
      explanation: `Basic ${operation} operation`,
      formula: `${num1} ${operationSymbol} ${num2} = ${result}`,
      success: true
    };
  }
  return { result: "Couldn't parse arithmetic query", success: false };
}

function handleTrigonometry(query: string): AIResponse {
  const sinMatch = query.match(/sin\s*\(?(\d+\.?\d*)\)?/);
  const cosMatch = query.match(/cos\s*\(?(\d+\.?\d*)\)?/);
  const tanMatch = query.match(/tan\s*\(?(\d+\.?\d*)\)?/);

  if (sinMatch) {
    const angle = parseFloat(sinMatch[1]);
    const radians = angle * Math.PI / 180;
    const result = Math.sin(radians);
    return {
      result: result.toFixed(6),
      explanation: `Sin of ${angle}° (converted to radians: ${radians.toFixed(4)})`,
      formula: `sin(${angle}°) = ${result.toFixed(6)}`,
      success: true
    };
  }

  if (cosMatch) {
    const angle = parseFloat(cosMatch[1]);
    const radians = angle * Math.PI / 180;
    const result = Math.cos(radians);
    return {
      result: result.toFixed(6),
      explanation: `Cosine of ${angle}° (converted to radians: ${radians.toFixed(4)})`,
      formula: `cos(${angle}°) = ${result.toFixed(6)}`,
      success: true
    };
  }

  if (tanMatch) {
    const angle = parseFloat(tanMatch[1]);
    const radians = angle * Math.PI / 180;
    const result = Math.tan(radians);
    return {
      result: result.toFixed(6),
      explanation: `Tangent of ${angle}° (converted to radians: ${radians.toFixed(4)})`,
      formula: `tan(${angle}°) = ${result.toFixed(6)}`,
      success: true
    };
  }

  return { result: "Couldn't parse trigonometry query", success: false };
}

function handleLogarithm(query: string): AIResponse {
  const lnMatch = query.match(/ln\s*\(?(\d+\.?\d*)\)?/);
  const logMatch = query.match(/log\s*\(?(\d+\.?\d*)\)?/);

  if (lnMatch) {
    const number = parseFloat(lnMatch[1]);
    const result = Math.log(number);
    return {
      result: result.toFixed(6),
      explanation: `Natural logarithm (base e) of ${number}`,
      formula: `ln(${number}) = ${result.toFixed(6)}`,
      success: true
    };
  }

  if (logMatch) {
    const number = parseFloat(logMatch[1]);
    const result = Math.log10(number);
    return {
      result: result.toFixed(6),
      explanation: `Logarithm (base 10) of ${number}`,
      formula: `log(${number}) = ${result.toFixed(6)}`,
      success: true
    };
  }

  return { result: "Couldn't parse logarithm query", success: false };
}

/**
 * Safe mathematical expression evaluator
 * Handles basic arithmetic expressions with proper order of operations
 */
function evaluateMathExpression(expr: string): number {
  // Remove spaces and replace symbols
  expr = expr.replace(/\s+/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, Math.PI.toString());

  // Only allow numbers, operators, parentheses, and decimal points
  if (!/^[\d+\-*/().eπ]+$/.test(expr)) {
    throw new Error('Invalid expression');
  }

  // Use Function constructor for safe evaluation (better than eval)
  try {
    return new Function('return ' + expr)();
  } catch (e) {
    throw new Error('Evaluation failed');
  }
}

/**
 * Get random math/logic trick for "Teach Me Something Cool" feature
 */
export function getRandomMathTrick(): { title: string; content: string } {
  const tricks = [
    {
      title: "The 9 Times Table Finger Trick",
      content: "Hold your hands in front of you. To multiply 9 by any number (1-10), fold down the finger in that position. The fingers to the left are the tens digit, and to the right are the ones digit. For 9×7: fold the 7th finger, you'll see 6 fingers left and 3 right = 63!"
    },
    {
      title: "Why 0.999... = 1",
      content: "Let x = 0.999... Then 10x = 9.999... Subtract: 10x - x = 9.999... - 0.999... So 9x = 9, which means x = 1. Mind blown! 🤯"
    },
    {
      title: "The 11 Multiplication Trick",
      content: "To multiply any 2-digit number by 11, add the two digits and put the result in the middle. For 45×11: 4+5=9, so answer is 4|9|5 = 495. If the sum is >9, carry the 1. Try 67×11: 6+7=13, so 6+1|3|7 = 737!"
    },
    {
      title: "Fibonacci in Nature",
      content: "The Fibonacci sequence (1,1,2,3,5,8,13...) appears everywhere in nature: sunflower seed spirals, pinecone patterns, nautilus shells, and even galaxy spirals follow this mathematical pattern!"
    },
    {
      title: "The Birthday Paradox",
      content: "In a room of just 23 people, there's a 50% chance two share the same birthday! With 70 people, it's 99.9%. Counterintuitive but mathematically proven!"
    },
    {
      title: "Pi's Infinite Mystery",
      content: "π (3.14159...) is infinite and non-repeating. Your phone number, birthday, and even your name (encoded) appear somewhere in π's digits. In fact, any finite sequence of numbers appears in π!"
    },
    {
      title: "Negative × Negative = Positive",
      content: "Why does -1 × -1 = 1? Think of it as direction. If you owe someone $1 (-1) and you cancel that debt (-1 again), you gain $1 (+1). Or: removing a negative is positive!"
    },
    {
      title: "The Power of Compound Interest",
      content: "Einstein called it the 8th wonder of the world. If you invest $100/month at 7% annual return for 40 years, you'd have ~$240,000! Small consistent investments beat large occasional ones."
    }
  ];

  return tricks[Math.floor(Math.random() * tricks.length)];
}

/**
 * Explain how a calculation was done (for "how did you calculate that?" queries)
 */
export function explainLastCalculation(lastQuery: string, lastResult: string): string {
  const response = interpretQuery(lastQuery);
  if (response.explanation) {
    return `${response.explanation}\n\nFormula: ${response.formula}`;
  }
  return `I calculated: ${lastQuery} = ${lastResult}`;
}
