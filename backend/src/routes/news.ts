import express from 'express';
import { NewsFetchJob } from '../jobs/fetchNews';
import { supabase } from '../services/supabase';

const router = express.Router();
const newsJob = new NewsFetchJob();

// Trigger Fetch Manually
router.post('/fetch', async (req, res) => {
  try {
    res.json({ message: 'News fetch started in background' });
    newsJob.fetchAndSaveNews().catch(console.error);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start fetch' });
  }
});

// Get Latest News (Direct from DB)
router.get('/latest', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('content_type', 'news_article')
      .order('publication_date', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;