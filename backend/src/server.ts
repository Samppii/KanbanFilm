import express from 'express';
import helmet from 'helmet';
import { env } from '@/config/env';
import { logger } from '@/config/logger';
import { corsMiddleware } from '@/middleware/cors.middleware';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware';
import { generalLimiter, authLimiter } from '@/middleware/rate-limit.middleware';
import { apiRoutes } from '@/routes';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);
app.use('/api/v1/auth', authLimiter);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentLength: req.get('Content-Length'),
  });
  next();
});

// API routes
app.use(env.API_PREFIX, apiRoutes);

// Health check endpoint (outside of API prefix)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT}`, {
    environment: env.NODE_ENV,
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export { app };