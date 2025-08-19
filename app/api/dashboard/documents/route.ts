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

    const [resumes, coverLetters] = await Promise.all([
      prisma.resume.findMany({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, template: true, createdAt: true, updatedAt: true },
      }),
      prisma.coverLetter.findMany({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
        select: { id: true, company: true, jobTitle: true, createdAt: true, updatedAt: true },
      }),
    ])

    const documents = [
      ...resumes.map((r) => ({
        id: r.id,
        title: r.title,
        type: "resume" as const,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        status: "completed" as const,
        template: r.template ?? undefined,
      })),
      ...coverLetters.map((c) => ({
        id: c.id,
        title: `Cover Letter${c.company ? ` - ${c.company}` : ""}`,
        type: "cover-letter" as const,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        status: "completed" as const,
        company: c.company ?? undefined,
        jobTitle: c.jobTitle ?? undefined,
      })),
    ]

    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error("[dashboard/documents]", error)
    return NextResponse.json({ message: "Failed to fetch documents" }, { status: 500 })
  }
}
