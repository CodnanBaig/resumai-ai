import { z } from "zod"

// Schema for parsed resume data
export const ParsedResumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
  }).optional(),
  skills: z.array(z.string()).optional(),
  workExperience: z.array(z.object({
    company: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
    current: z.boolean().optional(),
  })).optional(),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    field: z.string(),
    graduationDate: z.string().optional(),
  })).optional(),
})

export type ParsedResume = z.infer<typeof ParsedResumeSchema>

// Keywords that commonly appear in resumes
const RESUME_KEYWORDS = {
  personal: ['name', 'email', 'phone', 'address', 'location', 'summary', 'objective', 'profile'],
  skills: ['skills', 'technologies', 'programming', 'languages', 'tools', 'frameworks', 'databases'],
  experience: ['experience', 'work', 'employment', 'job', 'position', 'company', 'responsibilities'],
  education: ['education', 'degree', 'university', 'college', 'school', 'graduation', 'major', 'field'],
  dates: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'present', 'current'],
}

// Common job titles and industries
const COMMON_TITLES = [
  'software engineer', 'developer', 'programmer', 'analyst', 'manager', 'director',
  'consultant', 'specialist', 'coordinator', 'assistant', 'intern', 'lead', 'senior',
  'junior', 'principal', 'architect', 'designer', 'researcher', 'scientist'
]

// Common skills
const COMMON_SKILLS = [
  'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift',
  'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
  'mysql', 'postgresql', 'mongodb', 'redis', 'aws', 'azure', 'gcp', 'docker',
  'kubernetes', 'git', 'agile', 'scrum', 'machine learning', 'ai', 'data analysis'
]

export class ResumeParser {
  private text: string
  private lines: string[]

  constructor(text: string) {
    this.text = text.toLowerCase()
    this.lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  }

  parse(): ParsedResume {
    const result: ParsedResume = {}

    // Extract personal information
    result.personalInfo = this.extractPersonalInfo()
    
    // Extract skills
    result.skills = this.extractSkills()
    
    // Extract work experience
    result.workExperience = this.extractWorkExperience()
    
    // Extract education
    result.education = this.extractEducation()

    return result
  }

  private extractPersonalInfo() {
    const personalInfo: any = {}
    
    // Look for email patterns
    const emailMatch = this.text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
    if (emailMatch) {
      personalInfo.email = emailMatch[0]
    }

    // Look for phone patterns
    const phoneMatch = this.text.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    if (phoneMatch) {
      personalInfo.phone = phoneMatch[0]
    }

    // Look for name (usually first line or near the top)
    const nameLine = this.lines.find(line => 
      line.length > 0 && 
      line.length < 50 && 
      !line.includes('@') && 
      !line.includes('http') &&
      !line.includes('www') &&
      line.split(' ').length <= 4
    )
    if (nameLine) {
      personalInfo.fullName = nameLine
    }

    // Look for location (city, state patterns)
    const locationMatch = this.text.match(/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/)
    if (locationMatch) {
      personalInfo.location = locationMatch[0]
    }

    // Look for summary/objective
    const summaryKeywords = ['summary', 'objective', 'profile', 'about']
    for (const keyword of summaryKeywords) {
      const summaryIndex = this.lines.findIndex(line => line.toLowerCase().includes(keyword))
      if (summaryIndex !== -1 && summaryIndex + 1 < this.lines.length) {
        personalInfo.summary = this.lines[summaryIndex + 1]
        break
      }
    }

    return personalInfo
  }

  private extractSkills(): string[] {
    const skills: string[] = []
    
    // Look for skills section
    const skillsSectionIndex = this.lines.findIndex(line => 
      line.toLowerCase().includes('skills') || 
      line.toLowerCase().includes('technologies') ||
      line.toLowerCase().includes('programming')
    )

    if (skillsSectionIndex !== -1) {
      // Extract skills from the next few lines
      for (let i = skillsSectionIndex + 1; i < Math.min(skillsSectionIndex + 5, this.lines.length); i++) {
        const line = this.lines[i]
        if (line.length > 0 && !line.toLowerCase().includes('experience') && !line.toLowerCase().includes('education')) {
          // Split by common delimiters and extract individual skills
          const lineSkills = line.split(/[,•|;]/).map(skill => skill.trim()).filter(skill => skill.length > 0)
          skills.push(...lineSkills)
        }
      }
    }

    // Also look for skills mentioned throughout the document
    for (const skill of COMMON_SKILLS) {
      if (this.text.includes(skill.toLowerCase())) {
        if (!skills.includes(skill)) {
          skills.push(skill)
        }
      }
    }

    return skills.slice(0, 20) // Limit to 20 skills
  }

