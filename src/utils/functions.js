// Input validation function (based on OWASP C5)
export function validateInput(input) {
  if (!input || typeof input !== 'string') return { valid: false };

  // Limit input length to prevent ReDoS attacks
  if (input.length > 1000) {
    return { valid: false, reason: 'input_too_long' };
  }

  // Detect common XSS patterns
  const xssPatterns = [
    /<script/i,
    /<\/script>/i,
    /on\w+\s*=/i,
    /javascript:/i,
    /&#/,
    /&lt;/i,
    /&gt;/i,
    /%3C/i,
    /%3E/i
  ];
  
  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      return { valid: false, reason: 'xss' };
    }
  }

  // Detect common SQL injection patterns
  const sqlPattern = /('|--|;|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|WHERE|OR|AND)\b)/i;
  if (sqlPattern.test(input)) {
    return { valid: false, reason: 'sql' };
  }

  return { valid: true };
}