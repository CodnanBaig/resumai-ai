const { Client } = require('pg');

// Load environment variables
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not found');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  // Print the connection string (without password) for debugging
  const urlWithoutPassword = process.env.DATABASE_URL.replace(/:[^:@/]*@/, ':***@');
  console.log('Connection string:', urlWithoutPassword);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('✅ Successfully connected to the database');
    
    // Test with a simple query
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    await client.end();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Error code:', err.code);
    if (err.code === 'ECONNREFUSED') {
      console.error('This usually means the database server is not accepting connections.');
      console.error('Please check if your Neon database is active and not paused.');
    }
    console.error('Stack trace:', err.stack);
    process.exit(1);
  }
}

testConnection();