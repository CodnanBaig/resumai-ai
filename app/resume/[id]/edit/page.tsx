"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ResumeForm } from "@/components/resume-form"
import { MobileNavigation } from "@/components/mobile-navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"

interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  current: boolean
}

interface Education {
  id: string
  school: string
  degree: string
  field: string
  graduationDate: string
}

interface ResumeData {
  id: string
  title: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
  }
  skills: string[]
  workExperience: WorkExperience[]
  education: Education[]
  template: string
}

export default function EditResumePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { toast } = useToast()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { id } = await params
        const response = await fetch(`/api/resume/${id}`, {
          credentials: 'include'
        })
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.resume) {
            setResumeData(result.resume)
          } else {
            throw new Error("Failed to fetch resume")
          }
        } else {
          throw new Error("Failed to fetch resume")
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load resume. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchResume()
  }, [params, toast])

  const handleSave = async (updatedData: any) => {
    if (!resumeData) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/resume/${resumeData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your resume has been updated successfully.",
        })
        // Redirect back to resume view page
        window.location.href = `/resume/${resumeData.id}`
      } else {
        throw new Error("Failed to update resume")
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Resume not found</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <Link href="/dashboard" className="text-xl sm:text-2xl font-bold text-gray-900">
                ResumeAI
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link href={`/resume/${resumeData.id}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Resume
                </Button>
              </Link>
              <Button 
                onClick={() => handleSave(resumeData)} 
                disabled={isSaving}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-responsive py-6 sm:py-8 lg:py-10">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="heading-mobile text-gray-900 mb-2">
            Edit Resume{resumeData.title ? `: ${resumeData.title}` : ""}
          </h1>
          <p className="text-mobile text-gray-600">
            Make changes to your resume and save your updates.
          </p>
        </div>

        {/* Resume Form */}
        <div className="max-w-4xl mx-auto">
          <ResumeForm 
            initialData={resumeData}
            isEditMode={true}
            onSave={handleSave}
          />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation />
      </main>
    </div>
  )
}
