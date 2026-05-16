// Simulated security scanner engine
// In a production environment, this would use real HTTP requests and analysis tools

const simulateScan = async (url) => {
  const start = Date.now();

  // Extract domain
  let domain;
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  const isHttps = url.startsWith('https://');

  // Simulate random but realistic results
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const chance = (pct) => Math.random() < pct / 100;

  const vulnerabilities = [];

  // 1. SSL/TLS Check
  const sslStatus = isHttps ? (chance(80) ? 'safe' : 'warning') : 'vulnerable';
  if (!isHttps) {
    vulnerabilities.push({
      type: 'SSL/TLS',
      severity: 'critical',
      title: 'No HTTPS/SSL Certificate',
      description: 'The website does not use HTTPS. All data transmitted is unencrypted.',
      recommendation: 'Install an SSL/TLS certificate and force HTTPS redirects.',
      status: 'vulnerable'
    });
  } else if (sslStatus === 'warning') {
    vulnerabilities.push({
      type: 'SSL/TLS',
      severity: 'medium',
      title: 'SSL Configuration Issues',
      description: 'SSL is enabled but weak cipher suites may be supported.',
      recommendation: 'Disable TLS 1.0/1.1. Use only TLS 1.2 and 1.3 with strong cipher suites.',
      status: 'warning'
    });
  }

  // 2. Security Headers
  const missingHeaders = [];
  const headerChecks = [
    { name: 'Content-Security-Policy', severity: 'high', pctMissing: 65 },
    { name: 'X-Frame-Options', severity: 'medium', pctMissing: 40 },
    { name: 'X-XSS-Protection', severity: 'medium', pctMissing: 35 },
    { name: 'X-Content-Type-Options', severity: 'low', pctMissing: 30 },
    { name: 'Strict-Transport-Security', severity: 'high', pctMissing: 50 },
    { name: 'Referrer-Policy', severity: 'low', pctMissing: 55 },
  ];

  headerChecks.forEach(h => {
    if (chance(h.pctMissing)) {
      missingHeaders.push(h.name);
      vulnerabilities.push({
        type: 'Security Headers',
        severity: h.severity,
        title: `Missing ${h.name} Header`,
        description: `The ${h.name} security header is not configured.`,
        recommendation: `Add ${h.name} header to all HTTP responses.`,
        status: 'vulnerable'
      });
    }
  });

  // 3. SQL Injection
  const sqliStatus = chance(25) ? 'vulnerable' : (chance(30) ? 'warning' : 'safe');
  if (sqliStatus === 'vulnerable') {
    vulnerabilities.push({
      type: 'SQL Injection',
      severity: 'critical',
      title: 'Potential SQL Injection Vulnerability',
      description: 'Input parameters may not be properly sanitized, allowing SQL injection attacks.',
      recommendation: 'Use parameterized queries or prepared statements. Never concatenate user input in SQL queries.',
      status: 'vulnerable'
    });
  } else if (sqliStatus === 'warning') {
    vulnerabilities.push({
      type: 'SQL Injection',
      severity: 'medium',
      title: 'SQL Injection Risk Indicators',
      description: 'Some database error messages may be exposed.',
      recommendation: 'Disable verbose database errors. Implement proper input validation.',
      status: 'warning'
    });
  }

  // 4. XSS
  const xssStatus = chance(30) ? 'vulnerable' : (chance(25) ? 'warning' : 'safe');
  if (xssStatus === 'vulnerable') {
    vulnerabilities.push({
      type: 'XSS',
      severity: 'high',
      title: 'Cross-Site Scripting (XSS) Vulnerability',
      description: 'Reflected XSS vectors detected. User input may be rendered without sanitization.',
      recommendation: 'Encode all output. Implement Content Security Policy. Use DOMPurify for HTML rendering.',
      status: 'vulnerable'
    });
  } else if (xssStatus === 'warning') {
    vulnerabilities.push({
      type: 'XSS',
      severity: 'low',
      title: 'Potential XSS Risk',
      description: 'Some user-controlled data appears in HTML output.',
      recommendation: 'Audit all output encoding. Ensure all user input is sanitized.',
      status: 'warning'
    });
  }

  // 5. CSRF
  const csrfStatus = chance(35) ? 'vulnerable' : 'safe';
  if (csrfStatus === 'vulnerable') {
    vulnerabilities.push({
      type: 'CSRF',
      severity: 'high',
      title: 'CSRF Protection Missing',
      description: 'Forms and state-changing requests may lack CSRF token validation.',
      recommendation: 'Implement CSRF tokens on all state-changing requests. Use SameSite cookie attribute.',
      status: 'vulnerable'
    });
  }

  // 6. Open Ports
  const openPorts = [];
  const allPorts = [21, 22, 23, 25, 80, 443, 3306, 5432, 6379, 8080, 8443, 27017];
  allPorts.forEach(port => {
    if (chance(20) && port !== 80 && port !== 443) {
      openPorts.push(port);
      const isRisky = [21, 23, 3306, 5432, 6379, 27017].includes(port);
      if (isRisky) {
        vulnerabilities.push({
          type: 'Open Ports',
          severity: 'high',
          title: `Exposed Port ${port}`,
          description: `Port ${port} is accessible from the internet. This may expose sensitive services.`,
          recommendation: `Close port ${port} or restrict access via firewall rules.`,
          status: 'vulnerable'
        });
      }
    }
  });

  // 7. Info disclosure
  if (chance(40)) {
    vulnerabilities.push({
      type: 'Information Disclosure',
      severity: 'info',
      title: 'Server Version Exposed',
      description: 'HTTP response headers reveal server software and version information.',
      recommendation: 'Remove or obfuscate Server and X-Powered-By headers.',
      status: 'warning'
    });
  }

  // Calculate score
  const weights = { critical: 25, high: 15, medium: 8, low: 3, info: 1 };
  const deduction = vulnerabilities.reduce((sum, v) => sum + (weights[v.severity] || 0), 0);
  const securityScore = Math.max(0, Math.min(100, 100 - deduction));

  // Grade
  let grade;
  if (securityScore >= 90) grade = 'A+';
  else if (securityScore >= 80) grade = 'A';
  else if (securityScore >= 70) grade = 'B';
  else if (securityScore >= 60) grade = 'C';
  else if (securityScore >= 50) grade = 'D';
  else grade = 'F';

  // Summary counts
  const summary = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  vulnerabilities.forEach(v => summary[v.severity]++);

  // Recommendations
  const recommendations = [
    'Enable Content Security Policy (CSP) headers to prevent XSS attacks',
    'Implement HTTP Strict Transport Security (HSTS)',
    'Use HttpOnly and Secure flags on all cookies',
    'Enable X-Frame-Options to prevent clickjacking',
    'Implement proper input validation and output encoding',
    'Use rate limiting on authentication endpoints',
    'Enable CORS with strict allowed origins',
    'Keep all dependencies and server software up to date',
    'Implement a Web Application Firewall (WAF)',
    'Enable verbose error logging server-side while suppressing client-facing errors'
  ].sort(() => Math.random() - 0.5).slice(0, 5);

  const duration = Date.now() - start + rand(1500, 4000); // simulate scan time

  return {
    domain,
    securityScore,
    grade,
    vulnerabilities,
    summary,
    checks: {
      ssl: { status: sslStatus, details: isHttps ? 'TLS 1.3 supported' : 'No SSL certificate detected' },
      headers: { status: missingHeaders.length > 3 ? 'vulnerable' : missingHeaders.length > 0 ? 'warning' : 'safe', details: `${missingHeaders.length} missing headers` },
      ports: { status: openPorts.length > 0 ? 'warning' : 'safe', details: `${openPorts.length} potentially exposed ports` },
      sqli: { status: sqliStatus, details: sqliStatus === 'safe' ? 'No SQL injection vectors detected' : 'Input parameters require validation' },
      xss: { status: xssStatus, details: xssStatus === 'safe' ? 'XSS protections in place' : 'Reflected XSS risk detected' },
      csrf: { status: csrfStatus, details: csrfStatus === 'safe' ? 'CSRF tokens detected' : 'Missing CSRF protection' }
    },
    recommendations,
    duration
  };
};

module.exports = { simulateScan };
