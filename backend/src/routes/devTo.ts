import express from 'express';
import { DevToService } from '../services/devtoService';

const router = express.Router();
const devToService = new DevToService();

// Get articles by tag
router.get('/articles/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const articles = await devToService.fetchArticlesByTag(tag, limit);
    
    res.json({
      tag,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get all latest articles across all configured tags
router.get('/latest', async (req, res) => {
  try {
    const hoursOld = parseInt(req.query.hoursOld as string) || 24;
    const articles = await devToService.fetchAllTags(hoursOld);
    
    res.json({
      hoursOld,
      count: articles.length,
      articles: articles.slice(0, 50)
    });
  } catch (error) {
    console.error('Error fetching latest Dev.to articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

export default router;