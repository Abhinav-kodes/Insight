import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';
import { supabase } from './supabase';

export class ArticleScraper {
    private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Define the custom instance with SSL bypass and better headers
    private axiosInstance = axios.create({
        httpsAgent: new https.Agent({  
            rejectUnauthorized: false // ⚠️ Ignores SSL errors (fixes PushSquare, etc.)
        }),
        timeout: 15000,
        maxRedirects: 5,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://www.google.com/', // 👈 Tricks some WAFs
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
        }
    });

    /**
     * Fetch and extract main article text from a URL
     */
    async scrapeArticle(url: string): Promise<string | null> {
        try {
            // 🔄 CHANGE: Use the custom instance, not the global axios
            const response = await this.axiosInstance.get(url);

            const html = response.data;
            const $ = cheerio.load(html);

            // Remove unwanted elements
            $('script, style, nav, header, footer, aside, .ads, .advertisement, .sidebar, .comments, .related, .social-share, .cookie-banner, .newsletter-signup').remove();

            // Try common article selectors in order of specificity
            const selectors = [
                'article .content',
                'article .post-content',
                'article .entry-content',
                '.article-body',
                '.article-content',
                '.post-body',
                '.entry-content',
                '.story-body',
                '#article-body',
                '[itemprop="articleBody"]',
                'article',
                '[role="main"] p',
                'main p',
                '.content p',
            ];

            let text = '';

            for (const selector of selectors) {
                const element = $(selector);
                if (element.length > 0) {
                    // Get all paragraphs within the element
                    const paragraphs: string[] = [];
                    element.find('p').each((_, el) => {
                        const p = $(el).text().trim();
                        // Filter out short/empty paragraphs or "Read also" links
                        if (p.length > 30 && !p.toLowerCase().startsWith('read also') && !p.toLowerCase().startsWith('subscribe')) { 
                            paragraphs.push(p);
                        }
                    });

                    if (paragraphs.length > 0) {
                        text = paragraphs.join('\n\n');
                        break;
                    }
                }
            }

            // Fallback: just get all paragraph text
            if (!text) {
                const paragraphs: string[] = [];
                $('p').each((_, el) => {
                    const p = $(el).text().trim();
                    if (p.length > 50) {
                        paragraphs.push(p);
                    }
                });
                text = paragraphs.slice(0, 25).join('\n\n'); 
            }

            // Clean up text
            text = text
                .replace(/\s+/g, ' ')
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            // Only return if we got meaningful content
            if (text.length > 200) {
                return text;
            }

            return null;
        } catch (error: any) {
            // Don't log full error object, just message to keep logs clean
            // If it's a 403, we know it's a block, no need to panic
            const status = error.response ? error.response.status : 'Unknown';
            console.log(`   ⚠️ Failed to scrape (${status}) ${url}: ${error.message}`);
            return null;
        }
    }

    /**
     * Scrape all articles that are missing full_text
     */
    async scrapeUnscrapedArticles(limit: number = 20): Promise<number> {
        console.log(`🕷️ Starting article scraping (limit: ${limit})...`);

        // Get articles that need scraping (null or very short full_text)
        const { data: articles, error } = await supabase
            .from('content')
            .select('id, url, title')
            .eq('content_type', 'news_article')
            .or('full_text.is.null,full_text.eq.')
            .limit(limit);

        if (error) {
            console.error('❌ Error fetching articles to scrape:', error.message);
            return 0;
        }

        if (!articles || articles.length === 0) {
            console.log('✅ No articles need scraping.');
            return 0;
        }

        console.log(`📋 Found ${articles.length} articles to scrape.`);

        let successCount = 0;

        for (const article of articles) {
            console.log(`   🔍 Scraping: ${article.title?.substring(0, 50)}...`);

            const fullText = await this.scrapeArticle(article.url);

            if (fullText) {
                const { error: updateError } = await supabase
                    .from('content')
                    .update({
                        full_text: fullText,
                        scraped_at: new Date().toISOString(),
                    })
                    .eq('id', article.id);

                if (updateError) {
                    console.log(`   ❌ Update failed for ${article.id}: ${updateError.message}`);
                } else {
                    console.log(`   ✅ Saved ${fullText.length} chars`);
                    successCount++;
                }
            }

            // Rate limiting: wait 1.5 second between requests (slightly increased to avoid 429s)
            await this.sleep(1500);
        }

        console.log(`✅ Scraping complete: ${successCount}/${articles.length} articles updated.`);
        return successCount;
    }
}