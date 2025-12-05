// ⚠️ MUST be first - before any other imports!
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { authMiddleware, AuthRequest } from './middleware/auth';
import { supabase } from './services/supabase';

// Scheduler with job instances
import {
  startScheduler,
  triggerAllJobs,
  paperFetchJob,
  contentParserJob,
  devToFetchJob,
  newsFetchJob
} from './scheduler';

// Routes
import pdfRouter from './routes/pdf';
import aiRouter from './routes/ai';
import devToRouter from './routes/devTo';
import newsRouter from './routes/news';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - MUST be before routes
const corsOptions = {
  origin: ['http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://210.79.129.218',      
    'http://210.79.129.218:80',  
    'https://210.79.129.218',
    'https://insights.is-a.software',
    'http://insights.is-a.software'
    ] ,  
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    newsDataConfigured: !!process.env.NEWSDATA_API_KEY,
    cronEnabled: process.env.ENABLE_CRON === 'true',
    env: process.env.NODE_ENV || 'development'
  });
});

// Protected route example
app.post('/api/protected', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: 'Success', user: req.user });
});

// ==========================================
// 📚 RESEARCH PAPER JOBS (Researcher Mode)
// ==========================================

// Fetch papers from ArXiv
app.post('/api/fetch-papers', async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Paper fetch started in background' });
    console.log('🚀 Fetch triggered!');

    paperFetchJob.fetchPapersForAllInterests().catch(console.error);
  } catch (error) {
    console.error('❌ Error triggering paper fetch:', error);
    res.status(500).json({ error: 'Failed to start fetch' });
  }
});

// Parse PDFs and extract text
app.post('/api/parse-papers', async (req: Request, res: Response) => {
  try {
    res.json({ message: 'PDF parsing started in background' });
    console.log('🚀 Parse triggered!');

    contentParserJob.parseUnparsedPapers().catch(console.error);
  } catch (error) {
    console.error('❌ Error triggering parse:', error);
    res.status(500).json({ error: 'Failed to start parsing' });
  }
});

// Parse ALL papers (batch mode)
app.post('/api/parse-all-papers', async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Batch PDF parsing started in background' });
    console.log('🚀 Batch parse triggered!');

    contentParserJob.parseAllPapers().catch(console.error);
  } catch (error) {
    console.error('❌ Error triggering batch parse:', error);
    res.status(500).json({ error: 'Failed to start batch parsing' });
  }
});

// Parse specific paper
app.post('/api/parse-paper/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Parsing paper ${id}` });

    contentParserJob.parsePaperById(id).catch(console.error);
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse paper' });
  }
});

// Get detailed parsing status
app.get('/api/parse-details', async (req: Request, res: Response) => {
  try {
    const { data: unparsed } = await supabase
      .from('content')
      .select('id, title, arxiv_id')
      .eq('content_type', 'research_paper')
      .is('full_text', null)
      .limit(20);

    const { data: recent } = await supabase
      .from('content')
      .select('id, title, parsed_at')
      .eq('content_type', 'research_paper')
      .not('parsed_at', 'is', null)
      .order('parsed_at', { ascending: false })
      .limit(10);

    res.json({
      remaining: unparsed || [],
      recent_parsed: recent || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get details' });
  }
});

// ==========================================
// 👩‍💻 DEV.TO JOBS (Hobbyist Mode)
// ==========================================

// Trigger Manual Dev.to Fetch
app.post('/api/fetch-devto', async (req: Request, res: Response) => {
  try {
    // Default to 24 hours lookback if not specified
    const hours = req.body?.hours ? parseInt(req.body.hours) : 24;

    res.json({ message: `Dev.to article fetch started (last ${hours}h) in background` });
    console.log('🚀 Dev.to fetch triggered!');

    devToFetchJob.fetchAndSaveArticles(hours).catch(console.error);
  } catch (error) {
    console.error('❌ Error triggering Dev.to fetch:', error);
    res.status(500).json({ error: 'Failed to start fetch' });
  }
});

// ==========================================
// 📰 NEWS DATA JOBS (Trend Watcher Mode)
// ==========================================

app.post('/api/fetch-news', async (req: Request, res: Response) => {
  try {
    res.json({ message: 'News fetch started in background' });
    console.log('🚀 News fetch triggered!');

    newsFetchJob.fetchAndSaveNews().catch(console.error);
  } catch (error) {
    console.error('❌ Error triggering news fetch:', error);
    res.status(500).json({ error: 'Failed to start fetch' });
  }
});

// ==========================================
// ⏰ CRON JOB CONTROLS
// ==========================================

// Trigger all jobs manually (useful for testing or manual refresh)
app.post('/api/refresh-all', async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Full content refresh started in background' });
    console.log('🚀 Manual full refresh triggered!');

    triggerAllJobs().catch(console.error);
  } catch (error) {
    console.error('❌ Error triggering full refresh:', error);
    res.status(500).json({ error: 'Failed to start refresh' });
  }
});

// ==========================================
// 🔌 API ROUTES
// ==========================================

app.use('/api/pdf', pdfRouter);
app.use('/api/ai', aiRouter);
app.use('/api/devto', devToRouter);
app.use('/api/news', newsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  console.log(`❌ 404: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Global error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    type: err.type || 'Unknown',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📚 Researcher Mode (ArXiv) active`);
  console.log(`👩‍💻 Hobbyist Mode (Dev.to) active`);
  console.log(`📰 Trend Watcher Mode (NewsData) active`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`📧 Resend Email: ${process.env.RESEND_API_KEY ? '✅ Configured' : '⚠️  Not configured'}`);
  console.log('='.repeat(50));

  // Start the cron scheduler
  startScheduler();

  console.log('='.repeat(50) + '\n');
});

export default app;