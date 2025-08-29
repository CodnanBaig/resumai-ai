import { type NextRequest, NextResponse } from "next/server"
import { createResumePdfBuffer } from "@/lib/pdf/resume-pdf-playwright" // Using Playwright for better template support
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"
import { parseJsonField } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const auth = request.cookies.get("session")?.value
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(auth)

    const { resumeData, template, resumeId, accentColor } = await request.json()

    let data = resumeData
    
    // Always fetch the latest data from database if resumeId is provided
    if (resumeId) {
      const resume = await prisma.resume.findFirst({ 
        where: { id: resumeId, userId: session.userId },
        select: {
          personalInfo: true,
          skills: true,
          workExperience: true,
          education: true,
          certifications: true,
          projects: true,
          languages: true,
          socialLinks: true,
          interests: true,
          content: true
        }
      })
      
      if (!resume) {
        return NextResponse.json({ message: "Resume not found" }, { status: 404 })
      }
      
      // Parse JSON fields and ensure data completeness
      data = {
        personalInfo: parseJsonField(resume.personalInfo) || {},
        skills: parseJsonField(resume.skills) || [],
        workExperience: parseJsonField(resume.workExperience) || [],
        education: parseJsonField(resume.education) || [],
        certifications: parseJsonField(resume.certifications) || [],
        projects: parseJsonField(resume.projects) || [],
        languages: parseJsonField(resume.languages) || [],
        socialLinks: parseJsonField(resume.socialLinks) || [],
        interests: parseJsonField(resume.interests) || [],
      }
    }

    if (!data || !data.personalInfo) {
      return NextResponse.json({ message: "No valid resume data provided" }, { status: 400 })
    }

    // Validate that essential data exists
    if (!data.personalInfo.fullName) {
      return NextResponse.json({ message: "Resume must have a full name" }, { status: 400 })
    }

    const pdfBuffer = await createResumePdfBuffer({ resumeData: data, template, accentColor })
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
