import { NextResponse } from "next/server"

export async function GET() {
  try {
    // TODO: Fetch actual user statistics from database
    // For now, return mock data

    const stats = {
      totalResumes: 3,
      totalCoverLetters: 2,
      aiEnhancements: 5,
      totalDownloads: 8,
      recentActivity: [
        {
          id: "1",
          type: "resume_created",
          title: "Software Developer Resume",
          timestamp: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          type: "cover_letter_generated",
          title: "Cover Letter - Tech Innovations",
          timestamp: "2024-01-14T15:45:00Z",
        },
        {
          id: "3",
          type: "ai_enhancement",
          title: "Resume enhanced with AI",
          timestamp: "2024-01-13T09:20:00Z",
        },
      ],
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return NextResponse.json({ message: "Failed to fetch stats" }, { status: 500 })
  }
}
