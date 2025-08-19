import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"

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
      prisma.resume.count({ where: { userId: session.userId } }),
      prisma.resume.findMany({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          title: true,
          template: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error("[resume list]", error)
    return NextResponse.json({ message: "Failed to fetch resumes" }, { status: 500 })
  }
}


