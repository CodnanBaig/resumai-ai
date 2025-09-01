#!/usr/bin/env node

// Simple script to run database migrations
const { execSync } = require('child_process');

console.log('🚀 Starting database migration...');

try {
  // Run Prisma migrations
  console.log('📦 Applying database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  // Generate Prisma Client
  console.log('🔨 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Database migration completed successfully!');
} catch (error) {
  console.error('❌ Database migration failed:', error.message);
  process.exit(1);
}