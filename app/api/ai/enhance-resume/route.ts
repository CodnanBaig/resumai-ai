import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const sessionToken = request.cookies.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { verifySessionToken } = await import("@/lib/auth")
    const session = await verifySessionToken(sessionToken)

    const { resumeData, jobDescription, enhancementType, resumeId, customPrompt } = await request.json()

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || "google/gemma-3-27b-it:free"

    if (!openRouterApiKey) {
      return NextResponse.json(
        { message: "AI enhancement service is currently unavailable. Please try again later." },
        { status: 500 },
      )
    }

    let prompt = ""

    if (customPrompt) {
      // Use custom prompt for inline enhancement
      prompt = customPrompt
    } else {
      // Use predefined prompts for the dialog enhancement
      switch (enhancementType) {
        case "improve":
          prompt = `Please improve this resume content to make it more professional, concise, and impactful. Focus on:
          1. Strengthening action verbs and quantifying achievements
          2. Making content shorter and more snappy
          3. Adding relevant industry keywords
          4. Using bullet points for key highlights
          5. Keeping descriptions brief and scannable

          Resume Data: ${JSON.stringify(resumeData, null, 2)}

          Return the enhanced resume in the same JSON format with shorter, bullet-point content.`
          break

        case "tailor":
          prompt = `Please tailor this resume to match the following job description. Focus on:
          1. Highlighting relevant skills and experience
          2. Adding keywords from the job description
          3. Emphasizing matching qualifications
          4. Making content concise and bullet-point focused
          5. Keeping descriptions short and impactful

          Job Description: ${jobDescription}
          
          Resume Data: ${JSON.stringify(resumeData, null, 2)}

          Return the tailored resume in the same JSON format with shorter, bullet-point content.`
          break

        case "keywords":
          prompt = `Analyze this resume and suggest industry-relevant keywords that should be added. Focus on:
          1. Technical skills relevant to the field
          2. Industry-specific terminology
          3. Action verbs that demonstrate impact
          4. Certifications or qualifications commonly sought

          Resume Data: ${JSON.stringify(resumeData, null, 2)}

          Return a JSON object with: { "suggestedKeywords": ["keyword1", "keyword2", ...], "recommendations": "Brief explanation of why these keywords are important (max 2 sentences)" }`
          break

        default:
          return NextResponse.json({ message: "Invalid enhancement type" }, { status: 400 })
      }
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
              "You are a professional resume writer and career coach. Generate ONLY clean, professional text without any markdown formatting, explanations, or commentary. Do not include bullet points (• or *), bold formatting (**text**), explanations, or meta-commentary. Provide clean text that can be directly copied into a resume field. Focus on concise, impactful sentences with strong action verbs and quantifiable achievements where possible.",
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
      try {
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
