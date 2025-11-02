const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const { connectDB } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const reportRoutes = require('./routes/report.routes');
const userRoutes = require('./routes/user.routes');

// Initialize Express app
const app = express();

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * Security Middleware
 */
// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

/**
 * CORS Configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.cors.allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Logging Middleware
 */
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * Rate Limiting for Auth Routes
 */
const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts. Please try again later.',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Health Check Route
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    },
  });
});

/**
 * API Routes
 */
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/users', userRoutes);

/**
 * Root Route
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Forensic Evidence Analysis API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      reports: '/api/v1/reports',
      users: '/api/v1/users',
    },
  });
});

/**
 * 404 Error Handler (must come after all routes)
 */
app.use(notFound);

/**
 * Global Error Handler (must be last)
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running in ${config.nodeEnv} mode`);
  console.log(`🌐 Server listening on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
});

/**
 * Graceful Shutdown
 * Handle SIGTERM signal for graceful shutdown
 */
process.on('SIGTERM', async () => {
  console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
  
  server.close(async () => {
    console.log('✅ HTTP server closed');
    
    try {
      const { disconnectDB } = require('./config/database');
      await disconnectDB();
      console.log('✅ Database connection closed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
});

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  
  server.close(() => {
    process.exit(1);
  });
});

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error('Error:', err.name, err.message);
  process.exit(1);
});

module.exports = app;
