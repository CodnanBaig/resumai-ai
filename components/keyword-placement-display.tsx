"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, MapPin } from "lucide-react"

interface KeywordPlacement {
  keyword: string
  section: string
  location: string
  context: string
}

interface KeywordPlacementDisplayProps {
  placements: KeywordPlacement[]
  integrationSummary?: string
  integratedKeywords: string[]
}

export function KeywordPlacementDisplay({ 
  placements, 
  integrationSummary, 
  integratedKeywords 
}: KeywordPlacementDisplayProps) {
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
      'languages': 'Languages',
      'socialLinks': 'Social Links',
      'interests': 'Interests'
    }
    return sectionNames[section] || section.charAt(0).toUpperCase() + section.slice(1)
  }

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'skills':
        return '🛠️'
      case 'workExperience':
        return '💼'
      case 'summary':
      case 'personalInfo':
        return '👤'
      case 'projects':
        return '🚀'
      case 'education':
        return '🎓'
      case 'certifications':
        return '📜'
      default:
        return '📍'
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800 dark:text-green-200">
              Keywords Successfully Integrated
            </CardTitle>
          </div>
          <CardDescription className="text-green-700 dark:text-green-300">
            {integratedKeywords.length} keywords have been strategically added to your resume
          </CardDescription>
        </CardHeader>
        {integrationSummary && (
          <CardContent>
            <p className="text-sm text-green-800 dark:text-green-200">
              {integrationSummary}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Integration Summary */}
      <div className="flex flex-wrap gap-2">
        {integratedKeywords.map((keyword) => (
          <Badge key={keyword} variant="secondary" className="bg-green-100 text-green-800 border-green-300">
            {keyword}
          </Badge>
        ))}
      </div>

      {/* Placement Details by Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Where Keywords Were Added
        </h3>
        
        {Object.entries(placementsBySection).map(([section, sectionPlacements]) => (
          <Card key={section}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="text-lg">{getSectionIcon(section)}</span>
                {getSectionDisplayName(section)}
                <Badge variant="outline" className="ml-auto">
                  {sectionPlacements.length} keyword{sectionPlacements.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sectionPlacements.map((placement, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-3 bg-accent/30"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="default" className="text-xs">
                      {placement.keyword}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {placement.location}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {placement.context}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integration Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{integratedKeywords.length}</div>
              <div className="text-xs text-muted-foreground">Keywords Added</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{Object.keys(placementsBySection).length}</div>
              <div className="text-xs text-muted-foreground">Sections Enhanced</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{placements.length}</div>
              <div className="text-xs text-muted-foreground">Total Placements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Math.round((placements.length / integratedKeywords.length) * 100) / 100}
              </div>
              <div className="text-xs text-muted-foreground">Avg per Keyword</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}