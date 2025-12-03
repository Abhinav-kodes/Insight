import { DevToService } from '../services/devtoService';
import { supabase } from '../services/supabase';

const devToService = new DevToService();

export class DevToFetchJob {
  async fetchAndSaveArticles(hoursOld: number = 24) {
    try {
      console.log(`🚀 Starting Dev.to Job...`);
      
      // This will now take longer as it fetches full text inside
      const articles = await devToService.fetchAllTags(hoursOld);
      
      if (articles.length === 0) {
        console.log('⚠️  No articles found');
        return;
      }

      // Map to Supabase Schema
      const articlesToInsert = articles.map(article => ({
        content_type: 'hobby_article',
        title: article.title,
        url: article.url,
        description: article.description || `${article.title} by ${article.user.name}`,
        // 👇 MAP FULL TEXT HERE
        full_text: article.body_markdown, 
        authors_list: [article.user.name], 
        tags: article.tag_list || [],
        thumbnail: article.cover_image || article.social_image,
        scraped_at: new Date().toISOString(),
        metadata: {
          reactions: article.public_reactions_count,
          reading_time: article.reading_time_minutes,
          source: 'dev.to'
        }
      }));

      console.log('📝 Checking for duplicates...');

      // Check URL duplicates
      const urls = articlesToInsert.map(a => a.url);
      const { data: existingArticles } = await supabase
        .from('content')
        .select('url')
        .in('url', urls);

      const existingUrls = new Set(existingArticles?.map(a => a.url) || []);
      const newArticles = articlesToInsert.filter(a => !existingUrls.has(a.url));

      console.log(`📊 Inserting ${newArticles.length} new articles with full text...`);

      if (newArticles.length > 0) {
        const { error } = await supabase.from('content').insert(newArticles);
        if (error) console.error('❌ Insert Error:', error.message);
        else console.log(`✅ Success! Saved ${newArticles.length} articles.`);
      } else {
        console.log('✅ Database already up to date.');
      }

    } catch (error) {
      console.error('❌ Critical error in DevToFetchJob:', error);
    }
  }
}