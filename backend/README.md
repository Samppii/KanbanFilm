# TFH Film Team Kanban Board - Backend API

A comprehensive backend API for the TFH Film Team Kanban board system, built with Node.js, Express, TypeScript, and PostgreSQL.

## 🏗️ Architecture

- **Framework**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schemas
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate limiting
- **Real-time**: Socket.io (planned)
- **File Storage**: AWS S3 (planned)
- **Email**: Nodemailer (planned)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001/api/v1`

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

```bash
# Start all services (API, PostgreSQL, Redis)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Using Docker Only

```bash
# Build image
docker build -t tfh-kanban-api .

# Run with environment variables
docker run -p 3001:3001 -e DATABASE_URL=your-db-url tfh-kanban-api
```

## 🔐 Authentication

The API uses JWT tokens with refresh token rotation:

### Sample Users (after seeding)

- **Admin**: `admin@tfhfilm.com` / `admin123`
- **Project Manager**: `pm@tfhfilm.com` / `pm123`
- **Team Member**: `editor@tfhfilm.com` / `editor123`
- **Camera Operator**: `camera@tfhfilm.com` / `camera123`

### Authentication Flow

1. **Login**: POST `/api/v1/auth/login`
2. **Get Profile**: GET `/api/v1/auth/profile` (with Bearer token)
3. **Refresh Token**: POST `/api/v1/auth/refresh`
4. **Logout**: POST `/api/v1/auth/logout`

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh tokens
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/profile` - Get user profile

### Projects
- `GET /api/v1/projects` - List projects with filters
- `GET /api/v1/projects/:id` - Get project details
- `POST /api/v1/projects` - Create new project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `POST /api/v1/projects/:id/duplicate` - Duplicate project

### Health Check
- `GET /health` - Basic health check
- `GET /api/v1/health` - Detailed health check

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Zod schema validation
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Access & refresh tokens
- **SQL Injection Protection**: Prisma ORM
- **Error Handling**: Structured error responses

## 📝 Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tfh_kanban

# Authentication
JWT_SECRET=your-jwt-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Server
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Optional services
REDIS_URL=redis://localhost:6379
AWS_S3_BUCKET=tfh-kanban-files
SMTP_HOST=smtp.gmail.com
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Database Schema

The database includes the following main entities:

- **Users**: Team members, project managers, admins, clients
- **Projects**: Film projects with stages and progress tracking
- **Clients**: Client organizations and contacts
- **Project Details**: Technical specifications and requirements
- **Project Stages**: 9-stage production pipeline
- **Activities**: Project activity logs and history
- **Comments**: Project discussions and feedback
- **Files**: Project assets and deliverables
- **Team Members**: Project team assignments and roles
- **Notifications**: User notifications and alerts

## 🔍 Project Stages

The system tracks projects through 9 stages:

1. **Project Initiation** - Initial planning and setup
2. **Pre-Production** - Preparation and planning
3. **Production Planning** - Detailed production planning
4. **Production** - Active filming/recording
5. **Post-Production** - Editing and post-production
6. **Client Review** - Client feedback and revisions
7. **Final Delivery** - Delivery preparation
8. **Quality Assurance** - Final quality checks
9. **Project Complete** - Project completion

## 🎭 Role-Based Access Control

- **Admin**: Full system access
- **Project Manager**: Project management and team oversight
- **Team Member**: Project participation and updates
- **Client**: Project viewing and feedback

## 🚧 Development Status

### ✅ Completed
- Project structure and configuration
- Database schema with Prisma
- Authentication system with JWT
- Project management API
- Security middleware
- Error handling
- Input validation
- Docker configuration

### 🔄 In Progress
- File upload system
- Real-time features with Socket.io
- Email notification system

### 📋 Planned
- Client management API
- Team management API
- File management API
- Activity tracking API
- Notification system API
- Analytics and reporting API
- Advanced search with Elasticsearch
- Comprehensive testing suite
- API documentation with Swagger
- Performance monitoring
- Backup and recovery procedures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@tfhfilm.com or create an issue in the repository.

---

**TFH Film Team** - Building the future of film production management