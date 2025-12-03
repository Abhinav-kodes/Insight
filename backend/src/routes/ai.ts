import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';
import { supabase } from '../services/supabase';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Helpers ---

// Helper to log text length safely
const logContentStats = (label: string, text: string | undefined) => {
  if (!text) {
    console.log(`❌ ${label}: EMPTY or UNDEFINED`);
    return;
  }
  const len = text.length;
  console.log(`📏 ${label} Length: ${len} characters`);
  console.log(`   Start: "${text.substring(0, 50).replace(/\n/g, ' ')}..."`);
  console.log(`   End:   "...${text.substring(len - 100).replace(/\n/g, ' ')}"`);
};

// Helper to get full text (Prioritize DB > Client Body)
const getFullPaperText = async (paperId: string | undefined, bodyContent: string | undefined) => {
  // 1. Try DB First if ID exists (Source of Truth)
  if (paperId) {
    console.log(`📥 Fetching full text for ID: ${paperId} from DB...`);
    const { data, error } = await supabase
      .from('content')
      .select('full_text')
      .eq('id', paperId)
      .single();

    if (!error && data?.full_text) {
      console.log('✅ Successfully fetched text from DB');
      return data.full_text;
    }
    console.warn('⚠️ DB fetch failed or empty, falling back to client content');
  }
  
  // 2. Fallback to client content
  return bodyContent || '';
};

// --- Routes ---

// Summarize paper with Gemini
router.post('/summarize', async (req, res) => {
  try {
    const { fullText, paperId, systemPrompt } = req.body;

    console.log('\n--- SUMMARIZE REQUEST RECEIVED ---');
    
    // Fetch full text
    const finalPaperContent = await getFullPaperText(paperId, fullText);
    logContentStats('Final Content for Summary', finalPaperContent);

    if (!finalPaperContent || finalPaperContent.trim().length === 0) {
      return res.status(400).json({ error: 'Full text is required (could not fetch from DB or Body)' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' });

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Config Model with System Instructions (Stronger adherence)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: "You are an expert research paper analyzer. Your goal is to read the ENTIRE provided text and generate a comprehensive summary following the user's structure. Do not output markdown code blocks unless asked."
    });

    const structurePrompt = `Format the response EXACTLY as follows:

## Executive Summary
[1-2 sentences capturing the main contribution]

## Research Question & Objectives
[What problem does this paper solve?]

## Methodology
[Key methods used]

## Key Findings & Results
[Main results - bullet points]

## Implications & Significance
[Why does this matter?]

## Limitations & Future Work
[Areas for further research]

${systemPrompt ? `Additional Instructions: ${systemPrompt}` : ''}
    `;

    console.log('🤖 Calling Gemini 2.0 Flash for summarization...');
    
    // Send as PARTS (Array) to prevent truncation issues
    const result = await model.generateContent([
      { text: structurePrompt },
      { text: "--- BEGIN PAPER CONTENT ---" },
      { text: finalPaperContent },
      { text: "--- END PAPER CONTENT ---" }
    ]);

    const summary = result.response.text();
    console.log('✅ Summary generated');

    res.json({ summary, model: 'gemini-2.0-flash' });

  } catch (error) {
    console.error('❌ AI summarization error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to generate summary' });
  }
});

// Answer questions about paper
router.post('/ask', async (req, res) => {
  try {
    const { question, paperContent, paperId, paperTitle, authors } = req.body;

    console.log('\n--- ASK REQUEST RECEIVED ---');
    console.log(`❓ Question: ${question}`);

    // Fetch full text
    const finalPaperContent = await getFullPaperText(paperId, paperContent);
    logContentStats('Final Content for Ask', finalPaperContent);

    if (!question || !finalPaperContent) {
      return res.status(400).json({ error: 'Question and paper content required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' });

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Config Model with System Instructions for Context Awareness
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: `You are a helpful and rigorous research assistant.
      
      CRITICAL INSTRUCTION: You must read the ENTIRE text content provided, from the very first character to the very last character.
      
      Do not stop reading if you see blank lines, page numbers, or formatting artifacts.
      The user will ask a question about the paper. Answer it based ONLY on the text provided.
      `
    });

    console.log('🤖 Sending prompt to Gemini...');

    // Send as PARTS (Array) - This is the key fix for the "Page 8" issue.
    // It forces the model to treat the huge string as a distinct data block.
    const result = await model.generateContent([
      { text: `Metadata: Title: "${paperTitle || 'Unknown'}", Authors: "${authors || 'Unknown'}"` },
      { text: "--- BEGIN FULL PAPER TEXT ---" },
      { text: finalPaperContent }, // Sent as a separate part
      { text: "--- END FULL PAPER TEXT ---" },
      { text: `USER QUESTION: ${question}` }
    ]);

    const answer = result.response.text();
    console.log('✅ Answer generated');

    res.json({ answer });

  } catch (error) {
    console.error('FAQ error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to answer question' });
  }
});

