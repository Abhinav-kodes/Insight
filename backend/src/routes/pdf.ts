import express from 'express';

const router = express.Router();

router.get('/proxy/:arxivId', async (req, res) => {
  try {
    const { arxivId } = req.params;
    
    // 1. Use Export Mirror
    const pdfUrl = `https://export.arxiv.org/pdf/${arxivId}.pdf`;
    
    console.log(`🔄 Proxying PDF: ${pdfUrl}`);
    
    // 2. Polite Headers
    const response = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'InsightEngine/1.0 (mailto:abhinav.2428cse938@kiet.edu)',
        'Accept': 'application/pdf'
      }
    });
    
    if (!response.ok) {
        throw new Error(`ArXiv returned ${response.status}`);
    }

    // 3. Check for HTML (Block)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
        throw new Error('ArXiv returned HTML (Blocked)');
    }
    
    // 4. Send Data
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    res.send(buffer);
    
  } catch (error) {
    console.error('PDF proxy error:', error);
    res.status(500).send('Failed to load PDF');
  }
});

export default router;