  private extractWorkExperience() {
    const experience: any[] = []
    
    // Look for experience section
    const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience']
    let experienceSectionIndex = -1
    
    for (const keyword of experienceKeywords) {
      experienceSectionIndex = this.lines.findIndex(line => line.toLowerCase().includes(keyword))
      if (experienceSectionIndex !== -1) break
    }

    if (experienceSectionIndex !== -1) {
      let currentExperience: any = {}
      let inExperienceSection = false
      
      for (let i = experienceSectionIndex + 1; i < this.lines.length; i++) {
        const line = this.lines[i]
        const lowerLine = line.toLowerCase()
        
        // Check if we've moved to another section
        if (lowerLine.includes('education') || lowerLine.includes('skills') || lowerLine.includes('projects')) {
          break
        }
        
        // Look for company/position patterns
        if (line.length > 0 && line.length < 100) {
          // Check if this line might be a job entry
          const hasCompany = COMMON_TITLES.some(title => lowerLine.includes(title))
          const hasDate = RESUME_KEYWORDS.dates.some(date => lowerLine.includes(date))
          
          if (hasCompany || hasDate) {
            // Save previous experience if exists
            if (currentExperience.company && currentExperience.position) {
              experience.push({ ...currentExperience })
            }
            
            // Start new experience entry
            currentExperience = {}
            
            // Try to extract company and position
            const parts = line.split(/[-–—|]/)
            if (parts.length >= 2) {
              currentExperience.company = parts[0].trim()
              currentExperience.position = parts[1].trim()
            } else {
              currentExperience.company = line
              currentExperience.position = "Position"
            }
            
            // Look for dates
            const dateMatch = line.match(/(\w{3}\s+\d{4})\s*[-–—]?\s*(\w{3}\s+\d{4}|present|current)/i)
            if (dateMatch) {
              currentExperience.startDate = dateMatch[1]
              currentExperience.endDate = dateMatch[2]
              currentExperience.current = dateMatch[2].toLowerCase() === 'present' || dateMatch[2].toLowerCase() === 'current'
            }
          } else if (currentExperience.company && line.length > 20) {
            // This might be a description line
            if (!currentExperience.description) {
              currentExperience.description = line
            } else {
              currentExperience.description += ' ' + line
            }
          }
        }
      }
      
      // Add the last experience entry
      if (currentExperience.company && currentExperience.position) {
        experience.push({ ...currentExperience })
      }
    }

    return experience
  }

  private extractEducation() {
    const education: any[] = []
    
    // Look for education section
    const educationSectionIndex = this.lines.findIndex(line => 
      line.toLowerCase().includes('education') || 
      line.toLowerCase().includes('academic')
    )

    if (educationSectionIndex !== -1) {
      let currentEducation: any = {}
      
      for (let i = educationSectionIndex + 1; i < this.lines.length; i++) {
        const line = this.lines[i]
        const lowerLine = line.toLowerCase()
        
        // Check if we've moved to another section
        if (lowerLine.includes('experience') || lowerLine.includes('skills') || lowerLine.includes('projects')) {
          break
        }
        
        if (line.length > 0 && line.length < 100) {
          // Look for degree patterns
          const degreeKeywords = ['bachelor', 'master', 'phd', 'associate', 'diploma', 'certificate']
          const hasDegree = degreeKeywords.some(keyword => lowerLine.includes(keyword))
          
          if (hasDegree) {
            // Save previous education if exists
            if (currentEducation.school && currentEducation.degree) {
              education.push({ ...currentEducation })
            }
            
            // Start new education entry
            currentEducation = {}
            
            // Try to extract school and degree
            const parts = line.split(/[-–—|]/)
            if (parts.length >= 2) {
              currentEducation.school = parts[0].trim()
              currentEducation.degree = parts[1].trim()
            } else {
              currentEducation.school = line
              currentEducation.degree = "Degree"
            }
            
            // Look for graduation date
            const dateMatch = line.match(/(\d{4})/)
            if (dateMatch) {
              currentEducation.graduationDate = dateMatch[1]
            }
          } else if (currentEducation.school && line.length > 10) {
            // This might be additional education info
            if (!currentEducation.field) {
              currentEducation.field = line
            }
          }
        }
      }
      
      // Add the last education entry
      if (currentEducation.school && currentEducation.degree) {
        education.push({ ...currentEducation })
      }
    }

    return education
  }

  // Helper method to extract text from different file types
  static async extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'text/plain') {
      return await file.text()
    }
    
    if (file.type === 'application/pdf') {
      try {
        // Convert file to ArrayBuffer for PDF parsing
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        // Dynamic import to avoid SSR issues
        const pdfParse = await import('pdf-parse')
        const data = await pdfParse.default(buffer)
        
        return data.text
      } catch (error) {
        console.error('PDF parsing error:', error)
        throw new Error('Failed to parse PDF file. Please ensure the file is not corrupted and try again.')
      }
    }
    
    if (file.type.includes('word') || file.type.includes('document')) {
      // For Word documents, we'll need to implement DOC/DOCX parsing
      // For now, return a placeholder
      throw new Error('Word document parsing not yet implemented. Please upload a text file or PDF.')
    }
    
    throw new Error('Unsupported file type. Please upload a text file, PDF, or Word document.')
  }
}