// Send AI Digest Email
router.post('/send-digest', async (req, res) => {
  try {
    const { email, userId } = req.body;

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email and userId required' });
    }

    console.log(`📧 Generating AI digest for ${email}...`);

    // Fetch user's saved content
    const { data: savedContent, error: fetchError } = await supabase
      .from('content')
      .select('title, description, tags, url')
      .limit(20);

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      throw fetchError;
    }

    if (!savedContent || savedContent.length === 0) {
      return res.status(400).json({ 
        error: 'No saved content found. Save some papers first!'
      });
    }

    // Format content for AI processing
    const contentSummary = savedContent
      .map((item, idx) => `${idx + 1}. Title: ${item.title}\n   Tags: ${item.tags?.join(', ')}\n   URL: ${item.url}`)
      .join('\n\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Generate digest with Gemini
    const digestPrompt = `You are an AI assistant helping users digest research papers and articles. Generate a comprehensive email digest.

User's saved content (${savedContent.length} items):
${contentSummary}

Please generate an engaging digest that:
1. Summarizes the key themes across these papers/articles
2. Identifies important connections and insights
3. Highlights the most significant findings (3-5 key points)
4. Provides 2-3 actionable recommendations for further reading
5. Uses clear, accessible language suitable for email

Format as plain text with clear sections. Include:
- Key themes section
- Top insights (numbered list)
- Recommendations
- A closing

Keep it to about 800-1000 words. Make it engaging but professional.`;

    console.log('🤖 Generating digest with Gemini...');

    const result = await model.generateContent(digestPrompt);
    const digestText = result.response.text();

    console.log(`✅ Digest generated successfully (${digestText.length} chars)`);

    // Create HTML email
    const digestHtml = `
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(to right, #d18b2a, #c17a1f); padding: 30px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; background: #f9f6f3; }
    .footer { padding: 20px; background: #f0f0f0; text-align: center; font-size: 12px; color: #666; }
    a { color: #d18b2a; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your INSIGHTS AI Digest</h1>
      <p>Personalized insights from your saved content</p>
    </div>
    
    <div class="content">
      <p>Hello,</p>
      <p>Here's your personalized AI-generated digest from <strong>${savedContent.length} saved items</strong>:</p>
      
      <div style="white-space: pre-wrap; background: white; padding: 20px; border-left: 4px solid #d18b2a; margin: 20px 0;">
${digestText}
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 2px solid #e5d3b3;">
      
      <p><strong>Continue Exploring:</strong></p>
      <ul>
        <li>Save more papers related to your interests</li>
        <li>Request a new digest tomorrow for fresh insights</li>
        <li>Visit <a href="http://localhost:5173/home">INSIGHTS Dashboard</a> to manage your content</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>This digest was automatically generated by INSIGHTS AI.</p>
      <p>Next digest available: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
      <p><a href="http://localhost:5173/home">View on INSIGHTS →</a></p>
      <p style="margin-top: 10px; color: #999;">© 2025 INSIGHTS. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️  RESEND_API_KEY not configured, skipping email send');
      return res.json({
        success: true,
        message: 'Digest generated (email not sent - API not configured)',
        email,
        itemsIncluded: savedContent.length,
        preview: digestText.substring(0, 200)
      });
    }

    // Send email with Resend
    console.log(`📬 Sending digest email to ${email}...`);

    const emailResponse = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@insights.com',
      to: email,
      subject: `Your INSIGHTS AI Digest - ${new Date().toLocaleDateString()}`,
      html: digestHtml,
    });

    if (emailResponse.error) {
      console.error('❌ Email send error:', emailResponse.error);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    console.log(`✅ Email sent successfully! ID: ${emailResponse.data?.id}`);

    res.json({
      success: true,
      message: 'Digest sent successfully to your email',
      email,
      itemsIncluded: savedContent.length,
      emailId: emailResponse.data?.id,
      preview: digestText.substring(0, 300)
    });

  } catch (error) {
    console.error('❌ Error sending digest:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to send digest',
      type: error instanceof Error ? error.name : 'Unknown'
    });
  }
});

export default router;