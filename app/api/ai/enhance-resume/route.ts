import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobDescription, enhancementType, resumeId } = await request.json()

    // TODO: Add OpenRouter API key to environment variables
    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || "google/gemma-3-27b-it:free"

    if (!openRouterApiKey) {
      return NextResponse.json(
        { message: "OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    let prompt = ""

    switch (enhancementType) {
      case "improve":
        prompt = `Please improve this resume content to make it more professional and impactful. Focus on:
        1. Strengthening action verbs and quantifying achievements
        2. Improving clarity and conciseness
        3. Adding relevant industry keywords
        4. Enhancing the professional summary

        Resume Data: ${JSON.stringify(resumeData, null, 2)}

        Return the enhanced resume in the same JSON format.`
        break

      case "tailor":
        prompt = `Please tailor this resume to match the following job description. Focus on:
        1. Highlighting relevant skills and experience
        2. Adding keywords from the job description
        3. Emphasizing matching qualifications
        4. Adjusting the professional summary to align with the role

        Job Description: ${jobDescription}
        
        Resume Data: ${JSON.stringify(resumeData, null, 2)}

        Return the tailored resume in the same JSON format.`
        break

      case "keywords":
        prompt = `Analyze this resume and suggest industry-relevant keywords that should be added. Focus on:
        1. Technical skills relevant to the field
        2. Industry-specific terminology
        3. Action verbs that demonstrate impact
        4. Certifications or qualifications commonly sought

        Resume Data: ${JSON.stringify(resumeData, null, 2)}

        Return a JSON object with: { "suggestedKeywords": ["keyword1", "keyword2", ...], "recommendations": "explanation of why these keywords are important" }`
        break

      default:
        return NextResponse.json({ message: "Invalid enhancement type" }, { status: 400 })
    }

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
          {
            role: "system",
            content:
              "You are a professional resume writer and career coach. Provide helpful, accurate, and professional advice for improving resumes.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] OpenRouter API error:", errorData)
      return NextResponse.json({ message: "AI service temporarily unavailable" }, { status: 503 })
    }

    const aiResponse = await response.json()
    const enhancedContent = aiResponse.choices[0]?.message?.content

    if (!enhancedContent) {
      return NextResponse.json({ message: "No enhancement generated" }, { status: 500 })
    }

    // Try to parse JSON response for improve/tailor, return raw for keywords
    let result: Record<string, unknown>
    try {
      result = JSON.parse(enhancedContent)
    } catch {
      // If not valid JSON, return as text (for keywords suggestions)
      result = { content: enhancedContent }
    }

    // Optionally persist enhancement into an existing resume
    if (resumeId && (enhancementType === "improve" || enhancementType === "tailor") && result) {
      const token = request.cookies.get("session")?.value
      if (token) {
        try {
          const { verifySessionToken } = await import("@/lib/auth")
          const session = await verifySessionToken(token)
          const { prisma } = await import("@/lib/db")
          await prisma.resume.update({
            where: { id: resumeId, userId: session.userId },
            data: {
              personalInfo: result.personalInfo ?? undefined,
              skills: result.skills ?? undefined,
              workExperience: result.workExperience ?? undefined,
              education: result.education ?? undefined,
              content: result.content ?? undefined,
            },
          })
        } catch (err) {
          console.warn("[ai/enhance-resume] Could not persist enhancement:", err)
        }
      }
    }

    return NextResponse.json({
      success: true,
      enhancementType,
      result,
    })
  } catch (error) {
    console.error("[v0] Error enhancing resume:", error)
    return NextResponse.json({ message: "Failed to enhance resume" }, { status: 500 })
  }
}
