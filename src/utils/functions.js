// Input validation function (based on OWASP C5)
export function validateInput(input) {
  if (!input || typeof input !== 'string') return { valid: false };

  // Detect common XSS patterns
  const xssPattern = /<script.*?>.*?<\/script>|<.*?on\w+=.*?>|javascript:|&#|&lt;|&gt;|%3C|%3E/i;
  if (xssPattern.test(input)) {
    return { valid: false, reason: 'xss' };
  }

  // Detect common SQL injection patterns
  const sqlPattern = /('|--|;|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|WHERE|OR|AND)\b)/i;
  if (sqlPattern.test(input)) {
    return { valid: false, reason: 'sql' };
  }

  return { valid: true };
}
