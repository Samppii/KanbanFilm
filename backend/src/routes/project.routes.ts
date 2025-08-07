import { Router } from 'express';
import { ProjectController } from '@/controllers/project.controller';
import { authenticateToken, requirePermissions } from '@/middleware/auth.middleware';
import { validate } from '@/utils/validation';
import { 
  createProjectSchema,
  updateProjectSchema,
  getProjectsQuerySchema
} from '@/utils/validation';
import { Permission } from '@/types/auth';

const router = Router();

// All project routes require authentication
router.use(authenticateToken);

// GET /projects - List projects with filters
router.get(
  '/',
  requirePermissions([Permission.PROJECT_READ]),
  validate(getProjectsQuerySchema),
  ProjectController.getProjects
);

// GET /projects/:id - Get project details
router.get(
  '/:id',
  requirePermissions([Permission.PROJECT_READ]),
  ProjectController.getProject
);

// POST /projects - Create new project
router.post(
  '/',
  requirePermissions([Permission.PROJECT_CREATE]),
  validate(createProjectSchema),
  ProjectController.createProject
);

// PUT /projects/:id - Update project
router.put(
  '/:id',
  requirePermissions([Permission.PROJECT_UPDATE]),
  validate(updateProjectSchema),
  ProjectController.updateProject
);

// DELETE /projects/:id - Delete project
router.delete(
  '/:id',
  requirePermissions([Permission.PROJECT_DELETE]),
  ProjectController.deleteProject
);

// POST /projects/:id/duplicate - Duplicate project
router.post(
  '/:id/duplicate',
  requirePermissions([Permission.PROJECT_CREATE]),
  ProjectController.duplicateProject
);

export { router as projectRoutes };