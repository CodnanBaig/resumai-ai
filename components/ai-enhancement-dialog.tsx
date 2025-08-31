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
import { KeywordSelection } from "@/components/keyword-selection"

interface AIEnhancementDialogProps {
  resumeId: string
  resumeData?: any
  onEnhancementComplete?: (enhancedData: any) => void
  buttonText?: string
  isResumeView?: boolean
}

export function AIEnhancementDialog({ resumeId, resumeData, onEnhancementComplete, buttonText = "Enhance with AI", isResumeView = false }: AIEnhancementDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancementType, setEnhancementType] = useState<string | null>(null)
  const [keywordData, setKeywordData] = useState<{ keywords: string[], recommendations: string } | null>(null)
  const [showKeywordSelection, setShowKeywordSelection] = useState(false)
  const { toast } = useToast()

  const handleEnhancement = async (type: "tailor" | "keywords") => {
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
        credentials: 'include',
        body: JSON.stringify({
          resumeData,
          jobDescription: type === "tailor" ? jobDescription : undefined,
          enhancementType: type,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        if (type === "keywords") {
          // Handle keyword analysis - show selection interface
          const keywordResult = result.result
          if (keywordResult.suggestedKeywords && keywordResult.recommendations) {
            setKeywordData({
              keywords: keywordResult.suggestedKeywords,
              recommendations: keywordResult.recommendations
            })
            setShowKeywordSelection(true)
          } else {
            toast({
              title: "Analysis Complete",
              description: "Keywords have been analyzed but no suggestions were found.",
            })
          }
        } else {
          // Handle tailor - direct enhancement
          toast({
            title: "Enhancement Complete",
            description: "Your resume has been tailored successfully",
          })

          if (onEnhancementComplete) {
            console.log('AI Dialog: Calling onEnhancementComplete with:', result)
            onEnhancementComplete(result)
          }

          setIsOpen(false)
        }
      } else {
        toast({
          title: "Enhancement Failed",
          description: result.message || "Failed to enhance resume",
          variant: "destructive",
        })
      }
    } catch {
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

  const handleKeywordsIntegrated = (result: any) => {
    setShowKeywordSelection(false)
    setKeywordData(null)
    
    if (onEnhancementComplete) {
      onEnhancementComplete(result)
    }
    
    setIsOpen(false)
  }

  const handleCloseKeywordSelection = () => {
    setShowKeywordSelection(false)
    setKeywordData(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showKeywordSelection 
              ? "Select Keywords to Integrate" 
              : (isResumeView ? "Tailor Resume with AI" : "AI Resume Enhancement")
            }
          </DialogTitle>
          <DialogDescription>
            {showKeywordSelection
              ? "Choose which keywords you'd like to add to your resume. They will be smartly integrated into relevant sections."
              : (isResumeView 
                ? "Customize your resume for a specific job or analyze keywords" 
                : "Choose how you'd like to enhance your resume using AI")
            }
          </DialogDescription>
        </DialogHeader>

        {showKeywordSelection && keywordData ? (
          <KeywordSelection
            keywords={keywordData.keywords}
            recommendations={keywordData.recommendations}
            resumeId={resumeId}
            resumeData={resumeData}
            onKeywordsIntegrated={handleKeywordsIntegrated}
            onClose={handleCloseKeywordSelection}
          />
        ) : (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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


        </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
