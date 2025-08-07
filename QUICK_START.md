# 🚀 Quick Start Guide

## Option 1: Automated Setup (Recommended)

Run this single command to start everything:

```bash
./start-dev.sh
```

## Option 2: Manual Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- Git

### Step 1: Start PostgreSQL
```bash
# Using Docker (easiest)
docker run -d --name kanban-postgres \
  -e POSTGRES_DB=tfh_kanban \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15

# OR install PostgreSQL locally and create database 'tfh_kanban'
```

### Step 2: Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Setup database
npx prisma db push
npm run db:seed

# Start backend server
npm run dev
```
Backend will run on `http://localhost:3001`

### Step 3: Setup Frontend (in new terminal)
```bash
cd ..  # Back to root directory

# Install dependencies (if not already done)
npm install

# Start frontend server  
npm run dev
```
Frontend will run on `http://localhost:3000`

## 🎯 What You'll Get

### Sample Users (login at http://localhost:3000/login):
- **Admin**: `admin@tfhfilm.com` / `admin123`
- **Project Manager**: `pm@tfhfilm.com` / `pm123`
- **Editor**: `editor@tfhfilm.com` / `editor123`
- **Camera Operator**: `camera@tfhfilm.com` / `camera123`

### Sample Projects:
- **Mountain Echoes Documentary** (75% complete, Post-Production stage)
- **City Lights Series** (30% complete, Pre-Production stage)
- **Brand Story Commercial** (90% complete, Client Review stage)

### Available Features:
- ✅ User authentication & roles
- ✅ Project management (CRUD operations)
- ✅ Kanban board with 9 stages
- ✅ List view with filtering & sorting
- ✅ Calendar view with timeline
- ✅ Team management
- ✅ Analytics dashboard
- ✅ Notifications system
- ✅ User profiles
- ✅ Recent activity feed
- ✅ Quick actions menu

## 🔗 Key URLs

- **Frontend Dashboard**: http://localhost:3000/dashboard
- **Backend API**: http://localhost:3001/api/v1
- **Health Check**: http://localhost:3001/health
- **API Documentation**: http://localhost:3001/api/v1 (shows available endpoints)

## 🛠️ Development Commands

### Backend:
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Reseed database
npm run test         # Run tests
```

### Frontend:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 🐛 Troubleshooting

### Database Connection Issues:
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker restart kanban-postgres

# Check logs
docker logs kanban-postgres
```

### Port Already in Use:
```bash
# Kill process on port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Reset Database:
```bash
cd backend
npx prisma db push --force-reset
npm run db:seed
```

## 🔄 API Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tfhfilm.com","password":"admin123"}'

# Get projects (replace TOKEN with JWT from login)
curl http://localhost:3001/api/v1/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎉 You're Ready!

Once both servers are running, visit http://localhost:3000 and log in with any of the sample users to explore the TFH Film Team Kanban Board system!