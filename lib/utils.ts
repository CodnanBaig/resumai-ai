import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseJsonField(value: string | null): any {
  if (!value) return null
  
  // Handle case where value might already be an object
  if (typeof value === 'object') {
    return value
  }
  
  // Handle case where value might be a string representation of an object
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      // Ensure we return the parsed value, not null if it's falsy but valid
      return parsed
    } catch (error) {
      console.warn('Failed to parse JSON field:', error, 'Value:', value)
      return null
    }
  }
  
  return null
}

export function sanitizeHtmlContent(content: string | null | undefined): string {
  if (!content) return ""
  
  // Remove HTML tags and decode HTML entities
  return content
    .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
    .replace(/<\/p>/gi, '\n\n') // Convert </p> to double newlines
    .replace(/<p[^>]*>/gi, '') // Remove opening <p> tags
    .replace(/<[^>]*>/g, '') // Remove all other HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive newlines
    .trim()
}

export function renderHtmlContent(content: string | null | undefined): string {
  if (!content) return ""
  
  // If content contains HTML tags, sanitize them
  if (/<[^>]*>/.test(content)) {
    return sanitizeHtmlContent(content)
  }
  
  return content
}

export function convertToBulletPoints(content: string | null | undefined): string[] {
  if (!content) return []
  
  // First sanitize any HTML content
  const cleanContent = renderHtmlContent(content)
  
  // Check if the content already contains bullet-like formatting
  const hasBulletFormatting = /^[\s]*[-•*]\s|^\d+\.\s|^\d+\)\s/.test(cleanContent) || 
                              /\n[\s]*[-•*]\s|\n\d+\.\s|\n\d+\)\s/.test(cleanContent)
  
  // If content already has bullet formatting, preserve it
  if (hasBulletFormatting) {
    return cleanContent
      .split(/\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[\s]*[-•*]\s/, '').replace(/^\d+\.\s/, '').replace(/^\d+\)\s/, ''))
  }
  
  // If no bullet formatting, return the content as a single item (no bullet points)
  return [cleanContent]
}
