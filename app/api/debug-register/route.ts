import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST() {
  try {
    console.log("Testing register flow...")
    
    // Test 1: Database connection
    console.log("1. Testing database connection...")
    await prisma.$connect()
    console.log("✓ Database connected")
    
    // Test 2: Check existing users
    console.log("2. Checking existing users...")
    const userCount = await prisma.user.count()
    console.log(`✓ User count: ${userCount}`)
    
    // Test 3: Check if test user exists
    console.log("3. Checking if test user exists...")
    const existing = await prisma.user.findUnique({ 
      where: { email: "debug@test.com" } 
    })
    console.log(`✓ Existing user: ${existing ? "found" : "not found"}`)
    
    // Test 4: Environment variables
    console.log("4. Checking environment variables...")
    const hasDbUrl = !!process.env.DATABASE_URL
    const hasJwtSecret = !!process.env.JWT_SECRET
    console.log(`✓ DATABASE_URL: ${hasDbUrl}`)
    console.log(`✓ JWT_SECRET: ${hasJwtSecret}`)
    
    return NextResponse.json({ 
      success: true,
      message: "All register prerequisites passed",
      checks: {
        database: true,
        userCount,
        existingUser: !!existing,
        environment: { hasDbUrl, hasJwtSecret }
      }
    })
  } catch (error: any) {
    console.error("Register test error:", error)
    console.error("Error details:", {
      name: error?.name,
      code: error?.code,
      message: error?.message,
      cause: error?.cause
    })
    
    return NextResponse.json({ 
      success: false,
      message: "Register test failed",
      error: error?.message || "Unknown error",
      details: {
        name: error?.name,
        code: error?.code,
        cause: error?.cause
      }
    }, { status: 500 })
  }
}