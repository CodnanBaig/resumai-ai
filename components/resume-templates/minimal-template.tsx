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

interface MinimalTemplateProps {
  resumeData: ResumeData
}

export function MinimalTemplate({ resumeData }: MinimalTemplateProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white text-black p-8 font-sans">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-300">
        <h1 className="text-3xl font-light mb-2">{resumeData.personalInfo.fullName}</h1>
        <div className="text-sm text-gray-600 space-x-2">
          <span>{resumeData.personalInfo.email}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.phone}</span>
          <span>•</span>
          <span>{resumeData.personalInfo.location}</span>
        </div>
      </div>

      {/* Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4 text-black">Experience</h2>
        {resumeData.workExperience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-black">{exp.position}</h3>
              <span className="text-sm text-gray-600">
                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-2">{exp.company}</p>
            <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-4 text-black">Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-black">
                  {edu.degree} in {edu.field}
                </h3>
                <p className="text-gray-700 text-sm">{edu.school}</p>
              </div>
              <span className="text-sm text-gray-600">{edu.graduationDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-lg font-medium mb-4 text-black">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <span key={index} className="text-sm text-gray-700">
              {skill}
              {index < resumeData.skills.length - 1 ? " •" : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
