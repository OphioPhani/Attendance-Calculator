import rateLimit from 'express-rate-limit';

/**
 * Rate Limiting Configuration
 * Protects against brute force, DDoS, and abuse
 */

// General API rate limiter - 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip health check
    return req.path === '/api/health';
  },
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user?.id || req.ip;
  },
});

// Strict login limiter - 5 attempts per 15 minutes per IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Account locked for 15 minutes.',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

// Signup limiter - 3 accounts per hour per IP
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many signup attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Attendance update limiter - 50 per minute per user
export const attendanceLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  message: {
    success: false,
    message: 'Too many attendance updates. Please slow down.',
  },
  keyGenerator: (req) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  apiLimiter,
  loginLimiter,
  signupLimiter,
  attendanceLimiter,
};
