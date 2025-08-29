import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken, hashPassword } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { parseJsonField } from "@/lib/utils"
import { ResumeParser, ParsedResumeSchema } from "@/lib/resume-parser"

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

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.includes('text') && !file.type.includes('pdf') && !file.type.includes('word')) {
      return NextResponse.json({ 
        message: "Unsupported file type. Please upload a text file, PDF, or Word document." 
      }, { status: 400 })
    }

    let parsedData: any = {}
    let parsingErrors: string[] = []

    try {
      // Extract text from file
      const text = await ResumeParser.extractTextFromFile(file)
      
      // Parse the resume text
      const parser = new ResumeParser(text)
      parsedData = parser.parse()
      
      // Validate parsed data
      const validatedData = ParsedResumeSchema.parse(parsedData)
      parsedData = validatedData
      
    } catch (error) {
      console.error("[resume/upload] Parsing error:", error)
      parsingErrors.push(error instanceof Error ? error.message : "Unknown parsing error")
      
      // Continue with empty data if parsing fails
      parsedData = {
        personalInfo: {},
        skills: [],
        workExperience: [],
        education: []
      }
    }

    // Generate a title from the parsed data or use filename
    let title = file.name.replace(/\.[^/.]+$/, "") // Remove file extension
    if (parsedData.personalInfo?.fullName) {
      title = `${parsedData.personalInfo.fullName}'s Resume`
    }

    // Create resume in database with parsed data
    const created = await prisma.resume.create({
      data: {
        userId: user.id,
        title,
        template: "minimal", // Default template
        personalInfo: parsedData.personalInfo ? JSON.stringify(parsedData.personalInfo) : null,
        skills: parsedData.skills ? JSON.stringify(parsedData.skills) : null,
        workExperience: parsedData.workExperience ? JSON.stringify(parsedData.workExperience) : null,
        education: parsedData.education ? JSON.stringify(parsedData.education) : null,
        content: parsedData ? JSON.stringify(parsedData) : null, // Store the full parsed content
      },
      select: { 
        id: true,
        title: true,
        personalInfo: true,
        skills: true,
        workExperience: true,
        education: true
      },
    })

    // Parse JSON fields back to objects for the response
    const parsedCreated = {
      ...created,
      personalInfo: parseJsonField(created.personalInfo),
      skills: parseJsonField(created.skills),
      workExperience: parseJsonField(created.workExperience),
      education: parseJsonField(created.education),
    }

    return NextResponse.json({ 
      success: true, 
      id: created.id, 
      message: "Resume uploaded and parsed successfully",
      data: parsedCreated,
      parsingErrors: parsingErrors.length > 0 ? parsingErrors : undefined
    })
  } catch (error) {
    console.error("[resume/upload]", error)
    return NextResponse.json({ message: "Failed to upload resume" }, { status: 500 })
  }
}
