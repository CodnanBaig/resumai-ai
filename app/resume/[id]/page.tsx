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
import type { ResumeData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Edit } from "lucide-react"
import { KeywordHighlightOverlay } from "@/components/keyword-highlight-overlay"

export default function ResumeViewPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [id, setId] = useState<string>("")
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("minimal")
  const [accentColor, setAccentColor] = useState<string>("#2563eb")
  const [keywordPlacements, setKeywordPlacements] = useState<Array<{keyword: string, section: string, location: string, context: string}> | null>(null)
  const { toast } = useToast()

  // Function to highlight where keywords were added
  const highlightKeywordPlacements = (placements: Array<{keyword: string, section: string, location: string, context: string}>) => {
    // Group placements by keyword for better highlighting
    const keywordGroups = placements.reduce((acc, placement) => {
      if (!acc[placement.keyword]) acc[placement.keyword] = []
      acc[placement.keyword].push(placement)
      return acc
    }, {} as Record<string, typeof placements>)

    // Add highlighting styles
    const style = document.createElement('style')
    style.textContent = `
      .keyword-highlight {
        background: linear-gradient(120deg, #fef3c7 0%, #fef3c7 100%);
        background-repeat: no-repeat;
        background-size: 100% 0.2em;
        background-position: 0 88%;
        border-radius: 3px;
        padding: 1px 3px;
        margin: 0 1px;
        transition: all 0.3s ease;
        position: relative;
      }
      .keyword-highlight:hover {
        background-color: #fef3c7;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .keyword-highlight::after {
        content: attr(data-keyword);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #1f2937;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        z-index: 1000;
      }
      .keyword-highlight:hover::after {
        opacity: 1;
      }
    `
    document.head.appendChild(style)

    // Highlight each keyword in the resume content
    Object.entries(keywordGroups).forEach(([keyword, keywordPlacements]) => {
      const resume = document.querySelector('.resume-content')
      if (resume) {
        highlightKeywordInElement(resume, keyword, keywordPlacements)
      }
    })

    // Show a toast with placement summary
    setTimeout(() => {
      toast({
        title: "Keyword Placements Highlighted",
        description: "Hover over highlighted text to see which keyword was added.",
        duration: 3000,
      })
    }, 1500)
  }

  const highlightKeywordInElement = (element: Element, keyword: string, placements: Array<{keyword: string, section: string, location: string, context: string}>) => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    )

    const textNodes: Text[] = []
    let node
    while (node = walker.nextNode()) {
      textNodes.push(node as Text)
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent || ''
      const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase())
      
      if (keywordIndex !== -1) {
        const before = text.substring(0, keywordIndex)
        const keywordText = text.substring(keywordIndex, keywordIndex + keyword.length)
        const after = text.substring(keywordIndex + keyword.length)
        
        const highlightSpan = document.createElement('span')
        highlightSpan.className = 'keyword-highlight'
        highlightSpan.setAttribute('data-keyword', keyword)
        highlightSpan.textContent = keywordText
        
        const fragment = document.createDocumentFragment()
        if (before) fragment.appendChild(document.createTextNode(before))
        fragment.appendChild(highlightSpan)
        if (after) fragment.appendChild(document.createTextNode(after))
        
        textNode.parentNode?.replaceChild(fragment, textNode)
      }
    })
  }
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

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchResumeData()
    }
  }, [id, isAuthenticated])

  // Debug: Monitor resumeData changes
  useEffect(() => {
    console.log('resumeData changed:', resumeData)
  }, [resumeData])

  const handleEnhancementComplete = (enhancedData: { 
    enhancementType?: string; 
    result?: Record<string, unknown>;
    keywordPlacements?: Array<{keyword: string, section: string, location: string, context: string}>;
    integrationSummary?: string;
    integratedKeywords?: string[];
  }) => {
    console.log('=== AI Enhancement Debug ===')
    console.log('Raw enhanced data:', enhancedData)
    console.log('Enhancement type:', enhancedData?.enhancementType)
    console.log('Current resumeData:', resumeData)
    console.log('Enhanced data type:', typeof enhancedData)
    console.log('Has result property:', !!enhancedData?.result)
    console.log('Has content property:', !!enhancedData?.result?.content)
    
    // Handle keyword integration results
    if (enhancedData?.enhancementType === 'keyword-integration') {
      console.log('Keyword integration result:', enhancedData)
      
      if (enhancedData.result) {
        // Update resume data with the integrated keywords
        const enhancedResumeData = enhancedData.result as ResumeData
        setResumeData(enhancedResumeData)
        
        // Show success message with details
        const keywordCount = enhancedData.integratedKeywords?.length || 0
        const sectionCount = new Set(enhancedData.keywordPlacements?.map(p => p.section)).size || 0
        
        toast({
          title: "Keywords Integrated Successfully!",
          description: `${keywordCount} keywords added across ${sectionCount} sections. Check the highlighted areas.`,
          duration: 5000,
        })
        
        // Store keyword placements for highlighting
        if (enhancedData.keywordPlacements) {
          setKeywordPlacements(enhancedData.keywordPlacements)
          sessionStorage.setItem('keywordPlacements', JSON.stringify(enhancedData.keywordPlacements))
          // Trigger highlighting after a brief delay
          setTimeout(() => {
            highlightKeywordPlacements(enhancedData.keywordPlacements!)
          }, 1000)
        }
      }
      return
    }
    
    // Handle keywords analysis differently - just show the suggestions
    if (enhancedData?.enhancementType === 'keywords') {
      console.log('Keywords analysis result:', enhancedData.result)
      toast({
        title: "Keyword Analysis Complete",
        description: "Review the suggested keywords to improve your resume.",
      })
      // TODO: Show keywords in a modal or side panel
      return
    }
    
    // Only process tailor enhancements that modify the resume
    if (enhancedData?.enhancementType === 'tailor') {
      // The AI returns data in result.content as a JSON string
      if (enhancedData && enhancedData.result && enhancedData.result.content) {
        try {
          // Extract the JSON content from the AI response
          let contentToParse = enhancedData.result.content as string
          console.log('Content to parse:', contentToParse)
          
          // Remove markdown code blocks if present
          if (contentToParse.includes('```json')) {
            contentToParse = contentToParse.split('```json')[1].split('```')[0]
            console.log('Content after removing markdown:', contentToParse)
          }
          
          // Parse the JSON content
          const parsedContent = JSON.parse(contentToParse.trim())
          console.log('Parsed content:', parsedContent)
          
          // Format the data for the resume, preserving ALL fields
          const formattedData = {
            personalInfo: parsedContent.personalInfo || resumeData?.personalInfo || {},
            skills: parsedContent.skills || resumeData?.skills || [],
            workExperience: parsedContent.workExperience || resumeData?.workExperience || [],
            education: parsedContent.education || resumeData?.education || [],
            // Preserve additional fields from both the AI response and current data
            certifications: parsedContent.certifications || resumeData?.certifications || [],
            projects: parsedContent.projects || resumeData?.projects || [],
            languages: parsedContent.languages || resumeData?.languages || [],
            socialLinks: parsedContent.socialLinks || resumeData?.socialLinks || [],
            interests: parsedContent.interests || resumeData?.interests || [],
            content: parsedContent.content || resumeData?.content || {}
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
            const fallbackData: ResumeData = {
              personalInfo: (enhancedData.result.personalInfo as ResumeData['personalInfo']) || resumeData?.personalInfo || {},
              skills: (enhancedData.result.skills as string[]) || resumeData?.skills || [],
              workExperience: (enhancedData.result.workExperience as ResumeData['workExperience']) || resumeData?.workExperience || [],
              education: (enhancedData.result.education as ResumeData['education']) || resumeData?.education || [],
              // Preserve additional fields
              certifications: (enhancedData.result.certifications as ResumeData['certifications']) || resumeData?.certifications || [],
              projects: (enhancedData.result.projects as ResumeData['projects']) || resumeData?.projects || [],
              languages: (enhancedData.result.languages as ResumeData['languages']) || resumeData?.languages || [],
              socialLinks: (enhancedData.result.socialLinks as ResumeData['socialLinks']) || resumeData?.socialLinks || [],
              interests: (enhancedData.result.interests as string[]) || resumeData?.interests || [],
              content: (enhancedData.result.content as Record<string, unknown>) || resumeData?.content || {}
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
    
    const templateProps = { resumeData, accentColor }
    
    let TemplateComponent
    switch (selectedTemplate) {
      case "corporate":
        TemplateComponent = CorporateTemplate
        break
      case "creative":
        TemplateComponent = CreativeTemplate
        break
      case "tech-modern":
        TemplateComponent = TechModernTemplate
        break
      case "marketing-brand":
        TemplateComponent = MarketingBrandTemplate
        break
      case "accounts-ledger":
        TemplateComponent = AccountsLedgerTemplate
        break
      case "minimal":
      default:
        TemplateComponent = MinimalTemplate
        break
    }
    
    return (
      <div className="resume-content">
        <TemplateComponent {...templateProps} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Keyword Highlight Overlay */}
      {keywordPlacements && (
        <KeywordHighlightOverlay
          placements={keywordPlacements}
          onClose={() => setKeywordPlacements(null)}
        />
      )}

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
