"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Plus, Save, Sparkles, Loader2 } from "lucide-react"

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

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string
  credentialId: string
  url: string
}

interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate: string
  url: string
  current: boolean
}

interface Language {
  id: string
  name: string
  proficiency: string // e.g., "Native", "Fluent", "Intermediate", "Basic"
}

interface SocialLink {
  id: string
  platform: string
  url: string
  username: string
}

interface ResumeFormProps {
  initialData?: any
  isEditMode?: boolean
  onSave?: (data: any) => void
}

export function ResumeForm({ initialData, isEditMode = false, onSave }: ResumeFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [title, setTitle] = useState(initialData?.title || "")
  const [personalInfo, setPersonalInfo] = useState({
    fullName: initialData?.personalInfo?.fullName || "",
    email: initialData?.personalInfo?.email || "",
    phone: initialData?.personalInfo?.phone || "",
    location: initialData?.personalInfo?.location || "",
    summary: initialData?.personalInfo?.summary || ""
  })

  const [skills, setSkills] = useState<string[]>(initialData?.skills || [])
  const [newSkill, setNewSkill] = useState("")
  
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(
    initialData?.workExperience?.length > 0 ? initialData.workExperience : [
      {
        id: "1",
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false
      }
    ]
  )
  
  const [education, setEducation] = useState<Education[]>(
    initialData?.education?.length > 0 ? initialData.education : [
      {
        id: "1",
        school: "",
        degree: "",
        graduationDate: ""
      }
    ]
  )

  const [certifications, setCertifications] = useState<Certification[]>(
    initialData?.certifications?.length > 0 ? initialData.certifications : []
  )

  const [projects, setProjects] = useState<Project[]>(
    initialData?.projects?.length > 0 ? initialData.projects : []
  )

  const [languages, setLanguages] = useState<Language[]>(
    initialData?.languages?.length > 0 ? initialData.languages : [
      {
        id: "1",
        name: "English",
        proficiency: "Native"
      }
    ]
  )

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    initialData?.socialLinks?.length > 0 ? initialData.socialLinks : []
  )

  const [interests, setInterests] = useState<string[]>(initialData?.interests || [])
  const [newInterest, setNewInterest] = useState("")

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "")
      setPersonalInfo({
        fullName: initialData.personalInfo?.fullName || "",
        email: initialData.personalInfo?.email || "",
        phone: initialData.personalInfo?.phone || "",
        location: initialData.personalInfo?.location || "",
        summary: initialData.personalInfo?.summary || ""
      })
      setSkills(initialData.skills || [])
      setWorkExperience(
        initialData.workExperience?.length > 0 ? initialData.workExperience : [
          {
            id: "1",
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
            current: false
          }
        ]
      )
      setEducation(
        initialData.education?.length > 0 ? initialData.education : [
          {
            id: "1",
            school: "",
            degree: "",
            field: "",
            graduationDate: ""
          }
        ]
      )
      setCertifications(initialData.certifications || [])
      setProjects(initialData.projects || [])
      setLanguages(
        initialData.languages?.length > 0 ? initialData.languages : [
          {
            id: "1",
            name: "English",
            proficiency: "Native"
          }
        ]
      )
      setSocialLinks(initialData.socialLinks || [])
      setInterests(initialData.interests || [])
    }
  }, [initialData])

  const [enhancingSummary, setEnhancingSummary] = useState(false)
  const [enhancingWorkExp, setEnhancingWorkExp] = useState<{ [key: string]: boolean }>({})

  const enhanceWithAI = async (type: 'summary' | 'workExperience', workExpId?: string) => {
    if (type === 'summary') {
      setEnhancingSummary(true)
    } else if (type === 'workExperience' && workExpId) {
      setEnhancingWorkExp(prev => ({ ...prev, [workExpId]: true }))
    }

    try {
      let prompt = ""
      let currentContent = ""
      
      if (type === 'summary') {
        currentContent = personalInfo.summary
        if (currentContent.trim()) {
          prompt = `Please enhance this professional summary to make it more impactful and concise. Focus on:
          1. Strengthening action verbs and quantifying achievements
          2. Making it shorter and more snappy (max 3-4 sentences)
          3. Adding relevant industry keywords
          4. Creating a professional, flowing paragraph

          Current Summary: ${currentContent}
          
          Return ONLY the enhanced summary as clean, professional text without any formatting, bullet points, or explanations.`
        } else {
          prompt = `Please generate a concise professional summary based on this information:
          
          Name: ${personalInfo.fullName}
          Skills: ${skills.join(', ')}
          Work Experience: ${workExperience.map(exp => `${exp.position} at ${exp.company}`).join(', ')}
          Education: ${education.map(edu => `${edu.degree} in ${edu.field} from ${edu.school}`).join(', ')}
          
          Generate a short, snappy professional summary as clean, flowing text without any formatting, bullet points, or explanations.`
        }
      } else if (type === 'workExperience' && workExpId) {
        const workExp = workExperience.find(exp => exp.id === workExpId)
        if (workExp) {
          currentContent = workExp.description
          if (currentContent.trim()) {
            prompt = `Please enhance this work experience description to make it more impactful and concise. Focus on:
            1. Using strong action verbs
            2. Quantifying achievements with numbers and metrics
            3. Making it shorter and more scannable
            4. Formatting as bullet points for easy reading

            Position: ${workExp.position}
            Company: ${workExp.company}
            Current Description: ${currentContent}
            
            Return ONLY the enhanced description formatted as HTML bullet points using <ul><li> tags. Each achievement should be a separate bullet point.`
          } else {
            prompt = `Please generate a compelling work experience description for this role:
            
            Position: ${workExp.position}
            Company: ${workExp.company}
            Skills: ${skills.join(', ')}
            
            Generate a professional description formatted as HTML bullet points using <ul><li> tags. Each achievement should be a separate bullet point.`
          }
        }
      }

      const response = await fetch("/api/ai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          resumeData: {
            personalInfo,
            skills,
            workExperience,
            education
          },
          enhancementType: "improve",
          customPrompt: prompt
        }),
      })

      const result = await response.json()
      
      // Debug logging to understand the response structure
      console.log('AI Enhancement Response:', { response: response.ok, result })

      let enhancedContent: string | null = null
      
      if (response.ok && result.result?.content && result.result.content.trim()) {
        // Primary response structure: result.result.content
        enhancedContent = result.result.content
      } else if (response.ok && result.content && result.content.trim()) {
        // Fallback for different response structure
        enhancedContent = result.content
      }
      
      if (enhancedContent) {
        // Remove markdown code blocks if present
        if (enhancedContent.includes('```')) {
          enhancedContent = enhancedContent.split('```')[1]?.split('```')[0] || enhancedContent
        }
        
        // Clean up the content
        enhancedContent = enhancedContent.trim()
        
        if (type === 'summary') {
          // Convert plain text to HTML for RichTextEditor (summary)
          const htmlContent = `<p>${enhancedContent}</p>`
          setPersonalInfo(prev => ({ ...prev, summary: htmlContent }))
          toast({
            title: "Summary Enhanced!",
            description: "Your professional summary has been improved with AI.",
          })
        } else if (type === 'workExperience' && workExpId) {
          // Work experience already comes as HTML bullet points from AI
          setWorkExperience(prev => 
            prev.map(exp => 
              exp.id === workExpId 
                ? { ...exp, description: enhancedContent || '' }
                : exp
            )
          )
          toast({
            title: "Work Experience Enhanced!",
            description: "Your work experience description has been improved with AI.",
          })
        }
      } else {
        console.error('AI Enhancement failed:', { response: response.ok, result })
        const errorMsg = result.message || 
          (response.ok ? "AI returned empty content" : "API request failed") ||
          "Failed to enhance content"
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('AI Enhancement error:', error)
      toast({
        title: "Enhancement Failed",
        description: error instanceof Error ? error.message : "Failed to enhance content. Please try again.",
        variant: "destructive",
      })
    } finally {
      if (type === 'summary') {
        setEnhancingSummary(false)
      } else if (type === 'workExperience' && workExpId) {
        setEnhancingWorkExp(prev => ({ ...prev, [workExpId]: false }))
      }
    }
  }

  const addWorkExperience = () => {
    const newId = (workExperience.length + 1).toString()
    setWorkExperience([
      ...workExperience,
      {
        id: newId,
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false
      }
    ])
  }

  const removeWorkExperience = (id: string) => {
    if (workExperience.length > 1) {
      setWorkExperience(workExperience.filter(exp => exp.id !== id))
    }
  }

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setWorkExperience(workExperience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const addEducation = () => {
    const newId = (education.length + 1).toString()
    setEducation([
      ...education,
      {
        id: newId,
        school: "",
        degree: "",
        field: "",
        graduationDate: ""
      }
    ])
  }

  const removeEducation = (id: string) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id))
    }
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  // Certifications management
  const addCertification = () => {
    const newId = (certifications.length + 1).toString()
    setCertifications([
      ...certifications,
      {
        id: newId,
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        url: ""
      }
    ])
  }

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id))
  }

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    ))
  }

  // Projects management
  const addProject = () => {
    const newId = (projects.length + 1).toString()
    setProjects([
      ...projects,
      {
        id: newId,
        name: "",
        description: "",
        technologies: [],
        startDate: "",
        endDate: "",
        url: "",
        current: false
      }
    ])
  }

  const removeProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id))
  }

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map(proj =>
      proj.id === id ? { ...proj, [field]: value } : proj
    ))
  }

  // Languages management
  const addLanguage = () => {
    const newId = (languages.length + 1).toString()
    setLanguages([
      ...languages,
      {
        id: newId,
        name: "",
        proficiency: "Basic"
      }
    ])
  }

  const removeLanguage = (id: string) => {
    if (languages.length > 1) {
      setLanguages(languages.filter(lang => lang.id !== id))
    }
  }

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    ))
  }

  // Social Links management
  const addSocialLink = () => {
    const newId = (socialLinks.length + 1).toString()
    setSocialLinks([
      ...socialLinks,
      {
        id: newId,
        platform: "",
        url: "",
        username: ""
      }
    ])
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id))
  }

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setSocialLinks(socialLinks.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  // Interests management
  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest("")
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove))
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const resumeData = {
        title: title || `${personalInfo.fullName}'s Resume`,
        personalInfo,
        skills,
        workExperience,
        education,
        certifications,
        projects,
        languages,
        socialLinks,
        interests
      }

      if (isEditMode && onSave) {
        // In edit mode, call the onSave callback
        onSave(resumeData)
        return
      }

      // In create mode, make API call to create new resume
      const response = await fetch("/api/resume/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(resumeData),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success!",
          description: "Your resume has been created successfully.",
        })
        // Redirect to resume view page
        window.location.href = `/resume/${result.id}`
      } else {
        throw new Error("Failed to create resume")
      }
    } catch {
      toast({
        title: "Error",
        description: isEditMode ? "Failed to save changes. Please try again." : "Failed to create resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Resume Title */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Resume Title</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Give your resume a descriptive name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Software Engineer Resume, Marketing Manager CV"
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Personal Information</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Basic details about yourself
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="form-group-responsive">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={personalInfo.fullName}
                onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                placeholder="John Doe"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                placeholder="john.doe@example.com"
                required
                className="w-full"
              />
            </div>
          </div>
          
          <div className="form-group-responsive">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={personalInfo.location}
                onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                placeholder="City, State"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <p className="text-xs text-gray-500 mt-1">Click the AI icon to enhance or generate your summary</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => enhanceWithAI('summary')}
                disabled={enhancingSummary}
                className="h-8 w-8 p-0 hover:bg-blue-50 border border-blue-200 hover:border-blue-300"
                title="Enhance with AI"
              >
                {enhancingSummary ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-600" />
                )}
              </Button>
            </div>
            <RichTextEditor
              content={personalInfo.summary}
              onChange={(content) => setPersonalInfo({ ...personalInfo, summary: content })}
              placeholder="Brief overview of your professional background and career objectives..."
              maxLength={1000}
              showToolbar={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Skills</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Add your key skills and competencies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
            <Button type="button" onClick={addSkill} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
          
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card className="mobile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Work Experience</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your professional work history
              </CardDescription>
            </div>
            <Button type="button" onClick={addWorkExperience} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {workExperience.map((exp, index) => (
            <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                {workExperience.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeWorkExperience(exp.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateWorkExperience(exp.id, "company", e.target.value)}
                    placeholder="Company Name"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateWorkExperience(exp.id, "position", e.target.value)}
                    placeholder="Job Title"
                    required
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateWorkExperience(exp.id, "startDate", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateWorkExperience(exp.id, "endDate", e.target.value)}
                    disabled={exp.current}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateWorkExperience(exp.id, "current", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`current-${exp.id}`} className="text-sm">
                  I currently work here
                </Label>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Description</Label>
                    <p className="text-xs text-gray-500 mt-1">Click the AI icon to enhance or generate your description</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => enhanceWithAI('workExperience', exp.id)}
                    disabled={enhancingWorkExp[exp.id]}
                    className="h-8 w-8 p-0 hover:bg-blue-50 border border-blue-200 hover:border-blue-300"
                    title="Enhance with AI"
                  >
                    {enhancingWorkExp[exp.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    )}
                  </Button>
                </div>
                <RichTextEditor
                  content={exp.description}
                  onChange={(content) => updateWorkExperience(exp.id, "description", content)}
                  placeholder="Describe your responsibilities and achievements..."
                  maxLength={1500}
                  showToolbar={true}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="mobile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Education</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your educational background
              </CardDescription>
            </div>
            <Button type="button" onClick={addEducation} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {education.map((edu, index) => (
            <div key={edu.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                {education.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              
              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>School/University *</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                    placeholder="Institution Name"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    placeholder="e.g., Bachelor's, Master's"
                    required
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Date</Label>
                  <Input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="mobile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Certifications</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Add your professional certifications and credentials
              </CardDescription>
            </div>
            <Button type="button" onClick={addCertification} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Certification {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => removeCertification(cert.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>

              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Certification Name *</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                    placeholder="e.g., AWS Certified Solutions Architect"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuing Organization *</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                    placeholder="e.g., Amazon Web Services"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="month"
                    value={cert.issueDate}
                    onChange={(e) => updateCertification(cert.id, "issueDate", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    type="month"
                    value={cert.expiryDate}
                    onChange={(e) => updateCertification(cert.id, "expiryDate", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Credential ID</Label>
                  <Input
                    value={cert.credentialId}
                    onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value)}
                    placeholder="e.g., ABC123456789"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Credential URL</Label>
                  <Input
                    value={cert.url}
                    onChange={(e) => updateCertification(cert.id, "url", e.target.value)}
                    placeholder="https://verify.certification.com/..."
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
          {certifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No certifications added yet.</p>
              <p className="text-sm">Click "Add Certification" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="mobile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Projects</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Showcase your notable projects and achievements
              </CardDescription>
            </div>
            <Button type="button" onClick={addProject} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {projects.map((project, index) => (
            <div key={project.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => removeProject(project.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                  placeholder="e.g., E-commerce Platform"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <RichTextEditor
                  content={project.description}
                  onChange={(content) => updateProject(project.id, "description", content)}
                  placeholder="Describe the project, your role, and key achievements..."
                  maxLength={1000}
                  showToolbar={true}
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies Used</Label>
                <Input
                  value={project.technologies.join(', ')}
                  onChange={(e) => updateProject(project.id, "technologies", e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech))}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="w-full"
                />
              </div>

              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                    disabled={project.current}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-project-${project.id}`}
                  checked={project.current}
                  onChange={(e) => updateProject(project.id, "current", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`current-project-${project.id}`} className="text-sm">
                  This is an ongoing project
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Project URL</Label>
                <Input
                  value={project.url}
                  onChange={(e) => updateProject(project.id, "url", e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full"
                />
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No projects added yet.</p>
              <p className="text-sm">Click "Add Project" to showcase your work.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card className="mobile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Languages</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                List the languages you speak and your proficiency level
              </CardDescription>
            </div>
            <Button type="button" onClick={addLanguage} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {languages.map((lang, index) => (
            <div key={lang.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Language {index + 1}</h4>
                {languages.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeLanguage(lang.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Language *</Label>
                  <Input
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                    placeholder="e.g., Spanish, French"
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Proficiency Level</Label>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card className="mobile-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Interests & Hobbies</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Add your personal interests and hobbies to show your personality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest or hobby"
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
            />
            <Button type="button" onClick={addInterest} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Interest
            </Button>
          </div>

          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="mobile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">Social Links</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Add links to your professional social media profiles
              </CardDescription>
            </div>
            <Button type="button" onClick={addSocialLink} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {socialLinks.map((link, index) => (
            <div key={link.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Social Link {index + 1}</h4>
                <Button
                  type="button"
                  onClick={() => removeSocialLink(link.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>

              <div className="form-group-responsive">
                <div className="space-y-2">
                  <Label>Platform *</Label>
                  <select
                    value={link.platform}
                    onChange={(e) => updateSocialLink(link.id, "platform", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Platform</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Medium">Medium</option>
                    <option value="Dev.to">Dev.to</option>
                    <option value="Portfolio">Portfolio Website</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={link.username}
                    onChange={(e) => updateSocialLink(link.id, "username", e.target.value)}
                    placeholder="e.g., john-doe"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Full URL *</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
                  placeholder="https://linkedin.com/in/john-doe"
                  required
                  className="w-full"
                />
              </div>
            </div>
          ))}
          {socialLinks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No social links added yet.</p>
              <p className="text-sm">Click "Add Link" to connect your profiles.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          {isSubmitting 
            ? (isEditMode ? "Saving..." : "Creating...") 
            : (isEditMode ? "Save Changes" : "Create Resume")
          }
        </Button>
      </div>
    </form>
  )
}
