import { NextResponse } from "next/server"

export async function GET() {
  try {
    // TODO: Fetch actual user documents from database
    // For now, return mock data

    const documents = [
      {
        id: "1",
        title: "Software Developer Resume",
        type: "resume",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        status: "completed",
        template: "minimal",
      },
      {
        id: "2",
        title: "Senior Developer Resume",
        type: "resume",
        createdAt: "2024-01-12T14:20:00Z",
        updatedAt: "2024-01-12T14:20:00Z",
        status: "completed",
        template: "corporate",
      },
      {
        id: "3",
        title: "Cover Letter - Tech Innovations",
        type: "cover-letter",
        company: "Tech Innovations Inc.",
        jobTitle: "Senior Software Engineer",
        createdAt: "2024-01-10T16:45:00Z",
        updatedAt: "2024-01-10T16:45:00Z",
        status: "completed",
      },
      {
        id: "4",
        title: "Cover Letter - StartupCorp",
        type: "cover-letter",
        company: "StartupCorp",
        jobTitle: "Full Stack Developer",
        createdAt: "2024-01-08T11:15:00Z",
        updatedAt: "2024-01-08T11:15:00Z",
        status: "draft",
      },
    ]

    return NextResponse.json({
      success: true,
      documents,
    })
  } catch (error) {
    console.error("[v0] Error fetching documents:", error)
    return NextResponse.json({ message: "Failed to fetch documents" }, { status: 500 })
  }
}
