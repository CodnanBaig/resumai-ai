import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, Mail, Sparkles } from "lucide-react"

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Create Resume</CardTitle>
          </div>
          <CardDescription className="text-sm">Start building a new resume from scratch</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Link href="/resume/new">
            <Button className="w-full">Create New</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Upload Resume</CardTitle>
          </div>
          <CardDescription className="text-sm">Upload an existing resume to enhance with AI</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Link href="/resume/upload">
            <Button variant="outline" className="w-full bg-transparent">
              Upload File
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Cover Letter</CardTitle>
          </div>
          <CardDescription className="text-sm">Generate a tailored cover letter for a job</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Link href="/cover-letter/new">
            <Button variant="outline" className="w-full bg-transparent">
              Generate Letter
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">AI Templates</CardTitle>
          </div>
          <CardDescription className="text-sm">Browse professional resume templates</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button variant="outline" className="w-full bg-transparent" disabled>
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
