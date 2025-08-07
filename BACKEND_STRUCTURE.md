# TFH Film Team Kanban Board - Backend Structure

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Node.js with Express.js or Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **File Storage**: AWS S3 or Cloudinary
- **Real-time**: Socket.io for live updates
- **Email**: Nodemailer with templates
- **Validation**: Zod schemas
- **Testing**: Jest with Supertest
- **Documentation**: Swagger/OpenAPI

## 📊 Database Schema

### Core Tables

#### 1. **users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  role user_role NOT NULL DEFAULT 'team_member',
  department VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('admin', 'project_manager', 'team_member', 'client');
```

#### 2. **projects**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  brief TEXT,
  client_id UUID REFERENCES clients(id),
  project_manager_id UUID REFERENCES users(id),
  stage VARCHAR(50) NOT NULL DEFAULT '1',
  priority priority_level NOT NULL DEFAULT 'medium',
  status project_status NOT NULL DEFAULT 'active',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget DECIMAL(12,2),
  currency VARCHAR(3) DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE project_status AS ENUM ('active', 'on_hold', 'completed', 'cancelled');
```

#### 3. **clients**
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  website VARCHAR(500),
  logo_url VARCHAR(500),
  industry VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. **project_details**
```sql
CREATE TABLE project_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  project_type VARCHAR(100) NOT NULL,
  genre VARCHAR(100),
  duration VARCHAR(100),
  technical_requirements TEXT,
  production_requirements TEXT,
  payment_terms TEXT,
  deliverables TEXT[],
  additional_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. **project_stages**
```sql
CREATE TABLE project_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  stage_number INTEGER NOT NULL,
  stage_name VARCHAR(100) NOT NULL,
  status stage_status NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE stage_status AS ENUM ('pending', 'in_progress', 'completed', 'blocked');
```

#### 6. **project_activities**
```sql
CREATE TABLE project_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  activity_type activity_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE activity_type AS ENUM (
  'project_created', 'stage_changed', 'progress_updated', 
  'comment_added', 'file_uploaded', 'deadline_updated',
  'budget_updated', 'team_member_added', 'client_feedback'
);
```

#### 7. **project_comments**
```sql
CREATE TABLE project_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  parent_comment_id UUID REFERENCES project_comments(id),
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 8. **project_files**
```sql
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_type file_category NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE file_category AS ENUM (
  'script', 'storyboard', 'raw_footage', 'final_video',
  'audio', 'graphics', 'document', 'contract', 'other'
);
```

#### 9. **project_team_members**
```sql
CREATE TABLE project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role VARCHAR(100) NOT NULL,
  responsibilities TEXT[],
  hourly_rate DECIMAL(8,2),
  is_lead BOOLEAN DEFAULT false,
  joined_at TIMESTAMP DEFAULT NOW(),
  left_at TIMESTAMP
);
```

