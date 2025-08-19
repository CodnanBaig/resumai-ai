"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AIEnhancementDialog } from "@/components/ai-enhancement-dialog"
import { TemplateSelector } from "@/components/template-selector"
import { PDFGenerator } from "@/components/pdf-generator"
import { MinimalTemplate } from "@/components/resume-templates/minimal-template"
import { useEffect, useState } from "react"

export default function ResumeViewPage({ params }: { params: Promise<{ id: string }> }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [id, setId] = useState<string>("")
  const [resumeData, setResumeData] = useState<any>(null)

  useEffect(() => {
    // Await params and set id
    const getParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    // Check authentication on client side
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
        
        if (!data.authenticated) {
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        window.location.href = '/login'
      }
    }

    checkAuth()
  }, [])

  // Mock resume data for now
  useEffect(() => {
    if (id) {
      setResumeData({
        personalInfo: {
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          summary: "Experienced software developer with expertise in modern web technologies."
        },
        skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
        workExperience: [
          {
            company: "Tech Corp",
            position: "Senior Developer",
            startDate: "2020-01",
            endDate: "",
            description: "Led development of multiple web applications using React and Node.js",
            current: true
          }
        ],
        education: [
          {
            school: "University of Technology",
            degree: "Bachelor of Science",
            field: "Computer Science",
            graduationDate: "2019-05"
          }
        ]
      })
    }
  }, [id])

  const handleEnhancementComplete = (enhancedData: any) => {
    setResumeData(enhancedData)
  }

  const handleTemplateSelect = (template: string) => {
    console.log('Template selected:', template)
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  if (!resumeData) {
    return <div>Loading resume...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              ResumeAI
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review and enhance your resume</h1>
          <p className="mt-2 text-gray-600">Make final adjustments and download your professional resume</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resume Preview</CardTitle>
                <CardDescription>Preview your resume with the selected template</CardDescription>
              </CardHeader>
              <CardContent>
                <MinimalTemplate resumeData={resumeData} />
              </CardContent>
            </Card>
          </div>

          {/* Actions and Styles */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Enhance and customize your resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AIEnhancementDialog 
                  resumeId={id} 
                  resumeData={resumeData} 
                  onEnhancementComplete={handleEnhancementComplete}
                />
                <TemplateSelector 
                  resumeData={resumeData} 
                  onTemplateSelect={handleTemplateSelect}
                />
                <PDFGenerator resumeData={resumeData} />
              </CardContent>
            </Card>

            {/* Styles */}
            <Card>
              <CardHeader>
                <CardTitle>Styles</CardTitle>
                <CardDescription>Choose your preferred design style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Clean and elegant</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Professional with structure</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Modern sidebar design</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
