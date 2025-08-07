import { PriorityLevel, ProjectStatus, StageStatus, FileCategory } from '@prisma/client';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface GetProjectsQuery extends PaginationQuery {
  stage?: string;
  status?: ProjectStatus;
  priority?: PriorityLevel;
  search?: string;
  clientId?: string;
  projectManagerId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  brief?: string;
  clientId: string;
  projectManagerId: string;
  stage: string;
  priority: PriorityLevel;
  budget?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  projectType: string;
  genre?: string;
  duration?: string;
  technicalRequirements?: string;
  productionRequirements?: string;
  paymentTerms?: string;
  deliverables: string[];
  tags?: string[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  progress?: number;
  status?: ProjectStatus;
  actualStartDate?: string;
  actualEndDate?: string;
  metadata?: Record<string, any>;
}

export interface UpdateStageRequest {
  status: StageStatus;
  progress: number;
  notes?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  industry?: string;
  description?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  isActive?: boolean;
}

export interface AddTeamMemberRequest {
  userId: string;
  role: string;
  responsibilities?: string[];
  hourlyRate?: number;
  isLead?: boolean;
}

export interface UpdateTeamMemberRequest extends Partial<AddTeamMemberRequest> {}

export interface UploadFileRequest {
  category: FileCategory;
  description?: string;
}

export interface AddCommentRequest {
  content: string;
  parentCommentId?: string;
  isInternal?: boolean;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    redis: 'up' | 'down';
    elasticsearch: 'up' | 'down';
    fileStorage: 'up' | 'down';
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
}

export interface LogContext {
  userId?: string;
  projectId?: string;
  action?: string;
  ip?: string;
  userAgent?: string;
}