# 🔗 AgriLink Database Connection Guide

## 📋 Overview
This guide will help you connect your AgriLink application to a production database and deploy the backend API.

## 🗄️ Database Options

### Option 1: Render PostgreSQL (Recommended)
1. Go to [Render.com](https://render.com) and create an account
2. Create a new PostgreSQL database:
   - Name: `agrilink-postgres`
   - Database: `agrilink`
   - User: `agrilink`
3. Copy the External Database URL
4. Update your `DATABASE_URL` environment variable

### Option 2: Supabase PostgreSQL
1. Go to [Supabase.com](https://supabase.com) and create a project
2. Go to Settings > Database
3. Copy the Connection string (URI format)
4. Update your `DATABASE_URL` environment variable

### Option 3: Railway PostgreSQL
1. Go to [Railway.app](https://railway.app) and create a project
2. Add a PostgreSQL service
3. Copy the Database URL from the Connect tab
4. Update your `DATABASE_URL` environment variable

## 🚀 Backend Deployment

### Deploy to Render (Recommended)
1. Fork/Clone this repository to your GitHub
2. Go to [Render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Use these settings:
   - **Root Directory**: `apps/backend`
   - **Build Command**: `pnpm install && pnpm build && npx prisma generate && npx prisma migrate deploy && npx prisma db seed`
   - **Start Command**: `pnpm start`
   - **Health Check Path**: `/healthz`

5. Set environment variables:
   ```
   DATABASE_URL=your_postgres_url_here
   JWT_SECRET=agrilink-super-secret-jwt-key-production-2025
   IOT_MASTER_KEY=AGRILINK_IOT_MASTER_KEY_2025_PRODUCTION
   NODE_ENV=production
   ```

6. Deploy and wait for the build to complete

### Alternative: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Create a new project from GitHub
3. Select your repository
4. Set the same environment variables as above
5. Railway will auto-detect and deploy your Node.js app

## 🔧 Frontend Configuration

After deploying your backend, update your frontend to use the production API:

1. Create a `.env` file in `apps/frontend/`:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. Rebuild and redeploy your frontend:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## 📊 Database Schema

Your database includes these tables:
- **Users**: farmer@agrilink.local, buyer@agrilink.local, inspector@agrilink.local, admin@agrilink.local
- **Farms**: Sample farm data with different districts
- **Lots**: Agricultural lot data with tracking
- **Events**: IoT sensor data and events
- **QA Inspections**: Quality assurance records
- **Certificates**: Compliance and certification data

## 🔐 Authentication

Default demo accounts (password: `password123`):
- **Farmer**: farmer@agrilink.local
- **Buyer**: buyer@agrilink.local  
- **Inspector**: inspector@agrilink.local
- **Admin**: admin@agrilink.local

## 🧪 Testing the Connection

1. Visit your deployed frontend URL
2. Click "เข้าสู่ระบบ" (Login)
3. Use any demo account above
4. Navigate to "แดชบอร์ด" (Dashboard)
5. Create a new lot or place a bid to test database connectivity

## 📝 Manual Local Setup (Development)

If you want to run locally:

```bash
# Backend setup
cd apps/backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev

# Frontend setup (new terminal)
cd apps/frontend
npm install
npm run dev
```

## 🔍 Troubleshooting

- **Connection Error**: Check your DATABASE_URL format
- **Migration Error**: Ensure PostgreSQL database is created
- **Seed Error**: Check if user accounts already exist
- **CORS Error**: Verify your frontend URL is correct

Your AgriLink application will now have full database functionality with persistent data storage!