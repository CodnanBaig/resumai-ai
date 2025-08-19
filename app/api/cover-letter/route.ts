import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(sessionToken)

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)))
    const skip = (page - 1) * pageSize

    const [total, items] = await Promise.all([
      prisma.coverLetter.count({ where: { userId: session.userId } }),
      prisma.coverLetter.findMany({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          company: true,
          jobTitle: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ])

    return NextResponse.json({ success: true, items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) })
  } catch (error) {
    console.error("[cover letter list]", error)
    return NextResponse.json({ message: "Failed to fetch cover letters" }, { status: 500 })
  }
}

const CoverLetterUpdateSchema = z.object({
  content: z.string().min(1),
  company: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
})

export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(sessionToken)

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 })

    const data = CoverLetterUpdateSchema.parse(await request.json())
    const updated = await prisma.coverLetter.update({ where: { id, userId: session.userId }, data })
    return NextResponse.json({ success: true, coverLetter: updated })
  } catch (error: any) {
    if (error?.name === "ZodError") return NextResponse.json({ message: "Invalid input" }, { status: 400 })
    console.error("[cover letter update]", error)
    return NextResponse.json({ message: "Failed to update cover letter" }, { status: 500 })
  }
}


