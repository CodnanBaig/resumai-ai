import { renderHtmlContent, convertToBulletPoints } from "@/lib/utils"
import { ResumeData } from "@/lib/types"

interface MinimalTemplateProps {
  resumeData: ResumeData
  accentColor?: string
}

export function MinimalTemplate({ resumeData, accentColor = "#2563eb" }: MinimalTemplateProps) {
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
    <div className="max-w-2xl mx-auto bg-white text-black p-8 font-sans">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-300">
        <h1 className="text-3xl font-light mb-2" style={{ color: accentColor }}>{renderHtmlContent(personalInfo.fullName)}</h1>
        <div className="text-sm text-gray-600 space-x-2">
          <span>{renderHtmlContent(personalInfo.email)}</span>
          <span>•</span>
          <span>{renderHtmlContent(personalInfo.phone)}</span>
          <span>•</span>
          <span>{renderHtmlContent(personalInfo.location)}</span>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3 text-black" style={{ color: accentColor }}>Professional Summary</h2>
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
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4 text-black" style={{ color: accentColor }}>Experience</h2>
        {workExperience.map((exp: any, index: number) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-black" style={{ color: accentColor }}>{renderHtmlContent(exp.position)}</h3>
              <span className="text-sm text-gray-600">
                {renderHtmlContent(exp.startDate)} - {exp.current ? "Present" : renderHtmlContent(exp.endDate)}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{renderHtmlContent(exp.company)}</p>
            <div className="text-gray-600 text-sm leading-relaxed">
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
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4 text-black" style={{ color: accentColor }}>Education</h2>
        {education.map((edu: any, index: number) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-black" style={{ color: accentColor }}>
                  {renderHtmlContent(edu.degree)} in {renderHtmlContent(edu.field)}
                </h3>
                <p className="text-gray-700 text-sm">{renderHtmlContent(edu.school)}</p>
              </div>
              <span className="text-sm text-gray-600">{renderHtmlContent(edu.graduationDate)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4 text-black" style={{ color: accentColor }}>Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill: string, index: number) => (
            <span key={index} className="text-sm text-gray-700">
              {renderHtmlContent(skill)}
              {index < skills.length - 1 ? " •" : ""}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-black" style={{ color: accentColor }}>Certifications</h2>
          {certifications.map((cert: any, index: number) => (
            <div key={index} className="mb-3">
              <h3 className="font-medium text-black" style={{ color: accentColor }}>{renderHtmlContent(cert.name)}</h3>
              <p className="text-gray-700 text-sm">{renderHtmlContent(cert.issuer)}</p>
              <p className="text-gray-600 text-sm">{renderHtmlContent(cert.issueDate)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-black" style={{ color: accentColor }}>Projects</h2>
          {projects.map((project: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-black" style={{ color: accentColor }}>{renderHtmlContent(project.name)}</h3>
              <div className="text-gray-600 text-sm leading-relaxed">
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
                    <span key={techIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
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
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-black" style={{ color: accentColor }}>Languages</h2>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang: any, index: number) => (
              <span key={index} className="text-sm text-gray-700">
                {renderHtmlContent(lang.name)} ({renderHtmlContent(lang.proficiency)})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-black" style={{ color: accentColor }}>Social Links</h2>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link: any, index: number) => (
              <span key={index} className="text-sm text-gray-700">
                {renderHtmlContent(link.platform)}: {renderHtmlContent(link.username)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {interests && interests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4 text-black" style={{ color: accentColor }}>Interests</h2>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest: string, index: number) => (
              <span key={index} className="text-sm text-gray-700">
                {renderHtmlContent(interest)}
                {index < interests.length - 1 ? " •" : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
