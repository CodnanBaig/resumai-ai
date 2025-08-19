import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyPassword, createSessionToken } from "@/lib/auth"
import { z } from "zod"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { email, password } = LoginSchema.parse(json)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = await createSessionToken({ userId: user.id, email: user.email })
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 })
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
