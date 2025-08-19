import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionToken = _request.cookies.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(sessionToken)

    const letter = await prisma.coverLetter.findFirst({ where: { id, userId: session.userId } })
    if (!letter) return NextResponse.json({ message: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true, coverLetter: letter })
  } catch (error) {
    console.error("[cover-letter/:id GET]", error)
    return NextResponse.json({ message: "Failed to fetch cover letter" }, { status: 500 })
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

    await prisma.coverLetter.delete({ where: { id, userId: session.userId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[cover-letter/:id DELETE]", error)
    return NextResponse.json({ message: "Failed to delete cover letter" }, { status: 500 })
  }
}


