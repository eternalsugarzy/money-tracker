/**
 * Safely evaluates simple math expressions like "15000+25000*2" without using dangerous eval()
 */
export function evaluateMathExpression(expression: string): { value: number; isValid: boolean; error?: string } {
  if (!expression || expression.trim() === '') {
    return { value: 0, isValid: true };
  }

  // Clean expression: allow only numbers, +, -, *, /, ., (, )
  const cleaned = expression.replace(/,/g, '').replace(/\s+/g, '').replace(/x/gi, '*').replace(/÷/g, '/');

  if (!/^[0-9+\-*/.()]+$/.test(cleaned)) {
    return { value: 0, isValid: false, error: 'Karakter tidak valid' };
  }

  try {
    const tokens = tokenize(cleaned);
    if (!tokens || tokens.length === 0) {
      return { value: 0, isValid: true };
    }
    const result = parseExpression(tokens);
    if (isNaN(result) || !isFinite(result)) {
      return { value: 0, isValid: false, error: 'Hasil kalkulasi tidak valid' };
    }
    return { value: Math.max(0, Math.round(result * 100) / 100), isValid: true };
  } catch (err) {
    return { value: 0, isValid: false, error: 'Ekspresi matematika keliru' };
  }
}

type TokenType = 'NUMBER' | 'OPERATOR' | 'LPAREN' | 'RPAREN';

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
    } else if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
    } else if (['+', '-', '*', '/'].includes(char)) {
      // Check for unary minus at beginning or after operator/LPAREN
      if (char === '-' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'OPERATOR' || tokens[tokens.length - 1].type === 'LPAREN')) {
        let numStr = '-';
        i++;
        while (i < input.length && (/[0-9.]/.test(input[i]))) {
          numStr += input[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: numStr });
      } else {
        tokens.push({ type: 'OPERATOR', value: char });
        i++;
      }
    } else if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < input.length && /[0-9.]/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
    } else {
      i++;
    }
  }

  return tokens;
}

function parseExpression(tokens: Token[]): number {
  let index = 0;

  function parsePrimary(): number {
    const token = tokens[index];
    if (!token) throw new Error('Unexpected end of input');

    if (token.type === 'NUMBER') {
      index++;
      return parseFloat(token.value);
    }

    if (token.type === 'LPAREN') {
      index++; // skip '('
      const result = parseAddSub();
      if (tokens[index]?.type === 'RPAREN') {
        index++; // skip ')'
      }
      return result;
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }

  function parseMulDiv(): number {
    let left = parsePrimary();

    while (index < tokens.length && tokens[index].type === 'OPERATOR' && (tokens[index].value === '*' || tokens[index].value === '/')) {
      const op = tokens[index].value;
      index++;
      const right = parsePrimary();
      if (op === '*') {
        left *= right;
      } else {
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      }
    }

    return left;
  }

  function parseAddSub(): number {
    let left = parseMulDiv();

    while (index < tokens.length && tokens[index].type === 'OPERATOR' && (tokens[index].value === '+' || tokens[index].value === '-')) {
      const op = tokens[index].value;
      index++;
      const right = parseMulDiv();
      if (op === '+') {
        left += right;
      } else {
        left -= right;
      }
    }

    return left;
  }

  return parseAddSub();
}
