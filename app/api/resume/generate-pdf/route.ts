import { type NextRequest, NextResponse } from "next/server"
import { createResumePdfBuffer } from "@/lib/pdf/resume-pdf"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const auth = request.cookies.get("session")?.value
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(auth)

    const { resumeData, template, resumeId } = await request.json()

    let data = resumeData
    if (!data && resumeId) {
      const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: session.userId } })
      if (!resume) return NextResponse.json({ message: "Resume not found" }, { status: 404 })
      data = {
        personalInfo: resume.personalInfo as any,
        skills: (resume.skills as any) ?? [],
        workExperience: resume.workExperience as any,
        education: resume.education as any,
      }
    }

    if (!data) return NextResponse.json({ message: "No resume data provided" }, { status: 400 })

    const pdfBuffer = await createResumePdfBuffer({ resumeData: data, template })
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${resumeId || Date.now()}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    })
  } catch (error) {
    console.error("[pdf] Error generating PDF:", error)
    return NextResponse.json({ message: "Failed to generate PDF" }, { status: 500 })
  }
}
