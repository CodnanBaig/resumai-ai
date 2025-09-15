import { renderHtmlContent, convertToBulletPoints, formatMonthYear } from "@/lib/utils"
import { ResumeData } from "@/lib/types"

interface TechModernTemplateProps {
  resumeData: ResumeData
  accentColor?: string
}

export function TechModernTemplate({ resumeData, accentColor = "#2563eb" }: TechModernTemplateProps) {
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
    <div className="max-w-2xl mx-auto bg-white text-black font-sans grid grid-cols-3">
      {/* Sidebar */}
      <aside className="col-span-1 border-r border-gray-200 p-6">
        <h1 className="text-xl font-bold mb-2" style={{ color: accentColor }}>{renderHtmlContent(personalInfo.fullName)}</h1>
        <div className="text-xs text-gray-600 space-y-1 mb-6">
          <p>{renderHtmlContent(personalInfo.email)}</p>
          <p>{renderHtmlContent(personalInfo.phone)}</p>
          <p>{renderHtmlContent(personalInfo.location)}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 12).map((s: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[11px] border" style={{ borderColor: accentColor, color: accentColor }}>
                {renderHtmlContent(s)}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Languages</h2>
            <div className="space-y-2">
              {languages.map((lang: any, index: number) => (
                <div key={index} className="text-xs text-gray-600">
                  {renderHtmlContent(lang.name)} ({renderHtmlContent(lang.proficiency)})
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Education</h2>
          <div className="space-y-3">
            {education.map((edu: any, i: number) => (
              <div key={i}>
                <p className="text-sm font-medium">{edu.degree} in {edu.field}</p>
                <p className="text-xs text-gray-600">{edu.school}</p>
                <p className="text-xs text-gray-500">{edu.graduationDate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert: any, index: number) => (
                <div key={index} className="text-xs text-gray-600">
                  <div className="font-medium">{renderHtmlContent(cert.name)}</div>
                  <div>{renderHtmlContent(cert.issuer)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="col-span-2 p-6">
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-2" style={{ color: accentColor }}>Summary</h2>
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

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-3" style={{ color: accentColor }}>Projects</h2>
            {projects.map((project: any, index: number) => (
              <div key={index} className="mb-4 p-3 rounded-md border" style={{ borderColor: `${accentColor}33` }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold" style={{ color: accentColor }}>{renderHtmlContent(project.name)}</h3>
                  <span className="text-[11px] text-gray-600">
                    {renderHtmlContent(project.startDate)} - {project.current ? "Present" : renderHtmlContent(project.endDate)}
                  </span>
                </div>
                <div className="text-xs text-gray-600 leading-relaxed mb-2">
                  {convertToBulletPoints(project.description).map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start mb-1">
                      <span className="text-gray-500 mr-2 mt-1">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech: string, techIndex: number) => (
                      <span key={techIndex} className="px-2 py-0.5 rounded-full text-[10px] border" style={{ borderColor: accentColor, color: accentColor }}>
                        {renderHtmlContent(tech)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        <section className="mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: accentColor }}>Highlighted Projects</h2>
          {workExperience.slice(0, 2).map((exp: any, i: number) => (
            <div key={i} className="mb-4 p-3 rounded-md border" style={{ borderColor: `${accentColor}33` }}>
              <div className="flex justify-between items-start">
                <p className="text-sm font-semibold" style={{ color: accentColor }}>{exp.position}</p>
                <span className="text-[11px] text-gray-600">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <p className="text-xs text-gray-700 mb-1">{exp.company}</p>
                              <div className="text-xs text-gray-600 leading-relaxed">
                  {convertToBulletPoints(exp.description).map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start mb-1">
                      <span className="text-gray-500 mr-2 mt-1">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
            </div>
          ))}
        </section>

        <section className="mb-6">
          <h2 className="text-base font-semibold mb-3" style={{ color: accentColor }}>Experience</h2>
          {workExperience.map((exp: any, i: number) => (
            <div key={i} className="mb-4">
              <div className="flex items-baseline gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                <h3 className="text-sm font-semibold">{exp.position}</h3>
                <span className="text-[11px] text-gray-600">@ {exp.company}</span>
                <span className="ml-auto text-[11px] text-gray-500">{formatMonthYear(exp.startDate)} - {exp.current ? "Present" : formatMonthYear(exp.endDate)}</span>
              </div>
                              <div className="text-xs text-gray-600 leading-relaxed ml-4">
                  {convertToBulletPoints(exp.description).map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex items-start mb-1">
                      <span className="text-gray-500 mr-2 mt-1">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
            </div>
          ))}
        </section>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <section className="mb-6">
            <h2 className="text-base font-semibold mb-3" style={{ color: accentColor }}>Social Links</h2>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link: any, index: number) => (
                <span key={index} className="text-xs px-2 py-1 rounded border" style={{ borderColor: accentColor, color: accentColor }}>
                  {renderHtmlContent(link.platform)}: {renderHtmlContent(link.username)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <section>
            <h2 className="text-base font-semibold mb-3" style={{ color: accentColor }}>Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest: any, index: number) => (
                <span key={index} className="text-xs px-2 py-1 rounded border" style={{ borderColor: accentColor, color: accentColor }}>
                  {renderHtmlContent(interest)}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}


