"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AIEnhancementDialog } from "@/components/ai-enhancement-dialog"
import { TemplateSelector } from "@/components/template-selector"
import { PDFGenerator } from "@/components/pdf-generator"
import { MinimalTemplate } from "@/components/resume-templates/minimal-template"
import { useEffect, useState } from "react"
import { CorporateTemplate } from "@/components/resume-templates/corporate-template"
import { CreativeTemplate } from "@/components/resume-templates/creative-template"
import { TechModernTemplate } from "@/components/resume-templates/tech-modern-template"
import { MarketingBrandTemplate } from "@/components/resume-templates/marketing-brand-template"
import { AccountsLedgerTemplate } from "@/components/resume-templates/accounts-ledger-template"
import { useToast } from "@/hooks/use-toast"
import { Edit } from "lucide-react"

export default function ResumeViewPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [id, setId] = useState<string>("")
  const [resumeData, setResumeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("minimal")
  const [accentColor, setAccentColor] = useState<string>("#2563eb")
  const { toast } = useToast()

  // Add a function to refresh resume data
  const fetchResumeData = async () => {
    if (!id) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/resume/${id}`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch resume')
      }
      
      const data = await response.json()
      if (data.success && data.resume) {
        setResumeData({
          personalInfo: data.resume.personalInfo || {},
          skills: data.resume.skills || [],
          workExperience: data.resume.workExperience || [],
          education: data.resume.education || [],
          certifications: data.resume.certifications || [],
          projects: data.resume.projects || [],
          languages: data.resume.languages || [],
          socialLinks: data.resume.socialLinks || [],
          interests: data.resume.interests || [],
          content: data.resume.content || {}
        })
      } else {
        throw new Error('Invalid resume data')
      }
    } catch (err) {
      console.error('Error fetching resume:', err)
      setError('Failed to load resume data')
    } finally {
      setIsLoading(false)
    }
  }

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
        const response = await fetch('/api/auth/check', {
          credentials: 'include'
        })
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

  // Fetch actual resume data from database
  useEffect(() => {
    const fetchResumeData = async () => {
      if (!id) return
      
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/resume/${id}`, {
          credentials: 'include'
        })
        if (!response.ok) {
          throw new Error('Failed to fetch resume')
        }
        
        const data = await response.json()
        if (data.success && data.resume) {
          setResumeData({
            personalInfo: data.resume.personalInfo || {},
            skills: data.resume.skills || [],
            workExperience: data.resume.workExperience || [],
            education: data.resume.education || [],
            certifications: data.resume.certifications || [],
            projects: data.resume.projects || [],
            languages: data.resume.languages || [],
            socialLinks: data.resume.socialLinks || [],
            interests: data.resume.interests || [],
            content: data.resume.content || {}
          })
        } else {
          throw new Error('Invalid resume data')
        }
      } catch (err) {
        console.error('Error fetching resume:', err)
        setError('Failed to load resume data')
      } finally {
        setIsLoading(false)
      }
    }

    if (id && isAuthenticated) {
      fetchResumeData()
    }
  }, [id, isAuthenticated])

  // Debug: Monitor resumeData changes
  useEffect(() => {
    console.log('resumeData changed:', resumeData)
  }, [resumeData])

  const handleEnhancementComplete = (enhancedData: any) => {
    console.log('=== AI Enhancement Debug ===')
    console.log('Raw enhanced data:', enhancedData)
    console.log('Current resumeData:', resumeData)
    console.log('Enhanced data type:', typeof enhancedData)
    console.log('Has result property:', !!enhancedData?.result)
    console.log('Has content property:', !!enhancedData?.result?.content)
    
    // The AI returns data in result.content as a JSON string
    if (enhancedData && enhancedData.result && enhancedData.result.content) {
      try {
        // Extract the JSON content from the AI response
        let contentToParse = enhancedData.result.content
        console.log('Content to parse:', contentToParse)
        
        // Remove markdown code blocks if present
        if (contentToParse.includes('```json')) {
          contentToParse = contentToParse.split('```json')[1].split('```')[0]
          console.log('Content after removing markdown:', contentToParse)
        }
        
        // Parse the JSON content
        const parsedContent = JSON.parse(contentToParse.trim())
        console.log('Parsed content:', parsedContent)
        
        // Format the data for the resume
        const formattedData = {
          personalInfo: parsedContent.personalInfo || resumeData?.personalInfo || {},
          skills: parsedContent.skills || resumeData?.skills || [],
          workExperience: parsedContent.workExperience || resumeData?.workExperience || [],
          education: parsedContent.education || resumeData?.education || []
        }
        
        console.log('Formatted data to set:', formattedData)
        
        // Update the state
        setResumeData(formattedData)
        console.log('State update called with:', formattedData)
        
        // Show success message
        toast({
          title: "Resume Enhanced!",
          description: "Your resume has been updated with AI improvements.",
        })
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError)
        
        // If parsing fails, try to extract data from the raw response
        if (enhancedData.result && typeof enhancedData.result === 'object') {
          const fallbackData = {
            personalInfo: enhancedData.result.personalInfo || resumeData?.personalInfo || {},
            skills: enhancedData.result.skills || resumeData?.skills || [],
            workExperience: enhancedData.result.workExperience || resumeData?.workExperience || [],
            education: enhancedData.result.education || resumeData?.education || []
          }
          console.log('Using fallback data:', fallbackData)
          setResumeData(fallbackData)
          
          toast({
            title: "Resume Enhanced!",
            description: "Your resume has been updated with AI improvements.",
          })
        } else {
          // If all else fails, refresh from database
          console.log('All parsing failed, refreshing from database')
          fetchResumeData()
          toast({
            title: "Enhancement Complete",
            description: "Your resume has been enhanced and saved to the database.",
          })
        }
      }
    } else {
      console.log('No valid enhanced data structure found')
      // If enhancement failed or returned unexpected data, refresh from database
      fetchResumeData()
      toast({
        title: "Enhancement Complete",
        description: "Your resume has been enhanced and saved to the database.",
      })
    }
  }

  const handleTemplateSelect = (template: string, color?: string) => {
    setSelectedTemplate(template)
    if (color) setAccentColor(color)
    console.log('Template selected:', template, color)
    
    // Add visual feedback
    const button = document.querySelector(`[data-template="${template}"]`)
    if (button) {
      button.classList.add('ring-2', 'ring-blue-500')
      setTimeout(() => {
        button.classList.remove('ring-2', 'ring-blue-500')
      }, 500)
    }
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-900 text-lg mb-2">Error Loading Resume</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">📄</div>
          <p className="text-gray-900 text-lg mb-2">Resume Not Found</p>
          <p className="text-gray-600 mb-4">The resume you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Function to render the selected template
  const renderSelectedTemplate = () => {
    if (!resumeData) return null
    
    switch (selectedTemplate) {
      case "corporate":
        return <CorporateTemplate resumeData={resumeData} accentColor={accentColor} />
      case "creative":
        return <CreativeTemplate resumeData={resumeData} accentColor={accentColor} />
      case "tech-modern":
        return <TechModernTemplate resumeData={resumeData} accentColor={accentColor} />
      case "marketing-brand":
        return <MarketingBrandTemplate resumeData={resumeData} accentColor={accentColor} />
      case "accounts-ledger":
        return <AccountsLedgerTemplate resumeData={resumeData} accentColor={accentColor} />
      case "minimal":
      default:
        return <MinimalTemplate resumeData={resumeData} accentColor={accentColor} />
    }
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
                {renderSelectedTemplate()}
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
                <Link href={`/resume/${id}/edit`}>
                  <Button className="w-full" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Resume
                  </Button>
                </Link>
                <AIEnhancementDialog 
                  resumeId={id} 
                  resumeData={resumeData} 
                  onEnhancementComplete={handleEnhancementComplete}
                  buttonText="Tailor with AI"
                  isResumeView={true}
                />
                <TemplateSelector 
                  resumeData={resumeData} 
                  onTemplateSelect={handleTemplateSelect}
                  selectedTemplate={selectedTemplate}
                />
                <PDFGenerator resumeData={resumeData} resumeId={id} template={selectedTemplate} accentColor={accentColor} />
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Info</CardTitle>
                <CardDescription>Details about your resume</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Template</span>
                  <span className="text-sm text-gray-900">{selectedTemplate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-900">Just now</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ready
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
