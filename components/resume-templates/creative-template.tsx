import { renderHtmlContent, convertToBulletPoints, formatMonthYear } from "@/lib/utils"
import { ResumeData } from "@/lib/types"

interface CreativeTemplateProps {
  resumeData: ResumeData
  accentColor?: string
}

export function CreativeTemplate({ resumeData, accentColor = "#7c3aed" }: CreativeTemplateProps) {
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
    <div className="max-w-2xl mx-auto bg-white text-black font-sans flex">
      {/* Left Sidebar */}
      <div className="w-1/3 p-6" style={{ backgroundColor: `${accentColor}1A` }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: accentColor }}>{renderHtmlContent(personalInfo.fullName)}</h1>
          <div className="text-sm text-gray-700 space-y-1">
            <p>{renderHtmlContent(personalInfo.email)}</p>
            <p>{renderHtmlContent(personalInfo.phone)}</p>
            <p>{renderHtmlContent(personalInfo.location)}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: accentColor }}>Skills</h2>
          <div className="space-y-2">
            {skills.map((skill: string, index: number) => (
              <div key={index} className="relative">
                <span className="text-sm text-gray-800">{renderHtmlContent(skill)}</span>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div className="h-1 rounded-full" style={{ width: "85%", backgroundColor: accentColor }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: accentColor }}>Education</h2>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-sm" style={{ color: accentColor }}>{renderHtmlContent(edu.degree)}</h3>
              <p className="text-xs text-gray-700 mb-1">{renderHtmlContent(edu.field)}</p>
              <p className="text-xs text-gray-700">{renderHtmlContent(edu.school)}</p>
              <p className="text-xs text-gray-500">{renderHtmlContent(edu.graduationDate)}</p>
            </div>
          ))}
        </div>

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: accentColor }}>Languages</h2>
            <div className="space-y-2">
              {languages.map((lang: any, index: number) => (
                <div key={index} className="relative">
                  <span className="text-sm text-gray-800">{renderHtmlContent(lang.name)} ({renderHtmlContent(lang.proficiency)})</span>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                    <div className="h-1 rounded-full" style={{ width: "85%", backgroundColor: accentColor }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: accentColor }}>Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest: any, index: number) => (
                <span key={index} className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                  {renderHtmlContent(interest)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className="w-8 h-0.5 mr-3" style={{ backgroundColor: accentColor }}></div>
              <h2 className="text-lg font-bold" style={{ color: accentColor }}>About Me</h2>
            </div>
            <div className="text-gray-700 leading-relaxed text-sm">
              {convertToBulletPoints(personalInfo.summary).map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-start mb-1">
                  <span className="text-gray-500 mr-2 mt-1">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-8 h-0.5 mr-3" style={{ backgroundColor: accentColor }}></div>
            <h2 className="text-lg font-bold" style={{ color: accentColor }}>Experience</h2>
          </div>
          {workExperience.map((exp: any, index: number) => (
            <div key={index} className="mb-6 relative pl-4">
              <div className="absolute left-0 top-2 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
              <div className="absolute left-0.5 top-4 w-0.5 h-full" style={{ backgroundColor: `${accentColor}66` }}></div>

              <div className="mb-2">
                <h3 className="font-bold" style={{ color: accentColor }}>{renderHtmlContent(exp.position)}</h3>
                <p className="text-gray-700 font-medium text-sm">{renderHtmlContent(exp.company)}</p>
                <p className="text-gray-500 text-xs">
                  {formatMonthYear(exp.startDate)} - {exp.current ? "Present" : formatMonthYear(exp.endDate)}
                </p>
              </div>
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

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-0.5 mr-3" style={{ backgroundColor: accentColor }}></div>
              <h2 className="text-lg font-bold" style={{ color: accentColor }}>Projects</h2>
            </div>
            {projects.map((project: any, index: number) => (
              <div key={index} className="mb-6 relative pl-4">
                <div className="absolute left-0 top-2 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                <div className="absolute left-0.5 top-4 w-0.5 h-full" style={{ backgroundColor: `${accentColor}66` }}></div>

                <div className="mb-2">
                  <h3 className="font-bold" style={{ color: accentColor }}>{renderHtmlContent(project.name)}</h3>
                  <p className="text-gray-500 text-xs">
                    {renderHtmlContent(project.startDate)} - {project.current ? "Present" : renderHtmlContent(project.endDate)}
                  </p>
                </div>
                <div className="text-gray-600 text-sm leading-relaxed mb-2">
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
                      <span key={techIndex} className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                        {renderHtmlContent(tech)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-8 h-0.5 mr-3" style={{ backgroundColor: accentColor }}></div>
              <h2 className="text-lg font-bold" style={{ color: accentColor }}>Certifications</h2>
            </div>
            {certifications.map((cert: any, index: number) => (
              <div key={index} className="mb-4 relative pl-4">
                <div className="absolute left-0 top-2 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                <h3 className="font-bold text-sm" style={{ color: accentColor }}>{renderHtmlContent(cert.name)}</h3>
                <p className="text-gray-700 text-sm">{renderHtmlContent(cert.issuer)}</p>
                <p className="text-gray-500 text-xs">{renderHtmlContent(cert.issueDate)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <div className="w-8 h-0.5 mr-3" style={{ backgroundColor: accentColor }}></div>
              <h2 className="text-lg font-bold" style={{ color: accentColor }}>Social Links</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link: any, index: number) => (
                <span key={index} className="text-sm px-3 py-1 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                  {renderHtmlContent(link.platform)}: {renderHtmlContent(link.username)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
