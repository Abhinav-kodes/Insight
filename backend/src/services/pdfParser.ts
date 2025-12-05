import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

export class PDFParserService {
  // Clean text of problematic Unicode sequences
  private cleanText(text: string): string {
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .substring(0, 1000000);
  }

  async extractTextFromUrl(pdfUrl: string): Promise<string> {
    try {
      // 1. Use the "Export" mirror (often less strict)
      // Change 'arxiv.org/pdf/...' to 'export.arxiv.org/pdf/...'
      const safeUrl = pdfUrl.replace('://arxiv.org', '://export.arxiv.org');
      
      console.log(`   📄 Downloading: ${safeUrl}`);
      
      // 2. "Polite" Headers - Identity yourself
      const response = await fetch(safeUrl, {
        headers: {
          // ArXiv asks scripts to include contact info
          'User-Agent': 'InsightEngine/1.0 (mailto:abhinav.2428cse938@kiet.edu)',
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) {
        console.log(`   ⛔ Server returned ${response.status} (Blocked)`);
        return '';
      }
      
      const arrayBuffer = await response.arrayBuffer();

      // 3. Check Magic Bytes
      const header = new Uint8Array(arrayBuffer.slice(0, 5));
      const headerString = String.fromCharCode(...header);
      
      if (!headerString.includes('%PDF')) {
        console.log(`   ⚠️  Response was not a PDF. Header: ${headerString.substring(0, 10)}`);
        return '';
      }
      
      // 4. Parse
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        disableFontFace: true,
      }).promise;
      
      let fullText = '';
      
      // Extract first 15 pages (save memory/time)
      const maxPages = Math.min(pdf.numPages, 15);
      
      for (let i = 1; i <= maxPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => ('str' in item ? item.str : ''))
            .join(' ');
          fullText += pageText + '\n';
        } catch (e) { /* skip page errors */ }
      }
      
      return this.cleanText(fullText);
      
    } catch (error) {
      console.error(`   ❌ Parse error:`, error);
      return '';
    }
  }

  // Extract first N characters (summary)
  extractSummary(text: string, maxChars: number = 3000): string {
    if (!text) return '';
    let cleaned = text.replace(/\s+/g, ' ').trim();
    return cleaned.substring(0, maxChars);
  }

  // Extract key sections
  extractSections(text: string): { [key: string]: string } {
    const sections: { [key: string]: string } = {};
    const sectionPatterns = {
      'abstract': /abstract[\s\n]+([\s\S]*?)(?=introduction|1\.|$)/i,
      'introduction': /introduction[\s\n]+([\s\S]*?)(?=related work|background|2\.|$)/i,
      'conclusion': /conclusion[\s\n]+([\s\S]*?)(?=references|$)/i,
    };
    for (const [name, pattern] of Object.entries(sectionPatterns)) {
      const match = text.match(pattern);
      if (match) {
        sections[name] = match[1].trim().substring(0, 1000);
      }
    }
    return sections;
  }
}