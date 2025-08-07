#!/bin/bash

echo "🚀 Starting TFH Film Team Kanban Board (SQLite Mode for Quick Testing)"
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

cd backend

# Use SQLite configuration
echo "📊 Setting up SQLite database..."
cp .env.sqlite .env
cp prisma/schema.sqlite.prisma prisma/schema.prisma

# Generate client and setup database
echo "🔧 Generating Prisma client for SQLite..."
npx prisma generate

echo "📋 Setting up database schema and seeding data..."
npx prisma db push --force-reset
npm run db:seed

# Start backend server
echo "🔧 Starting backend server on port 3001..."
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

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
echo "🗄️ Database: SQLite (dev.db)"
echo ""
echo "👥 Sample Users:"
echo "   Admin: admin@tfhfilm.com / admin123"
echo "   Project Manager: pm@tfhfilm.com / pm123"
echo "   Editor: editor@tfhfilm.com / editor123"
echo "   Camera: camera@tfhfilm.com / camera123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait