import { type NextRequest, NextResponse } from "next/server"
import { createCoverLetterPdfBuffer } from "@/lib/pdf/cover-letter-pdf-playwright"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const auth = request.cookies.get("session")?.value
    if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    const session = await verifySessionToken(auth)

    const { coverLetterId, content, companyName, jobTitle } = await request.json()

    let coverLetterData = { content, companyName, jobTitle }
    
    // If coverLetterId is provided, fetch the actual data from database
    if (coverLetterId) {
      const coverLetter = await prisma.coverLetter.findFirst({ 
        where: { id: coverLetterId, userId: session.userId } 
      })
      if (!coverLetter) {
        return NextResponse.json({ message: "Cover letter not found" }, { status: 404 })
      }
      coverLetterData = {
        content: coverLetter.content,
        companyName: coverLetter.company || "Company",
        jobTitle: coverLetter.jobTitle || "Position"
      }
    }

    if (!coverLetterData.content) {
      return NextResponse.json({ message: "No cover letter content provided" }, { status: 400 })
    }

    const pdfBuffer = await createCoverLetterPdfBuffer(coverLetterData)
    
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cover-letter-${coverLetterData.companyName?.replace(/\s+/g, "-").toLowerCase() || "company"}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    })
  } catch (error) {
    console.error("[cover-letter PDF] Error generating PDF:", error)
    return NextResponse.json({ message: "Failed to generate PDF" }, { status: 500 })
  }
}
