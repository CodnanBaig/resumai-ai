import { chromium } from "playwright"

export interface CoverLetterData {
  content: string
  companyName: string
  jobTitle: string
}

export async function createCoverLetterPdfBuffer(data: CoverLetterData): Promise<Buffer> {
  const { content, companyName, jobTitle } = data

  // Generate HTML content
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cover Letter - ${companyName}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          margin: 0;
          padding: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .company-info {
          margin-bottom: 30px;
        }
        .content {
          text-align: justify;
          margin-bottom: 30px;
        }
        .signature {
          margin-top: 40px;
        }
        .date {
          margin-bottom: 20px;
        }
        h1 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        .company-name {
          font-size: 18px;
          font-weight: bold;
          color: #34495e;
        }
        .job-title {
          font-size: 16px;
          color: #7f8c8d;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Cover Letter</h1>
        <div class="company-name">${companyName}</div>
        <div class="job-title">${jobTitle}</div>
      </div>
      
      <div class="date">
        ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
      
      <div class="company-info">
        <p>Dear Hiring Manager,</p>
      </div>
      
      <div class="content">
        ${content.split('\n').map(paragraph => 
          paragraph.trim() ? `<p>${paragraph}</p>` : ''
        ).join('')}
      </div>
      
      <div class="signature">
        <p>Sincerely,</p>
        <p>[Your Name]</p>
      </div>
    </body>
    </html>
  `

  // Launch browser and generate PDF
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.setContent(html)
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    })
    
    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}

