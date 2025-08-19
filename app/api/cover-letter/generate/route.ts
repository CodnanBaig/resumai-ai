import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeId, companyName, jobTitle, jobDescription, additionalInfo } = await request.json()

    const openRouterApiKey = process.env.OPENROUTER_API_KEY

    if (!openRouterApiKey) {
      return NextResponse.json(
        { message: "OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    // TODO: Fetch actual resume data from database
    const mockResumeData = {
      personalInfo: {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "(555) 123-4567",
        location: "New York, NY",
        summary: "Experienced software developer with 5+ years in web development",
      },
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
      workExperience: [
        {
          company: "Tech Corp",
          position: "Senior Developer",
          startDate: "2021-01",
          endDate: "",
          description: "Led development of web applications using React and Node.js",
          current: true,
        },
      ],
      education: [
        {
          school: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science",
          graduationDate: "2019-05",
        },
      ],
    }

    const prompt = `Write a professional cover letter for the following job application:

Company: ${companyName}
Job Title: ${jobTitle}
Job Description: ${jobDescription}

Applicant Resume Summary:
Name: ${mockResumeData.personalInfo.fullName}
Summary: ${mockResumeData.personalInfo.summary}
Skills: ${mockResumeData.skills.join(", ")}
Recent Experience: ${mockResumeData.workExperience[0]?.position} at ${mockResumeData.workExperience[0]?.company}
Education: ${mockResumeData.education[0]?.degree} in ${mockResumeData.education[0]?.field}

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
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional career coach and expert cover letter writer. Write compelling, personalized cover letters that help candidates stand out to employers.",
          },
          {
            role: "user",
            content: prompt,
          },
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

    // TODO: Save cover letter to database
    const mockCoverLetterId = Date.now().toString()

    console.log("[v0] Cover letter generated:", {
      id: mockCoverLetterId,
      companyName,
      jobTitle,
      resumeId,
    })

    return NextResponse.json({
      success: true,
      id: mockCoverLetterId,
      content: coverLetterContent,
      companyName,
      jobTitle,
      resumeId,
    })
  } catch (error) {
    console.error("[v0] Error generating cover letter:", error)
    return NextResponse.json({ message: "Failed to generate cover letter" }, { status: 500 })
  }
}
