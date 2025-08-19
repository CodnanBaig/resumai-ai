import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"
import { z } from "zod"

const ResumeUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  template: z.string().optional().nullable(),
  personalInfo: z.any().optional().nullable(),
  skills: z.any().optional().nullable(),
  workExperience: z.any().optional().nullable(),
  education: z.any().optional().nullable(),
  content: z.any().optional().nullable(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionToken = _request.cookies.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(sessionToken)

    const resume = await prisma.resume.findFirst({
      where: { id, userId: session.userId },
    })
    if (!resume) return NextResponse.json({ message: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true, resume })
  } catch (error) {
    console.error("[resume/:id GET]", error)
    return NextResponse.json({ message: "Failed to fetch resume" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionToken = request.cookies.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(sessionToken)

    const json = await request.json()
    const data = ResumeUpdateSchema.parse(json)

    const updated = await prisma.resume.update({
      where: { id, userId: session.userId },
      data,
    })
    return NextResponse.json({ success: true, resume: updated })
  } catch (error: any) {
    if (error?.name === "ZodError") return NextResponse.json({ message: "Invalid input" }, { status: 400 })
    console.error("[resume/:id PUT]", error)
    return NextResponse.json({ message: "Failed to update resume" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionToken = request.cookies.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(sessionToken)

    await prisma.resume.delete({ where: { id, userId: session.userId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[resume/:id DELETE]", error)
    return NextResponse.json({ message: "Failed to delete resume" }, { status: 500 })
  }
}


