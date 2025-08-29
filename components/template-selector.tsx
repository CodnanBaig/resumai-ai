"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check, Palette, FileText, Briefcase, ChevronLeft, ChevronRight, Code, Megaphone, Calculator } from "lucide-react"

interface TemplateSelectorProps {
  resumeData: any
  onTemplateSelect: (template: string, color?: string) => void
  selectedTemplate: string
}

export function TemplateSelector({ resumeData, onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>("#2563eb")
  const [category, setCategory] = useState<string>("all")

  const allTemplates = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean and simple design with elegant typography. Perfect for traditional industries.",
      icon: FileText,
      features: ["Professional layout", "Easy to read", "ATS friendly"],
      color: "bg-blue-50 border-blue-200",
      category: "general"
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Professional layout with bold headers and structured sections. Ideal for business roles.",
      icon: Briefcase,
      features: ["Bold design", "Structured sections", "Executive look"],
      color: "bg-gray-50 border-gray-200",
      category: "general"
    },
    {
      id: "creative",
      name: "Creative",
      description: "Modern sidebar design with visual skill indicators. Great for creative and tech roles.",
      icon: Palette,
      features: ["Modern design", "Visual elements", "Creative layout"],
      color: "bg-purple-50 border-purple-200",
      category: "general"
    },
    {
      id: "tech-modern",
      name: "Tech Modern",
      description: "Sleek layout emphasizing projects, stacks, and impact for tech roles.",
      icon: Code,
      features: ["Project-first", "Stack highlights", "Impact bullets"],
      color: "bg-indigo-50 border-indigo-200",
      category: "tech"
    },
    {
      id: "marketing-brand",
      name: "Digital Marketing",
      description: "Showcases campaigns, metrics, and brand storytelling.",
      icon: Megaphone,
      features: ["Campaign metrics", "Brand focus", "Portfolio links"],
      color: "bg-pink-50 border-pink-200",
      category: "marketing"
    },
    {
      id: "accounts-ledger",
      name: "Accounts & Finance",
      description: "Structured sections for financial reporting, audits, and compliance.",
      icon: Calculator,
      features: ["Reports & audits", "Compliance", "Certifications"],
      color: "bg-emerald-50 border-emerald-200",
      category: "accounts"
    }
  ] as const

  const categories = [
    { id: "all", label: "All" },
    { id: "tech", label: "Tech" },
    { id: "marketing", label: "Digital Marketing" },
    { id: "accounts", label: "Accounts" },
    { id: "general", label: "General" }
  ]

  const templates = useMemo(() => {
    if (category === "all") return allTemplates
    return allTemplates.filter(t => t.category === category)
  }, [category])

  const handleTemplateSelect = async (templateId: string) => {
    setIsSelecting(true)
    try {
      onTemplateSelect(templateId, selectedColor)
      await new Promise(resolve => setTimeout(resolve, 150))
      setIsOpen(false)
    } finally {
      setIsSelecting(false)
    }
  }

  const nextTemplate = () => {
    setCurrentTemplateIndex((prev) => (prev + 1) % templates.length)
  }

  const prevTemplate = () => {
    setCurrentTemplateIndex((prev) => (prev - 1 + templates.length) % templates.length)
  }

  const openModal = () => {
    setIsOpen(true)
    const idx = templates.findIndex(t => t.id === selectedTemplate)
    setCurrentTemplateIndex(idx >= 0 ? idx : 0)
  }

  const colorOptions = [
    "#2563eb", // blue-600
    "#16a34a", // green-600
    "#dc2626", // red-600
    "#9333ea", // purple-600
    "#f59e0b", // amber-500
    "#0ea5e9"  // sky-500
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Current Template</h3>
          <p className="text-sm text-gray-600">
            Selected: <span className="font-medium">{allTemplates.find(t => t.id === selectedTemplate)?.name}</span>
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto" onClick={openModal}>
              <Palette className="w-4 h-4 mr-2" />
              Choose Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl sm:text-2xl">Choose Resume Template</DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Filter by category, preview a template, and pick a color theme
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-lg font-bold hover:bg-gray-100"
                >
                  ×
                </Button>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((c) => (
                  <Button
                    key={c.id}
                    variant={category === c.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setCategory(c.id); setCurrentTemplateIndex(0) }}
                  >
                    {c.label}
                  </Button>
                ))}
              </div>

              {/* Color Picker */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">Color:</span>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-6 rounded-full border ${selectedColor === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                      style={{ backgroundColor: c }}
                      aria-label={`Choose color ${c}`}
                    />
                  ))}
                </div>
              </div>

              {/* Template Carousel */}
              <div className="relative">
                {/* Navigation Arrows */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevTemplate}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 bg-white/80 hover:bg-white shadow-lg border rounded-full"
                  disabled={templates.length <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextTemplate}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 p-0 bg-white/80 hover:bg-white shadow-lg border rounded-full"
                  disabled={templates.length <= 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Template Display */}
                <div className="px-16 py-4">
                  {templates.map((template, index) => {
                    const IconComponent = template.icon
                    const isSelected = selectedTemplate === template.id
                    const isVisible = index === currentTemplateIndex
                    
                    if (!isVisible) return null
                    
                    return (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                          isSelected 
                            ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300 transform scale-105' 
                            : `hover:bg-gray-50 hover:scale-105 ${template.color}`
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select ${template.name} template`}
                      >
                        <CardHeader className="text-center pb-3">
                          <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <IconComponent className="w-12 h-12" />
                          </div>
                          <CardTitle className="text-2xl font-semibold">{template.name}</CardTitle>
                          <CardDescription className="text-base text-gray-600 max-w-md mx-auto">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {/* Features */}
                          <div className="space-y-3 mb-6">
                            {template.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-base text-gray-600">
                                <Check className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                                {feature}
                              </div>
                            ))}
                          </div>
                          
                          {/* Action Button */}
                          <Button 
                            className={`w-full transition-all duration-200 ${
                              isSelected 
                                ? 'bg-blue-600 hover:bg-blue-700 scale-105 shadow-lg' 
                                : 'bg-gray-600 hover:bg-gray-700 hover:scale-105'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTemplateSelect(template.id)
                            }}
                            disabled={isSelecting}
                          >
                            {isSelecting ? (
                              <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Selecting...
                              </>
                            ) : isSelected ? (
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

                {/* Template Indicators */}
                <div className="flex justify-center space-x-2 mt-4">
                  {templates.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTemplateIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentTemplateIndex 
                          ? 'bg-blue-600 scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to template ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
