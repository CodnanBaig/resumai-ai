import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const auth = request.cookies.get("session")?.value
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(auth)

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    // TODO: Parse resume file into structured data
    const created = await prisma.resume.create({
      data: {
        userId: session.userId,
        title: file.name || "Uploaded Resume",
        template: null,
        personalInfo: null,
        skills: [],
        workExperience: null,
        education: null,
        content: null,
      },
      select: { id: true },
    })

    return NextResponse.json({ success: true, id: created.id, message: "Resume uploaded successfully" })
  } catch (error) {
    console.error("[resume/upload]", error)
    return NextResponse.json({ message: "Failed to upload resume" }, { status: 500 })
  }
}
