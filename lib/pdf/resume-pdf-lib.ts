import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ResumeData } from './resume-pdf-playwright';

export interface CreateResumePdfBufferOptions {
  resumeData: ResumeData;
  template?: string | null;
  accentColor?: string | null;
}

function hexToRgb(hex: string): [number, number, number] {
  const bigint = parseInt(hex.slice(1), 16);
  return [((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255];
}

async function createMinimalPdf(resumeData: ResumeData, accentColor: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const [r, g, b] = hexToRgb(accentColor);

  // Header
  const fullName = resumeData.personalInfo?.fullName || 'Unnamed Candidate';
  const contactLine = [resumeData.personalInfo?.email, resumeData.personalInfo?.phone, resumeData.personalInfo?.location]
    .filter(Boolean)
    .join(' • ');

  page.drawText(fullName, {
    x: 50,
    y: 750,
    size: 24,
    font: boldFont,
    color: rgb(r, g, b),
  });

  page.drawText(contactLine, {
    x: 50,
    y: 720,
    size: 10,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  let currentY = 680;

  // Summary
  if (resumeData.personalInfo?.summary) {
    page.drawText('Summary', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(r, g, b),
    });
    currentY -= 20;

    const summaryLines = resumeData.personalInfo.summary.split('\n');
    for (const line of summaryLines) {
      if (currentY < 50) {
        // Add a new page if needed
        // For simplicity, we'll just break here
        break;
      }
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    }
    currentY -= 20; // Space after section
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    page.drawText('Skills', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(r, g, b),
    });
    currentY -= 20;

    const skillsText = resumeData.skills.join(', ');
    const skillsLines = [];
    let line = '';
    const words = skillsText.split(' ');

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, 10);
      if (width > 400 && line !== '') {
        skillsLines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    skillsLines.push(line);

    for (const line of skillsLines) {
      if (currentY < 50) break;
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;
    }
    currentY -= 20;
  }

  // Experience
  if (resumeData.workExperience && resumeData.workExperience.length > 0) {
    page.drawText('Experience', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(r, g, b),
    });
    currentY -= 20;

    for (const job of resumeData.workExperience) {
      if (currentY < 100) break; // Leave some space

      const jobTitle = `${job.position || 'Position'} • ${job.company || 'Company'}`;
      const jobDates = `${job.startDate || ''} - ${job.current ? 'Present' : job.endDate || ''}`;

      page.drawText(jobTitle, {
        x: 50,
        y: currentY,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      page.drawText(jobDates, {
        x: 500,
        y: currentY,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      currentY -= 15;

      if (job.description) {
        const descLines = job.description.split('\n');
        for (const line of descLines) {
          if (currentY < 50) break;
          page.drawText(`• ${line}`, {
            x: 60,
            y: currentY,
            size: 10,
            font: font,
            color: rgb(0, 0, 0),
          });
          currentY -= 15;
        }
      }

      currentY -= 10; // Space between jobs
    }
    currentY -= 20;
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    page.drawText('Education', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(r, g, b),
    });
    currentY -= 20;

    for (const edu of resumeData.education) {
      if (currentY < 100) break;

      const eduTitle = `${edu.degree || 'Degree'} • ${edu.school || 'School'}`;
      const eduDetails = `${edu.graduationDate || ''} ${edu.field ? `• ${edu.field}` : ''}`;

      page.drawText(eduTitle, {
        x: 50,
        y: currentY,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 15;

      page.drawText(eduDetails, {
        x: 50,
        y: currentY,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentY -= 20; // Space between education items
    }
  }

  return await pdfDoc.save();
}

export async function createResumePdfBuffer(options: CreateResumePdfBufferOptions): Promise<Buffer> {
  try {
    const { resumeData, template = 'minimal', accentColor = '#2563eb' } = options;
    const safeAccentColor = accentColor || '#2563eb';

    if (!resumeData || !resumeData.personalInfo) {
      throw new Error("Invalid resume data provided");
    }

    let pdfBytes: Uint8Array;

    switch (template) {
      // For now, we'll implement the 'minimal' template fully in pdf-lib
      // Other templates would require more complex layout handling
      default:
        pdfBytes = await createMinimalPdf(resumeData, safeAccentColor);
        break;
    }

    if (!pdfBytes || pdfBytes.length === 0) {
      throw new Error("Failed to generate PDF buffer");
    }

    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error("PDF generation error:", error);
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}