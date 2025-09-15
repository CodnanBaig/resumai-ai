"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Upload, File, X, CheckCircle, AlertCircle, Eye } from "lucide-react"

interface ParsedResumeData {
  id: string
  title: string
  personalInfo: any
  skills: string[]
  workExperience: any[]
  education: any[]
}

interface UploadResponse {
  success: boolean
  id: string
  message: string
  data: ParsedResumeData
  parsingErrors?: string[]
}

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [parsingErrors, setParsingErrors] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleFileSelect = useCallback((selectedFile: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file",
        variant: "destructive",
      })
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setParsedData(null)
    setResumeId(null)
    setParsingErrors([])
    setShowPreview(false)
  }, [toast])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer?.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget?.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    setParsedData(null)
    setResumeId(null)
    setParsingErrors([])
    setShowPreview(false)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        credentials: 'include',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        const uploadResult = result as UploadResponse
        setParsedData(uploadResult.data)
        setResumeId(uploadResult.id)
        setParsingErrors(uploadResult.parsingErrors || [])
        
        toast({
          title: "Success",
          description: uploadResult.message || "Resume uploaded and parsed successfully",
        })
      } else {
        throw new Error(result.message || "Upload failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload resume",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleContinue = () => {
    if (resumeId) {
      router.push(`/resume/${resumeId}`)
    }
  }

  const renderParsedData = () => {
    if (!parsedData) return null

    return (
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Parsed Resume Data</CardTitle>
              <CardDescription>
                Your resume has been analyzed and structured. Review the extracted information below.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Hide" : "Preview"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personal Info */}
          {parsedData.personalInfo && Object.keys(parsedData.personalInfo).length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {parsedData.personalInfo.fullName && (
                  <div><span className="text-muted-foreground">Name:</span> {parsedData.personalInfo.fullName}</div>
                )}
                {parsedData.personalInfo.email && (
                  <div><span className="text-muted-foreground">Email:</span> {parsedData.personalInfo.email}</div>
                )}
                {parsedData.personalInfo.phone && (
                  <div><span className="text-muted-foreground">Phone:</span> {parsedData.personalInfo.phone}</div>
                )}
                {parsedData.personalInfo.location && (
                  <div><span className="text-muted-foreground">Location:</span> {parsedData.personalInfo.location}</div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {parsedData.skills && parsedData.skills.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Skills ({parsedData.skills.length})</h4>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.slice(0, 10).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {parsedData.skills.length > 10 && (
                  <Badge variant="outline" className="text-xs">
                    +{parsedData.skills.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {parsedData.workExperience && parsedData.workExperience.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Work Experience ({parsedData.workExperience.length})</h4>
              <div className="space-y-2">
                {parsedData.workExperience.slice(0, 3).map((exp, index) => (
                  <div key={`${exp.company}-${exp.position}-${index}`} className="text-sm border-l-2 border-primary/20 pl-3">
                    <div className="font-medium">{exp.position}</div>
                    <div className="text-muted-foreground">{exp.company}</div>
                  </div>
                ))}
                {parsedData.workExperience.length > 3 && (
                  <div className="text-sm text-muted-foreground">
                    +{parsedData.workExperience.length - 3} more positions
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {parsedData.education && parsedData.education.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Education ({parsedData.education.length})</h4>
              <div className="space-y-2">
                {parsedData.education.slice(0, 2).map((edu, index) => (
                  <div key={`${edu.school}-${edu.degree}-${index}`} className="text-sm border-l-2 border-primary/20 pl-3">
                    <div className="font-medium">{edu.degree}</div>
                    <div className="text-muted-foreground">{edu.school}</div>
                  </div>
                ))}
                {parsedData.education.length > 2 && (
                  <div className="text-sm text-muted-foreground">
                    +{parsedData.education.length - 2} more entries
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Parsing Errors/Warnings */}
          {parsingErrors.length > 0 && (
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <h4 className="font-medium text-yellow-800">Parsing Warnings</h4>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                {parsingErrors.map((error) => (
                  <li key={error}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleContinue} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Continue to Resume
            </Button>
            <Button variant="outline" onClick={removeFile}>
              Upload Different File
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <button
          type="button"
          className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
          <p className="text-muted-foreground mb-4">Drag and drop your file here, or click to browse</p>
          <input
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileInput}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="mt-2">
            <span className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm">Choose File</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Supports PDF, DOCX, and TXT files up to 10MB</p>
        </button>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={removeFile}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {file && !parsedData && (
        <Button onClick={handleUpload} disabled={isUploading} className="w-full">
          {isUploading ? "Uploading and Parsing..." : "Upload & Parse Resume"}
        </Button>
      )}

      {/* Show parsed data after successful upload */}
      {renderParsedData()}
    </div>
  )
}
