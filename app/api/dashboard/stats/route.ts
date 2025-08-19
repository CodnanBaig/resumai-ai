import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(sessionToken)

    const [resumeCount, coverLetterCount] = await Promise.all([
      prisma.resume.count({ where: { userId: session.userId } }),
      prisma.coverLetter.count({ where: { userId: session.userId } }),
    ])

    // No activity table yet; return simple stats
    return NextResponse.json({
      success: true,
      stats: {
        totalResumes: resumeCount,
        totalCoverLetters: coverLetterCount,
        aiEnhancements: 0,
        totalDownloads: 0,
        recentActivity: [],
      },
    })
  } catch (error) {
    console.error("[dashboard/stats]", error)
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 })
  }
}
