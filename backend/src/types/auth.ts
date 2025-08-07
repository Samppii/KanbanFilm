import { UserRole } from '@prisma/client';

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  department?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatarUrl?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export enum Permission {
  // Project permissions
  PROJECT_CREATE = 'project:create',
  PROJECT_READ = 'project:read',
  PROJECT_UPDATE = 'project:update',
  PROJECT_DELETE = 'project:delete',
  
  // Stage permissions
  STAGE_UPDATE = 'stage:update',
  STAGE_DELETE = 'stage:delete',
  
  // Team permissions
  TEAM_MANAGE = 'team:manage',
  TEAM_INVITE = 'team:invite',
  
  // Client permissions
  CLIENT_MANAGE = 'client:manage',
  
  // Admin permissions
  USER_MANAGE = 'user:manage',
  SYSTEM_CONFIG = 'system:config'
}

export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.PROJECT_MANAGER]: [
    Permission.PROJECT_CREATE,
    Permission.PROJECT_READ,
    Permission.PROJECT_UPDATE,
    Permission.STAGE_UPDATE,
    Permission.TEAM_MANAGE,
    Permission.CLIENT_MANAGE
  ],
  [UserRole.TEAM_MEMBER]: [
    Permission.PROJECT_READ,
    Permission.STAGE_UPDATE
  ],
  [UserRole.CLIENT]: [
    Permission.PROJECT_READ
  ]
};