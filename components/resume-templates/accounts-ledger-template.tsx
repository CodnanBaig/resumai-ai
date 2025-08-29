import { renderHtmlContent, convertToBulletPoints } from "@/lib/utils"
import { ResumeData } from "@/lib/types"

interface AccountsLedgerTemplateProps {
  resumeData: ResumeData
  accentColor?: string
}

export function AccountsLedgerTemplate({ resumeData, accentColor = "#059669" }: AccountsLedgerTemplateProps) {
  const personalInfo = (resumeData as any)?.personalInfo ?? {}
  const skills = (resumeData as any)?.skills ?? []
  const education = (resumeData as any)?.education ?? []
  const workExperience = (resumeData as any)?.workExperience ?? []
  const certifications = (resumeData as any)?.certifications ?? []
  const projects = (resumeData as any)?.projects ?? []
  const languages = (resumeData as any)?.languages ?? []
  const socialLinks = (resumeData as any)?.socialLinks ?? []
  const interests = (resumeData as any)?.interests ?? []

  return (
    <div className="max-w-2xl mx-auto bg-white text-black font-serif border border-gray-200">
      {/* Header */}
      <div className="px-8 pt-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: accentColor }}>{renderHtmlContent(personalInfo.fullName)}</h1>
        <div className="text-sm text-gray-700 mt-1">
          {renderHtmlContent(personalInfo.email)} • {renderHtmlContent(personalInfo.phone)} • {renderHtmlContent(personalInfo.location)}
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 mt-4" style={{ backgroundColor: accentColor }}></div>

      <div className="p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Professional Summary</h2>
            <div className="text-sm text-gray-700 leading-relaxed">
              {convertToBulletPoints(personalInfo.summary).map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-start mb-1">
                  <span className="text-gray-500 mr-2 mt-1">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Accounting Experience</h2>
          {workExperience.map((exp: any, i: number) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold" style={{ color: accentColor }}>{renderHtmlContent(exp.position)}</p>
                  <p className="text-xs text-gray-700">{renderHtmlContent(exp.company)}</p>
                </div>
                <span className="text-[11px] text-gray-600">{renderHtmlContent(exp.startDate)} - {exp.current ? "Present" : renderHtmlContent(exp.endDate)}</span>
              </div>
                             <div className="text-xs text-gray-600 leading-relaxed mt-1">
                 {convertToBulletPoints(exp.description).map((bullet, bulletIndex) => (
                   <div key={bulletIndex} className="flex items-start mb-1">
                     <span className="text-gray-500 mr-2 mt-1">•</span>
                     <span>{bullet}</span>
                   </div>
                 ))}
               </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {["GAAP", "IFRS", "Audit", "Tax", "AP/AR", "Forecasting"].map((tag, k) => (
                  <div key={k} className="text-[11px] px-2 py-1 rounded border text-gray-800" style={{ borderColor: `${accentColor}55` }}>{tag}</div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Certifications & Skills */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Certifications & Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded text-[11px] border" style={{ borderColor: accentColor, color: accentColor }}>{renderHtmlContent(s)}</span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Education</h2>
          {education.map((edu: any, i: number) => (
            <div key={i} className="mb-3">
                              <p className="text-sm font-medium">{renderHtmlContent(edu.degree)} in {renderHtmlContent(edu.field)}</p>
                <p className="text-xs text-gray-600">{renderHtmlContent(edu.school)} • {renderHtmlContent(edu.graduationDate)}</p>
            </div>
          ))}
        </section>

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Certifications</h2>
                      {certifications.map((cert: any, index: number) => (
            <div key={index} className="mb-3">
              <h3 className="text-sm font-medium" style={{ color: accentColor }}>{renderHtmlContent(cert.name)}</h3>
              <p className="text-xs text-gray-700">{renderHtmlContent(cert.issuer)}</p>
              <p className="text-xs text-gray-600">{renderHtmlContent(cert.issueDate)}</p>
            </div>
          ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Projects</h2>
            {projects.map((project: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="text-sm font-medium" style={{ color: accentColor }}>{renderHtmlContent(project.name)}</h3>
                <div className="text-xs text-gray-600 leading-relaxed mt-1">
                  {convertToBulletPoints(project.description).map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start mb-1">
                      <span className="text-gray-500 mr-2 mt-1">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech: string, techIndex: number) => (
                      <span key={techIndex} className="text-[10px] px-2 py-0.5 rounded border text-gray-800" style={{ borderColor: `${accentColor}55` }}>
                        {renderHtmlContent(tech)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Languages</h2>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang: any, index: number) => (
                <span key={index} className="text-xs text-gray-700 px-2 py-1 rounded border" style={{ borderColor: `${accentColor}55` }}>
                  {renderHtmlContent(lang.name)} ({renderHtmlContent(lang.proficiency)})
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Social Links</h2>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link: any, index: number) => (
                <span key={index} className="text-xs text-gray-700 px-2 py-1 rounded border" style={{ borderColor: `${accentColor}55` }}>
                  {renderHtmlContent(link.platform)}: {renderHtmlContent(link.username)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest: string, index: number) => (
                <span key={index} className="text-xs text-gray-700 px-2 py-1 rounded border" style={{ borderColor: `${accentColor}55` }}>
                  {renderHtmlContent(interest)}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}


