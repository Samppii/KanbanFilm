import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { projectRoutes } from './project.routes';
import { env } from '@/config/env';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
    services: {
      database: 'up', // TODO: Add actual health checks
      redis: 'up',
      elasticsearch: 'up',
      fileStorage: 'up',
    },
  };

  res.json({
    success: true,
    data: healthCheck,
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

// TODO: Add more route modules
// router.use('/clients', clientRoutes);
// router.use('/users', userRoutes);
// router.use('/notifications', notificationRoutes);
// router.use('/files', fileRoutes);
// router.use('/analytics', analyticsRoutes);

export { router as apiRoutes };