#### 10. **notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM (
  'project_update', 'deadline_reminder', 'team_mention',
  'client_feedback', 'file_upload', 'stage_completion'
);
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
}
```

### Role-Based Access Control (RBAC)
```typescript
enum Permission {
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

const rolePermissions = {
  admin: Object.values(Permission),
  project_manager: [
    Permission.PROJECT_CREATE,
    Permission.PROJECT_READ,
    Permission.PROJECT_UPDATE,
    Permission.STAGE_UPDATE,
    Permission.TEAM_MANAGE,
    Permission.CLIENT_MANAGE
  ],
  team_member: [
    Permission.PROJECT_READ,
    Permission.STAGE_UPDATE
  ],
  client: [
    Permission.PROJECT_READ
  ]
};
```

## 🚀 API Endpoints

### Authentication Routes
```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  department?: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// POST /api/auth/refresh
// POST /api/auth/logout
// POST /api/auth/forgot-password
// POST /api/auth/reset-password
```

### Project Routes
```typescript
// GET /api/projects - List projects with filters
interface GetProjectsQuery {
  page?: number;
  limit?: number;
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

// POST /api/projects - Create new project
interface CreateProjectRequest {
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

// GET /api/projects/:id - Get project details
// PUT /api/projects/:id - Update project
// DELETE /api/projects/:id - Delete project
// POST /api/projects/:id/duplicate - Duplicate project
```

### Stage Management Routes
```typescript
// PUT /api/projects/:id/stages/:stageId
interface UpdateStageRequest {
  status: StageStatus;
  progress: number;
  notes?: string;
  startDate?: string;
  endDate?: string;
}

// POST /api/projects/:id/stages/:stageId/complete
// POST /api/projects/:id/stages/:stageId/block
```

### Client Routes
```typescript
// GET /api/clients - List clients
// POST /api/clients - Create client
interface CreateClientRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  industry?: string;
  description?: string;
}

// GET /api/clients/:id - Get client details
// PUT /api/clients/:id - Update client
// DELETE /api/clients/:id - Delete client
```

### Team Management Routes
```typescript
// GET /api/projects/:id/team - Get project team
// POST /api/projects/:id/team - Add team member
interface AddTeamMemberRequest {
  userId: string;
  role: string;
  responsibilities?: string[];
  hourlyRate?: number;
  isLead?: boolean;
}

// PUT /api/projects/:id/team/:memberId - Update team member
// DELETE /api/projects/:id/team/:memberId - Remove team member
```

### File Management Routes
```typescript
// POST /api/projects/:id/files - Upload file
interface UploadFileRequest {
  file: File;
  category: FileCategory;
  description?: string;
}

// GET /api/projects/:id/files - List project files
// DELETE /api/projects/:id/files/:fileId - Delete file
// GET /api/files/:fileId/download - Download file
```

### Activity & Comments Routes
```typescript
// GET /api/projects/:id/activities - Get project activities
// POST /api/projects/:id/comments - Add comment
interface AddCommentRequest {
  content: string;
  parentCommentId?: string;
  isInternal?: boolean;
}

// GET /api/projects/:id/comments - Get project comments
// PUT /api/comments/:id - Update comment
// DELETE /api/comments/:id - Delete comment
```

### Notification Routes
```typescript
// GET /api/notifications - Get user notifications
// PUT /api/notifications/:id/read - Mark as read
// PUT /api/notifications/read-all - Mark all as read
// DELETE /api/notifications/:id - Delete notification
```

## 🔄 Real-time Features

### Socket.io Events
```typescript
// Server-side events
interface ServerEvents {
  // Project updates
  'project:created': (project: Project) => void;
  'project:updated': (project: Project) => void;
  'project:deleted': (projectId: string) => void;
  
  // Stage updates
  'stage:updated': (data: { projectId: string; stage: ProjectStage }) => void;
  'stage:completed': (data: { projectId: string; stage: ProjectStage }) => void;
  
  // Team updates
  'team:member_added': (data: { projectId: string; member: TeamMember }) => void;
  'team:member_removed': (data: { projectId: string; memberId: string }) => void;
  
  // Comments
  'comment:added': (comment: ProjectComment) => void;
  'comment:updated': (comment: ProjectComment) => void;
  'comment:deleted': (commentId: string) => void;
  
  // Notifications
  'notification:new': (notification: Notification) => void;
  
  // File uploads
  'file:uploaded': (file: ProjectFile) => void;
  'file:deleted': (fileId: string) => void;
}

// Client-side events
interface ClientEvents {
  'join:project': (projectId: string) => void;
  'leave:project': (projectId: string) => void;
  'typing:comment': (data: { projectId: string; userId: string }) => void;
  'stop:typing': (data: { projectId: string; userId: string }) => void;
}
```

## 📧 Email Notifications

### Email Templates
```typescript
interface EmailTemplates {
  // Project notifications
  'project-assigned': {
    subject: 'New Project Assignment: {{projectTitle}}';
    template: 'project-assigned.html';
  };
  'stage-completed': {
    subject: 'Stage Completed: {{stageName}} - {{projectTitle}}';
    template: 'stage-completed.html';
  };
  'deadline-reminder': {
    subject: 'Deadline Reminder: {{projectTitle}}';
    template: 'deadline-reminder.html';
  };
  
