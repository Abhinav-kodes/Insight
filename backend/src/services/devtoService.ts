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
  body_markdown?: string;
}

export class DevToService {
  private baseUrl = 'https://dev.to/api/articles';

  private tags = [
    'javascript', 'webdev', 'programming',
    'ai', 'machinelearning', 'datascience',
    'python', 'react', 'node', 'devops',
    'systemdesign', 'database', 'security'
  ];

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Updated to support 'top' articles (best of week/month)
  async fetchArticlesByTag(tag: string, limit: number = 5, days: number = 1): Promise<DevToArticle[]> {
    try {
      // Logic: If looking back more than 3 days, use "top" (best content).
      // If looking back < 3 days, use "rising" (trending news).
      const params: any = {
        tag: tag,
        per_page: limit,
      };

      if (days > 3) {
        params.top = days; // e.g., 7 for top of the week
      } else {
        params.state = 'rising';
      }

      const response = await axios.get<DevToArticle[]>(this.baseUrl, { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) console.warn(`⚠️ Rate limit (List) for ${tag}. Skipping...`);
      else console.error(`❌ Error fetching list for ${tag}:`, error.message);
      return [];
    }
  }

  async fetchArticleDetails(id: number): Promise<string | null> {
    try {
      const response = await axios.get<DevToArticle>(`${this.baseUrl}/${id}`);
      return response.data.body_markdown || null;
    } catch (error: any) {
      console.error(`❌ Failed to fetch details for ID ${id}:`, error.message);
      return null;
    }
  }

  // Changed argument to 'daysOld' for clarity
  async fetchAllTags(daysOld: number = 1): Promise<DevToArticle[]> {
    const candidates: DevToArticle[] = [];
    const seenIds = new Set<number>();

    const now = new Date();
    // Calculate cutoff based on days
    const cutoffTime = new Date(now.getTime() - daysOld * 24 * 60 * 60 * 1000);

    console.log(`📡 1. Scanning tags for candidates (Past ${daysOld} days)...`);

    // Step A: Gather candidates
    for (const tag of this.tags) {
      // Increase limit per tag to ensure we find enough matching the date filter
      const articles = await this.fetchArticlesByTag(tag, 30, daysOld); 

      articles.forEach(article => {
        const pubDate = new Date(article.published_at);
        // Filter: Must be newer than cutoff AND have a positive reaction count (quality check)
        if (pubDate >= cutoffTime && !seenIds.has(article.id) && article.public_reactions_count > 5) {
          seenIds.add(article.id);
          candidates.push(article);
        }
      });
      await this.sleep(1000); 
    }

    // Step B: Fetch Full Text
    // Limit to top 50 to prevent hitting rate limits too hard if we widen the window
    const topCandidates = candidates
      .sort((a, b) => b.public_reactions_count - a.public_reactions_count)
      .slice(0, 50);

    console.log(`📡 2. Fetching full text for ${topCandidates.length} articles...`);

    const finalArticles: DevToArticle[] = [];

    for (const article of topCandidates) {
      const fullText = await this.fetchArticleDetails(article.id);

      if (fullText) {
        article.body_markdown = fullText;
        finalArticles.push(article);
        console.log(`   ✅ Got text for: ${article.title.substring(0, 30)}...`);
      }
      await this.sleep(1500);
    }

    return finalArticles;
  }
}