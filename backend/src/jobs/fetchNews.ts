import { NewsDataService } from '../services/newsDataService';
import { ArticleScraper } from '../services/articleScraper';
import { supabase } from '../services/supabase';

const newsService = new NewsDataService();
const articleScraper = new ArticleScraper();

export class NewsFetchJob {

    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Normalize title for deduplication (lowercase, strip punctuation, trim)
    private normalizeTitle(title: string): string {
        return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    }

    async fetchAndSaveNews() {
        try {
            console.log(`🚀 Starting Trend Watcher (News) Job...`);
            console.log(`🎯 Goal: Save 100 UNIQUE articles WITH FULL TEXT extracted.`);

            let totalSavedWithFullText = 0;
            let nextPageToken: string | null = null;
            let loopCount = 0;
            const MAX_LOOPS = 50;
            const TARGET_WITH_FULLTEXT = 100;

            // Track both URLs AND titles to catch duplicates
            const seenUrlsInRun = new Set<string>();
            const seenTitlesInRun = new Set<string>();

            while (totalSavedWithFullText < TARGET_WITH_FULLTEXT && loopCount < MAX_LOOPS) {
                loopCount++;
                console.log(`\n🔄 Batch ${loopCount}: Fetching from API...`);

                const { articles, nextPage } = await newsService.fetchPage(nextPageToken ?? undefined);

                if (articles.length === 0) {
                    console.log('⚠️ No articles returned in this batch.');
                    if (!nextPage) break;
                    nextPageToken = nextPage;
                    await this.sleep(1000);
                    continue;
                }

                // Client-side Deduplication - check BOTH url AND title
                const uniqueFromApi = articles.filter(a => {
                    const normalizedTitle = this.normalizeTitle(a.title);

                    // Skip if we've seen this URL or title in this run
                    if (seenUrlsInRun.has(a.link) || seenTitlesInRun.has(normalizedTitle)) {
                        return false;
                    }

                    seenUrlsInRun.add(a.link);
                    seenTitlesInRun.add(normalizedTitle);
                    return true;
                });

                if (uniqueFromApi.length === 0) {
                    console.log('   ⚠️ All articles in this batch were duplicates.');
                    nextPageToken = nextPage || null;
                    await this.sleep(1000);
                    continue;
                }

                // Database Deduplication - check both URLs AND titles
                const urlsToCheck = uniqueFromApi.map(a => a.link);
                const titlesToCheck = uniqueFromApi.map(a => a.title);

                const { data: existingByUrl } = await supabase
                    .from('content')
                    .select('url')
                    .in('url', urlsToCheck);

                const { data: existingByTitle } = await supabase
                    .from('content')
                    .select('title')
                    .eq('content_type', 'news_article')
                    .in('title', titlesToCheck);

                const existingUrls = new Set(existingByUrl?.map(r => r.url) || []);
                const existingTitles = new Set(existingByTitle?.map(r => r.title) || []);

                const newArticles = uniqueFromApi.filter(a =>
                    !existingUrls.has(a.link) && !existingTitles.has(a.title)
                );

                console.log(`   📊 Batch: ${articles.length} fetched → ${uniqueFromApi.length} unique in run → ${newArticles.length} truly new`);

                if (newArticles.length === 0) {
                    console.log('   ⏩ All articles already in database.');
                    nextPageToken = nextPage || null;
                    await this.sleep(1000);
                    continue;
                }

                // Process each new article: Scrape first, only save if full_text extracted
                let batchSaved = 0;
                for (const article of newArticles) {
                    // Check if we've reached our target
                    if (totalSavedWithFullText >= TARGET_WITH_FULLTEXT) {
                        console.log(`\n🎯 Target reached! Stopping processing.`);
                        break;
                    }

                    console.log(`   🔍 Scraping: ${article.title?.substring(0, 50)}...`);

                    // SCRAPE FIRST
                    const fullText = await articleScraper.scrapeArticle(article.link);

                    if (!fullText) {
                        console.log(`   ⏭️ Skipping - no full text extracted`);
                        await this.sleep(1500);
                        continue;
                    }

                    // Only save if we got full text
                    const contentToInsert = {
                        content_type: 'news_article',
                        title: article.title,
                        url: article.link,
                        description: article.description || article.title,
                        full_text: fullText,
                        authors_list: article.creator || [article.source_id],
                        tags: [...new Set([...(article.keywords || []), ...(article.category || [])])],
                        thumbnail: article.image_url,
                        publication_date: article.pubDate,
                        scraped_at: new Date().toISOString(),
                        metadata: {
                            source: article.source_id,
                            country: article.country,
                            language: article.language
                        }
                    };

                    const { error } = await supabase.from('content').insert(contentToInsert);

                    if (error) {
                        // If duplicate error, just log and continue
                        if (error.message.includes('duplicate')) {
                            console.log(`   ⏭️ Duplicate detected, skipping`);
                        } else {
                            console.log(`   ❌ Insert failed: ${error.message}`);
                        }
                    } else {
                        totalSavedWithFullText++;
                        batchSaved++;
                        console.log(`   ✅ Saved! (${fullText.length} chars) Progress: ${totalSavedWithFullText}/${TARGET_WITH_FULLTEXT}`);
                    }

                    // Rate limiting between scrapes
                    await this.sleep(1500);
                }

                console.log(`   📈 Batch complete: ${batchSaved} saved with full text`);

                if (!nextPage) {
                    console.log('🛑 No more pages available from API.');
                    break;
                }
                nextPageToken = nextPage;

                await this.sleep(1000);
            }

            console.log(`\n🎉 Job Finished! Total UNIQUE articles saved with full text: ${totalSavedWithFullText}`);

        } catch (error) {
            console.error('❌ Critical error in NewsFetchJob:', error);
        }
    }
}