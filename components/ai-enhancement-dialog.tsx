"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Target, Hash, Loader2 } from "lucide-react"

interface AIEnhancementDialogProps {
  resumeId: string
  resumeData?: any
  onEnhancementComplete?: (enhancedData: any) => void
}

export function AIEnhancementDialog({ resumeId, resumeData, onEnhancementComplete }: AIEnhancementDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancementType, setEnhancementType] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEnhancement = async (type: "improve" | "tailor" | "keywords") => {
    if (type === "tailor" && !jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please provide a job description to tailor your resume",
        variant: "destructive",
      })
      return
    }

    setIsEnhancing(true)
    setEnhancementType(type)

    try {
      const response = await fetch("/api/ai/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          jobDescription: type === "tailor" ? jobDescription : undefined,
          enhancementType: type,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Enhancement Complete",
          description: `Your resume has been ${type === "improve" ? "improved" : type === "tailor" ? "tailored" : "analyzed"} successfully`,
        })

        if (onEnhancementComplete) {
          onEnhancementComplete(result.result)
        }

        setIsOpen(false)
      } else {
        toast({
          title: "Enhancement Failed",
          description: result.message || "Failed to enhance resume",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong during enhancement",
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
      setEnhancementType(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Enhance with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Resume Enhancement</DialogTitle>
          <DialogDescription>Choose how you'd like to enhance your resume using AI</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Job Description Input */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description (Optional for tailoring)</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here to tailor your resume to a specific role..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Enhancement Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle className="text-sm">General Improvement</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs mb-3">
                  Enhance language, add action verbs, and improve overall impact
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleEnhancement("improve")}
                  disabled={isEnhancing}
                >
                  {isEnhancing && enhancementType === "improve" ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  Improve
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-sm">Tailor to Job</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs mb-3">
                  Customize resume content to match a specific job description
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleEnhancement("tailor")}
                  disabled={isEnhancing || !jobDescription.trim()}
                >
                  {isEnhancing && enhancementType === "tailor" ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Target className="w-3 h-3 mr-1" />
                  )}
                  Tailor
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-primary" />
                  <CardTitle className="text-sm">Keyword Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs mb-3">
                  Get suggestions for industry-relevant keywords to add
                </CardDescription>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => handleEnhancement("keywords")}
                  disabled={isEnhancing}
                >
                  {isEnhancing && enhancementType === "keywords" ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Hash className="w-3 h-3 mr-1" />
                  )}
                  Analyze
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* API Key Notice */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> AI enhancement requires an OpenRouter API key. Add OPENROUTER_API_KEY to your
              environment variables to enable this feature.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
