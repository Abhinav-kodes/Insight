const PORT = process.env.PORT || 3000;
const API_URL = `http://127.0.0.1:${PORT}`;

// Define the shape of the data so TypeScript is happy
interface ParseStatus {
  total: number;
  parsed: number;
  unparsed: number;
  percentage: string;
}

async function getStatus(): Promise<ParseStatus | null> {
  try {
    const response = await fetch(`${API_URL}/api/parse-status`);
    const data = await response.json();
    return data as ParseStatus;
  } catch (error) {
    console.error('Error fetching status:', error);
    return null;
  }
}

async function monitor() {
  console.clear();
  console.log('📊 PDF Parsing Progress Monitor');
  console.log('================================\n');

  const status = await getStatus();
  
  if (!status) {
    console.log('❌ Cannot connect to server');
    return;
  }

  // Now TypeScript knows these properties exist
  const { total, parsed, unparsed, percentage } = status;
  
  // Progress bar
  const barLength = 40;
  // Handle potential division by zero if total is 0
  const filledLength = total > 0 ? Math.round((barLength * parsed) / total) : 0;
  const bar = '█'.repeat(filledLength) + '░'.repeat(Math.max(0, barLength - filledLength));
  
  console.log(`Total Papers:     ${total}`);
  console.log(`✅ Parsed:         ${parsed}`);
  console.log(`⏳ Remaining:      ${unparsed}`);
  console.log(`\nProgress: [${bar}] ${percentage}%\n`);
  
  // ETA calculation
  if (parsed > 0) {
    const timePerPaper = 2; // 2 seconds per paper (rate limit)
    const estimatedTotalTime = (total * timePerPaper) / 60; // minutes
    const timeElapsed = (parsed * timePerPaper) / 60; // minutes
    const timeRemaining = (unparsed * timePerPaper) / 60; // minutes
    
    console.log(`⏱️  Time Metrics:`);
    console.log(`   Per paper: ${timePerPaper}s`);
    console.log(`   Elapsed: ${Math.round(timeElapsed)}m`);
    console.log(`   Remaining: ${Math.round(timeRemaining)}m`);
    console.log(`   Total estimate: ${Math.round(estimatedTotalTime)}m`);
  }
  
  console.log(`\n⏰ Last update: ${new Date().toLocaleTimeString()}`);
  console.log('Refreshing in 10 seconds...\n');
}

// Monitor every 10 seconds
setInterval(monitor, 10000);
monitor(); // Initial call