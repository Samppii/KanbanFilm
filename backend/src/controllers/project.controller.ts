import { Response } from 'express';
import { ProjectService } from '@/services/project.service';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { ApiResponse, handleAsync, NotFoundError } from '@/utils/errors';
import { logger } from '@/config/logger';

export class ProjectController {
  static getProjects = handleAsync(async (req: AuthenticatedRequest, res: Response) => {
    const result = await ProjectService.getProjects(req.query, req.user?.id);

    const response: ApiResponse = {
      success: true,
      data: result.projects,
      meta: result.meta,
    };

    res.json(response);
  });

  static getProject = handleAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);

    if (!project) {
      throw new NotFoundError('Project');
    }

    const response: ApiResponse = {
      success: true,
      data: project,
    };

    res.json(response);
  });

  static createProject = handleAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const project = await ProjectService.createProject(req.body, req.user.id);

    logger.info(`Project created: ${project.title}`, {
      projectId: project.id,
      userId: req.user.id,
    });

    const response: ApiResponse = {
      success: true,
      data: project,
      message: 'Project created successfully',
    };

    res.status(201).json(response);
  });

  static updateProject = handleAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const { id } = req.params;
    const project = await ProjectService.updateProject(id, req.body, req.user.id);

    logger.info(`Project updated: ${project.title}`, {
      projectId: id,
      userId: req.user.id,
    });

    const response: ApiResponse = {
      success: true,
      data: project,
      message: 'Project updated successfully',
    };

    res.json(response);
  });

  static deleteProject = handleAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const { id } = req.params;
    await ProjectService.deleteProject(id, req.user.id);

    logger.info(`Project deleted`, {
      projectId: id,
      userId: req.user.id,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Project deleted successfully',
    };

    res.json(response);
  });

  static duplicateProject = handleAsync(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required for project duplication',
      });
    }

    const project = await ProjectService.duplicateProject(id, title, req.user.id);

    logger.info(`Project duplicated: ${title}`, {
      originalProjectId: id,
      newProjectId: project.id,
      userId: req.user.id,
    });

    const response: ApiResponse = {
      success: true,
      data: project,
      message: 'Project duplicated successfully',
    };

    res.status(201).json(response);
  });
}