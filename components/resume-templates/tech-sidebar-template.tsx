import { renderHtmlContent, convertToBulletPoints, formatMonthYear } from "@/lib/utils"
import type { ResumeData } from "@/lib/types"

interface TechSidebarTemplateProps {
  resumeData: ResumeData
  accentColor?: string
}

export function TechSidebarTemplate({ resumeData, accentColor = "#0ea5e9" }: TechSidebarTemplateProps) {
  const personalInfo = (resumeData as any)?.personalInfo ?? {}
  const skills = (resumeData as any)?.skills ?? []
  const workExperience = (resumeData as any)?.workExperience ?? []
  const projects = (resumeData as any)?.projects ?? []

  return (
    <div className="max-w-4xl mx-auto bg-white text-black font-sans grid grid-cols-3">
      <aside className="col-span-1 p-6 border-r border-gray-200 bg-gray-50">
        <h1 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>{renderHtmlContent(personalInfo.fullName)}</h1>
        <div className="text-xs text-gray-700 space-y-1 mb-4">
          <div>{renderHtmlContent(personalInfo.email)}</div>
          <div>{renderHtmlContent(personalInfo.phone)}</div>
          <div>{renderHtmlContent(personalInfo.location)}</div>
        </div>
        {skills.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Tech Stack</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((s: string, i: number) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded border" style={{ borderColor: `${accentColor}55`, color: accentColor }}>{renderHtmlContent(s)}</span>
              ))}
            </div>
          </div>
        )}
        {projects.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold mb-2" style={{ color: accentColor }}>Projects</h2>
            <ul className="text-xs text-gray-700 space-y-1">
              {projects.map((p: any, i: number) => (
                <li key={i} className="list-disc list-inside">{renderHtmlContent(p.name)}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      <main className="col-span-2 p-6">
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
  )
}


