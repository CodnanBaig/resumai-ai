# 🚨 Production Register API Fix Guide

## Problem Identified
Your register API is returning internal server error because of configuration mismatch between:
1. **Neon PostgreSQL database** (which you're using)
2. **MySQL-configured Prisma schema** (what was deployed)
3. **Missing environment variables** in Vercel

## ✅ Solutions Applied

### 1. Updated Prisma Schema
- Fixed PostgreSQL compatibility issues
- Added proper indexes and constraints
- Added `@db.Text` for large fields
- Added cascade delete relationships

### 2. Regenerated Prisma Client
- Generated with correct PostgreSQL schema
- Fixed type definitions

## 🔧 Vercel Environment Variables Setup

**CRITICAL**: You must set these environment variables in your Vercel dashboard:

1. Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

2. Add these variables for **Production** environment:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_PSa14LuoAiOb@ep-young-water-adnjsygu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=your-secure-jwt-secret-minimum-32-characters-long-random-string

OPENROUTER_API_KEY=your-openrouter-api-key-from-openrouter.ai

OPENROUTER_MODEL=google/gemma-3-27b-it:free

NEXT_PUBLIC_SITE_URL=https://resumai-ai.vercel.app
```

## 🚀 Deployment Steps

### Option A: Auto-Deploy (Recommended)
1. Commit and push your changes to GitHub
2. Vercel will auto-deploy with the fixed schema

### Option B: Manual Deploy
```bash
# If you have Vercel CLI
vercel --prod

# Or redeploy from Vercel dashboard
```

## 🧪 Testing the Fix

After deployment, test the register API:

```bash
curl -X POST https://resumai-ai.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "testpassword123"
  }'
```

Expected success response:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

## 🔍 Troubleshooting

### If still getting errors:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions → View Logs
   - Look for detailed error messages

2. **Verify Environment Variables:**
   - Ensure all 5 variables are set correctly
   - No extra spaces or quotes

3. **Database Connection:**
   - Test your Neon connection string
   - Ensure database is active

### Common Error Messages:

- `P1001`: Database connection error → Check DATABASE_URL
- `JWT_SECRET not set`: Missing JWT_SECRET environment variable
- `ZodError`: Invalid input data format

## 📋 Checklist

- [ ] Environment variables set in Vercel
- [ ] Code deployed to production
- [ ] Register API test successful
- [ ] Database connection working
- [ ] Login functionality tested

## 🆘 If Still Not Working

1. Check Vercel function logs for specific error
2. Verify Neon database is active and accessible
3. Test environment variables are correctly set
4. Ensure latest code is deployed

The most common cause is missing `DATABASE_URL` or `JWT_SECRET` in Vercel environment variables.