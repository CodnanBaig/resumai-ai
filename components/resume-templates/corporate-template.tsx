interface ResumeData {
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
}

interface CorporateTemplateProps {
  resumeData: ResumeData
}

export function CorporateTemplate({ resumeData }: CorporateTemplateProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white text-black font-serif">
      {/* Header */}
      <div className="bg-gray-900 text-white p-8 mb-0">
        <h1 className="text-4xl font-bold mb-3">{resumeData.personalInfo.fullName}</h1>
        <div className="text-gray-300 space-y-1">
          <p>
            {resumeData.personalInfo.email} | {resumeData.personalInfo.phone}
          </p>
          <p>{resumeData.personalInfo.location}</p>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-gray-900 border-b-2 border-gray-900 pb-1">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-900 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {resumeData.workExperience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-black">{exp.position}</h3>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-900 pb-1">EDUCATION</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-black">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-gray-700">{edu.school}</p>
                </div>
                <span className="text-sm text-gray-600 font-medium">{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-gray-900 pb-1">CORE COMPETENCIES</h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <div className="w-2 h-2 bg-gray-900 mr-3"></div>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
