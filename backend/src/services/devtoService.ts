import axios from 'axios';

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  social_image: string;
  published_at: string;
  tag_list: string[];
  slug: string;
  user: {
    name: string;
    username: string;
    profile_image: string;
  };
  public_reactions_count: number;
  reading_time_minutes: number;
  // This field is only present after detailed fetch
  body_markdown?: string; 
}

export class DevToService {
  private baseUrl = 'https://dev.to/api/articles';
  
  private tags = [
    'javascript', 'webdev', 'programming', 
    'ai', 'machinelearning', 'datascience',
    'python', 'react', 'node', 'devops'
  ];

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 1. Fetch List (Summary only)
  async fetchArticlesByTag(tag: string, limit: number = 5): Promise<DevToArticle[]> {
    try {
      const response = await axios.get<DevToArticle[]>(this.baseUrl, {
        params: { tag: tag, per_page: limit, state: 'rising' }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) console.warn(`⚠️ Rate limit (List) for ${tag}. Skipping...`);
      else console.error(`❌ Error fetching list for ${tag}:`, error.message);
      return [];
    }
  }

  // 2. Fetch Single Article (Full Text)
  async fetchArticleDetails(id: number): Promise<string | null> {
    try {
      const response = await axios.get<DevToArticle>(`${this.baseUrl}/${id}`);
      return response.data.body_markdown || null;
    } catch (error: any) {
      console.error(`❌ Failed to fetch details for ID ${id}:`, error.message);
      return null;
    }
  }

  // 3. Orchestrator
  async fetchAllTags(hoursOld: number = 24): Promise<DevToArticle[]> {
    const candidates: DevToArticle[] = [];
    const seenIds = new Set<number>();
    
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - hoursOld * 60 * 60 * 1000);

    console.log(`📡 1. Scanning tags for candidates...`);

    // Step A: Gather candidates (Summaries only)
    for (const tag of this.tags) {
      const articles = await this.fetchArticlesByTag(tag, 5); // Small batch per tag
      
      articles.forEach(article => {
        const pubDate = new Date(article.published_at);
        if (pubDate >= cutoffTime && !seenIds.has(article.id)) {
          seenIds.add(article.id);
          candidates.push(article);
        }
      });
      await this.sleep(1000); // 1s delay between tags
    }

    // Step B: Fetch Full Text for unique candidates
    console.log(`📡 2. Fetching full text for ${candidates.length} articles (this will take time)...`);
    
    const finalArticles: DevToArticle[] = [];

    for (const article of candidates) {
      // Fetch the full markdown
      const fullText = await this.fetchArticleDetails(article.id);
      
      if (fullText) {
        article.body_markdown = fullText;
        finalArticles.push(article);
        console.log(`   ✅ Got text for: ${article.title.substring(0, 30)}...`);
      }

      // ⏳ CRITICAL: 1.5s delay to prevent 429 errors on detail fetch
      await this.sleep(1500); 
    }

    return finalArticles.sort((a, b) => b.public_reactions_count - a.public_reactions_count);
  }
}