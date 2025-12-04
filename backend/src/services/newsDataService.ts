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
  nextPage?: string;
}

export class NewsDataService {
  private baseUrl = 'https://newsdata.io/api/1/news';
  private apiKey = process.env.NEWSDATA_API_KEY;

  // Modified to fetch ONE page at a time, giving control to the Job
  async fetchPage(pageToken?: string): Promise<{ articles: NewsArticle[], nextPage: string | null }> {
    if (!this.apiKey) {
      console.error('❌ Missing NEWSDATA_API_KEY');
      return { articles: [], nextPage: null };
    }

    try {
      const params: any = {
        apikey: this.apiKey,
        category: 'technology',
        language: 'en',
        country: 'us,in,gb',
      };

      if (pageToken) {
        params.page = pageToken;
      }

      const response = await axios.get<NewsResponse>(this.baseUrl, { params });

      if (response.data.status !== 'success') {
        console.error(`⚠️ API Error:`, response.data);
        return { articles: [], nextPage: null };
      }

      return {
        articles: response.data.results || [],
        nextPage: response.data.nextPage || null
      };

    } catch (error: any) {
      console.error(`❌ NewsAPI Request Error:`, error.message);
      return { articles: [], nextPage: null };
    }
  }
}