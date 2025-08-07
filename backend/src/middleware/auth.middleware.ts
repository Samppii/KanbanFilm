import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import { Permission, rolePermissions } from '@/types/auth';
import { ApiError } from '@/utils/errors';
import { logger } from '@/config/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      });
      return;
    }

    const decoded = AuthService.verifyAccessToken(token);
    const user = await AuthService.getUserById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: rolePermissions[user.role],
    };

    logger.debug('User authenticated', { 
      userId: user.id, 
      email: user.email,
      action: `${req.method} ${req.path}`
    });

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
      return;
    }

    logger.error('Authentication error', error);
    res.status(401).json({
      success: false,
      error: 'Invalid authentication token',
    });
  }
};

export const requirePermissions = (requiredPermissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const userPermissions = req.user.permissions;
    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      logger.warn('Insufficient permissions', {
        userId: req.user.id,
        required: requiredPermissions,
        userPermissions,
        action: `${req.method} ${req.path}`
      });

      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Insufficient role access', {
        userId: req.user.id,
        userRole: req.user.role,
        allowedRoles,
        action: `${req.method} ${req.path}`
      });

      res.status(403).json({
        success: false,
        error: 'Insufficient role access',
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // No token provided, continue without auth
    }

    const decoded = AuthService.verifyAccessToken(token);
    const user = await AuthService.getUserById(decoded.userId);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: rolePermissions[user.role],
      };
    }

    next();
  } catch (error) {
    // Invalid token, but continue without auth
    logger.debug('Optional auth failed, continuing without authentication', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    next();
  }
};