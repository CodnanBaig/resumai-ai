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

interface CreativeTemplateProps {
  resumeData: ResumeData
}

export function CreativeTemplate({ resumeData }: CreativeTemplateProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white text-black font-sans flex">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gray-100 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-black">{resumeData.personalInfo.fullName}</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{resumeData.personalInfo.email}</p>
            <p>{resumeData.personalInfo.phone}</p>
            <p>{resumeData.personalInfo.location}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-black">Skills</h2>
          <div className="space-y-2">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="relative">
                <span className="text-sm text-gray-700">{skill}</span>
                <div className="mt-1 w-full bg-gray-300 rounded-full h-1">
                  <div className="bg-black h-1 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-black">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-sm text-black">{edu.degree}</h3>
              <p className="text-xs text-gray-600 mb-1">{edu.field}</p>
              <p className="text-xs text-gray-600">{edu.school}</p>
              <p className="text-xs text-gray-500">{edu.graduationDate}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-6">
        {/* Summary */}
        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <div className="w-8 h-0.5 bg-black mr-3"></div>
              <h2 className="text-lg font-bold text-black">About Me</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div>
          <div className="flex items-center mb-6">
            <div className="w-8 h-0.5 bg-black mr-3"></div>
            <h2 className="text-lg font-bold text-black">Experience</h2>
          </div>
          {resumeData.workExperience.map((exp, index) => (
            <div key={index} className="mb-6 relative pl-4">
              <div className="absolute left-0 top-2 w-2 h-2 bg-black rounded-full"></div>
              <div className="absolute left-0.5 top-4 w-0.5 h-full bg-gray-300"></div>

              <div className="mb-2">
                <h3 className="font-bold text-black">{exp.position}</h3>
                <p className="text-gray-700 font-medium text-sm">{exp.company}</p>
                <p className="text-gray-500 text-xs">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
