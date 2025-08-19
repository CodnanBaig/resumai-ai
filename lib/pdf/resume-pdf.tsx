import * as React from "react"
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer"

type WorkItem = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  current: boolean
}

type EducationItem = {
  school: string
  degree: string
  field: string
  graduationDate: string
}

export interface ResumeData {
  personalInfo?: {
    fullName?: string
    email?: string
    phone?: string
    location?: string
    summary?: string
  }
  skills?: string[]
  workExperience?: WorkItem[]
  education?: EducationItem[]
}

export interface CreateResumePdfOptions {
  resumeData: ResumeData
  template?: string | null
}

// Use system fonts instead of external fonts to avoid loading issues
const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: "Helvetica" },
  header: { marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "bold" },
  contact: { fontSize: 10, color: "#4b5563" },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 6, color: "#111827" },
  paragraph: { fontSize: 10, lineHeight: 1.4, color: "#111827" },
  list: { marginTop: 4 },
  listItem: { fontSize: 10, marginBottom: 3 },
  jobHeader: { fontSize: 11, fontWeight: "bold" },
  jobMeta: { fontSize: 9, color: "#6b7280", marginBottom: 4 },
})

// Corporate template styles
const corporateStyles = StyleSheet.create({
  page: { padding: 0, fontFamily: "Helvetica" },
  header: { backgroundColor: "#1f2937", color: "white", padding: 32, marginBottom: 0 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  contact: { fontSize: 10, color: "#d1d5db" },
  content: { padding: 32 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "#111827", borderBottom: "2px solid #1f2937", paddingBottom: 4 },
  paragraph: { fontSize: 10, lineHeight: 1.4, color: "#111827" },
  jobHeader: { fontSize: 12, fontWeight: "bold", marginBottom: 4 },
  jobMeta: { fontSize: 9, color: "#6b7280", marginBottom: 4 },
  skillsGrid: { display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillItem: { fontSize: 9, color: "#111827" },
})

// Creative template styles
const creativeStyles = StyleSheet.create({
  page: { padding: 0, fontFamily: "Helvetica" },
  sidebar: { width: "30%", backgroundColor: "#f3f4f6", padding: 24 },
  mainContent: { width: "70%", padding: 24 },
  header: { marginBottom: 16 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  contact: { fontSize: 8, color: "#6b7280", marginBottom: 2 },
  section: { marginTop: 16 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 6, color: "#111827" },
  paragraph: { fontSize: 9, lineHeight: 1.4, color: "#111827" },
  jobHeader: { fontSize: 10, fontWeight: "bold", marginBottom: 2 },
  jobMeta: { fontSize: 8, color: "#6b7280", marginBottom: 2 },
  skillItem: { fontSize: 8, color: "#111827", marginBottom: 2 },
})

function MinimalResumePDF({ data }: { data: ResumeData }) {
  const fullName = data.personalInfo?.fullName || "Unnamed Candidate"
  const contactLine = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location]
    .filter(Boolean)
    .join("  •  ")

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{fullName}</Text>
          {contactLine ? <Text style={styles.contact}>{contactLine}</Text> : null}
        </View>

        {data.personalInfo?.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.paragraph}>{data.personalInfo.summary}</Text>
          </View>
        ) : null}

        {Array.isArray(data.skills) && data.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.list}>
              <Text style={styles.paragraph}>{data.skills.join(", ")}</Text>
            </View>
          </View>
        ) : null}

        {Array.isArray(data.workExperience) && data.workExperience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View>
              {data.workExperience.map((job, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={styles.jobHeader}>{job.position || "Position"} • {job.company || "Company"}</Text>
                  <Text style={styles.jobMeta}>
                    {(job.startDate || "").toString()} - {job.current ? "Present" : (job.endDate || "").toString()}
                  </Text>
                  {job.description ? <Text style={styles.paragraph}>{job.description}</Text> : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {Array.isArray(data.education) && data.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View>
              {data.education.map((edu, idx) => (
                <View key={idx} style={{ marginBottom: 6 }}>
                  <Text style={styles.jobHeader}>{edu.degree || "Degree"} • {edu.school || "School"}</Text>
                  <Text style={styles.jobMeta}>
                    {(edu.graduationDate || "").toString()} {edu.field ? `• ${edu.field}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </Page>
    </Document>
  )
}

function CorporateResumePDF({ data }: { data: ResumeData }) {
  const fullName = data.personalInfo?.fullName || "Unnamed Candidate"
  const contactLine = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location]
    .filter(Boolean)
    .join("  •  ")

  return (
    <Document>
      <Page size="A4">
        <View style={corporateStyles.header}>
          <Text style={corporateStyles.name}>{fullName}</Text>
          {contactLine ? <Text style={corporateStyles.contact}>{contactLine}</Text> : null}
        </View>
        
        <View style={corporateStyles.content}>
          {data.personalInfo?.summary ? (
            <View style={corporateStyles.section}>
              <Text style={corporateStyles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
              <Text style={corporateStyles.paragraph}>{data.personalInfo.summary}</Text>
            </View>
          ) : null}

          {Array.isArray(data.workExperience) && data.workExperience.length > 0 ? (
            <View style={corporateStyles.section}>
              <Text style={corporateStyles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
              <View>
                {data.workExperience.map((job, idx) => (
                  <View key={idx} style={{ marginBottom: 12 }}>
                    <Text style={corporateStyles.jobHeader}>{job.position || "Position"} • {job.company || "Company"}</Text>
                    <Text style={corporateStyles.jobMeta}>
                      {(job.startDate || "").toString()} - {job.current ? "Present" : (job.endDate || "").toString()}
                    </Text>
                    {job.description ? <Text style={corporateStyles.paragraph}>{job.description}</Text> : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {Array.isArray(data.education) && data.education.length > 0 ? (
            <View style={corporateStyles.section}>
              <Text style={corporateStyles.sectionTitle}>EDUCATION</Text>
              <View>
                {data.education.map((edu, idx) => (
                  <View key={idx} style={{ marginBottom: 8 }}>
                    <Text style={corporateStyles.jobHeader}>{edu.degree || "Degree"} • {edu.school || "School"}</Text>
                    <Text style={corporateStyles.jobMeta}>
                      {(edu.graduationDate || "").toString()} {edu.field ? `• ${edu.field}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {Array.isArray(data.skills) && data.skills.length > 0 ? (
            <View style={corporateStyles.section}>
              <Text style={corporateStyles.sectionTitle}>CORE COMPETENCIES</Text>
              <View style={corporateStyles.skillsGrid}>
                {data.skills.map((skill, index) => (
                  <Text key={index} style={corporateStyles.skillItem}>• {skill}</Text>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}

function CreativeResumePDF({ data }: { data: ResumeData }) {
  const fullName = data.personalInfo?.fullName || "Unnamed Candidate"
  const contactLine = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location]
    .filter(Boolean)
    .join("  •  ")

  return (
    <Document>
      <Page size="A4" style={{ display: "flex", flexDirection: "row" }}>
        {/* Left Sidebar */}
        <View style={creativeStyles.sidebar}>
          <View style={creativeStyles.header}>
            <Text style={creativeStyles.name}>{fullName}</Text>
            <Text style={creativeStyles.contact}>{data.personalInfo?.email || ""}</Text>
            <Text style={creativeStyles.contact}>{data.personalInfo?.phone || ""}</Text>
            <Text style={creativeStyles.contact}>{data.personalInfo?.location || ""}</Text>
          </View>

          {Array.isArray(data.skills) && data.skills.length > 0 ? (
            <View style={creativeStyles.section}>
              <Text style={creativeStyles.sectionTitle}>Skills</Text>
              <View>
                {data.skills.map((skill, index) => (
                  <Text key={index} style={creativeStyles.skillItem}>• {skill}</Text>
                ))}
              </View>
            </View>
          ) : null}

          {Array.isArray(data.education) && data.education.length > 0 ? (
            <View style={creativeStyles.section}>
              <Text style={creativeStyles.sectionTitle}>Education</Text>
              {data.education.map((edu, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={creativeStyles.jobHeader}>{edu.degree || "Degree"}</Text>
                  <Text style={creativeStyles.jobMeta}>{edu.field || ""}</Text>
                  <Text style={creativeStyles.jobMeta}>{edu.school || ""}</Text>
                  <Text style={creativeStyles.jobMeta}>{edu.graduationDate || ""}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Right Content */}
        <View style={creativeStyles.mainContent}>
          {data.personalInfo?.summary ? (
            <View style={creativeStyles.section}>
              <Text style={creativeStyles.sectionTitle}>About Me</Text>
              <Text style={creativeStyles.paragraph}>{data.personalInfo.summary}</Text>
            </View>
          ) : null}

          {Array.isArray(data.workExperience) && data.workExperience.length > 0 ? (
            <View style={creativeStyles.section}>
              <Text style={creativeStyles.sectionTitle}>Experience</Text>
              {data.workExperience.map((job, idx) => (
                <View key={idx} style={{ marginBottom: 12 }}>
                  <Text style={creativeStyles.jobHeader}>{job.position || "Position"}</Text>
                  <Text style={creativeStyles.jobMeta}>{job.company || "Company"}</Text>
                  <Text style={creativeStyles.jobMeta}>
                    {(job.startDate || "").toString()} - {job.current ? "Present" : (job.endDate || "").toString()}
                  </Text>
                  {job.description ? <Text style={creativeStyles.paragraph}>{job.description}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}

export async function createResumePdfBuffer(options: CreateResumePdfOptions): Promise<Buffer> {
  try {
    const { resumeData, template } = options
    
    // Validate resume data
    if (!resumeData || !resumeData.personalInfo) {
      throw new Error("Invalid resume data provided")
    }
    
    // Choose template based on selection
    let element: React.ReactElement
    switch (template) {
      case "corporate":
        element = <CorporateResumePDF data={resumeData} />
        break
      case "creative":
        element = <CreativeResumePDF data={resumeData} />
        break
      case "minimal":
      default:
        element = <MinimalResumePDF data={resumeData} />
        break
    }
    
    const buffer = await renderToBuffer(element)
    
    if (!buffer || buffer.byteLength === 0) {
      throw new Error("Failed to generate PDF buffer")
    }
    
    return Buffer.from(buffer)
  } catch (error) {
    console.error("PDF generation error:", error)
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}


