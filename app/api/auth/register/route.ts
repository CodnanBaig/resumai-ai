import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, createSessionToken } from "@/lib/auth"
import { z } from "zod"

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { name, email, password } = RegisterSchema.parse(json)

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 })
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({ data: { name, email, passwordHash } })

    // Create session token
    const token = await createSessionToken({ userId: user.id, email: user.email })

    // Set session cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name } 
    })
    
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error: any) {
    // Log the error for debugging
    console.error("Registration error:", error)
    
    // Handle specific error types
    if (error?.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input", error: error.errors }, { status: 400 })
    }
    
    // Handle Prisma errors
    if (error?.code) {
      console.error("Database error code:", error.code)
      console.error("Database error message:", error.message)
      
      // Handle unique constraint violation
      if (error.code === "P2002") {
        return NextResponse.json({ message: "User already exists" }, { status: 409 })
      }
      
      // Handle connection errors
      if (error.code === "P1001" || error.code === "P1013") {
        return NextResponse.json({ 
          message: "Database connection error", 
          error: "Unable to connect to the database" 
        }, { status: 500 })
      }
    }
    
    // Generic error response
    return NextResponse.json({ 
      message: "Internal server error", 
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    }, { status: 500 })
  }
}