  // Team notifications
  'team-invitation': {
    subject: 'You\'ve been invited to join {{projectTitle}}';
    template: 'team-invitation.html';
  };
  
  // Client notifications
  'client-feedback-request': {
    subject: 'Feedback Request: {{projectTitle}}';
    template: 'client-feedback-request.html';
  };
}
```

## 🔍 Search & Filtering

### Elasticsearch Integration
```typescript
interface SearchIndex {
  projects: {
    mappings: {
      properties: {
        title: { type: 'text', analyzer: 'standard' };
        description: { type: 'text', analyzer: 'standard' };
        client: { type: 'keyword' };
        stage: { type: 'keyword' };
        priority: { type: 'keyword' };
        tags: { type: 'keyword' };
        teamMembers: { type: 'keyword' };
        createdAt: { type: 'date' };
        updatedAt: { type: 'date' };
      };
    };
  };
}
```

## 📊 Analytics & Reporting

### Analytics Endpoints
```typescript
// GET /api/analytics/projects/overview
interface ProjectOverview {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  averageProjectDuration: number;
  projectsByStage: Record<string, number>;
  projectsByPriority: Record<PriorityLevel, number>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

// GET /api/analytics/team/performance
interface TeamPerformance {
  teamMembers: Array<{
    userId: string;
    name: string;
    projectsCompleted: number;
    averageProjectRating: number;
    totalHours: number;
  }>;
}

// GET /api/analytics/clients/overview
interface ClientOverview {
  totalClients: number;
  activeClients: number;
  topClients: Array<{
    clientId: string;
    name: string;
    totalProjects: number;
    totalRevenue: number;
  }>;
}
```

## 🧪 Testing Strategy

### Test Structure
```typescript
// Unit Tests
describe('ProjectService', () => {
  describe('createProject', () => {
    it('should create a new project with valid data');
    it('should validate required fields');
    it('should assign default stage');
  });
  
  describe('updateProjectStage', () => {
    it('should update project stage');
    it('should create activity log');
    it('should send notifications');
  });
});

// Integration Tests
describe('Project API', () => {
  describe('POST /api/projects', () => {
    it('should create project with authentication');
    it('should validate request body');
    it('should return created project');
  });
});

// E2E Tests
describe('Project Management Flow', () => {
  it('should allow user to create and manage projects');
  it('should handle file uploads');
  it('should send real-time updates');
});
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tfh_kanban
DATABASE_POOL_SIZE=10

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=tfh-kanban-files

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# App
NODE_ENV=production
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Deployment

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/tfh_kanban
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
      - elasticsearch

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: tfh_kanban
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  elasticsearch:
    image: elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

volumes:
  postgres_data:
  elasticsearch_data:
```

## 📈 Monitoring & Logging

### Health Checks
```typescript
// GET /api/health
interface HealthCheck {
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
```

### Logging Strategy
```typescript
interface LogLevels {
  error: 'Error logs for debugging';
  warn: 'Warning logs for potential issues';
  info: 'General application logs';
  debug: 'Detailed debugging information';
}

interface LogContext {
  userId?: string;
  projectId?: string;
  action?: string;
  ip?: string;
  userAgent?: string;
}
```

## 🔒 Security Measures

### Security Headers
```typescript
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
```

### Rate Limiting
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});
```

### Input Validation
```typescript
const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  clientId: z.string().uuid(),
  projectManagerId: z.string().uuid(),
  stage: z.string().regex(/^[1-9]$/),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  budget: z.number().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
```

This backend structure provides a comprehensive foundation for the TFH Film Team Kanban board, supporting all frontend features with scalability, security, and performance in mind.
