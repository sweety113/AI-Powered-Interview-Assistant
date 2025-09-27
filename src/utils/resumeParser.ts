import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set the worker src for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedResumeData {
  text: string;
  name?: string;
  email?: string;
  phone?: string;
}

export async function parseResumeFile(file: File): Promise<ParsedResumeData> {
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    return parsePDF(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword'
  ) {
    return parseDOCX(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
}

async function parsePDF(file: File): Promise<ParsedResumeData> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' ';
    }

    return extractContactInfo(fullText);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure it\'s a valid PDF.');
  }
}

async function parseDOCX(file: File): Promise<ParsedResumeData> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return extractContactInfo(result.value);
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file. Please ensure it\'s a valid Word document.');
  }
}

function extractContactInfo(text: string): ParsedResumeData {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Extract name (usually the first line or first few words in caps)
  const nameMatch = cleanText.match(/^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  const name = nameMatch ? nameMatch[1] : undefined;
  
  // Extract email
  const emailMatch = cleanText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  const email = emailMatch ? emailMatch[0] : undefined;
  
  // Extract phone number (various formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const phoneMatch = cleanText.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : undefined;
  
  return {
    text: cleanText,
    name,
    email,
    phone,
  };
}

// Utility function to validate contact information
export function validateContactInfo(data: { name?: string; email?: string; phone?: string }) {
  const missing: string[] = [];
  
  if (!data.name?.trim()) missing.push('name');
  if (!data.email?.trim()) missing.push('email');
  if (!data.phone?.trim()) missing.push('phone');
  
  return {
    isValid: missing.length === 0,
    missingFields: missing,
  };
}