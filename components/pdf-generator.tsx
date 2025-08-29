"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Download, Loader2 } from "lucide-react"

interface PDFGeneratorProps {
  resumeData: any
  template?: string
  resumeId: string
  accentColor?: string
}

export function PDFGenerator({ resumeData, template = "minimal", resumeId, accentColor }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleDownloadPDF = async () => {
    if (!resumeId) {
      toast({
        title: "Error",
        description: "Resume ID is required for PDF generation",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Always use resumeId to fetch fresh data from database
      const response = await fetch("/api/resume/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          resumeId, // Always pass resumeId to ensure fresh data
          template,
          accentColor,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        
        if (blob.size === 0) {
          throw new Error("Generated PDF is empty")
        }
        
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `resume-${resumeId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Success",
          description: "Resume PDF downloaded successfully",
        })
      } else {
        let errorMessage = "Failed to generate PDF"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
        
        console.error("PDF generation failed:", {
          status: response.status,
          statusText: response.statusText,
          errorMessage
        })
      }
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong while generating PDF",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadPDF} disabled={isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </>
      )}
    </Button>
  )
}
