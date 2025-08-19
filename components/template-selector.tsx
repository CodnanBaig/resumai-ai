"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check, Palette, FileText, Briefcase } from "lucide-react"

interface TemplateSelectorProps {
  resumeData: any
  onTemplateSelect: (template: string) => void
  selectedTemplate: string
}

export function TemplateSelector({ resumeData, onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const templates = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean and simple design with elegant typography. Perfect for traditional industries.",
      icon: FileText,
      features: ["Professional layout", "Easy to read", "ATS friendly"],
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional layout with bold headers and structured sections. Ideal for business roles.",
      icon: Briefcase,
      features: ["Bold design", "Structured sections", "Executive look"],
      color: "bg-gray-50 border-gray-200"
    },
    {
      id: "creative",
      name: "Creative",
      description: "Modern sidebar design with visual skill indicators. Great for creative and tech roles.",
      icon: Palette,
      features: ["Modern design", "Visual elements", "Creative layout"],
      color: "bg-purple-50 border-purple-200"
    }
  ]

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId)
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Current Template</h3>
          <p className="text-sm text-gray-600">
            Selected: <span className="font-medium">{templates.find(t => t.id === selectedTemplate)?.name}</span>
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Palette className="w-4 h-4 mr-2" />
              Choose Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">Choose Resume Template</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Select a template that best represents your professional style
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Template Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => {
                  const IconComponent = template.icon
                  const isSelected = selectedTemplate === template.id
                  
                  return (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                        isSelected 
                          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' 
                          : `hover:bg-gray-50 ${template.color}`
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardHeader className="text-center pb-3">
                        <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {/* Features */}
                        <div className="space-y-2 mb-4">
                          {template.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        {/* Action Button */}
                        <Button 
                          className={`w-full ${
                            isSelected 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-gray-600 hover:bg-gray-700'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTemplateSelect(template.id)
                          }}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            'Select Template'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              
              {/* Template Comparison */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Template Comparison</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Feature</th>
                        {templates.map(template => (
                          <th key={template.id} className="text-center py-2 font-medium">
                            {template.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Best For</td>
                        <td className="text-center py-2">Traditional industries</td>
                        <td className="text-center py-2">Business roles</td>
                        <td className="text-center py-2">Creative/Tech roles</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Layout Style</td>
                        <td className="text-center py-2">Clean & simple</td>
                        <td className="text-center py-2">Structured & bold</td>
                        <td className="text-center py-2">Modern & visual</td>
                      </tr>
                      <tr>
                        <td className="py-2">ATS Friendly</td>
                        <td className="text-center py-2">✅ Excellent</td>
                        <td className="text-center py-2">✅ Good</td>
                        <td className="text-center py-2">⚠️ Moderate</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
