# ResumeAI Production Deployment Guide

## Quick Deployment to Vercel

### 1. Prerequisites
- Vercel account (free)
- OpenRouter API key
- Database provider (PlanetScale/Neon recommended)

### 2. Database Setup (Choose One)

#### Option A: PlanetScale (MySQL)
1. Create account at https://planetscale.com
2. Create new database named `resumai`
3. Get connection string from dashboard
4. Update prisma/schema.prisma:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

#### Option B: Neon (PostgreSQL)
1. Create account at https://neon.tech
2. Create new database
3. Get connection string
4. Update prisma/schema.prisma:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Deploy to Vercel

#### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add OPENROUTER_API_KEY
vercel env add JWT_SECRET
vercel env add DATABASE_URL
vercel env add OPENROUTER_MODEL
vercel env add NEXT_PUBLIC_SITE_URL
```

#### Method 2: GitHub Integration
1. Push code to GitHub repository
2. Go to vercel.com and import your repository
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### 4. Environment Variables (Required)
Set these in Vercel dashboard:

```
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=google/gemma-3-27b-it:free
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
JWT_SECRET=your-secure-jwt-secret-key
DATABASE_URL=your-database-connection-string
```

### 5. Database Migration
After deployment, run:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 6. Custom Domain (Optional)
1. Go to Vercel dashboard
2. Navigate to your project
3. Go to Settings > Domains
4. Add your custom domain

## Alternative: Railway Deployment

### 1. Deploy to Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 2. Add Database
```bash
railway add postgresql
```

### 3. Environment Variables
Railway will auto-generate DATABASE_URL. Add others:
- OPENROUTER_API_KEY
- JWT_SECRET
- OPENROUTER_MODEL
- NEXT_PUBLIC_SITE_URL

## Production Checklist
- [ ] Database configured and migrated
- [ ] Environment variables set
- [ ] OpenRouter API key configured
- [ ] JWT secret generated
- [ ] SSL certificate active
- [ ] Custom domain configured (optional)
- [ ] Error monitoring setup (optional)

## Troubleshooting
- Ensure all environment variables are set correctly
- Check Vercel function logs for errors
- Verify database connection string
- Confirm Prisma client generation