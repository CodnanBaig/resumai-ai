import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifySessionToken, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const auth = request.cookies.get("session")?.value
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(auth)

    // Ensure the session user exists to satisfy FK constraint
    let user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) {
      user = await prisma.user.findUnique({ where: { email: session.email } })
      if (!user) {
        const randomPassword = Math.random().toString(36).slice(2) + Date.now().toString(36)
        const passwordHash = await hashPassword(randomPassword)
        user = await prisma.user.create({ data: { id: session.userId, email: session.email, passwordHash } })
      }
    }

    const resumeData = await request.json()

    const created = await prisma.resume.create({
      data: {
        userId: user.id,
        title: resumeData?.title || "Untitled Resume",
        template: resumeData?.template || null,
        personalInfo: resumeData?.personalInfo ? JSON.stringify(resumeData.personalInfo) : null,
        skills: Array.isArray(resumeData?.skills) ? JSON.stringify(resumeData.skills) : null,
        workExperience: resumeData?.workExperience ? JSON.stringify(resumeData.workExperience) : null,
        education: resumeData?.education ? JSON.stringify(resumeData.education) : null,
        certifications: Array.isArray(resumeData?.certifications) ? JSON.stringify(resumeData.certifications) : null,
        projects: Array.isArray(resumeData?.projects) ? JSON.stringify(resumeData.projects) : null,
        languages: Array.isArray(resumeData?.languages) ? JSON.stringify(resumeData.languages) : null,
        socialLinks: Array.isArray(resumeData?.socialLinks) ? JSON.stringify(resumeData.socialLinks) : null,
        interests: Array.isArray(resumeData?.interests) ? JSON.stringify(resumeData.interests) : null,
        content: resumeData?.content ? JSON.stringify(resumeData.content) : null,
      },
      select: { id: true },
    })

    return NextResponse.json({ success: true, id: created.id, message: "Resume created successfully" })
  } catch (error) {
    console.error("[resume/create]", error)
    return NextResponse.json({ message: "Failed to create resume" }, { status: 500 })
  }
}
