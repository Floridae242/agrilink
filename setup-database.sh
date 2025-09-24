#!/bin/bash
echo "🔗 Setting up AgriLink Database Connection..."

# Navigate to backend directory
cd agrilink-starter/apps/backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed the database with initial data
echo "🌱 Seeding database with initial data..."
npm run seed

# Start the backend server
echo "🚀 Starting backend server..."
npm run dev