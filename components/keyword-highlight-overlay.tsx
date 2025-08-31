"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Eye, EyeOff } from "lucide-react"

interface KeywordPlacement {
  keyword: string
  section: string
  location: string
  context: string
}

interface KeywordHighlightOverlayProps {
  placements: KeywordPlacement[]
  onClose: () => void
}

export function KeywordHighlightOverlay({ placements, onClose }: KeywordHighlightOverlayProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [highlightsEnabled, setHighlightsEnabled] = useState(true)

  useEffect(() => {
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow fade out animation
    }, 10000)

    return () => clearTimeout(timer)
  }, [onClose])

  const toggleHighlights = () => {
    setHighlightsEnabled(!highlightsEnabled)
    
    // Toggle highlight visibility in the DOM
    const highlights = document.querySelectorAll('.keyword-highlight')
    highlights.forEach(highlight => {
      const element = highlight as HTMLElement
      element.style.background = highlightsEnabled ? 'transparent' : 'linear-gradient(120deg, #fef3c7 0%, #fef3c7 100%)'
      element.style.backgroundSize = highlightsEnabled ? '0' : '100% 0.2em'
      element.style.backgroundPosition = '0 88%'
    })
  }

  if (!isVisible) return null

  // Group placements by section
  const placementsBySection = placements.reduce((acc, placement) => {
    if (!acc[placement.section]) {
      acc[placement.section] = []
    }
    acc[placement.section].push(placement)
    return acc
  }, {} as Record<string, KeywordPlacement[]>)

  const getSectionDisplayName = (section: string) => {
    const sectionNames: Record<string, string> = {
      'personalInfo': 'Personal Information',
      'summary': 'Professional Summary',
      'skills': 'Skills',
      'workExperience': 'Work Experience',
      'education': 'Education',
      'projects': 'Projects',
      'certifications': 'Certifications',
    }
    return sectionNames[section] || section.charAt(0).toUpperCase() + section.slice(1)
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-h-96 overflow-y-auto">
      <Card className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'} shadow-lg border-green-200 bg-green-50 dark:bg-green-950`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm text-green-800 dark:text-green-200">
                Keywords Added ✨
              </CardTitle>
              <CardDescription className="text-xs text-green-600 dark:text-green-300">
                {placements.length} keywords integrated
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleHighlights}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
              >
                {highlightsEnabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {Object.entries(placementsBySection).map(([section, sectionPlacements]) => (
            <div key={section} className="space-y-1">
              <div className="text-xs font-medium text-green-800 dark:text-green-200">
                {getSectionDisplayName(section)}
              </div>
              <div className="flex flex-wrap gap-1">
                {sectionPlacements.map((placement, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                    title={placement.context}
                  >
                    {placement.keyword}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-green-200">
            <p className="text-xs text-green-600 dark:text-green-300">
              💡 Hover over highlighted text to see which keyword was added
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}