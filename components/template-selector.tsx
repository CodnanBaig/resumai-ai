"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MinimalTemplate } from "./resume-templates/minimal-template"
import { CorporateTemplate } from "./resume-templates/corporate-template"
import { CreativeTemplate } from "./resume-templates/creative-template"

interface TemplateSelectorProps {
  resumeData: any
  onTemplateSelect: (template: string) => void
}

export function TemplateSelector({ resumeData, onTemplateSelect }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("minimal")
  const [isOpen, setIsOpen] = useState(false)

  const templates = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean and simple design with elegant typography.",
      component: MinimalTemplate,
      preview: "/api/resume/preview/minimal"
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional layout with bold headers and structured sections.",
      component: CorporateTemplate,
      preview: "/api/resume/preview/corporate"
    },
    {
      id: "creative",
      name: "Creative",
      description: "Modern sidebar design with visual skill indicators.",
      component: CreativeTemplate,
      preview: "/api/resume/preview/creative"
    }
  ]

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    onTemplateSelect(templateId)
    setIsOpen(false)
  }

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || MinimalTemplate

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Current Template</h3>
          <p className="text-sm text-gray-600">Selected: {templates.find(t => t.id === selectedTemplate)?.name}</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Choose Template
            </Button>
          </DialogTrigger>
          <DialogContent className="mobile-modal-content max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">Choose Resume Template</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Select a template that best represents your professional style
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Template Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`mobile-card cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="text-center pb-3">
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <template.component resumeData={resumeData} />
                      </div>
                      <CardTitle className="text-base sm:text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs sm:text-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Preview functionality would go here
                          }}
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 text-xs sm:text-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTemplateSelect(template.id)
                          }}
                        >
                          {selectedTemplate === template.id ? (
                            <>
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Selected
                            </>
                          ) : (
                            'Select'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Current Template Preview */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Template Preview</h4>
                <div className="border rounded-lg overflow-hidden bg-white">
                  <SelectedTemplateComponent resumeData={resumeData} />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
