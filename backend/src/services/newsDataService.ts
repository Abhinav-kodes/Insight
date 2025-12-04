import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  keywords?: string[];
  creator?: string[];
  video_url: string | null;
  description: string;
  content: string;
  pubDate: string;
  image_url: string | null;
  source_id: string;
  source_priority: number;
  country: string[];
  category: string[];
  language: string;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage?: string; // 👈 This is the key to getting more data
}

export class NewsDataService {
  private baseUrl = 'https://newsdata.io/api/1/news';
  private apiKey = process.env.NEWSDATA_API_KEY;

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fetch multiple pages (default 5 pages = 50 articles)
  async fetchTechNews(maxPages: number = 5): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      console.error('❌ Missing NEWSDATA_API_KEY in .env');
      return [];
    }

    let allArticles: NewsArticle[] = [];
    let nextPageToken: string | null = null;

    console.log(`📡 Fetching Tech News (Target: ${maxPages} pages)...`);

    for (let i = 0; i < maxPages; i++) {
      try {
        const params: any = {
          apikey: this.apiKey,
          category: 'technology',
          language: 'en',
          country: 'us,in,gb',
        };

        // If we have a token from the previous loop, use it to get the next batch
        if (nextPageToken) {
          params.page = nextPageToken;
        }

        const response = await axios.get<NewsResponse>(this.baseUrl, { params });

        if (response.data.status !== 'success') {
          console.error(`⚠️ API Error on page ${i + 1}:`, response.data);
          break;
        }

        const results = response.data.results || [];
        allArticles = [...allArticles, ...results];
        
        console.log(`   📄 Page ${i + 1}: Got ${results.length} articles.`);

        // Update token for next loop
        nextPageToken = response.data.nextPage || null;

        // If no next page, stop early
        if (!nextPageToken) {
          console.log('   🛑 No more pages available.');
          break;
        }

        // Be polite to the API rate limits
        await this.sleep(1000); 

      } catch (error: any) {
        console.error(`❌ Error on page ${i + 1}:`, error.message);
        break;
      }
    }

    console.log(`✅ Total Fetched: ${allArticles.length} articles.`);
    return allArticles;
  }
}