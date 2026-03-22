import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import {
  securityHeaders,
  dataSanitization,
  xssProtection,
  parameterPollutionProtection,
  requestIdMiddleware,
  corsConfig,
  payloadLimits,
  auditLogger,
} from './middleware/securityMiddleware.js';
import { apiLimiter, loginLimiter, signupLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
const validateRequiredEnv = () => {
  const missing = [];

  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET');
  }

  if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    missing.push('MONGODB_URI (or MONGO_URI)');
  }

  if (missing.length > 0) {
    console.error('❌ Startup preflight failed. Missing required environment variables:');
    missing.forEach((name) => console.error(`   - ${name}`));
    console.error('💡 Add these values to server/.env and restart the server.');
    process.exit(1);
  }
};

validateRequiredEnv();

// Connect to MongoDB
connectDB();

// ============================================
// Security & Protection Middleware (Top Priority)
// ============================================

// 1. Security headers
app.use(securityHeaders);

// 2. Request size limits
app.use(express.json(payloadLimits.json));
app.use(express.urlencoded(payloadLimits.urlencoded));

// 3. CORS with strict configuration

const allowedOrigins = [
  'http://localhost:5173',
  'https://attendance-calculator-vert.vercel.app',
  'https://attendance-calculator-503n9ch8d-ophiophanis-projects.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      origin.includes('localhost') ||
      origin.includes('vercel.app')
    ) {
      callback(null, true);
    } else {
      // ❌ DO NOT THROW ERROR
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 4. Request ID generation
app.use(requestIdMiddleware);

// 5. Data sanitization
app.use(dataSanitization);

// 6. XSS protection
app.use(xssProtection);

// 7. Parameter pollution protection
app.use(parameterPollutionProtection);

// 8. Audit logging
app.use(auditLogger);

// 9. General rate limiting on all API routes
app.use('/api/', apiLimiter);

// ============================================
// Routes
// ============================================

// Health check route (unauthenticated)
app.get('/api/health', (req, res) => {
  // Don't expose sensitive environment info
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes with specific rate limiters
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/signup', signupLimiter);
app.use('/api/auth', authRoutes);

// Attendance routes
app.use('/api/attendance', attendanceRoutes);

// ============================================
// Error Handling (must be last)
// ============================================

app.use(notFound);
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Security: ENABLED (Helmet, Rate-Limiting, Input Validation)`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
