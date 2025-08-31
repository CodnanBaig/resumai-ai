"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { KeywordPlacementDisplay } from "@/components/keyword-placement-display"
import { ResumeData } from "@/lib/types"

interface KeywordIntegrationResult {
  success: boolean
  enhancementType: string
  result: ResumeData
  keywordPlacements: Array<{
    keyword: string
    section: string
    location: string
    context: string
  }>
  integrationSummary: string
  integratedKeywords: string[]
}

interface KeywordSelectionProps {
  keywords: string[]
  recommendations: string
  resumeId?: string
  resumeData?: ResumeData
  onKeywordsIntegrated?: (result: KeywordIntegrationResult) => void
  onClose?: () => void
}

export function KeywordSelection({ 
  keywords, 
  recommendations, 
  resumeId, 
  resumeData,
  onKeywordsIntegrated,
  onClose 
}: KeywordSelectionProps) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [isIntegrating, setIsIntegrating] = useState(false)
  const [integrationResult, setIntegrationResult] = useState<KeywordIntegrationResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const handleSelectAll = () => {
    setSelectedKeywords(keywords)
  }

  const handleDeselectAll = () => {
    setSelectedKeywords([])
  }

  const handleIntegrateKeywords = async () => {
    if (selectedKeywords.length === 0) {
      toast({
        title: "No keywords selected",
        description: "Please select at least one keyword to integrate.",
        variant: "destructive"
      })
      return
    }

    if (!resumeData) {
      toast({
        title: "Resume data missing",
        description: "Unable to integrate keywords. Please try refreshing the page.",
        variant: "destructive"
      })
      return
    }

    setIsIntegrating(true)

    try {
      const response = await fetch("/api/ai/integrate-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: resumeId || null, // Handle case where resumeId might be undefined
          resumeData,
          selectedKeywords,
        }),
      })

      // Get the response data first to provide better error messages
      const result = await response.json()

      if (!response.ok) {
        // Provide specific error messages based on status codes
        let errorMessage = "Failed to integrate keywords. Please try again."
        
        if (response.status === 503) {
          errorMessage = "AI service is temporarily unavailable. Please try again in a moment."
        } else if (response.status === 500) {
          errorMessage = result.message || "An error occurred while processing your request."
        } else if (response.status === 401) {
          errorMessage = "Authentication required. Please log in again."
        }
        
        throw new Error(errorMessage)
      }
      
      setIntegrationResult(result)
      setShowResults(true)
      
      toast({
        title: "Keywords integrated successfully!",
        description: `${selectedKeywords.length} keywords have been smartly added to your resume.`,
      })

      onKeywordsIntegrated?.(result)
    } catch (error) {
      console.error("Error integrating keywords:", error)
      
      const errorMessage = error instanceof Error ? error.message : "Failed to integrate keywords. Please try again."
      
      toast({
        title: "Integration failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsIntegrating(false)
    }
  }

  return (
    <div className="space-y-6">
      {showResults && integrationResult ? (
        <KeywordPlacementDisplay
          placements={integrationResult.keywordPlacements}
          integrationSummary={integrationResult.integrationSummary}
          integratedKeywords={integrationResult.integratedKeywords}
        />
      ) : (
        <>
          <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>AI Keyword Recommendations</span>
            <Badge variant="secondary">{keywords.length} suggested</Badge>
          </CardTitle>
          <CardDescription>
            {recommendations}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selection Controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
              disabled={selectedKeywords.length === keywords.length}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeselectAll}
              disabled={selectedKeywords.length === 0}
            >
              Deselect All
            </Button>
            <div className="ml-auto text-sm text-muted-foreground">
              {selectedKeywords.length} of {keywords.length} selected
            </div>
          </div>

          {/* Keywords Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {keywords.map((keyword) => (
              <div
                key={keyword}
                className="flex items-center space-x-2 p-3 rounded-md border hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={`keyword-${keyword}`}
                  checked={selectedKeywords.includes(keyword)}
                  onCheckedChange={() => handleKeywordToggle(keyword)}
                />
                <label
                  htmlFor={`keyword-${keyword}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {keyword}
                </label>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              onClick={handleIntegrateKeywords}
              disabled={selectedKeywords.length === 0 || isIntegrating}
              className="flex-1"
            >
              {isIntegrating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Integrating Keywords...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Integrate {selectedKeywords.length} Keywords
                </>
              )}
            </Button>
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isIntegrating}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedKeywords.length > 0 && !showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selected Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="default"
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleKeywordToggle(keyword)}
                >
                  {keyword}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </>
      )}
    </div>
  )
}