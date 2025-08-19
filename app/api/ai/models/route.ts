import { NextResponse } from "next/server"

export async function GET() {
  try {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY

    if (!openRouterApiKey) {
      return NextResponse.json({ message: "OpenRouter API key not configured" }, { status: 500 })
    }

    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to fetch available models" }, { status: 503 })
    }

    const models = await response.json()

    // Filter for free models suitable for resume enhancement, prioritizing Gemma 3
    const freeModels = models.data.filter((m: { id: string; pricing?: { prompt: string } }) =>
      m.pricing?.prompt === "0" || m.id.includes("gemma-3") || m.id.endsWith(":free"),
    )

    return NextResponse.json({
      success: true,
      models: freeModels,
      recommended: [
        "google/gemma-3-27b-it:free",
        "google/gemma-3-12b-it:free",
        "google/gemma-3-4b-it:free",
      ],
    })
  } catch (error) {
    console.error("[v0] Error fetching models:", error)
    return NextResponse.json({ message: "Failed to fetch models" }, { status: 500 })
  }
}
