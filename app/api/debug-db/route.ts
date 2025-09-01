import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    console.log("Testing database connection...")
    
    // Test basic connection
    await prisma.$connect()
    console.log("Prisma connection successful")
    
    // Test query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log("Query result:", result)
    
    // Test user table access
    const userCount = await prisma.user.count()
    console.log("User count:", userCount)
    
    return NextResponse.json({ 
      success: true,
      message: "All tests passed",
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Database connection error:", error)
    console.error("Error code:", error?.code)
    console.error("Error message:", error?.message)
    
    return NextResponse.json({ 
      success: false,
      message: "Database connection failed",
      error: error?.message || "Unknown error",
      code: error?.code || "NO_CODE"
    }, { status: 500 })
  }
}