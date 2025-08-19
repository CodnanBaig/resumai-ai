"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Download, Copy, Edit, Loader2 } from "lucide-react"

interface CoverLetterActionsProps {
  coverLetterId: string
  content: string
  companyName: string
  jobTitle: string
}

export function CoverLetterActions({ coverLetterId, content, companyName, jobTitle }: CoverLetterActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied",
        description: "Cover letter copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)

    try {
      const response = await fetch("/api/cover-letter/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverLetterId,
          content,
          companyName,
          jobTitle,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `cover-letter-${companyName.replace(/\s+/g, "-").toLowerCase()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Success",
          description: "Cover letter PDF downloaded successfully",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to generate PDF",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while generating PDF",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleEdit = () => {
    toast({
      title: "Coming Soon",
      description: "Cover letter editing feature will be available soon",
    })
  }

  return (
    <>
      <Button onClick={handleCopyToClipboard} className="w-full">
        <Copy className="w-4 h-4 mr-2" />
        Copy to Clipboard
      </Button>

      <Button variant="outline" className="w-full bg-transparent" onClick={handleDownloadPDF} disabled={isDownloading}>
        {isDownloading ? (
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

      <Button variant="outline" className="w-full bg-transparent" onClick={handleEdit}>
        <Edit className="w-4 h-4 mr-2" />
        Edit Content
      </Button>
    </>
  )
}
