import { renderHtmlContent, convertToBulletPoints, formatMonthYear } from "@/lib/utils"
import type { ResumeData } from "@/lib/types"

interface TechTwoColumnTemplateProps {
  resumeData: ResumeData
  accentColor?: string
}

export function TechTwoColumnTemplate({ resumeData, accentColor = "#9333ea" }: TechTwoColumnTemplateProps) {
  const personalInfo = (resumeData as any)?.personalInfo ?? {}
  const skills = (resumeData as any)?.skills ?? []
  const workExperience = (resumeData as any)?.workExperience ?? []
  const projects = (resumeData as any)?.projects ?? []
  const education = (resumeData as any)?.education ?? []

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-6 font-sans">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold" style={{ color: accentColor }}>{renderHtmlContent(personalInfo.fullName)}</h1>
        <div className="text-xs text-gray-600 flex flex-wrap gap-x-2">
          <span>{renderHtmlContent(personalInfo.email)}</span>
          <span>•</span>
          <span>{renderHtmlContent(personalInfo.phone)}</span>
          <span>•</span>
          <span>{renderHtmlContent(personalInfo.location)}</span>
        </div>
      </header>

      <div className="grid grid-cols-5 gap-6">
        <aside className="col-span-2">
          {skills.length > 0 && (
            <section className="mb-4">
              <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Tech Stack</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s: string, i: number) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded border" style={{ borderColor: `${accentColor}55`, color: accentColor }}>{renderHtmlContent(s)}</span>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Projects</h2>
              {projects.map((p: any, i: number) => (
                <div key={i} className="mb-2">
                  <h3 className="text-sm font-semibold">{renderHtmlContent(p.name)}</h3>
                  <div className="text-xs text-gray-700">
                    {convertToBulletPoints(p.description).map((b, k) => (
                      <div key={k} className="flex items-start gap-2 mb-0.5"><span className="mt-0.5">•</span><span>{b}</span></div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section className="mt-4">
              <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Education</h2>
              {education.map((e: any, i: number) => (
                <div key={i} className="text-xs text-gray-700 mb-1">
                  <span className="font-medium">{renderHtmlContent(e.degree)}</span> in {renderHtmlContent(e.field)}<br/>{renderHtmlContent(e.school)}
                </div>
              ))}
            </section>
          )}
        </aside>

        <main className="col-span-3">
          {personalInfo.summary && (
            <section className="mb-4">
              <h2 className="text-sm font-semibold mb-1" style={{ color: accentColor }}>Professional Summary</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{renderHtmlContent(personalInfo.summary)}</p>
            </section>
          )}

          <section>
            <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Experience</h2>
            {workExperience.map((exp: any, i: number) => (
              <div key={i} className="mb-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-semibold">{renderHtmlContent(exp.position)}</h3>
                  <span className="text-xs text-gray-600">@ {renderHtmlContent(exp.company)}</span>
                  <span className="ml-auto text-[11px] text-gray-500">{formatMonthYear(exp.startDate)} - {exp.current ? "Present" : formatMonthYear(exp.endDate)}</span>
                </div>
                <div className="text-xs text-gray-700 leading-relaxed mt-1">
                  {convertToBulletPoints(exp.description).map((b, k) => (
                    <div key={k} className="flex items-start gap-2 mb-0.5"><span className="mt-0.5">•</span><span>{b}</span></div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}


