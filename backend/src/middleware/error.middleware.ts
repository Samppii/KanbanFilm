import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@/utils/errors';
import { logger } from '@/config/logger';
import { env } from '@/config/env';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    
    switch (prismaError.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          error: 'Resource already exists',
          details: prismaError.meta?.target,
        });
      
      case 'P2025':
        return res.status(404).json({
          success: false,
          error: 'Resource not found',
        });
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Database operation failed',
          ...(env.NODE_ENV === 'development' && { details: prismaError.message }),
        });
    }
  }

  // Prisma validation errors
  if (error.name === 'PrismaClientValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid request data',
      ...(env.NODE_ENV === 'development' && { details: error.message }),
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Authentication token expired',
    });
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(error.isOperational && env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.message,
    });
  }

  // Multer errors (file upload)
  if (error.name === 'MulterError') {
    const multerError = error as any;
    
    switch (multerError.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File too large',
        });
      
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files',
        });
      
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected file field',
        });
      
      default:
        return res.status(400).json({
          success: false,
          error: 'File upload error',
        });
    }
  }

  // Default error
  const statusCode = error.name === 'CastError' ? 400 : 500;
  
  res.status(statusCode).json({
    success: false,
    error: env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : error.message,
    ...(env.NODE_ENV === 'development' && { 
      stack: error.stack,
      name: error.name,
    }),
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};