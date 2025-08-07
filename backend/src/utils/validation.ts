import { z } from 'zod';
import { UserRole, PriorityLevel, ProjectStatus, StageStatus, FileCategory } from '@prisma/client';

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  role: z.nativeEnum(UserRole).optional(),
  department: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Project Schemas
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  brief: z.string().max(2000).optional(),
  clientId: z.string().uuid('Invalid client ID'),
  projectManagerId: z.string().uuid('Invalid project manager ID'),
  stage: z.string().regex(/^[1-9]$/, 'Invalid stage'),
  priority: z.nativeEnum(PriorityLevel),
  budget: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  projectType: z.string().min(1, 'Project type is required').max(100),
  genre: z.string().max(100).optional(),
  duration: z.string().max(100).optional(),
  technicalRequirements: z.string().max(2000).optional(),
  productionRequirements: z.string().max(2000).optional(),
  paymentTerms: z.string().max(1000).optional(),
  deliverables: z.array(z.string()),
  tags: z.array(z.string()).optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  brief: z.string().max(2000).optional(),
  clientId: z.string().uuid().optional(),
  projectManagerId: z.string().uuid().optional(),
  stage: z.string().regex(/^[1-9]$/).optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  progress: z.number().min(0).max(100).optional(),
  budget: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  actualStartDate: z.string().datetime().optional(),
  actualEndDate: z.string().datetime().optional(),
  projectType: z.string().max(100).optional(),
  genre: z.string().max(100).optional(),
  duration: z.string().max(100).optional(),
  technicalRequirements: z.string().max(2000).optional(),
  productionRequirements: z.string().max(2000).optional(),
  paymentTerms: z.string().max(1000).optional(),
  deliverables: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const getProjectsQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  stage: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  search: z.string().optional(),
  clientId: z.string().uuid().optional(),
  projectManagerId: z.string().uuid().optional(),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }).optional(),
});

// Client Schemas
export const createClientSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email format'),
  phone: z.string().max(20).optional(),
  company: z.string().max(255).optional(),
  website: z.string().url().optional(),
  industry: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  company: z.string().max(255).optional(),
  website: z.string().url().optional(),
  industry: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
});

// Stage Schemas
export const updateStageSchema = z.object({
  status: z.nativeEnum(StageStatus),
  progress: z.number().min(0).max(100),
  notes: z.string().max(1000).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Team Member Schemas
export const addTeamMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.string().min(1, 'Role is required').max(100),
  responsibilities: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  isLead: z.boolean().optional(),
});

export const updateTeamMemberSchema = z.object({
  role: z.string().max(100).optional(),
  responsibilities: z.array(z.string()).optional(),
  hourlyRate: z.number().positive().optional(),
  isLead: z.boolean().optional(),
});

// Comment Schemas
export const addCommentSchema = z.object({
  content: z.string().min(1, 'Content is required').max(2000),
  parentCommentId: z.string().uuid().optional(),
  isInternal: z.boolean().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

// File Upload Schema
export const uploadFileSchema = z.object({
  category: z.nativeEnum(FileCategory),
  description: z.string().max(500).optional(),
});

// Validation middleware
export const validate = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      const validationTarget = req.method === 'GET' ? req.query : req.body;
      const result = schema.safeParse(validationTarget);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      // Replace req.body or req.query with validated data
      if (req.method === 'GET') {
        req.query = result.data;
      } else {
        req.body = result.data;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal validation error',
      });
    }
  };
};