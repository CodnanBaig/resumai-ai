"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, FileText } from "lucide-react"

interface Resume {
  id: string
  name: string
  createdAt: string
}

export function CoverLetterForm() {
  const [selectedResume, setSelectedResume] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // TODO: Fetch user's resumes from API
    // For now, using mock data
    setResumes([
      { id: "1", name: "Software Developer Resume", createdAt: "2024-01-15" },
      { id: "2", name: "Senior Developer Resume", createdAt: "2024-01-10" },
    ])
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedResume || !companyName || !jobTitle || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          resumeId: selectedResume,
          companyName,
          jobTitle,
          jobDescription,
          additionalInfo,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Success",
          description: "Cover letter generated successfully",
        })
        router.push(`/cover-letter/${result.id}`)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to generate cover letter",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resume Selection */}
      <div className="space-y-2">
        <Label htmlFor="resume">Select Resume *</Label>
        <Select value={selectedResume} onValueChange={setSelectedResume}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a resume to base your cover letter on" />
          </SelectTrigger>
          <SelectContent>
            {resumes.map((resume) => (
              <SelectItem key={resume.id} value={resume.id}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{resume.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Company and Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            placeholder="e.g., Google, Microsoft, Startup Inc."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            placeholder="e.g., Senior Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <Label htmlFor="jobDescription">Job Description *</Label>
        <Textarea
          id="jobDescription"
          placeholder="Paste the complete job posting here, including requirements, responsibilities, and company information..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          required
        />
      </div>

      {/* Additional Information */}
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
        <Textarea
          id="additionalInfo"
          placeholder="Any specific points you'd like to highlight, company research, or personal connections..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" size="lg" disabled={isGenerating} className="w-full">
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating Cover Letter...
          </>
        ) : (
          "Generate Cover Letter"
        )}
      </Button>
    </form>
  )
}
