import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CoverLetterActions } from "@/components/cover-letter-actions"

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    redirect("/login")
  }
}

export default async function CoverLetterViewPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  await checkAuth()
  const { id } = await params

  // TODO: Fetch actual cover letter data from database
  const mockCoverLetterData = {
    id,
    companyName: "Tech Innovations Inc.",
    jobTitle: "Senior Software Engineer",
    content: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at Tech Innovations Inc. With over 5 years of experience in web development and a proven track record of leading successful projects, I am excited about the opportunity to contribute to your innovative team.

In my current role as Senior Developer at Tech Corp, I have led the development of web applications using React and Node.js, directly aligning with the technical requirements outlined in your job posting. My expertise in JavaScript, Python, and SQL, combined with my Bachelor's degree in Computer Science from the University of Technology, positions me well to tackle the challenges and opportunities at Tech Innovations Inc.

What particularly excites me about this opportunity is Tech Innovations Inc.'s commitment to cutting-edge technology solutions and collaborative work environment. I am eager to bring my technical skills, leadership experience, and passion for innovation to help drive your company's continued success.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team. Thank you for considering my application, and I look forward to hearing from you soon.

Sincerely,
John Doe`,
    createdAt: "2024-01-15",
    resumeId: "1",
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
            {mockCoverLetterData.jobTitle} at {mockCoverLetterData.companyName}
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
                  <div className="whitespace-pre-line text-gray-900">{mockCoverLetterData.content}</div>
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
                  content={mockCoverLetterData.content}
                  companyName={mockCoverLetterData.companyName}
                  jobTitle={mockCoverLetterData.jobTitle}
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
                  <p className="text-sm text-muted-foreground">{mockCoverLetterData.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Position</p>
                  <p className="text-sm text-muted-foreground">{mockCoverLetterData.jobTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Created</p>
                  <p className="text-sm text-muted-foreground">{mockCoverLetterData.createdAt}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
