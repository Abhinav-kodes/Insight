import { NewsDataService } from '../services/newsDataService';
import { supabase } from '../services/supabase';

const newsService = new NewsDataService();

export class NewsFetchJob {
  async fetchAndSaveNews() {
    try {
      console.log(`🚀 Starting Trend Watcher (News) Job...`);
      
      const articles = await newsService.fetchTechNews(10);
      
      if (articles.length === 0) {
        console.log('⚠️  No news articles found');
        return;
      }

      // Map to Supabase Schema
      const newsToInsert = articles.map(article => ({
        content_type: 'news_article',
        title: article.title,
        url: article.link,
        description: article.description || article.title,
        // NewsData often truncates content, so we use description as fallback
        full_text: article.content || article.description, 
        authors_list: article.creator || [article.source_id], 
        tags: article.keywords || article.category || [],
        thumbnail: article.image_url, // Often null for smaller blogs, handled in UI
        publication_date: article.pubDate,
        scraped_at: new Date().toISOString(),
        metadata: {
          source: article.source_id,
          country: article.country,
          language: article.language
        }
      }));

      console.log('📝 Checking for duplicates...');

      const urls = newsToInsert.map(a => a.url);
      const { data: existingArticles } = await supabase
        .from('content')
        .select('url')
        .in('url', urls);

      const existingUrls = new Set(existingArticles?.map(a => a.url) || []);
      const newArticles = newsToInsert.filter(a => !existingUrls.has(a.url));

      console.log(`📊 Inserting ${newArticles.length} new trending news articles...`);

      if (newArticles.length > 0) {
        const { error } = await supabase.from('content').insert(newArticles);
        if (error) console.error('❌ Insert Error:', error.message);
        else console.log(`✅ Success! Saved ${newArticles.length} news articles.`);
      } else {
        console.log('✅ Database already up to date.');
      }

    } catch (error) {
      console.error('❌ Critical error in NewsFetchJob:', error);
    }
  }
}