import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { ApiResponse, ApiError, handleAsync } from '@/utils/errors';
import { logger } from '@/config/logger';

export class AuthController {
  static register = handleAsync(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role, department } = req.body;

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      role,
      department,
    });

    logger.info(`New user registered: ${email}`);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'User registered successfully',
    };

    res.status(201).json(response);
  });

  static login = handleAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    logger.info(`User logged in: ${email}`);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Login successful',
    };

    res.json(response);
  });

  static refresh = handleAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const result = await AuthService.refreshTokens(refreshToken);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Tokens refreshed successfully',
    };

    res.json(response);
  });

  static logout = handleAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    await AuthService.logout(refreshToken);

    const response: ApiResponse = {
      success: true,
      message: 'Logged out successfully',
    };

    res.json(response);
  });

  static profile = handleAsync(async (req: any, res: Response) => {
    if (!req.user) {
      throw new ApiError('User not authenticated', 401);
    }

    const user = await AuthService.getUserById(req.user.id);
    
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const response: ApiResponse = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    res.json(response);
  });

  static forgotPassword = handleAsync(async (req: Request, res: Response) => {
    // TODO: Implement forgot password functionality
    // This would typically involve:
    // 1. Generate a password reset token
    // 2. Store the token with expiration
    // 3. Send email with reset link
    
    const response: ApiResponse = {
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    };

    res.json(response);
  });

  static resetPassword = handleAsync(async (req: Request, res: Response) => {
    // TODO: Implement reset password functionality
    // This would typically involve:
    // 1. Verify the reset token
    // 2. Update the user's password
    // 3. Invalidate the reset token
    
    const response: ApiResponse = {
      success: true,
      message: 'Password reset successfully',
    };

    res.json(response);
  });
}