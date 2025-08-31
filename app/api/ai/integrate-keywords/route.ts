import { type NextRequest, NextResponse } from "next/server"

// Fallback function for basic keyword integration
function basicKeywordIntegration(resumeData: any, selectedKeywords: string[]) {
  const enhancedResume = JSON.parse(JSON.stringify(resumeData)) // Deep clone
  const keywordPlacements: any[] = []
  
  // Add keywords to skills if skills array exists
  if (enhancedResume.skills && Array.isArray(enhancedResume.skills)) {
    const newSkills = selectedKeywords.filter(keyword => 
      !enhancedResume.skills.some((skill: string) => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    
    enhancedResume.skills.push(...newSkills)
    
    newSkills.forEach(keyword => {
      keywordPlacements.push({
        keyword,
        section: "skills",
        location: "Skills section",
        context: `Added ${keyword} to skills list`
      })
    })
  }
  
  // Add keywords to summary if it exists
  if (enhancedResume.personalInfo?.summary) {
    const summaryKeywords = selectedKeywords.slice(0, 2) // Take first 2 keywords
    summaryKeywords.forEach(keyword => {
      if (!enhancedResume.personalInfo.summary.toLowerCase().includes(keyword.toLowerCase())) {
        enhancedResume.personalInfo.summary += ` Experienced with ${keyword}.`
        keywordPlacements.push({
          keyword,
          section: "summary",
          location: "Professional summary",
          context: `Integrated ${keyword} into professional summary`
        })
      }
    })
  }
  
  return {
    enhancedResume,
    keywordPlacements,
    integrationSummary: `Successfully integrated ${keywordPlacements.length} keywords using basic integration method.`
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication first
    const sessionToken = request.cookies.get("session")?.value
    if (!sessionToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { verifySessionToken } = await import("@/lib/auth")
    const session = await verifySessionToken(sessionToken)

    const { resumeId, resumeData, selectedKeywords } = await request.json()

    if (!selectedKeywords || selectedKeywords.length === 0) {
      return NextResponse.json({ message: "No keywords selected" }, { status: 400 })
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || "google/gemma-3-27b-it:free" // Use same reliable model as other endpoints

    if (!openRouterApiKey) {
      console.log("[keyword-integration] No API key, using fallback integration")
      const fallbackResult = basicKeywordIntegration(resumeData, selectedKeywords)
      
      return NextResponse.json({
        success: true,
        enhancementType: "keyword-integration",
        result: fallbackResult.enhancedResume,
        keywordPlacements: fallbackResult.keywordPlacements,
        integrationSummary: fallbackResult.integrationSummary,
        integratedKeywords: selectedKeywords,
      })
    }

    const prompt = `You are a professional resume writer. I need you to integrate the following keywords into this resume in a natural and strategic way:

KEYWORDS TO INTEGRATE: ${selectedKeywords.join(", ")}

CURRENT RESUME DATA: ${JSON.stringify(resumeData, null, 2)}

REQUIREMENTS:
1. Integrate each keyword naturally into the most relevant sections
2. Keywords should fit contextually and not feel forced
3. Prioritize placement in: skills, work experience descriptions, summary, and project descriptions
4. Maintain professional tone and readability
5. Keep existing content structure and don't remove important information
6. For each keyword added, track which section it was added to

IMPORTANT INSTRUCTIONS:
- Return ONLY valid JSON without any markdown formatting, explanations, or additional text
- Escape all quotes properly in JSON strings
- Do not include code blocks or markdown
- Ensure all JSON strings are properly terminated

RESPONSE FORMAT (return exactly this structure):
{
  "enhancedResume": { /* complete updated resume with keywords integrated */ },
  "keywordPlacements": [
    {
      "keyword": "keyword name",
      "section": "section name",
      "location": "specific description",
      "context": "brief explanation"
    }
  ],
  "integrationSummary": "Brief summary of the integration process"
}`

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
            content: "You are a professional resume writer specializing in keyword optimization and ATS compatibility. You integrate keywords naturally while maintaining professional quality and readability. You MUST respond with valid JSON only - no markdown, no explanations, no code blocks. Ensure all JSON strings are properly escaped and terminated. Never include backticks, markdown formatting, or any text outside the JSON object."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2, // Very low temperature for more consistent JSON output
        max_tokens: 4000,
        response_format: { type: "json_object" } // Force JSON response if supported
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[keyword-integration] OpenRouter API error:", errorData)
      
      // Use fallback integration instead of failing
      console.log("[keyword-integration] Using fallback due to API error")
      const fallbackResult = basicKeywordIntegration(resumeData, selectedKeywords)
      
      return NextResponse.json({
        success: true,
        enhancementType: "keyword-integration",
        result: fallbackResult.enhancedResume,
        keywordPlacements: fallbackResult.keywordPlacements,
        integrationSummary: fallbackResult.integrationSummary + " (Basic integration used due to AI service issue)",
        integratedKeywords: selectedKeywords,
      })
    }

    const aiResponse = await response.json()
    const enhancedContent = aiResponse.choices[0]?.message?.content

    if (!enhancedContent) {
      return NextResponse.json({ message: "No enhancement generated" }, { status: 500 })
    }

    // Clean the response to remove any markdown formatting or extra text
    let cleanedContent = enhancedContent.trim()
    
    // Remove markdown code blocks if present
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    
    // Find the JSON object in the response (in case there's extra text)
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      cleanedContent = jsonMatch[0]
    }

    // Parse the AI response
    let result: any
    try {
      result = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error("[keyword-integration] Failed to parse AI response:", parseError)
      console.error("[keyword-integration] Raw response:", enhancedContent)
      console.error("[keyword-integration] Cleaned response:", cleanedContent)
      
      // Fallback: try to create a basic structure with the original resume
      console.log("[keyword-integration] Using fallback basic integration")
      
      const fallbackResult = basicKeywordIntegration(resumeData, selectedKeywords)
      
      // Continue with the fallback result
      result = fallbackResult
    }

    // Validate the response structure
    if (!result.enhancedResume || !result.keywordPlacements) {
      console.log("[keyword-integration] Invalid AI response structure, using fallback")
      const fallbackResult = basicKeywordIntegration(resumeData, selectedKeywords)
      result = fallbackResult
    }

    // Persist the enhanced resume to the database if resumeId is provided
    if (resumeId) {
      try {
        const { prisma } = await import("@/lib/db")
        
        console.log("[keyword-integration] Persisting to database for resumeId:", resumeId)
        console.log("[keyword-integration] Enhanced result:", result.enhancedResume)
        
        // Create update data object with all enhanced fields, properly serializing them
        const updateData: Record<string, unknown> = {}
        const enhanced = result.enhancedResume
        
        // Update core fields if they exist in the enhanced result (serialize as JSON strings)
        if (enhanced.personalInfo) {
          updateData.personalInfo = JSON.stringify(enhanced.personalInfo)
          console.log("[keyword-integration] Updating personalInfo:", enhanced.personalInfo)
        }
        if (enhanced.skills) {
          updateData.skills = JSON.stringify(enhanced.skills)
          console.log("[keyword-integration] Updating skills:", enhanced.skills)
        }
        if (enhanced.workExperience) {
          updateData.workExperience = JSON.stringify(enhanced.workExperience)
          console.log("[keyword-integration] Updating workExperience:", enhanced.workExperience)
        }
        if (enhanced.education) {
          updateData.education = JSON.stringify(enhanced.education)
        }
        if (enhanced.content) {
          updateData.content = JSON.stringify(enhanced.content)
        }
        
        // Preserve additional fields if they exist in the enhanced result
        if (enhanced.certifications) updateData.certifications = JSON.stringify(enhanced.certifications)
        if (enhanced.projects) updateData.projects = JSON.stringify(enhanced.projects)
        if (enhanced.languages) updateData.languages = JSON.stringify(enhanced.languages)
        if (enhanced.socialLinks) updateData.socialLinks = JSON.stringify(enhanced.socialLinks)
        if (enhanced.interests) updateData.interests = JSON.stringify(enhanced.interests)
        
        console.log("[keyword-integration] Update data:", updateData)
        
        // Only update if we have data to update
        if (Object.keys(updateData).length > 0) {
          const updateResult = await prisma.resume.update({
            where: { id: resumeId, userId: session.userId },
            data: updateData,
          })
          console.log("[keyword-integration] Database update successful:", updateResult.id)
        } else {
          console.warn("[keyword-integration] No data to update")
        }
      } catch (err) {
        console.error("[keyword-integration] Database update error:", err)
        // Don't fail the request if database update fails
      }
    }

    return NextResponse.json({
      success: true,
      enhancementType: "keyword-integration",
      result: result.enhancedResume,
      keywordPlacements: result.keywordPlacements,
      integrationSummary: result.integrationSummary,
      integratedKeywords: selectedKeywords,
    })
  } catch (error) {
    console.error("[keyword-integration] Error:", error)
    return NextResponse.json({ message: "Failed to integrate keywords" }, { status: 500 })
  }
}