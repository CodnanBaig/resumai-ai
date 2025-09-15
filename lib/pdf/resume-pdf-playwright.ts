import { chromium } from 'playwright'

type WorkItem = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  current: boolean
}

type EducationItem = {
  school: string
  degree: string
  field: string
  graduationDate: string
}

export interface ResumeData {
  personalInfo?: {
    fullName?: string
    email?: string
    phone?: string
    location?: string
    summary?: string
  }
  skills?: string[]
  workExperience?: WorkItem[]
  education?: EducationItem[]
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

export interface CreateResumePdfOptions {
  resumeData: ResumeData
  template?: string | null
  accentColor?: string | null
}

function generateHTML(resumeData: ResumeData, template: string | null = 'minimal', accentColor: string | null = '#2563eb'): string {
  const fullName = resumeData.personalInfo?.fullName || 'Unnamed Candidate'
  const contactLine = [resumeData.personalInfo?.email, resumeData.personalInfo?.phone, resumeData.personalInfo?.location]
    .filter(Boolean)
    .join(' • ')

  const baseStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
      .page { width: 210mm; height: 297mm; margin: 0 auto; padding: 20mm; background: white; }
      .header { margin-bottom: 20px; }
      .name { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
      .contact { font-size: 12px; color: #666; margin-bottom: 4px; }
      .section { margin-top: 20px; }
      .section-title { font-size: 16px; font-weight: bold; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
      .summary { font-size: 12px; line-height: 1.6; margin-bottom: 8px; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
      .skill-item { background: #f3f4f6; padding: 4px 12px; border-radius: 12px; font-size: 11px; }
      .job { margin-bottom: 16px; }
      .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
      .job-title { font-size: 14px; font-weight: bold; }
      .job-company { font-size: 12px; color: #666; }
      .job-dates { font-size: 11px; color: #888; }
      .job-description { font-size: 11px; line-height: 1.5; margin-top: 6px; }
      .education-item { margin-bottom: 12px; }
      .education-degree { font-size: 13px; font-weight: bold; }
      .education-school { font-size: 11px; color: #666; }
      .education-date { font-size: 10px; color: #888; }
    </style>
  `

  let templateStyles = ''
  let templateHTML = ''

  switch (template) {
    case 'corporate':
      templateStyles = `
        <style>
          .name { color: #1f2937; border-bottom: 3px solid #1f2937; padding-bottom: 8px; }
          .section-title { color: #1f2937; border-bottom: 2px solid #1f2937; padding-bottom: 4px; }
          .job-title { color: #1f2937; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="header">
            <div class="name">${fullName}</div>
            <div class="contact">${contactLine}</div>
          </div>
          
          ${resumeData.personalInfo?.summary ? `
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <div class="summary">${resumeData.personalInfo.summary}</div>
            </div>
          ` : ''}
          
          ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Professional Experience</div>
              ${resumeData.workExperience.map(job => `
                <div class="job">
                  <div class="job-header">
                    <div>
                      <div class="job-title">${job.position || 'Position'}</div>
                      <div class="job-company">${job.company || 'Company'}</div>
                    </div>
                    <div class="job-dates">
                      ${(job.startDate ? new Date(/^\d{4}-\d{2}$/.test(job.startDate) ? job.startDate + '-01' : job.startDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : '')}
                      -
                      ${(job.current ? 'Present' : (job.endDate ? new Date(/^\d{4}-\d{2}$/.test(job.endDate) ? job.endDate + '-01' : job.endDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : ''))}
                    </div>
                  </div>
                  ${job.description ? `<div class="job-description">${job.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resumeData.education && resumeData.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${resumeData.education.map(edu => `
                <div class="education-item">
                  <div class="education-degree">${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</div>
                  <div class="education-school">${edu.school || 'School'}</div>
                  <div class="education-date">${edu.graduationDate || ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resumeData.skills && resumeData.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Core Competencies</div>
              <div class="skills-list">
                ${resumeData.skills.map(skill => `<div class="skill-item">• ${skill}</div>`).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.certifications && resumeData.certifications.length > 0 ? `
            <div class="section">
              <div class="section-title">Certifications</div>
              ${resumeData.certifications.map(cert => `
                <div class="education-item">
                  <div class="education-degree">${cert.name || 'Certification'}</div>
                  <div class="education-school">${cert.issuer || ''} • ${cert.issueDate || ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resumeData.projects && resumeData.projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              ${resumeData.projects.map(project => `
                <div class="job">
                  <div class="job-header">
                    <div>
                      <div class="job-title">${project.name || 'Project'}</div>
                    </div>
                    <div class="job-dates">
                      ${project.startDate || ''} - ${project.current ? 'Present' : project.endDate || ''}
                    </div>
                  </div>
                  ${project.description ? `<div class="job-description">${project.description}</div>` : ''}
                  ${project.technologies && project.technologies.length > 0 ? `
                    <div style="margin-top: 8px;">
                      ${project.technologies.map(tech => `<span class="skill-item">${tech}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resumeData.languages && resumeData.languages.length > 0 ? `
            <div class="section">
              <div class="section-title">Languages</div>
              <div class="skills-list">
                ${resumeData.languages.map(lang => `<span class="skill-item">${lang.name} (${lang.proficiency})</span>`).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.socialLinks && resumeData.socialLinks.length > 0 ? `
            <div class="section">
              <div class="section-title">Social Links</div>
              <div class="skills-list">
                ${resumeData.socialLinks.map(link => {
                  const url = link.url || (link.username && /^https?:\/\//.test(link.username) ? link.username : null)
                  const label = `${link.platform}: ${link.username}`
                  return url 
                    ? `<a class=\"skill-item\" href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${label}</a>`
                    : `<span class=\"skill-item\">${label}</span>`
                }).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.interests && resumeData.interests.length > 0 ? `
            <div class="section">
              <div class="section-title">Interests</div>
              <div class="skills-list">
                ${resumeData.interests.map(interest => `<span class="skill-item">${interest}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `
      break

    case 'creative':
      templateStyles = `
        <style>
          .page { display: flex; }
          .sidebar { width: 30%; background: #f8fafc; padding: 20px; }
          .main-content { width: 70%; padding: 20px; }
          .name { color: ${accentColor}; }
          .section-title { color: ${accentColor}; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="sidebar">
            <div class="header">
              <div class="name">${fullName}</div>
              <div class="contact">${resumeData.personalInfo?.email || ''}</div>
              <div class="contact">${resumeData.personalInfo?.phone || ''}</div>
              <div class="contact">${resumeData.personalInfo?.location || ''}</div>
            </div>
            
            ${resumeData.skills && resumeData.skills.length > 0 ? `
              <div class="section">
                <div class="section-title">Skills</div>
                <div class="skills-list">
                  ${resumeData.skills.map(skill => `<div class="skill-item">• ${skill}</div>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${resumeData.education && resumeData.education.length > 0 ? `
              <div class="section">
                <div class="section-title">Education</div>
                ${resumeData.education.map(edu => `
                  <div class="education-item">
                    <div class="education-degree">${edu.degree || 'Degree'}</div>
                    <div class="education-school">${edu.field || ''}</div>
                    <div class="education-school">${edu.school || 'School'}</div>
                    <div class="education-date">${edu.graduationDate || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.languages && resumeData.languages.length > 0 ? `
              <div class="section">
                <div class="section-title">Languages</div>
                <div class="skills-list">
                  ${resumeData.languages.map(lang => `<div class="skill-item">${lang.name} (${lang.proficiency})</div>`).join('')}
                </div>
              </div>
            ` : ''}

            ${resumeData.interests && resumeData.interests.length > 0 ? `
              <div class="section">
                <div class="section-title">Interests</div>
                <div class="skills-list">
                  ${resumeData.interests.map(interest => `<div class="skill-item">${interest}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div class="main-content">
            ${resumeData.personalInfo?.summary ? `
              <div class="section">
                <div class="section-title">About Me</div>
                <div class="summary">${resumeData.personalInfo.summary}</div>
              </div>
            ` : ''}
            
            ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
              <div class="section">
                <div class="section-title">Experience</div>
                ${resumeData.workExperience.map(job => `
                  <div class="job">
                    <div class="job-title">${job.position || 'Position'}</div>
                    <div class="job-company">${job.company || 'Company'}</div>
                    <div class="job-dates">
                      ${job.startDate || ''} - ${job.current ? 'Present' : job.endDate || ''}
                    </div>
                    ${job.description ? `<ul class="job-description">${job.description
                      .split(/\r?\n/)
                      .map(line => line.trim())
                      .filter(line => line.length > 0)
                      .map(line => `<li>${line.replace(/^[-•*]\s*/, '')}</li>`)
                      .join('')}</ul>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.projects && resumeData.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Projects</div>
                ${resumeData.projects.map(project => `
                  <div class="job">
                    <div class="job-title">${project.name || 'Project'}</div>
                    <div class="job-dates">
                      ${project.startDate || ''} - ${project.current ? 'Present' : project.endDate || ''}
                    </div>
                    ${project.description ? `<div class="job-description">${project.description}</div>` : ''}
                    ${project.technologies && project.technologies.length > 0 ? `
                      <div style="margin-top: 8px;">
                        ${project.technologies.map(tech => `<span class="skill-item">${tech}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.certifications && resumeData.certifications.length > 0 ? `
              <div class="section">
                <div class="section-title">Certifications</div>
                ${resumeData.certifications.map(cert => `
                  <div class="job">
                    <div class="job-title">${cert.name || 'Certification'}</div>
                    <div class="job-company">${cert.issuer || ''}</div>
                    <div class="job-dates">${cert.issueDate || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.socialLinks && resumeData.socialLinks.length > 0 ? `
              <div class="section">
                <div class="section-title">Social Links</div>
                <div class="skills-list">
                  ${resumeData.socialLinks.map(link => {
                    const url = link.url || (link.username && /^https?:\/\//.test(link.username) ? link.username : null)
                    const label = `${link.platform}: ${link.username}`
                    return url 
                      ? `<a class=\"skill-item\" href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${label}</a>`
                      : `<span class=\"skill-item\">${label}</span>`
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `
      break

    case 'tech-modern':
      templateStyles = `
        <style>
          .page { position: relative; }
          .sidebar { position: absolute; left: 0; top: 0; width: 30%; background: #f8fafc; padding: 20px; border-right: 1px solid #e2e8f0; height: 100%; }
          .main-content { position: absolute; left: 30%; top: 0; width: 70%; padding: 20px; }
          .name { color: ${accentColor}; }
          .section-title { color: ${accentColor}; }
          .skill-tag { display: inline-block; background: ${accentColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; margin: 2px; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="sidebar">
            <div class="header">
              <div class="name">${fullName}</div>
              <div class="contact">${resumeData.personalInfo?.email || ''}</div>
              <div class="contact">${resumeData.personalInfo?.phone || ''}</div>
              <div class="contact">${resumeData.personalInfo?.location || ''}</div>
            </div>
            
            ${resumeData.skills && resumeData.skills.length > 0 ? `
              <div class="section">
                <div class="section-title">Tech Stack</div>
                <div class="skills-list">
                  ${resumeData.skills.slice(0, 12).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${resumeData.education && resumeData.education.length > 0 ? `
              <div class="section">
                <div class="section-title">Education</div>
                ${resumeData.education.map(edu => `
                  <div class="education-item">
                    <div class="education-degree">${edu.degree || 'Degree'}</div>
                    <div class="education-school">${edu.field || ''}</div>
                    <div class="education-school">${edu.school || 'School'}</div>
                    <div class="education-date">${edu.graduationDate || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.languages && resumeData.languages.length > 0 ? `
              <div class="section">
                <div class="section-title">Languages</div>
                <div class="skills-list">
                  ${resumeData.languages.map(lang => `<span class="skill-tag">${lang.name} (${lang.proficiency})</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${resumeData.certifications && resumeData.certifications.length > 0 ? `
              <div class="section">
                <div class="section-title">Certifications</div>
                ${resumeData.certifications.map(cert => `
                  <div class="education-item">
                    <div class="education-degree">${cert.name || 'Certification'}</div>
                    <div class="education-school">${cert.issuer || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="main-content">
            ${resumeData.personalInfo?.summary ? `
              <div class="section">
                <div class="section-title">Summary</div>
                <div class="summary">${resumeData.personalInfo.summary}</div>
              </div>
            ` : ''}
            
            ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
              <div class="section">
                <div class="section-title">Experience</div>
                ${resumeData.workExperience.map(job => `
                  <div class="job">
                    <div class="job-header">
                      <div>
                        <div class="job-title">${job.position || 'Position'}</div>
                        <div class="job-company">@ ${job.company || 'Company'}</div>
                      </div>
                      <div class="job-dates">
                        ${job.startDate || ''} - ${job.current ? 'Present' : job.endDate || ''}
                      </div>
                    </div>
                    ${job.description ? `<div class="job-description">${job.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.projects && resumeData.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Projects</div>
                ${resumeData.projects.map(project => `
                  <div class="job">
                    <div class="job-header">
                      <div>
                        <div class="job-title">${project.name || 'Project'}</div>
                      </div>
                      <div class="job-dates">
                        ${project.startDate || ''} - ${project.current ? 'Present' : project.endDate || ''}
                      </div>
                    </div>
                    ${project.description ? `<div class="job-description">${project.description}</div>` : ''}
                    ${project.technologies && project.technologies.length > 0 ? `
                      <div style="margin-top: 8px;">
                        ${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.socialLinks && resumeData.socialLinks.length > 0 ? `
              <div class="section">
                <div class="section-title">Social Links</div>
                <div class="skills-list">
                  ${resumeData.socialLinks.map(link => `<span class="skill-tag">${link.platform}: ${link.username}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${resumeData.interests && resumeData.interests.length > 0 ? `
              <div class="section">
                <div class="section-title">Interests</div>
                <div class="skills-list">
                  ${resumeData.interests.map(interest => `<span class="skill-tag">${interest}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `
      break

    case 'tech-compact':
      templateStyles = `
        <style>
          .name { color: ${accentColor}; }
          .section-title { color: ${accentColor}; font-weight: 600; margin: 12px 0 6px; }
          .tag { display: inline-block; padding: 2px 8px; border: 1px solid ${accentColor}55; border-radius: 4px; color: ${accentColor}; margin: 2px; font-size: 10px; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="header">
            <div class="name">${fullName}</div>
            <div class="contact">${contactLine}</div>
          </div>
          <div style="padding: 20px;">
            ${resumeData.personalInfo?.summary ? `
              <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${String(resumeData.personalInfo.summary)
                  .replace(/<br\s*\/?>/gi, '\n')
                  .replace(/<\/p>/gi, '\n\n')
                  .replace(/<p[^>]*>/gi, '')
                  .replace(/<[^>]*>/g, '')
                  .split(/\r?\n/).map(l => l.trim()).filter(Boolean).join('<br/>')}</div>
              </div>
            ` : ''}
            ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
              <div class="section">
                <div class="section-title">Experience</div>
                ${resumeData.workExperience.map(job => `
                  <div class="job">
                    <div class="job-title">${job.position || 'Position'}</div>
                    <div class="job-company">${job.company || 'Company'}</div>
                    <div class="job-dates">
                      ${(job.startDate ? new Date(/^\d{4}-\d{2}$/.test(job.startDate) ? job.startDate + '-01' : job.startDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : '')}
                      -
                      ${(job.current ? 'Present' : (job.endDate ? new Date(/^\d{4}-\d{2}$/.test(job.endDate) ? job.endDate + '-01' : job.endDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : ''))}
                    </div>
                    ${job.description ? `<ul class="job-description">${String(job.description).split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => `<li>${l.replace(/^[-•*]\s*/, '')}</li>`).join('')}</ul>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${resumeData.projects && resumeData.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Projects</div>
                ${resumeData.projects.map(p => `
                  <div class="job">
                    <div class="job-title">${p.name || 'Project'}</div>
                    ${p.description ? `<ul class="job-description">${String(p.description).split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => `<li>${l.replace(/^[-•*]\s*/, '')}</li>`).join('')}</ul>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${resumeData.skills && resumeData.skills.length > 0 ? `
              <div class="section">
                <div class="section-title">Tech Stack</div>
                ${resumeData.skills.map((s: string) => `<span class="tag">${s}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `
      break

    case 'tech-sidebar':
      templateStyles = `
        <style>
          .page { display: flex; }
          .sidebar { width: 32%; background: #f8fafc; padding: 20px; }
          .main-content { width: 68%; padding: 20px; }
          .name { color: ${accentColor}; }
          .section-title { color: ${accentColor}; }
          .tag { display: inline-block; padding: 2px 8px; border: 1px solid ${accentColor}55; border-radius: 4px; color: ${accentColor}; margin: 2px; font-size: 10px; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="sidebar">
            <div class="header">
              <div class="name">${fullName}</div>
              <div class="contact">${resumeData.personalInfo?.email || ''}</div>
              <div class="contact">${resumeData.personalInfo?.phone || ''}</div>
              <div class="contact">${resumeData.personalInfo?.location || ''}</div>
            </div>
            ${resumeData.skills && resumeData.skills.length > 0 ? `
              <div class="section">
                <div class="section-title">Tech Stack</div>
                ${resumeData.skills.map((s: string) => `<span class="tag">${s}</span>`).join('')}
              </div>
            ` : ''}
            ${resumeData.projects && resumeData.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Projects</div>
                <div class="skills-list">
                  ${resumeData.projects.map((p: any) => `<div class="skill-item">${p.name || 'Project'}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          <div class="main-content">
            ${resumeData.personalInfo?.summary ? `
              <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${String(resumeData.personalInfo.summary)
                  .replace(/<br\s*\/?>/gi, '\n')
                  .replace(/<\/p>/gi, '\n\n')
                  .replace(/<p[^>]*>/gi, '')
                  .replace(/<[^>]*>/g, '')
                  .split(/\r?\n/).map(l => l.trim()).filter(Boolean).join('<br/>')}</div>
              </div>
            ` : ''}
            ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
              <div class="section">
                <div class="section-title">Experience</div>
                ${resumeData.workExperience.map(job => `
                  <div class="job">
                    <div class="job-header">
                      <div>
                        <div class="job-title">${job.position || 'Position'}</div>
                        <div class="job-company">${job.company || 'Company'}</div>
                      </div>
                      <div class="job-dates">
                        ${(job.startDate ? new Date(/^\d{4}-\d{2}$/.test(job.startDate) ? job.startDate + '-01' : job.startDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : '')}
                        -
                        ${(job.current ? 'Present' : (job.endDate ? new Date(/^\d{4}-\d{2}$/.test(job.endDate) ? job.endDate + '-01' : job.endDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : ''))}
                      </div>
                    </div>
                    ${job.description ? `<ul class="job-description">${String(job.description).split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => `<li>${l.replace(/^[-•*]\s*/, '')}</li>`).join('')}</ul>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `
      break

    case 'tech-two-column':
      templateStyles = `
        <style>
          .grid { display: grid; grid-template-columns: 2fr 3fr; gap: 20px; }
          .name { color: ${accentColor}; }
          .section-title { color: ${accentColor}; font-weight: 600; margin: 12px 0 6px; }
          .tag { display: inline-block; padding: 2px 8px; border: 1px solid ${accentColor}55; border-radius: 4px; color: ${accentColor}; margin: 2px; font-size: 10px; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="header">
            <div class="name">${fullName}</div>
            <div class="contact">${contactLine}</div>
          </div>
          <div class="grid" style="padding: 20px;">
            <aside>
              ${resumeData.skills && resumeData.skills.length > 0 ? `
                <div class="section">
                  <div class="section-title">Tech Stack</div>
                  ${resumeData.skills.map((s: string) => `<span class="tag">${s}</span>`).join('')}
                </div>
              ` : ''}
              ${resumeData.projects && resumeData.projects.length > 0 ? `
                <div class="section">
                  <div class="section-title">Projects</div>
                  ${resumeData.projects.map((p: any) => `
                    <div class="job">
                      <div class="job-title">${p.name || 'Project'}</div>
                      ${p.description ? `<ul class="job-description">${String(p.description).split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => `<li>${l.replace(/^[-•*]\s*/, '')}</li>`).join('')}</ul>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </aside>
            <main>
              ${resumeData.personalInfo?.summary ? `
                <div class="section">
                  <div class="section-title">Professional Summary</div>
                  <div class="summary">${String(resumeData.personalInfo.summary)
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/p>/gi, '\n\n')
                    .replace(/<p[^>]*>/gi, '')
                    .replace(/<[^>]*>/g, '')
                    .split(/\r?\n/).map(l => l.trim()).filter(Boolean).join('<br/>')}</div>
                </div>
              ` : ''}
              ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
                <div class="section">
                  <div class="section-title">Experience</div>
                  ${resumeData.workExperience.map(job => `
                    <div class="job">
                      <div class="job-header">
                        <div>
                          <div class="job-title">${job.position || 'Position'}</div>
                          <div class="job-company">${job.company || 'Company'}</div>
                        </div>
                        <div class="job-dates">
                          ${(job.startDate ? new Date(/^\d{4}-\d{2}$/.test(job.startDate) ? job.startDate + '-01' : job.startDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : '')}
                          -
                          ${(job.current ? 'Present' : (job.endDate ? new Date(/^\d{4}-\d{2}$/.test(job.endDate) ? job.endDate + '-01' : job.endDate).toLocaleString('en-US', { month: 'short', year: 'numeric' }) : ''))}
                        </div>
                      </div>
                      ${job.description ? `<ul class="job-description">${String(job.description).split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => `<li>${l.replace(/^[-•*]\s*/, '')}</li>`).join('')}</ul>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </main>
          </div>
        </div>
      `
      break

    case 'marketing-brand':
      templateStyles = `
        <style>
          .hero-header { background: ${accentColor}; padding: 32px; margin-bottom: 0; color: white; }
          .name { color: white; }
          .contact { color: rgba(255,255,255,0.9); }
          .section-title { color: ${accentColor}; }
          .metric-badge { display: inline-block; background: ${accentColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 8px; margin: 2px; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="hero-header">
            <div class="name">${fullName}</div>
            <div class="contact">${contactLine}</div>
          </div>
          
          <div style="padding: 32px;">
            ${resumeData.personalInfo?.summary ? `
              <div class="section">
                <div class="section-title">Brand Summary</div>
                <div class="summary">${resumeData.personalInfo.summary}</div>
              </div>
            ` : ''}
            
            ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
              <div class="section">
                <div class="section-title">Campaign Experience</div>
                ${resumeData.workExperience.map(job => `
                  <div class="job">
                    <div class="job-header">
                      <div>
                        <div class="job-title">${job.position || 'Position'}</div>
                        <div class="job-company">${job.company || 'Company'}</div>
                      </div>
                      <div class="job-dates">
                        ${job.startDate || ''} - ${job.current ? 'Present' : job.endDate || ''}
                      </div>
                    </div>
                    ${job.description ? `<div class="job-description">${job.description}</div>` : ''}
                    <div style="margin-top: 8px;">
                      ${["CTR +18%", "CPL -22%", "ROAS 3.2x"].map((metric) => `<span class="metric-badge">${metric}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resumeData.skills && resumeData.skills.length > 0 ? `
              <div class="section">
                <div class="section-title">Core Skills</div>
                <div class="skills-list">
                  ${resumeData.skills.map(skill => `
                    <div style="margin-bottom: 8px; position: relative;">
                      <div style="width: 6px; height: 6px; border-radius: 3px; margin-right: 8px; background: ${accentColor}; position: absolute; left: 0; top: 2px;"></div>
                      <div style="font-size: 10px; color: #111827; margin-left: 16px;">${skill}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${resumeData.education && resumeData.education.length > 0 ? `
              <div class="section">
                <div class="section-title">Education</div>
                ${resumeData.education.map(edu => `
                  <div class="education-item">
                    <div class="education-degree">${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</div>
                    <div class="education-school">${edu.school || ''} • ${edu.graduationDate || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.certifications && resumeData.certifications.length > 0 ? `
              <div class="section">
                <div class="section-title">Certifications</div>
                ${resumeData.certifications.map(cert => `
                  <div class="education-item">
                    <div class="education-degree">${cert.name || 'Certification'}</div>
                    <div class="education-school">${cert.issuer || ''} • ${cert.issueDate || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.projects && resumeData.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Campaign Projects</div>
                ${resumeData.projects.map(project => `
                  <div class="job">
                    <div class="job-header">
                      <div>
                        <div class="job-title">${project.name || 'Project'}</div>
                      </div>
                      <div class="job-dates">
                        ${project.startDate || ''} - ${project.current ? 'Present' : project.endDate || ''}
                      </div>
                    </div>
                    ${project.description ? `<div class="job-description">${project.description}</div>` : ''}
                    ${project.technologies && project.technologies.length > 0 ? `
                      <div style="margin-top: 8px;">
                        ${project.technologies.map(tech => `<span class="metric-badge">${tech}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.languages && resumeData.languages.length > 0 ? `
              <div class="section">
                <div class="section-title">Languages</div>
                <div class="skills-list">
                  ${resumeData.languages.map(lang => `<span class="metric-badge">${lang.name} (${lang.proficiency})</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${resumeData.socialLinks && resumeData.socialLinks.length > 0 ? `
              <div class="section">
                <div class="section-title">Social Links</div>
                <div class="skills-list">
                  ${resumeData.socialLinks.map(link => {
                    const url = link.url || (link.username && /^https?:\/\//.test(link.username) ? link.username : null)
                    const label = `${link.platform}: ${link.username}`
                    return url 
                      ? `<a class=\"metric-badge\" href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${label}</a>`
                      : `<span class=\"metric-badge\">${label}</span>`
                  }).join('')}
                </div>
              </div>
            ` : ''}

            ${resumeData.interests && resumeData.interests.length > 0 ? `
              <div class="section">
                <div class="section-title">Interests</div>
                <div class="skills-list">
                  ${resumeData.interests.map(interest => `<span class="metric-badge">${interest}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `
      break

    case 'accounts-ledger':
      templateStyles = `
        <style>
          .name { color: ${accentColor}; }
          .section-title { color: ${accentColor}; }
          .divider { height: 4px; margin-top: 16px; background: ${accentColor}; }
          .tag { display: inline-block; padding: 4px 8px; border: 1px solid ${accentColor}55; border-radius: 4px; color: #111827; margin-right: 4px; margin-bottom: 4px; font-size: 8px; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="header">
            <div class="name">${fullName}</div>
            <div class="contact">${contactLine}</div>
          </div>
          
          <div class="divider"></div>
          
          <div style="padding: 32px;">
            ${resumeData.personalInfo?.summary ? `
              <div class="section">
                <div class="section-title">Professional Summary</div>
                <div class="summary">${String(resumeData.personalInfo.summary)
                  .replace(/<br\s*\/?>/gi, '\n')
                  .replace(/<\/p>/gi, '\n\n')
                  .replace(/<p[^>]*>/gi, '')
                  .replace(/<[^>]*>/g, '')
                  .split(/\r?\n/)
                  .map(line => line.trim())
                  .filter(line => line.length > 0)
                  .join('<br/>')}</div>
              </div>
            ` : ''}
            
            ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
              <div class="section">
                <div class="section-title">Accounting Experience</div>
                ${resumeData.workExperience.map(job => `
                  <div class="job">
                    <div class="job-header">
                      <div>
                        <div class="job-title">${job.position || 'Position'}</div>
                        <div class="job-company">${job.company || 'Company'}</div>
                      </div>
                      <div class="job-dates">
                        ${job.startDate || ''} - ${job.current ? 'Present' : job.endDate || ''}
                      </div>
                    </div>
                    ${job.description ? `<div class="job-description">${job.description}</div>` : ''}
                    <div style="margin-top: 8px;">
                      ${["GAAP", "IFRS", "Audit", "Tax", "AP/AR", "Forecasting"].map((tag) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${resumeData.skills && resumeData.skills.length > 0 ? `
              <div class="section">
                <div class="section-title">Certifications & Skills</div>
                <div class="skills-list">
                  ${resumeData.skills.map(skill => `<span class="tag" style="color: ${accentColor}; border: 1px solid ${accentColor};">${skill}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${resumeData.education && resumeData.education.length > 0 ? `
              <div class="section">
                <div class="section-title">Education</div>
                ${resumeData.education.map(edu => `
                  <div class="education-item">
                    <div class="education-degree">${edu.degree || 'Degree'} ${edu.field ? `in ${edu.field}` : ''}</div>
                    <div class="education-school">${edu.school || ''} • ${edu.graduationDate || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.certifications && resumeData.certifications.length > 0 ? `
              <div class="section">
                <div class="section-title">Certifications</div>
                ${resumeData.certifications.map(cert => `
                  <div class="education-item">
                    <div class="education-degree">${cert.name || 'Certification'}</div>
                    <div class="education-school">${cert.issuer || ''} • ${cert.issueDate || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.projects && resumeData.projects.length > 0 ? `
              <div class="section">
                <div class="section-title">Projects</div>
                ${resumeData.projects.map(project => `
                  <div class="job">
                    <div class="job-header">
                      <div>
                        <div class="job-title">${project.name || 'Project'}</div>
                      </div>
                      <div class="job-dates">
                        ${project.startDate || ''} - ${project.current ? 'Present' : project.endDate || ''}
                      </div>
                    </div>
                    ${project.description ? `<div class="job-description">${project.description}</div>` : ''}
                    ${project.technologies && project.technologies.length > 0 ? `
                      <div style="margin-top: 8px;">
                        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            ${resumeData.languages && resumeData.languages.length > 0 ? `
              <div class="section">
                <div class="section-title">Languages</div>
                <div class="skills-list">
                  ${resumeData.languages.map(lang => `<span class="tag">${lang.name} (${lang.proficiency})</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${resumeData.socialLinks && resumeData.socialLinks.length > 0 ? `
              <div class="section">
                <div class="section-title">Social Links</div>
                <div class="skills-list">
                  ${resumeData.socialLinks.map(link => `<span class="tag">${link.platform}: ${link.username}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${resumeData.interests && resumeData.interests.length > 0 ? `
              <div class="section">
                <div class="section-title">Interests</div>
                <div class="skills-list">
                  ${resumeData.interests.map(interest => `<span class="tag">${interest}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `
      break

    default: // minimal template
      templateStyles = `
        <style>
          .name { color: ${accentColor}; }
          .section-title { color: ${accentColor}; }
        </style>
      `
      templateHTML = `
        <div class="page">
          <div class="header">
            <div class="name">${fullName}</div>
            <div class="contact">${contactLine}</div>
          </div>
          
          ${resumeData.personalInfo?.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <div class="summary">${resumeData.personalInfo.summary}</div>
            </div>
          ` : ''}
          
          ${resumeData.skills && resumeData.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="skills-list">
                ${resumeData.skills.map(skill => `<div class="skill-item">• ${skill}</div>`).join('')}
              </div>
            </div>
          ` : ''}
          
          ${resumeData.workExperience && resumeData.workExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Experience</div>
              ${resumeData.workExperience.map(job => `
                <div class="job">
                  <div class="job-header">
                    <div>
                      <div class="job-title">${job.position || 'Position'} • ${job.company || 'Company'}</div>
                    </div>
                    <div class="job-dates">
                      ${job.startDate || ''} - ${job.current ? 'Present' : job.endDate || ''}
                    </div>
                  </div>
                  ${job.description ? `<div class="job-description">${job.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${resumeData.education && resumeData.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${resumeData.education.map(edu => `
                <div class="education-item">
                  <div class="education-degree">${edu.degree || 'Degree'} • ${edu.school || 'School'}</div>
                  <div class="education-date">
                    ${edu.graduationDate || ''} ${edu.field ? `• ${edu.field}` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resumeData.certifications && resumeData.certifications.length > 0 ? `
            <div class="section">
              <div class="section-title">Certifications</div>
              ${resumeData.certifications.map(cert => `
                <div class="education-item">
                  <div class="education-degree">${cert.name || 'Certification'}</div>
                  <div class="education-school">${cert.issuer || ''} • ${cert.issueDate || ''}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resumeData.projects && resumeData.projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              ${resumeData.projects.map(project => `
                <div class="job">
                  <div class="job-header">
                    <div>
                      <div class="job-title">${project.name || 'Project'}</div>
                    </div>
                    <div class="job-dates">
                      ${project.startDate || ''} - ${project.current ? 'Present' : project.endDate || ''}
                    </div>
                  </div>
                  ${project.description ? `<div class="job-description">${project.description}</div>` : ''}
                  ${project.technologies && project.technologies.length > 0 ? `
                    <div style="margin-top: 8px;">
                      ${project.technologies.map(tech => `<span class="skill-item">${tech}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${resumeData.languages && resumeData.languages.length > 0 ? `
            <div class="section">
              <div class="section-title">Languages</div>
              <div class="skills-list">
                ${resumeData.languages.map(lang => `<div class="skill-item">${lang.name} (${lang.proficiency})</div>`).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.socialLinks && resumeData.socialLinks.length > 0 ? `
            <div class="section">
              <div class="section-title">Social Links</div>
              <div class="skills-list">
                ${resumeData.socialLinks.map(link => {
                  const url = link.url || (link.username && /^https?:\/\//.test(link.username) ? link.username : null)
                  const label = `${link.platform}: ${link.username}`
                  return url 
                    ? `<a class=\"skill-item\" href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${label}</a>`
                    : `<div class=\"skill-item\">${label}</div>`
                }).join('')}
              </div>
            </div>
          ` : ''}

          ${resumeData.interests && resumeData.interests.length > 0 ? `
            <div class="section">
              <div class="section-title">Interests</div>
              <div class="skills-list">
                ${resumeData.interests.map(interest => `<div class="skill-item">• ${interest}</div>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${fullName} - Resume</title>
        ${baseStyles}
        ${templateStyles}
      </head>
      <body>
        ${templateHTML}
      </body>
    </html>
  `
}

export async function createResumePdfBuffer(options: CreateResumePdfOptions): Promise<Buffer> {
  try {
    const { resumeData, template = 'minimal', accentColor = '#2563eb' } = options
    const safeAccentColor = accentColor || '#2563eb'
    
    if (!resumeData || !resumeData.personalInfo) {
      throw new Error("Invalid resume data provided")
    }

    // Validate and sanitize data to ensure completeness
    const sanitizedData = {
      personalInfo: {
        fullName: resumeData.personalInfo?.fullName || 'Unnamed Candidate',
        email: resumeData.personalInfo?.email || '',
        phone: resumeData.personalInfo?.phone || '',
        location: resumeData.personalInfo?.location || '',
        summary: resumeData.personalInfo?.summary || ''
      },
      skills: Array.isArray(resumeData.skills) ? resumeData.skills.filter(Boolean) : [],
      workExperience: Array.isArray(resumeData.workExperience) ? resumeData.workExperience.filter(exp => exp && exp.position) : [],
      education: Array.isArray(resumeData.education) ? resumeData.education.filter(edu => edu && edu.degree) : [],
      certifications: Array.isArray(resumeData.certifications) ? resumeData.certifications.filter(cert => cert && cert.name) : [],
      projects: Array.isArray(resumeData.projects) ? resumeData.projects.filter(project => project && project.name) : [],
      languages: Array.isArray(resumeData.languages) ? resumeData.languages.filter(lang => lang && lang.name) : [],
      socialLinks: Array.isArray(resumeData.socialLinks) ? resumeData.socialLinks.filter(link => link && link.platform) : [],
      interests: Array.isArray(resumeData.interests) ? resumeData.interests.filter(Boolean) : []
    }
    
    // Generate HTML content with sanitized data
    const html = generateHTML(sanitizedData, template, safeAccentColor)
    
    // Launch browser and generate PDF
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Set content and wait for it to load
    await page.setContent(html, { waitUntil: 'networkidle' })
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    })
    
    await browser.close()
    
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Failed to generate PDF buffer")
    }
    
    return Buffer.from(pdfBuffer)
  } catch (error) {
    console.error("PDF generation error:", error)
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
