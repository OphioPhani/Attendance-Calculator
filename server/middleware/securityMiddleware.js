import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import crypto from 'crypto';

/**
 * Security Middleware Bundle
 * Implements OWASP security best practices
 */

// 1. Helmet - Set various HTTP headers for security
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
});

// 2. Data Sanitization - Remove data query operator ($, .)
export const dataSanitization = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ Potential NoSQL injection detected in: ${key}`);
  },
});

// 3. XSS Protection - Clean user input from malicious HTML/JS
export const xssProtection = xss();

// 4. HPP - Prevent Parameter Pollution
export const parameterPollutionProtection = hpp({
  whitelist: [
    'username',
    'email',
    'mobile',
    'semester',
    'id',
    'userId',
    'date',
    'limit',
    'page',
    'sort',
    'fields',
  ],
});

// 5. Request ID Generator - For audit logging and request tracking
export const requestIdMiddleware = (req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// 6. Strict CORS Configuration
export const corsConfig = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
  maxAge: 86400, // 24 hours
};

// 7. Request Size Limits - Prevent large payload attacks
export const payloadLimits = {
  json: '16kb',
  urlencoded: {
    limit: '16kb',
    extended: true,
  },
};

// 8. Security Audit Logging
export const auditLogger = (req, res, next) => {
  res.on('finish', () => {
    const auditLog = {
      requestId: req.id,
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      userId: req.user?.id || 'anonymous',
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    // Log suspicious activities
    if (res.statusCode === 401 || res.statusCode === 403) {
      console.warn(`🚨 Security Event: ${JSON.stringify(auditLog)}`);
    }

    // Optional: Send to external logging service
    // logToExternalService(auditLog);
  });

  next();
};

export default {
  securityHeaders,
  dataSanitization,
  xssProtection,
  parameterPollutionProtection,
  requestIdMiddleware,
  corsConfig,
  payloadLimits,
  auditLogger,
};
