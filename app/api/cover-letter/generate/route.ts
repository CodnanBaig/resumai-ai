import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"
import { parseJsonField } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const auth = request.cookies.get("session")?.value
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(auth)

    const { resumeId, companyName, jobTitle, jobDescription, additionalInfo } = await request.json()

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || "google/gemma-3-27b-it:free"

    if (!openRouterApiKey) {
      return NextResponse.json(
        { message: "OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    // Optional: fetch resume data to enrich prompt
    const resume = resumeId
      ? await prisma.resume.findFirst({ where: { id: resumeId, userId: session.userId } })
      : null

    // Parse JSON fields from resume if it exists
    const parsedResume = resume ? {
      ...resume,
      personalInfo: parseJsonField(resume.personalInfo),
      skills: parseJsonField(resume.skills),
      workExperience: parseJsonField(resume.workExperience),
      education: parseJsonField(resume.education),
      content: parseJsonField(resume.content),
    } : null

    const prompt = `Write a professional cover letter for the following job application:

Company: ${companyName}
Job Title: ${jobTitle}
Job Description: ${jobDescription}

Applicant Resume Summary:
Name: ${session.email}
Summary: ${parsedResume?.personalInfo?.summary ?? ""}
Skills: ${Array.isArray(parsedResume?.skills) ? parsedResume.skills.join(", ") : ""}
Recent Experience: ${parsedResume?.workExperience?.[0]?.position ?? ""} at ${parsedResume?.workExperience?.[0]?.company ?? ""}
Education: ${parsedResume?.education?.[0]?.degree ?? ""} in ${parsedResume?.education?.[0]?.field ?? ""}

${additionalInfo ? `Additional Information: ${additionalInfo}` : ""}

Please write a compelling cover letter that:
1. Addresses the hiring manager professionally
2. Shows enthusiasm for the specific role and company
3. Highlights relevant experience and skills from the resume
4. Demonstrates knowledge of the company and role requirements
5. Includes a strong closing with call to action
6. Maintains a professional yet personable tone
7. Is approximately 3-4 paragraphs long

Format the response as a complete cover letter with proper business letter formatting.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "ResumeAI Builder",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a professional career coach and expert cover letter writer. Write compelling, personalized cover letters that help candidates stand out to employers." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenRouter API error:", errorData)
      return NextResponse.json({ message: "AI service temporarily unavailable" }, { status: 503 })
    }

    const aiResponse = await response.json()
    const coverLetterContent = aiResponse.choices[0]?.message?.content

    if (!coverLetterContent) {
      return NextResponse.json({ message: "No cover letter generated" }, { status: 500 })
    }

    const saved = await prisma.coverLetter.create({
      data: {
        userId: session.userId,
        resumeId: resume?.id ?? null,
        company: companyName ?? null,
        jobTitle: jobTitle ?? null,
        content: coverLetterContent,
      },
      select: { id: true },
    })

    return NextResponse.json({
      success: true,
      id: saved.id,
      content: coverLetterContent,
      companyName,
      jobTitle,
      resumeId: resume?.id ?? null,
    })
  } catch (error) {
    console.error("[v0] Error generating cover letter:", error)
    return NextResponse.json({ message: "Failed to generate cover letter" }, { status: 500 })
  }
}
