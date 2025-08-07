import { prisma } from '@/config/database';
import { logger } from '@/config/logger';
import { ApiError, NotFoundError } from '@/utils/errors';
import { CreateProjectRequest, UpdateProjectRequest, GetProjectsQuery } from '@/types/api';
import { Project, PriorityLevel, ProjectStatus, ActivityType } from '@prisma/client';

export class ProjectService {
  static async createProject(
    data: CreateProjectRequest,
    createdByUserId: string
  ): Promise<Project> {
    try {
      // Verify client exists
      const client = await prisma.client.findUnique({
        where: { id: data.clientId },
      });

      if (!client) {
        throw new NotFoundError('Client');
      }

      // Verify project manager exists
      const projectManager = await prisma.user.findUnique({
        where: { id: data.projectManagerId },
      });

      if (!projectManager) {
        throw new NotFoundError('Project Manager');
      }

      const project = await prisma.$transaction(async (tx) => {
        // Create project
        const newProject = await tx.project.create({
          data: {
            title: data.title,
            description: data.description,
            brief: data.brief,
            clientId: data.clientId,
            projectManagerId: data.projectManagerId,
            stage: data.stage,
            priority: data.priority,
            budget: data.budget,
            currency: data.currency,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            tags: data.tags || [],
          },
          include: {
            client: true,
            projectManager: true,
            details: true,
          },
        });

        // Create project details
        await tx.projectDetails.create({
          data: {
            projectId: newProject.id,
            projectType: data.projectType,
            genre: data.genre,
            duration: data.duration,
            technicalRequirements: data.technicalRequirements,
            productionRequirements: data.productionRequirements,
            paymentTerms: data.paymentTerms,
            deliverables: data.deliverables,
          },
        });

        // Create initial project stages
        const stageNames = [
          'Project Initiation',
          'Pre-Production',
          'Production Planning',
          'Production',
          'Post-Production',
          'Client Review',
          'Final Delivery',
          'Quality Assurance',
          'Project Complete',
        ];

        await tx.projectStage.createMany({
          data: stageNames.map((name, index) => ({
            projectId: newProject.id,
            stageNumber: index + 1,
            stageName: name,
            status: index + 1 === parseInt(data.stage) ? 'IN_PROGRESS' : 'PENDING',
            progress: index + 1 === parseInt(data.stage) ? 10 : 0,
          })),
        });

        // Create activity log
        await tx.projectActivity.create({
          data: {
            projectId: newProject.id,
            userId: createdByUserId,
            activityType: ActivityType.PROJECT_CREATED,
            title: `Project "${newProject.title}" created`,
            description: `New project created by ${projectManager.firstName} ${projectManager.lastName}`,
            metadata: {
              stage: data.stage,
              priority: data.priority,
              budget: data.budget,
            },
          },
        });

        return newProject;
      });

      logger.info(`Project created: ${project.title}`, {
        projectId: project.id,
        userId: createdByUserId,
      });

      return project;
    } catch (error) {
      logger.error('Error creating project', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create project', 500);
    }
  }

  static async getProjects(query: GetProjectsQuery, userId?: string) {
    try {
      const {
        page = 1,
        limit = 10,
        stage,
        status,
        priority,
        search,
        clientId,
        projectManagerId,
        dateRange,
      } = query;

      const skip = (page - 1) * limit;

      const where: any = {};

      if (stage) where.stage = stage;
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (clientId) where.clientId = clientId;
      if (projectManagerId) where.projectManagerId = projectManagerId;

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { client: { name: { contains: search, mode: 'insensitive' } } },
        ];
      }

      if (dateRange) {
        where.AND = [
          { startDate: { gte: new Date(dateRange.start) } },
          { endDate: { lte: new Date(dateRange.end) } },
        ];
      }

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          skip,
          take: limit,
          include: {
            client: {
              select: {
                id: true,
                name: true,
                company: true,
                email: true,
              },
            },
            projectManager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatarUrl: true,
              },
            },
            details: true,
            _count: {
              select: {
                comments: true,
                files: true,
                teamMembers: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        }),
        prisma.project.count({ where }),
      ]);

      return {
        projects,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching projects', error);
      throw new ApiError('Failed to fetch projects', 500);
    }
  }

  static async getProjectById(id: string): Promise<Project | null> {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          client: true,
          projectManager: true,
          details: true,
          stages: {
            orderBy: { stageNumber: 'asc' },
          },
          teamMembers: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatarUrl: true,
                  role: true,
                  department: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
              files: true,
              activities: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      logger.error('Error fetching project by ID', error);
      throw new ApiError('Failed to fetch project', 500);
    }
  }

  static async updateProject(
    id: string,
    data: UpdateProjectRequest,
    updatedByUserId: string
  ): Promise<Project> {
    try {
      const existingProject = await prisma.project.findUnique({
        where: { id },
      });

      if (!existingProject) {
        throw new NotFoundError('Project');
      }

      const updatedProject = await prisma.$transaction(async (tx) => {
        // Update project
        const project = await tx.project.update({
          where: { id },
          data: {
            title: data.title,
            description: data.description,
            brief: data.brief,
            clientId: data.clientId,
            projectManagerId: data.projectManagerId,
            stage: data.stage,
            priority: data.priority,
            status: data.status,
            progress: data.progress,
            budget: data.budget,
            currency: data.currency,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            actualStartDate: data.actualStartDate ? new Date(data.actualStartDate) : undefined,
            actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : undefined,
            tags: data.tags,
            metadata: data.metadata,
          },
          include: {
            client: true,
            projectManager: true,
            details: true,
          },
        });

        // Update project details if provided
        if (
          data.projectType ||
          data.genre ||
          data.duration ||
          data.technicalRequirements ||
          data.productionRequirements ||
          data.paymentTerms ||
          data.deliverables
        ) {
          await tx.projectDetails.upsert({
            where: { projectId: id },
            update: {
              projectType: data.projectType,
              genre: data.genre,
              duration: data.duration,
              technicalRequirements: data.technicalRequirements,
              productionRequirements: data.productionRequirements,
              paymentTerms: data.paymentTerms,
              deliverables: data.deliverables,
            },
            create: {
              projectId: id,
              projectType: data.projectType || 'Unknown',
              genre: data.genre,
              duration: data.duration,
              technicalRequirements: data.technicalRequirements,
              productionRequirements: data.productionRequirements,
              paymentTerms: data.paymentTerms,
              deliverables: data.deliverables || [],
            },
          });
        }

        // Update project stage if changed
        if (data.stage && data.stage !== existingProject.stage) {
          await tx.projectStage.updateMany({
            where: {
              projectId: id,
              stageNumber: parseInt(data.stage),
            },
            data: {
              status: 'IN_PROGRESS',
              startDate: new Date(),
            },
          });

          // Create activity log for stage change
          await tx.projectActivity.create({
            data: {
              projectId: id,
              userId: updatedByUserId,
              activityType: ActivityType.STAGE_CHANGED,
              title: `Project moved to stage ${data.stage}`,
              description: `Stage changed from ${existingProject.stage} to ${data.stage}`,
              metadata: {
                oldStage: existingProject.stage,
                newStage: data.stage,
              },
            },
          });
        }

        // Create activity log for project update
        await tx.projectActivity.create({
          data: {
            projectId: id,
            userId: updatedByUserId,
            activityType: ActivityType.PROGRESS_UPDATED,
            title: `Project "${project.title}" updated`,
            description: `Project details updated`,
            metadata: data,
          },
        });

        return project;
      });

      logger.info(`Project updated: ${updatedProject.title}`, {
        projectId: id,
        userId: updatedByUserId,
      });

      return updatedProject;
    } catch (error) {
      logger.error('Error updating project', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update project', 500);
    }
  }

  static async deleteProject(id: string, deletedByUserId: string): Promise<void> {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        select: { title: true },
      });

      if (!project) {
        throw new NotFoundError('Project');
      }

      await prisma.project.delete({
        where: { id },
      });

      logger.info(`Project deleted: ${project.title}`, {
        projectId: id,
        userId: deletedByUserId,
      });
    } catch (error) {
      logger.error('Error deleting project', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete project', 500);
    }
  }

  static async duplicateProject(
    id: string,
    title: string,
    duplicatedByUserId: string
  ): Promise<Project> {
    try {
      const originalProject = await prisma.project.findUnique({
        where: { id },
        include: {
          details: true,
        },
      });

      if (!originalProject) {
        throw new NotFoundError('Project');
      }

      const duplicatedProject = await prisma.$transaction(async (tx) => {
        // Create duplicated project
        const newProject = await tx.project.create({
          data: {
            title,
            description: originalProject.description,
            brief: originalProject.brief,
            clientId: originalProject.clientId,
            projectManagerId: originalProject.projectManagerId,
            stage: '1', // Start from first stage
            priority: originalProject.priority,
            budget: originalProject.budget,
            currency: originalProject.currency,
            tags: originalProject.tags,
            progress: 0,
          },
          include: {
            client: true,
            projectManager: true,
          },
        });

        // Duplicate project details
        if (originalProject.details) {
          await tx.projectDetails.create({
            data: {
              projectId: newProject.id,
              projectType: originalProject.details.projectType,
              genre: originalProject.details.genre,
              duration: originalProject.details.duration,
              technicalRequirements: originalProject.details.technicalRequirements,
              productionRequirements: originalProject.details.productionRequirements,
              paymentTerms: originalProject.details.paymentTerms,
              deliverables: originalProject.details.deliverables,
              additionalNotes: originalProject.details.additionalNotes,
            },
          });
        }

        // Create initial project stages (same as create project)
        const stageNames = [
          'Project Initiation',
          'Pre-Production',
          'Production Planning',
          'Production',
          'Post-Production',
          'Client Review',
          'Final Delivery',
          'Quality Assurance',
          'Project Complete',
        ];

        await tx.projectStage.createMany({
          data: stageNames.map((name, index) => ({
            projectId: newProject.id,
            stageNumber: index + 1,
            stageName: name,
            status: index === 0 ? 'IN_PROGRESS' : 'PENDING',
            progress: index === 0 ? 10 : 0,
          })),
        });

        // Create activity log
        await tx.projectActivity.create({
          data: {
            projectId: newProject.id,
            userId: duplicatedByUserId,
            activityType: ActivityType.PROJECT_CREATED,
            title: `Project duplicated from "${originalProject.title}"`,
            description: `Project "${title}" created as duplicate`,
            metadata: {
              originalProjectId: originalProject.id,
              originalTitle: originalProject.title,
            },
          },
        });

        return newProject;
      });

      logger.info(`Project duplicated: ${title}`, {
        originalProjectId: id,
        newProjectId: duplicatedProject.id,
        userId: duplicatedByUserId,
      });

      return duplicatedProject;
    } catch (error) {
      logger.error('Error duplicating project', error);
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to duplicate project', 500);
    }
  }
}