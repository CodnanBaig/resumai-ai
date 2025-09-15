import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CoverLetterActions } from "@/components/cover-letter-actions"
import { prisma } from "@/lib/db"
import { verifySessionToken } from "@/lib/auth"

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    redirect("/login")
  }
  
  return session.value
}

export default async function CoverLetterViewPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const sessionToken = await checkAuth()
  const { id } = await params

  // Verify session and fetch cover letter data
  const session = await verifySessionToken(sessionToken)
  const coverLetter = await prisma.coverLetter.findFirst({
    where: { 
      id, 
      userId: session.userId 
    },
    include: {
      resume: {
        select: {
          title: true
        }
      }
    }
  })

  if (!coverLetter) {
    redirect("/dashboard")
  }

  const coverLetterData = {
    id: coverLetter.id,
    companyName: coverLetter.company || "Company",
    jobTitle: coverLetter.jobTitle || "Position",
    content: coverLetter.content,
    createdAt: coverLetter.createdAt.toLocaleDateString(),
    resumeId: coverLetter.resumeId,
    resumeTitle: coverLetter.resume?.title || "Resume"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <h1 className="text-xl font-semibold text-foreground">ResumeAI</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cover Letter</h1>
          <p className="text-muted-foreground">
            {coverLetterData.jobTitle} at {coverLetterData.companyName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter Content</CardTitle>
                <CardDescription>Review and edit your generated cover letter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-8 font-serif leading-relaxed">
                  <div className="whitespace-pre-line text-gray-900">{coverLetterData.content}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CoverLetterActions
                  coverLetterId={id}
                  content={coverLetterData.content}
                  companyName={coverLetterData.companyName}
                  jobTitle={coverLetterData.jobTitle}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Company</p>
                  <p className="text-sm text-muted-foreground">{coverLetterData.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Position</p>
                  <p className="text-sm text-muted-foreground">{coverLetterData.jobTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Created</p>
                  <p className="text-sm text-muted-foreground">{coverLetterData.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Based on Resume</p>
                  <p className="text-sm text-muted-foreground">{coverLetterData.resumeTitle}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
