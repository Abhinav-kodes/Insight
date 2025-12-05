import cron from 'node-cron';
import { PaperFetchJob } from './jobs/fetchPapers';
import { ContentParserJob } from './jobs/parseContent';
import { DevToFetchJob } from './jobs/fetchDevTo';
import { NewsFetchJob } from './jobs/fetchNews';

// Job instances
const paperFetchJob = new PaperFetchJob();
const contentParserJob = new ContentParserJob();
const devToFetchJob = new DevToFetchJob();
const newsFetchJob = new NewsFetchJob();

// Track if jobs are currently running to prevent overlap
let isRunning = {
    papers: false,
    devto: false,
    news: false,
    parser: false
};

/**
 * Run all fetch jobs sequentially
 */
async function runAllFetchJobs() {
    const startTime = new Date();
    console.log('\n' + '🔄'.repeat(25));
    console.log(`⏰ CRON: Starting scheduled content refresh at ${startTime.toISOString()}`);
    console.log('🔄'.repeat(25) + '\n');

    try {
        // 1. Fetch Research Papers (ArXiv)
        if (!isRunning.papers) {
            isRunning.papers = true;
            console.log('📚 [1/4] Fetching research papers from ArXiv...');
            try {
                await paperFetchJob.fetchPapersForAllInterests();
                console.log('✅ [1/4] Research papers fetch complete');
            } catch (error) {
                console.error('❌ [1/4] Paper fetch failed:', error);
            }
            isRunning.papers = false;
        } else {
            console.log('⏭️ [1/4] Papers job already running, skipping...');
        }

        // 2. Parse PDFs (extract text from new papers)
        if (!isRunning.parser) {
            isRunning.parser = true;
            console.log('📄 [2/4] Parsing unparsed PDFs...');
            try {
                await contentParserJob.parseAllPapers();
                console.log('✅ [2/4] PDF parsing complete');
            } catch (error) {
                console.error('❌ [2/4] PDF parsing failed:', error);
            }
            isRunning.parser = false;
        } else {
            console.log('⏭️ [2/4] Parser job already running, skipping...');
        }

        // 3. Fetch Dev.to Articles
        if (!isRunning.devto) {
            isRunning.devto = true;
            console.log('👩‍💻 [3/4] Fetching Dev.to articles (last 160h)...');
            try {
                await devToFetchJob.fetchAndSaveArticles(160);
                console.log('✅ [3/4] Dev.to fetch complete');
            } catch (error) {
                console.error('❌ [3/4] Dev.to fetch failed:', error);
            }
            isRunning.devto = false;
        } else {
            console.log('⏭️ [3/4] Dev.to job already running, skipping...');
        }

        // 4. Fetch News Articles (with full text scraping)
        if (!isRunning.news) {
            isRunning.news = true;
            console.log('📰 [4/4] Fetching news articles with scraping...');
            try {
                await newsFetchJob.fetchAndSaveNews();
                console.log('✅ [4/4] News fetch complete');
            } catch (error) {
                console.error('❌ [4/4] News fetch failed:', error);
            }
            isRunning.news = false;
        } else {
            console.log('⏭️ [4/4] News job already running, skipping...');
        }

    } catch (error) {
        console.error('❌ CRON: Critical error in scheduled jobs:', error);
    }

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);

    console.log('\n' + '✅'.repeat(25));
    console.log(`⏰ CRON: All jobs completed in ${duration} minutes`);
    console.log(`📅 Next run scheduled for: ${getNextRunTime()}`);
    console.log('✅'.repeat(25) + '\n');
}

/**
 * Get the next scheduled run time (for logging)
 */
function getNextRunTime(): string {
    const now = new Date();
    const next = new Date(now);
    next.setHours(6, 0, 0, 0); // 6 AM
    if (next <= now) {
        next.setDate(next.getDate() + 1);
    }
    return next.toISOString();
}

/**
 * Initialize and start all cron jobs
 */
export function startScheduler() {
    const cronEnabled = process.env.ENABLE_CRON === 'true';

    if (!cronEnabled) {
        console.log('⏸️  CRON: Scheduler disabled (set ENABLE_CRON=true to enable)');
        return;
    }

    console.log('⏰ CRON: Scheduler enabled, initializing...');

    // Schedule: Run at 6 AM every day (server timezone)
    // Cron syntax: minute hour day-of-month month day-of-week
    const dailySchedule = process.env.CRON_SCHEDULE || '0 6 * * *';

    cron.schedule(dailySchedule, () => {
        runAllFetchJobs().catch(console.error);
    }, {
        timezone: process.env.TZ || 'Asia/Kolkata' // Default to IST
    });

    console.log(`✅ CRON: Daily job scheduled at ${dailySchedule}`);
    console.log(`🌍 CRON: Timezone: ${process.env.TZ || 'Asia/Kolkata'}`);

    // Optionally run immediately on startup (for VPS cold starts)
    const runOnStartup = process.env.CRON_RUN_ON_STARTUP === 'true';
    if (runOnStartup) {
        console.log('🚀 CRON: Running jobs immediately on startup...');
        // Delay by 10 seconds to let server fully initialize
        setTimeout(() => {
            runAllFetchJobs().catch(console.error);
        }, 10000);
    }
}

/**
 * Manually trigger all jobs (for testing or API endpoint)
 */
export async function triggerAllJobs() {
    return runAllFetchJobs();
}

// Export job instances for manual API triggers
export { paperFetchJob, contentParserJob, devToFetchJob, newsFetchJob };
