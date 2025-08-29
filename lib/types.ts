export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    summary: string
  }
  skills: string[]
  workExperience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
    current: boolean
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    graduationDate: string
  }>
  certifications?: Array<{
    name: string
    issuer: string
    issueDate: string
    expiryDate?: string
    credentialId?: string
    url?: string
  }>
  projects?: Array<{
    name: string
    description: string
    technologies: string[]
    startDate: string
    endDate: string
    url?: string
    current: boolean
  }>
  languages?: Array<{
    name: string
    proficiency: string
  }>
  socialLinks?: Array<{
    platform: string
    url: string
    username: string
  }>
  interests?: string[]
}
