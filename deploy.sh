#!/bin/bash

# ResumeAI Deployment Script for Vercel with Neon PostgreSQL

echo "🚀 ResumeAI Deployment Script (Neon PostgreSQL)"
echo "================================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Generate a secure JWT secret if not provided
echo "🔑 Generating JWT secret..."
JWT_SECRET=$(openssl rand -base64 32)
echo "Generated JWT secret: $JWT_SECRET"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

# Set environment variables
echo "⚙️  Setting up environment variables..."

echo "🔑 Environment variables setup required:"
echo ""
echo "CRITICAL: Set these in your Vercel dashboard:"
echo "1. DATABASE_URL=postgresql://neondb_owner:npg_PSa14LuoAiOb@ep-young-water-adnjsygu-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo "2. JWT_SECRET=$JWT_SECRET"
echo "3. OPENROUTER_API_KEY=your-openrouter-api-key"
echo "4. OPENROUTER_MODEL=google/gemma-3-27b-it:free"
echo "5. NEXT_PUBLIC_SITE_URL=https://resumai-ai.vercel.app"
echo ""
echo "⚠️  IMPORTANT: The register API error is likely due to missing environment variables"
echo "   in production. Please ensure all variables are set in Vercel dashboard."

# Ask if user wants to set them via CLI
read -p "Would you like to set environment variables via CLI? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Setting environment variables..."
    
    read -p "Enter your OpenRouter API key: " OPENROUTER_KEY
    vercel env add OPENROUTER_API_KEY production <<< "$OPENROUTER_KEY"
    
    vercel env add OPENROUTER_MODEL production <<< "google/gemma-3-27b-it:free"
    vercel env add JWT_SECRET production <<< "$JWT_SECRET"
    
    read -p "Enter your database URL: " DB_URL
    vercel env add DATABASE_URL production <<< "$DB_URL"
    
    # Get the Vercel URL and set it
    VERCEL_URL=$(vercel inspect --scope=personal 2>/dev/null | grep "url:" | head -1 | cut -d'"' -f4)
    if [ ! -z "$VERCEL_URL" ]; then
        vercel env add NEXT_PUBLIC_SITE_URL production <<< "https://$VERCEL_URL"
    fi
    
    echo "✅ Environment variables set successfully!"
    echo "🔄 Triggering a redeploy..."
    vercel --prod
fi

echo ""
echo "🎉 Deployment complete!"
echo "📋 Next steps:"
echo "1. Set up your database (PlanetScale/Neon recommended)"
echo "2. Run database migrations"
echo "3. Test your application"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"