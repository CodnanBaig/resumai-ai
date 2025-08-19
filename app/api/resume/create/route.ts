import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const auth = request.cookies.get("session")?.value
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(auth)

    const resumeData = await request.json()

    const created = await prisma.resume.create({
      data: {
        userId: session.userId,
        title: resumeData?.title || "Untitled Resume",
        template: resumeData?.template || null,
        personalInfo: resumeData?.personalInfo || null,
        skills: Array.isArray(resumeData?.skills) ? resumeData.skills : [],
        workExperience: resumeData?.workExperience || null,
        education: resumeData?.education || null,
        content: resumeData?.content || null,
      },
      select: { id: true },
    })

    return NextResponse.json({ success: true, id: created.id, message: "Resume created successfully" })
  } catch (error) {
    console.error("[resume/create]", error)
    return NextResponse.json({ message: "Failed to create resume" }, { status: 500 })
  }
}
