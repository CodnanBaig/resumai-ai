import { renderHtmlContent, convertToBulletPoints } from "@/lib/utils"
import { ResumeData } from "@/lib/types"

interface CorporateTemplateProps {
  resumeData: ResumeData
  accentColor?: string
}

export function CorporateTemplate({ resumeData, accentColor = "#111827" }: CorporateTemplateProps) {
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
    <div className="max-w-2xl mx-auto bg-white text-black font-serif">
      {/* Header */}
      <div className="text-white p-8 mb-0" style={{ backgroundColor: accentColor }}>
        <h1 className="text-4xl font-bold mb-3">{renderHtmlContent(personalInfo.fullName)}</h1>
        <div className="opacity-90 space-y-1">
          <p>
            {renderHtmlContent(personalInfo.email)} | {renderHtmlContent(personalInfo.phone)}
          </p>
          <p>{renderHtmlContent(personalInfo.location)}</p>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>
              PROFESSIONAL SUMMARY
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {convertToBulletPoints(personalInfo.summary).map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-start mb-2">
                  <span className="text-gray-500 mr-2 mt-1">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          {workExperience.map((exp: any, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: accentColor }}>{renderHtmlContent(exp.position)}</h3>
                  <p className="text-gray-700 font-medium">{renderHtmlContent(exp.company)}</p>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {renderHtmlContent(exp.startDate)} - {exp.current ? "Present" : renderHtmlContent(exp.endDate)}
                </span>
              </div>
              <div className="text-gray-600 leading-relaxed">
                {convertToBulletPoints(exp.description).map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex items-start mb-1">
                    <span className="text-gray-500 mr-2 mt-1">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>EDUCATION</h2>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: accentColor }}>
                    {renderHtmlContent(edu.degree)} in {renderHtmlContent(edu.field)}
                  </h3>
                  <p className="text-gray-700">{renderHtmlContent(edu.school)}</p>
                </div>
                <span className="text-sm text-gray-600 font-medium">{renderHtmlContent(edu.graduationDate)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>CORE COMPETENCIES</h2>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 mr-3" style={{ backgroundColor: accentColor }}></div>
                <span className="text-gray-700">{renderHtmlContent(skill)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>CERTIFICATIONS</h2>
            {certifications.map((cert: any, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-semibold" style={{ color: accentColor }}>{renderHtmlContent(cert.name)}</h3>
                <p className="text-gray-700">{renderHtmlContent(cert.issuer)}</p>
                <p className="text-gray-600 text-sm">{renderHtmlContent(cert.issueDate)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>PROJECTS</h2>
            {projects.map((project: any, index: number) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold" style={{ color: accentColor }}>{renderHtmlContent(project.name)}</h3>
                <div className="text-gray-600 leading-relaxed mb-2">
                  {convertToBulletPoints(project.description).map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start mb-1">
                      <span className="text-gray-500 mr-2 mt-1">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, techIndex: number) => (
                      <span key={techIndex} className="text-sm bg-gray-100 px-3 py-1 rounded">
                        {renderHtmlContent(tech)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>LANGUAGES</h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang: any, index: number) => (
                <span key={index} className="text-gray-700 px-3 py-1 border rounded" style={{ borderColor: accentColor }}>
                  {renderHtmlContent(lang.name)} ({renderHtmlContent(lang.proficiency)})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>SOCIAL LINKS</h2>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link: any, index: number) => (
                <span key={index} className="text-gray-700 px-3 py-1 border rounded" style={{ borderColor: accentColor }}>
                  {renderHtmlContent(link.platform)}: {renderHtmlContent(link.username)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 pb-1" style={{ borderColor: accentColor }}>INTERESTS</h2>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest: string, index: number) => (
                <span key={index} className="text-gray-700 px-3 py-1 border rounded" style={{ borderColor: accentColor }}>
                  {renderHtmlContent(interest)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
