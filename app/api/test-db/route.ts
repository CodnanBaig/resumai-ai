import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    
    // Test user count
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      connected: result,
      userCount: userCount
    })
  } catch (error: any) {
    console.error("Database test error:", error)
    
    return NextResponse.json({ 
      success: false, 
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    }, { status: 500 })
  }
}