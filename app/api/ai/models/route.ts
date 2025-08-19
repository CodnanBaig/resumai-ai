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

    // Filter for free models suitable for resume enhancement
    const freeModels = models.data.filter(
      (model: any) =>
        model.pricing?.prompt === "0" || model.id.includes("gpt-3.5-turbo") || model.id.includes("mistral-7b-instruct"),
    )

    return NextResponse.json({
      success: true,
      models: freeModels,
      recommended: ["openai/gpt-3.5-turbo", "mistralai/mistral-7b-instruct", "meta-llama/llama-3.2-3b-instruct:free"],
    })
  } catch (error) {
    console.error("[v0] Error fetching models:", error)
    return NextResponse.json({ message: "Failed to fetch models" }, { status: 500 })
  }
}
