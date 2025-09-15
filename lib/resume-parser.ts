import { z } from "zod"

// Schema for parsed resume data
export const ParsedResumeSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().optional(),
    email: z.string().optional(), // Made more flexible - can be empty or invalid
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

  // AI-powered parsing method
  static async parseWithAI(text: string, sessionToken?: string): Promise<ParsedResume> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

      const schemaExample = `{
        "personalInfo": {
          "fullName": "",
          "email": "",
          "phone": "",
          "location": "",
          "summary": ""
        },
        "skills": [],
        "workExperience": [
          {
            "company": "",
            "position": "",
            "startDate": "",
            "endDate": "",
            "current": false,
            "description": ""
          }
        ],
        "education": [
          {
            "school": "",
            "degree": "",
            "field": "",
            "graduationDate": ""
          }
        ]
      }`

      const prompt = [
        'You are a precise information extractor. Do NOT fabricate or add anything.',
        'Parse ONLY the provided resume text and return a single JSON object.',
        'Follow the EXACT structure and content found in the resume - do not force it into predefined categories.',
        'If a value is missing in the text, return an empty string for that field; use [] for empty arrays.',
        'Never include markdown code fences, comments, or extra text. Output must be a single JSON object.',
        '',
        'IMPORTANT: Extract work experience, professional summary, and all sections as they actually appear in the resume.',
        'Do not force everything into education. Look for actual job titles, companies, dates, and descriptions.',
        '',
        'Resume Text:',
        '"""',
        text,
        '"""',
        '',
        'Return JSON exactly per this schema (keys required, values may be empty strings/arrays):',
        schemaExample
      ].join('\n')

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (sessionToken) headers['Cookie'] = `session=${sessionToken}`

      const resp = await fetch(`${baseUrl}/api/ai/enhance-resume`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ resumeData: { content: text }, customPrompt: prompt }),
      })

      if (!resp.ok) throw new Error(`AI endpoint error: ${resp.status}`)
      const data: any = await resp.json()

      // Case 1: structured result object
      if (data && typeof data.result === 'object') {
        const ai = data.result
        console.log('AI Response structure:', JSON.stringify(ai, null, 2))
        
        const transformed = {
          personalInfo: {
            fullName: ai.fullName || ai.name || ai.personalInfo?.fullName || ai.personalInfo?.name || '',
            email: ai.email || ai.personalInfo?.email || '',
            phone: ai.phone || ai.personalInfo?.phone || '',
            location: ai.location || ai.personalInfo?.location || '',
            summary: ai.summary || ai.personalInfo?.summary || ai.objective || ai.profile || ''
          },
          skills: this.flattenSkills(ai.skills || ai.technicalSkills || ai.personalInfo?.skills || []),
          workExperience: this.transformExperience(ai.experience || ai.workExperience || ai.employment || ai.jobs || []),
          education: this.transformEducation(ai.education || ai.academic || ai.qualifications || []),
        }
        
        console.log('Transformed data:', JSON.stringify(transformed, null, 2))
        return ParsedResumeSchema.parse(transformed)
      }

      // Case 2: text content that contains JSON
      let raw = data?.enhancedContent || data?.content || ''
      if (typeof raw !== 'string') raw = String(raw ?? '')

      // Strip code fences if present
      if (raw.includes('```json')) raw = raw.split('```json')[1]?.split('```')[0] ?? raw
      else if (raw.includes('```')) raw = raw.split('```')[1]?.split('```')[0] ?? raw

      // Fallback: take substring from first { to last }
      if (!(raw.trim().startsWith('{') && raw.trim().endsWith('}'))) {
        const start = raw.indexOf('{')
        const end = raw.lastIndexOf('}')
        if (start !== -1 && end !== -1 && end > start) raw = raw.slice(start, end + 1)
      }

      const parsed = JSON.parse(raw)
      return ParsedResumeSchema.parse(parsed)
    } catch (err) {
      console.error('AI parsing error:', err)
      // Robust fallback: basic + enhanced + schema-safe
      const parser = new ResumeParser(text)
      const basic = parser.parse()
      const enhanced = this.enhanceBasicParsing(text, basic)
      const safe = ParsedResumeSchema.safeParse(enhanced)
      if (safe.success) return safe.data
      return basic as ParsedResume
    }
  }

  // Enhanced basic parsing with better pattern matching
  private static enhanceBasicParsing(text: string, basicResult: any): any {
    const enhanced = { ...basicResult }
    
    // Enhanced work experience extraction
    if (!enhanced.workExperience || enhanced.workExperience.length === 0) {
      enhanced.workExperience = this.extractWorkExperienceEnhanced(text)
    }
    
    // Enhanced education extraction
    if (!enhanced.education || enhanced.education.length === 0) {
      enhanced.education = this.extractEducationEnhanced(text)
    }
    
    return enhanced
  }

  private static extractWorkExperienceEnhanced(text: string): any[] {
    const experiences: any[] = []
    const lines = text.split('\n').map(line => line.trim())
    
    let inExperienceSection = false
    let currentExperience: any = null

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line === '') continue
        const lowerLine = line.toLowerCase()

        // Section start/end logic
        if (!inExperienceSection && ['experience', 'work history', 'employment', 'professional experience'].some(k => lowerLine.startsWith(k))) {
            inExperienceSection = true
            continue
        }
        if (inExperienceSection && ['education', 'skills', 'projects'].some(k => lowerLine.startsWith(k))) {
            if (currentExperience) experiences.push(currentExperience)
            break
        }
        if (!inExperienceSection) continue

        const isDescription = line.startsWith('•') || line.startsWith('-') || line.startsWith('*')
        const dateMatch = line.match(/(\d{4})\s*-\s*(Present|current|\d{4})/i)

        // A new job starts with a line that has a date and is not a description
        if (!isDescription && dateMatch) {
            if (currentExperience) experiences.push(currentExperience)
            
            currentExperience = {
                position: line.replace(dateMatch[0], '').trim(),
                company: 'Freelance', // Default to Freelance, can be overwritten by next line
                startDate: dateMatch[1],
                endDate: dateMatch[2],
                current: /present|current/i.test(dateMatch[2]),
                description: ''
            }

            // Check next line for company name
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1]
                if (nextLine && !nextLine.startsWith('•') && !/(\d{4})\s*-\s*(Present|current|\d{4})/i.test(nextLine)) {
                    currentExperience.company = nextLine
                    i++ // Skip next line since we consumed it
                }
            }
        } else if (currentExperience && isDescription) {
            // This is a description for the current job
            currentExperience.description += (currentExperience.description ? '\n' : '') + line
        }
    }

    if (currentExperience) experiences.push(currentExperience)
    
    return experiences.filter(e => e.position)
  }

  // Fallback method to extract work experience from unstructured text
  private static extractWorkExperienceFromText(text: string): any[] {
    const experiences: any[] = []
    
    // Look for common freelance/contract patterns
    const freelancePatterns = [
      /freelance\s+developer/i,
      /software\s+developer\s+-\s+freelance/i,
      /full\s+stack\s+developer/i,
      /flutter\s+developer/i,
      /web\s+developer/i
    ]
    
    freelancePatterns.forEach(pattern => {
      const match = text.match(pattern)
      if (match) {
        experiences.push({
          company: 'Freelance',
          position: match[0],
          startDate: '2022',
          endDate: 'Present',
          current: true,
          description: 'Freelance development work including web and mobile applications.'
        })
      }
    })
    
    return experiences
  }

  private static extractEducationEnhanced(text: string): any[] {
    const education: any[] = []
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    // Look for education patterns
    let inEducationSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check if we're entering an education section
      if (line.toLowerCase().includes('education') || line.toLowerCase().includes('academic')) {
        inEducationSection = true
        continue
      }
      
      if (inEducationSection) {
        // Look for degree patterns
        if (line.toLowerCase().includes('bachelor') || line.toLowerCase().includes('master') || 
            line.toLowerCase().includes('phd') || line.toLowerCase().includes('degree') ||
            line.toLowerCase().includes('university') || line.toLowerCase().includes('college') || line.startsWith('•')) {
          
          const eduEntry = {
            school: '',
            degree: '',
            field: '',
            graduationDate: ''
          }
          
          const cleanedLine = line.replace(/^•\s*/, '').replace(/\s+in$/, '').trim()

          // Extract degree and school
          if (cleanedLine.includes('–') || cleanedLine.includes('-')) {
            const parts = cleanedLine.split(/[-–]/)
            eduEntry.degree = parts[0].trim()
            if (parts.length > 1) {
              eduEntry.school = parts[1].trim()
            }
          } else {
            eduEntry.degree = cleanedLine
          }
          
          // Extract graduation year
          const yearMatch = cleanedLine.match(/\d{4}/)
          if (yearMatch) {
            eduEntry.graduationDate = yearMatch[0]
            eduEntry.school = eduEntry.school.replace(yearMatch[0], '').trim()
            eduEntry.degree = eduEntry.degree.replace(yearMatch[0], '').trim()
          }
          
          education.push(eduEntry)
        }
        
        // Check if we're leaving education section
        else if (line.toLowerCase().includes('skills') || line.toLowerCase().includes('experience')) {
          break
        }
      }
    }
    
    return education
  }

  // Helper method to flatten skills from categorized format to flat array
  private static flattenSkills(skills: any): string[] {
    if (!skills) return []
    
    if (Array.isArray(skills)) {
      return skills
    }
    
    // If skills is an object with categories, flatten it
    const flattened: string[] = []
    for (const [category, skillList] of Object.entries(skills)) {
      if (Array.isArray(skillList)) {
        flattened.push(category + ': ' + skillList.join(', '))
      }
    }
    return flattened
  }

  // Helper method to transform experience data
  private static transformExperience(experience: any[]): any[] {
    if (!Array.isArray(experience)) return []
    
    return experience.map(exp => ({
      company: exp.company || '',
      position: exp.role || exp.position || '',
      startDate: this.extractStartDate(exp.period || ''),
      endDate: this.extractEndDate(exp.period || ''),
      current: this.isCurrent(exp.period || ''),
      description: exp.description || ''
    }))
  }

  // Helper method to transform education data
  private static transformEducation(education: any[]): any[] {
    if (!Array.isArray(education)) return []
    
    return education.map(edu => ({
      school: edu.institution || edu.school || '',
      degree: edu.degree || '',
      field: edu.field || edu.degree || '',
      graduationDate: edu.year || edu.graduationDate || ''
    }))
  }

  // Helper method to extract start date from period string
  private static extractStartDate(period: string): string {
    if (!period) return ''
    const parts = period.split(' - ')
    return parts[0] || ''
  }

  // Helper method to extract end date from period string
  private static extractEndDate(period: string): string {
    if (!period) return ''
    const parts = period.split(' - ')
    return parts[1] || ''
  }

  // Helper method to check if position is current
  private static isCurrent(period: string): boolean {
    return period.toLowerCase().includes('present')
  }

  private extractPersonalInfo() {
    const personalInfo: any = {}
    const lines = this.text.split('\n').map(line => line.trim()).filter(line => line.length > 0)

    // Look for name (usually first line or most prominent text)
    if (lines.length > 0) {
      const nameLine = lines.find(line => 
        line.length > 0 && 
        line.length < 50 && 
        !line.includes('@') && 
        !line.includes('http') &&
        !line.includes('www') &&
        !line.includes('+') &&
        !line.includes('phone') &&
        !line.includes('email') &&
        line.split(' ').length <= 4 &&
        /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(line) // Only proper names
      )
      if (nameLine) {
        personalInfo.fullName = nameLine
      } else if (!lines[0].includes('@')) {
        personalInfo.fullName = lines[0]
      }
    }

    // Look for email patterns (enhanced)
    const emailMatch = this.text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
    if (emailMatch) {
      personalInfo.email = emailMatch[0]
    }

    // Look for phone patterns (enhanced for international formats)
    const phonePatterns = [
      /(?:\+91|0)?[-\s]?[6-9]\d{9}/g,
      /\+?[\d\s\-\(\)]{10,}/g,
    ]
    
    for (const pattern of phonePatterns) {
      const phoneMatch = this.text.match(pattern)
      if (phoneMatch && phoneMatch[0]) {
        personalInfo.phone = phoneMatch[0].trim()
        break
      }
    }

    // Look for location (enhanced patterns for Indian cities and international)
    const locationPatterns = [
      /\b[A-Z][a-z]+,\s*[A-Z][a-z]+\b/,  // City, Country
      /(Mumbai|Delhi|Bangalore|Chennai|Kolkata|Hyderabad|Pune|Ahmedabad|Jaipur|Lucknow|India)/gi,
    ]
    
    for (const pattern of locationPatterns) {
      const locationMatch = this.text.match(pattern)
      if (locationMatch && locationMatch[0]) {
        personalInfo.location = locationMatch[0].trim()
        break
      }
    }

    // Look for summary/objective (enhanced with multi-line support)
    const summaryKeywords = ['professional summary', 'summary', 'objective', 'profile', 'about', 'overview']
    let inSummarySection = false
    let summaryLines = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lowerLine = line.toLowerCase()
      
      if (summaryKeywords.some(keyword => lowerLine.startsWith(keyword))) {
        inSummarySection = true
        continue
      }
      
      if (inSummarySection) {
        if (['experience', 'education', 'skills', 'work', 'employment'].some(k => lowerLine.startsWith(k))) {
          break
        }
        
        if (line.length > 10) {
          summaryLines.push(line.replace(/^•\s*/, ''))
        }
      }
    }
    
    if (summaryLines.length > 0) {
      personalInfo.summary = summaryLines.join(' ').trim()
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
    
    // Look for experience section with more keywords
    const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience', 'work', 'career']
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
        if (lowerLine.includes('education') || lowerLine.includes('skills') || lowerLine.includes('projects') ||
            lowerLine.includes('certifications') || lowerLine.includes('languages')) {
          break
        }
        
        // Enhanced job entry detection
        const hasJobKeywords = lowerLine.includes('developer') || lowerLine.includes('engineer') || 
                              lowerLine.includes('manager') || lowerLine.includes('analyst') ||
                              lowerLine.includes('consultant') || lowerLine.includes('freelance') ||
                              lowerLine.includes('intern') || lowerLine.includes('assistant') ||
                              lowerLine.includes('specialist') || lowerLine.includes('coordinator') ||
                              lowerLine.includes('architect') || lowerLine.includes('lead') ||
                              lowerLine.includes('senior') || lowerLine.includes('junior')
        
        const hasDatePattern = /\d{4}|\d{4}-\d{4}|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(line)
        
        // Look for company/position patterns - more flexible
        if (line.includes(' - ') || line.includes(' at ') || line.includes('@') || 
            (hasJobKeywords && hasDatePattern) || line.includes('(') && line.includes(')')) {
          
          // Save previous experience if exists
          if (currentExperience.company && currentExperience.position) {
            experience.push({ ...currentExperience })
          }
          
          // Start new experience entry
          currentExperience = {
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
          }
          
          // Extract position and company with more flexible patterns
          if (line.includes(' - ')) {
            const parts = line.split(' - ')
            currentExperience.position = parts[0].trim()
            if (parts.length > 1) {
              currentExperience.company = parts[1].trim()
            }
          } else if (line.includes(' at ')) {
            const parts = line.split(' at ')
            currentExperience.position = parts[0].trim()
            if (parts.length > 1) {
              currentExperience.company = parts[1].trim()
            }
          } else if (line.includes('@')) {
            const parts = line.split('@')
            currentExperience.position = parts[0].trim()
            if (parts.length > 1) {
              currentExperience.company = parts[1].trim()
            }
          } else if (line.includes('(') && line.includes(')')) {
            // Handle patterns like "Software Developer (2022 - Present)"
            const parenMatch = line.match(/^(.+?)\s*\((.+?)\)/)
            if (parenMatch) {
              currentExperience.position = parenMatch[1].trim()
              currentExperience.company = 'Freelance' // Default for freelance work
            }
          } else if (hasJobKeywords) {
            // If it looks like a job title, use the whole line as position
            currentExperience.position = line
            currentExperience.company = 'Company'
          }
          
          // Extract dates with more flexible patterns
          const dateMatch = line.match(/(\d{4}|\d{4}-\d{4}|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi)
          if (dateMatch) {
            const dates = dateMatch.join(' - ')
            if (dates.toLowerCase().includes('present') || dates.toLowerCase().includes('current')) {
              currentExperience.current = true
              currentExperience.endDate = 'Present'
            }
            const dateParts = dates.split(' - ')
            currentExperience.startDate = dateParts[0] || ''
            if (!currentExperience.current && dateParts.length > 1) {
              currentExperience.endDate = dateParts[1] || ''
            }
          }
        }
        
        // Collect description lines with more bullet patterns
        else if (currentExperience.position && (line.startsWith('•') || line.startsWith('-') || 
                 line.startsWith('*') || line.startsWith('◦') || line.startsWith('▪'))) {
          currentExperience.description += line + '\n'
        }
        
        // Also collect lines that look like job descriptions (contain action verbs)
        else if (currentExperience.position && (
          lowerLine.includes('developed') || lowerLine.includes('built') || 
          lowerLine.includes('created') || lowerLine.includes('implemented') ||
          lowerLine.includes('managed') || lowerLine.includes('led') ||
          lowerLine.includes('collaborated') || lowerLine.includes('designed') ||
          lowerLine.includes('optimized') || lowerLine.includes('delivered') ||
          lowerLine.includes('maintained') || lowerLine.includes('improved') ||
          lowerLine.includes('debugged') || lowerLine.includes('tested')
        )) {
          currentExperience.description += '• ' + line + '\n'
        }
      }
      
      // Add the last experience entry
      if (currentExperience.position) {
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
        
        // Use pdf-parse library to extract text
        const pdfParse = await import('pdf-parse/lib/pdf-parse.js')
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
