#!/bin/bash

echo "🚀 Starting TFH Film Team Kanban Board Development Environment"
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Check if we need to set up the database
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found! Please run setup first."
    exit 1
fi

# Start PostgreSQL (if using Docker)
echo "📊 Starting PostgreSQL with Docker..."
docker run -d --name kanban-postgres \
  -e POSTGRES_DB=tfh_kanban \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15 2>/dev/null || echo "PostgreSQL already running or failed to start"

# Wait a moment for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 3

# Set up database schema and seed data
echo "📋 Setting up database schema and seeding data..."
cd backend
npx prisma db push --force-reset
npm run db:seed
cd ..

# Start backend server
echo "🔧 Starting backend server on port 3001..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start frontend server
echo "🎨 Starting frontend server on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001/api/v1"
echo "📊 Health Check: http://localhost:3001/health"
echo ""
echo "👥 Sample Users (after seeding):"
echo "   Admin: admin@tfhfilm.com / admin123"
echo "   Project Manager: pm@tfhfilm.com / pm123"
echo "   Editor: editor@tfhfilm.com / editor123"
echo "   Camera: camera@tfhfilm.com / camera123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait