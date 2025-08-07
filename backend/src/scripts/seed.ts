import { PrismaClient, UserRole, PriorityLevel } from '@prisma/client';
import { AuthService } from '@/services/auth.service';
import { logger } from '@/config/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('Starting database seeding...');

  try {
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@tfhfilm.com' },
      update: {},
      create: {
        email: 'admin@tfhfilm.com',
        passwordHash: await AuthService.hashPassword('admin123'),
        firstName: 'System',
        lastName: 'Administrator',
        role: UserRole.ADMIN,
        department: 'Management',
        isActive: true,
        emailVerified: true,
      },
    });

    // Create project manager
    const projectManager = await prisma.user.upsert({
      where: { email: 'pm@tfhfilm.com' },
      update: {},
      create: {
        email: 'pm@tfhfilm.com',
        passwordHash: await AuthService.hashPassword('pm123'),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.PROJECT_MANAGER,
        department: 'Production',
        isActive: true,
        emailVerified: true,
      },
    });

    // Create team members
    const teamMember1 = await prisma.user.upsert({
      where: { email: 'editor@tfhfilm.com' },
      update: {},
      create: {
        email: 'editor@tfhfilm.com',
        passwordHash: await AuthService.hashPassword('editor123'),
        firstName: 'Sarah',
        lastName: 'Williams',
        role: UserRole.TEAM_MEMBER,
        department: 'Post-Production',
        isActive: true,
        emailVerified: true,
      },
    });

    const teamMember2 = await prisma.user.upsert({
      where: { email: 'camera@tfhfilm.com' },
      update: {},
      create: {
        email: 'camera@tfhfilm.com',
        passwordHash: await AuthService.hashPassword('camera123'),
        firstName: 'Mike',
        lastName: 'Johnson',
        role: UserRole.TEAM_MEMBER,
        department: 'Production',
        isActive: true,
        emailVerified: true,
      },
    });

    // Create clients
    const client1 = await prisma.client.upsert({
      where: { email: 'contact@discovery.com' },
      update: {},
      create: {
        name: 'Discovery Channel',
        email: 'contact@discovery.com',
        phone: '+1-555-0101',
        company: 'Discovery Communications',
        website: 'https://www.discovery.com',
        industry: 'Media & Entertainment',
        description: 'Leading documentary and educational content producer',
        isActive: true,
      },
    });

    const client2 = await prisma.client.upsert({
      where: { email: 'production@netflix.com' },
      update: {},
      create: {
        name: 'Netflix Productions',
        email: 'production@netflix.com',
        phone: '+1-555-0102',
        company: 'Netflix Inc.',
        website: 'https://www.netflix.com',
        industry: 'Streaming & Media',
        description: 'Global streaming entertainment service',
        isActive: true,
      },
    });

    const client3 = await prisma.client.upsert({
      where: { email: 'marketing@apple.com' },
      update: {},
      create: {
        name: 'Apple Marketing',
        email: 'marketing@apple.com',
        phone: '+1-555-0103',
        company: 'Apple Inc.',
        website: 'https://www.apple.com',
        industry: 'Technology',
        description: 'Leading technology company',
        isActive: true,
      },
    });

    // Create sample projects
    const project1 = await prisma.project.create({
      data: {
        title: 'Mountain Echoes Documentary',
        description: 'An in-depth exploration of mountain ecosystems and wildlife conservation efforts',
        brief: 'Create a compelling documentary about mountain ecosystems',
        clientId: client1.id,
        projectManagerId: projectManager.id,
        stage: '5',
        priority: PriorityLevel.HIGH,
        progress: 75,
        budget: 250000,
        currency: 'USD',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-30'),
        tags: ['nature', 'documentary', 'conservation'],
        details: {
          create: {
            projectType: 'Documentary',
            genre: 'Nature',
            duration: '90 minutes',
            technicalRequirements: '4K resolution, HDR, Dolby Atmos',
            productionRequirements: 'Mountain filming equipment, drone permits',
            paymentTerms: '50% upfront, 50% on delivery',
            deliverables: ['Final Cut', 'Raw Footage', 'Behind-the-Scenes'],
            additionalNotes: 'Weather dependent shooting schedule',
          },
        },
      },
    });

    const project2 = await prisma.project.create({
      data: {
        title: 'City Lights Series',
        description: 'Urban drama series exploring modern city life',
        brief: 'Develop a gripping urban drama series for streaming platform',
        clientId: client2.id,
        projectManagerId: projectManager.id,
        stage: '2',
        priority: PriorityLevel.MEDIUM,
        progress: 30,
        budget: 500000,
        currency: 'USD',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-15'),
        tags: ['drama', 'urban', 'series'],
        details: {
          create: {
            projectType: 'Series',
            genre: 'Drama',
            duration: '6 episodes',
            technicalRequirements: '4K resolution, Dolby Atmos',
            productionRequirements: 'Urban locations, night shooting permits',
            paymentTerms: 'Monthly payments as per milestone delivery',
            deliverables: ['Final Episodes', 'Web Version', 'Trailer'],
            additionalNotes: 'Night shooting required for authentic urban atmosphere',
          },
        },
      },
    });

    const project3 = await prisma.project.create({
      data: {
        title: 'Brand Story Commercial',
        description: 'Corporate brand story highlighting innovation and values',
        brief: 'Create an inspiring brand story commercial',
        clientId: client3.id,
        projectManagerId: projectManager.id,
        stage: '6',
        priority: PriorityLevel.HIGH,
        progress: 90,
        budget: 150000,
        currency: 'USD',
        startDate: new Date('2024-01-05'),
        endDate: new Date('2024-02-20'),
        tags: ['commercial', 'brand', 'corporate'],
        details: {
          create: {
            projectType: 'Commercial',
            genre: 'Corporate',
            duration: '60 seconds',
            technicalRequirements: '4K resolution, HDR',
            productionRequirements: 'Studio setup, professional lighting',
            paymentTerms: '30% upfront, 70% on delivery',
            deliverables: ['Final Commercial', 'Social Media Versions'],
            additionalNotes: 'Brand guidelines must be strictly followed',
          },
        },
      },
    });

    // Create project stages for each project
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

    for (const project of [project1, project2, project3]) {
      await prisma.projectStage.createMany({
        data: stageNames.map((name, index) => ({
          projectId: project.id,
          stageNumber: index + 1,
          stageName: name,
          status: index + 1 <= parseInt(project.stage) ? 
            (index + 1 === parseInt(project.stage) ? 'IN_PROGRESS' : 'COMPLETED') : 
            'PENDING',
          progress: index + 1 <= parseInt(project.stage) ? 
            (index + 1 === parseInt(project.stage) ? project.progress : 100) : 
            0,
        })),
      });
    }

    // Add team members to projects
    await prisma.projectTeamMember.createMany({
      data: [
        {
          projectId: project1.id,
          userId: teamMember1.id,
          role: 'Video Editor',
          responsibilities: ['Video editing', 'Color grading'],
          hourlyRate: 75,
          isLead: true,
        },
        {
          projectId: project1.id,
          userId: teamMember2.id,
          role: 'Cinematographer',
          responsibilities: ['Camera operation', 'Lighting'],
          hourlyRate: 85,
          isLead: false,
        },
        {
          projectId: project2.id,
          userId: teamMember1.id,
          role: 'Post-Production Lead',
          responsibilities: ['Post-production supervision', 'Final delivery'],
          hourlyRate: 80,
          isLead: true,
        },
        {
          projectId: project3.id,
          userId: teamMember2.id,
          role: 'Director of Photography',
          responsibilities: ['Visual direction', 'Camera work'],
          hourlyRate: 90,
          isLead: true,
        },
      ],
    });

    // Create some sample activities
    await prisma.projectActivity.createMany({
      data: [
        {
          projectId: project1.id,
          userId: projectManager.id,
          activityType: 'PROJECT_CREATED',
          title: 'Project "Mountain Echoes Documentary" created',
          description: 'New documentary project initiated',
        },
        {
          projectId: project1.id,
          userId: teamMember1.id,
          activityType: 'STAGE_CHANGED',
          title: 'Moved to Post-Production stage',
          description: 'Project advanced to post-production phase',
        },
        {
          projectId: project2.id,
          userId: projectManager.id,
          activityType: 'PROJECT_CREATED',
          title: 'Project "City Lights Series" created',
          description: 'New drama series project initiated',
        },
        {
          projectId: project3.id,
          userId: teamMember2.id,
          activityType: 'PROGRESS_UPDATED',
          title: 'Project progress updated to 90%',
          description: 'Commercial nearing completion',
        },
      ],
    });

    // Create sample notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: projectManager.id,
          title: 'New Project Assignment',
          message: 'You have been assigned as project manager for "Mountain Echoes Documentary"',
          type: 'PROJECT_UPDATE',
          isRead: false,
        },
        {
          userId: teamMember1.id,
          title: 'Stage Completion Required',
          message: 'Post-production stage for "Mountain Echoes Documentary" needs completion',
          type: 'STAGE_COMPLETION',
          isRead: false,
        },
        {
          userId: teamMember2.id,
          title: 'Client Feedback Received',
          message: 'New feedback received for "Brand Story Commercial"',
          type: 'CLIENT_FEEDBACK',
          isRead: true,
        },
      ],
    });

    logger.info('Database seeding completed successfully!');
    
    logger.info('Sample users created:');
    logger.info(`- Admin: admin@tfhfilm.com / admin123`);
    logger.info(`- Project Manager: pm@tfhfilm.com / pm123`);
    logger.info(`- Editor: editor@tfhfilm.com / editor123`);
    logger.info(`- Camera Operator: camera@tfhfilm.com / camera123`);
    
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });