/**
 * news-admin/src/services/newsAutomation/newsAutomation.ts
 *
 * Pipeline:
 *  1. Fetch top 10 RSS items across all categories
 *  2. For each item ONE BY ONE:
 *     a. Scrape article text
 *     b. Send to Gemini AI → get rewritten article
 *     c. INSERT into DB immediately (don't wait for others)
 *     d. Log result, move to next
 *  3. Repeat every hour via cron.ts
 *
 * Env vars needed in .env.local:
 *   GEMINI_API_KEY=your_key   (get free at aistudio.google.com)
 *   MONGODB_URI=already set
 */

import mongoose from 'mongoose';
import { User } from '@/lib/models/User';
import { News } from '@/lib/models/News';
import { TAG_COLORS, NewsTag } from '@/types';

// ─── Config ───────────────────────────────────────────────────────────────────
const TOTAL_ARTICLES_PER_RUN = 10;   // top N across all categories
const ARTICLES_PER_CATEGORY  = 3;    // pull 3 from each feed (8 cats × 3 = 24, pick top 10)
const DELAY_BETWEEN_ARTICLES = 3000; // ms between Gemini calls — avoids rate limiting

// ─── Logger ───────────────────────────────────────────────────────────────────
const log = {
  info:  (msg: string) => console.log(`[NEWS-AUTO ${ts()}] ℹ️  ${msg}`),
  ok:    (msg: string) => console.log(`[NEWS-AUTO ${ts()}] ✅  ${msg}`),
  skip:  (msg: string) => console.log(`[NEWS-AUTO ${ts()}] ⏭️  ${msg}`),
  error: (msg: string) => console.error(`[NEWS-AUTO ${ts()}] ❌  ${msg}`),
  ai:    (msg: string) => console.log(`[NEWS-AUTO ${ts()}] 🤖  ${msg}`),
  step:  (n: number, total: number, msg: string) =>
    console.log(`[NEWS-AUTO ${ts()}] [${n}/${total}] ${msg}`),
};
function ts() {
  return new Date().toTimeString().slice(0, 8); // HH:MM:SS
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface RawItem {
  title:       string;
  link:        string;
  source:      string;
  description: string;
  category:    NewsTag;
}

// ─── Mongoose model (lazy) ────────────────────────────────────────────────────
type NewsModelType = mongoose.Model<{
  title: string; summary: string; content: string; tag: string; tagColor: string;
  imageUrl: string; imageKey: string; source: string; sourceUrl: string;
  readTime: number; featured: boolean; published: boolean; views: number;
  contentType: string; author: mongoose.Types.ObjectId; slug?: string | null;
}>;

// The app's real News model. A private stand-in schema used to live here; whenever the
// cron loaded first it became the app-wide "News" model, with published defaulting to
// true — so drafts created in the admin were published immediately.
function getNewsModel(): NewsModelType {
  return News as unknown as NewsModelType;
}

// ─── RSS feeds ────────────────────────────────────────────────────────────────
const RSS_FEEDS: Record<NewsTag, string> = {
  'AI':          'https://news.google.com/rss/search?q=Artificial+Intelligence+AI&hl=en-IN&gl=IN&ceid=IN:en',
  'Security':    'https://news.google.com/rss/search?q=cybersecurity&hl=en-IN&gl=IN&ceid=IN:en',
  'Cloud':       'https://news.google.com/rss/search?q=cloud+computing&hl=en-IN&gl=IN&ceid=IN:en',
  'Tools':       'https://news.google.com/rss/search?q=developer+tools&hl=en-IN&gl=IN&ceid=IN:en',
  'Web':         'https://news.google.com/rss/search?q=web+development&hl=en-IN&gl=IN&ceid=IN:en',
  'Mobile':      'https://news.google.com/rss/search?q=mobile+development&hl=en-IN&gl=IN&ceid=IN:en',
  'Open Source': 'https://news.google.com/rss/search?q=open+source+software&hl=en-IN&gl=IN&ceid=IN:en',
  'Startups':    'https://news.google.com/rss/search?q=tech+startup&hl=en-IN&gl=IN&ceid=IN:en',
};

// ─── Category keyword detector ────────────────────────────────────────────────
const KEYWORDS: Record<NewsTag, string[]> = {
  'AI':          ['artificial intelligence', 'machine learning', 'llm', 'gpt', 'neural', 'openai', 'gemini', 'chatbot', 'generative ai', 'deep learning'],
  'Security':    ['cybersecurity', 'hacking', 'malware', 'ransomware', 'vulnerability', 'breach', 'phishing', 'zero-day', 'cyber attack'],
  'Cloud':       ['aws', 'azure', 'google cloud', 'cloud computing', 'kubernetes', 'docker', 'serverless', 'devops'],
  'Tools':       ['developer tools', 'ide', 'vscode', 'cli', 'sdk', 'framework', 'npm', 'package manager', 'productivity'],
  'Web':         ['web development', 'javascript', 'typescript', 'react', 'next.js', 'vue', 'angular', 'css', 'frontend', 'backend'],
  'Mobile':      ['android', 'ios', 'mobile app', 'flutter', 'react native', 'swift', 'kotlin', 'app store'],
  'Open Source': ['open source', 'linux', 'apache', 'mit license', 'contributor', 'open-source'],
  'Startups':    ['startup', 'funding', 'venture capital', 'series a', 'seed round', 'unicorn', 'ipo', 'acquisition'],
};

function detectCategory(text: string): NewsTag {
  const lower = text.toLowerCase();
  let best: NewsTag = 'AI';
  let bestScore = 0;
  for (const [cat, kws] of Object.entries(KEYWORDS) as [NewsTag, string[]][]) {
    const score = kws.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = cat; }
  }
  return best;
}

// ─── Minimal RSS parser (zero deps) ──────────────────────────────────────────
function parseRss(xml: string): { title: string; link: string; source: string; description: string }[] {
  const results: { title: string; link: string; source: string; description: string }[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const get = (tag: string) => {
      const re = new RegExp(
        '<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/' + tag + '>|<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>',
        'i'
      );
      const r = re.exec(block);
      return r ? (r[1] != null ? r[1] : r[2] || '').trim() : '';
    };
    const srcM = /<source[^>]*>([\s\S]*?)<\/source>/i.exec(block);
    const title = get('title').replace(/ - [^-]+$/, '').trim();
    if (!title) continue;
    results.push({
      title,
      link:        get('link'),
      source:      srcM ? srcM[1].trim() : 'Unknown',
      description: get('description')
        .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim(),
    });
  }
  return results;
}

// ─── DB ───────────────────────────────────────────────────────────────────────
async function connectDB(): Promise<void> {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  log.info('MongoDB connected');
}

async function getBotUserId(): Promise<mongoose.Types.ObjectId> {
  // Use the real User model. Registering a bare stand-in here (as before) made it the
  // app-wide "User" model whenever the cron ran first, which broke login
  // (comparePassword is not a function).
  const admin = await User.findOne({ role: 'admin' }).lean() as { _id: mongoose.Types.ObjectId } | null;
  if (!admin) throw new Error('No admin user found in DB');
  return admin._id;
}

// ─── STEP 1: Collect top 10 fresh RSS items ───────────────────────────────────
async function collectTopItems(): Promise<RawItem[]> {
  log.info('Collecting RSS feeds from all 8 categories...');
  const all: RawItem[] = [];

  for (const [category, feedUrl] of Object.entries(RSS_FEEDS) as [NewsTag, string][]) {
    try {
      const res = await fetch(feedUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) { log.error(`RSS ${category}: HTTP ${res.status}`); continue; }
      const xml   = await res.text();
      const items = parseRss(xml).slice(0, ARTICLES_PER_CATEGORY);
      for (const item of items) {
        all.push({ ...item, category });
      }
      log.info(`  ${category}: got ${items.length} items`);
    } catch (e) {
      log.error(`RSS ${category}: ${e}`);
    }
  }

  // Shuffle so we get variety, then take top N
  const shuffled = all.sort(() => Math.random() - 0.5);
  const top = shuffled.slice(0, TOTAL_ARTICLES_PER_RUN);
  log.info(`Collected ${all.length} total → selected top ${top.length} for this run`);
  return top;
}

// ─── STEP 2: Resolve Google News redirect → real URL ─────────────────────────
async function resolveUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
      signal: AbortSignal.timeout(8_000),
    });
    return res.url || url;
  } catch { return url; }
}

// ─── STEP 3: Scrape article text from real URL ────────────────────────────────
async function scrapeText(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)', Accept: 'text/html' },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return '';
    const html = await res.text();
    const paras: string[] = [];
    const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      const t = m[1]
        .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
      if (t.length > 60) paras.push(t);
      if (paras.length >= 25) break;
    }
    return paras.join('\n\n');
  } catch { return ''; }
}

// ─── STEP 4: Send to Gemini → get structured article ─────────────────────────
async function rewriteWithGemini(
  title: string,
  rawText: string,
  source: string,
  sourceUrl: string,
  category: NewsTag,
): Promise<{ title: string; summary: string; content: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) { log.error('GEMINI_API_KEY not set'); return null; }

  // ── Plain-text delimiters — avoids ALL JSON escaping/truncation bugs ────────
  // Gemini writes a long markdown article which breaks JSON (unescaped quotes,
  // newlines, apostrophes). Instead we ask for a simple delimited format and
  // extract fields with indexOf — 100% reliable regardless of content length.
  // If raw text is very thin, tell Gemini to write from knowledge — avoids empty responses
  const hasContent = rawText && rawText.length > 200;
  const prompt =
    'You are a professional tech journalist. Write a complete original blog article.\n\n' +
    'HEADLINE: ' + title + '\n' +
    'CATEGORY: ' + category + '\n' +
    'SOURCE: ' + source + '\n' +
    (hasContent
      ? 'RAW TEXT (use as reference):\n' + rawText.slice(0, 3500)
      : 'NOTE: No source text available. Write a well-researched article based on your knowledge of this topic and headline.'
    ) + '\n\n' +
    'OUTPUT RULES — follow exactly:\n' +
    'Line 1:  TITLE: your SEO blog title (max 80 chars, no quotes)\n' +
    'Line 2:  SUMMARY: one sentence summary (max 260 chars, no quotes)\n' +
    'Line 3:  ARTICLE_START\n' +
    'Lines 4+: the full markdown article (450-600 words)\n' +
    'Last line: ARTICLE_END\n\n' +
    'ARTICLE REQUIREMENTS:\n' +
    '- Strong opening paragraph with no heading\n' +
    '- Use these headings in order:\n' +
    '  ## What Happened\n' +
    '  ## Why It Matters\n' +
    '  ## Key Details  (use bullet points here)\n' +
    '  ## What This Means For You\n' +
    '  ## Takeaway\n' +
    '- Neutral journalistic tone\n' +
    '- Very last line of article: *Source: [' + source + '](' + sourceUrl + ')*\n\n' +
    'OUTPUT NOTHING ELSE. No JSON. No explanation. No markdown fences around the output.';

  log.ai('Sending to Gemini 2.5 Flash: "' + title.slice(0, 55) + '..."');

  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.65,
            maxOutputTokens: 2000,
          },
        }),
        signal: AbortSignal.timeout(60_000),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      log.error('Gemini HTTP ' + res.status + ': ' + err.slice(0, 200));
      return null;
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
    };
    const raw = (data?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
    if (!raw) { log.error('Gemini returned empty response'); return null; }

    // ── Parse delimited output ───────────────────────────────────────────────
    // Gemini sometimes skips ARTICLE_START/ARTICLE_END markers entirely.
    // Strategy: extract TITLE and SUMMARY by prefix, then everything else is the article.
    const lines = raw.split('\n');

    // Extract TITLE line — with or without 'TITLE:' prefix
    const titleLine = lines.find(l => l.trimStart().startsWith('TITLE:')) || '';
    const aiTitle   = titleLine
      ? titleLine.replace(/^TITLE:\s*/i, '').trim().slice(0, 120)
      : (lines.find(l => l.trim().length > 10 && !l.trim().startsWith('SUMMARY:')) || '').trim().slice(0, 120);

    // Extract SUMMARY line
    const summaryLine = lines.find(l => l.trimStart().startsWith('SUMMARY:')) || '';
    const aiSummary   = summaryLine.replace(/^SUMMARY:\s*/i, '').trim().slice(0, 280);

    // Extract article content — try all strategies in order:
    let aiContent = '';

    // Strategy A: between ARTICLE_START and ARTICLE_END (ideal)
    const startIdx = lines.findIndex(l => l.trim() === 'ARTICLE_START');
    const endIdx   = lines.findIndex(l => l.trim() === 'ARTICLE_END');
    if (startIdx !== -1) {
      aiContent = lines
        .slice(startIdx + 1, endIdx > startIdx ? endIdx : undefined)
        .join('\n').trim();
    }

    // Strategy B: everything after SUMMARY line (Gemini skipped the markers)
    if (!aiContent) {
      const summaryIdx = lines.findIndex(l => l.trimStart().startsWith('SUMMARY:'));
      if (summaryIdx !== -1) {
        aiContent = lines
          .slice(summaryIdx + 1)
          .filter(l => l.trim() !== 'ARTICLE_START' && l.trim() !== 'ARTICLE_END')
          .join('\n').trim();
      }
    }

    // Strategy C: last resort — drop first 2 lines (TITLE + SUMMARY) and take rest
    if (!aiContent) {
      aiContent = lines
        .slice(2)
        .filter(l => l.trim() !== 'ARTICLE_START' && l.trim() !== 'ARTICLE_END')
        .join('\n').trim();
    }

    if (!aiTitle) {
      log.error('Gemini returned no TITLE. Raw: ' + raw.slice(0, 200));
      return null;
    }
    // Reject if content looks like just the summary (no headings, too short)
    const hasHeading = aiContent.includes('##') || aiContent.includes('\n\n');
    const wordCount  = aiContent.trim().split(/\s+/).length;
    if (!aiContent || wordCount < 50 || (!hasHeading && wordCount < 100)) {
      log.error('Gemini body too short (' + wordCount + ' words) — skipping. Raw: ' + raw.slice(0, 200));
      return null;
    }

    // If summary not found, build from first sentence of content
    const finalSummary = aiSummary || aiContent.split(/[.!?]/)[0].trim().slice(0, 260);

    log.ai('Gemini OK — ' + aiContent.split(/\s+/).length + ' words');
    return { title: aiTitle, summary: finalSummary, content: aiContent };

  } catch (e) {
    log.error('Gemini error: ' + e);
    return null;
  }
}

// ─── STEP 5: Generate image with Gemini + upload to S3 ───────────────────────
async function generateAndUploadImage(
  title: string,
  category: NewsTag,
): Promise<{ imageUrl: string; imageKey: string }> {
  const apiKey   = process.env.GEMINI_API_KEY;
  const bucket   = process.env.S3_BUCKET_NAME;
  const region   = process.env.AWS_REGION || 'us-east-1';
  const cfDomain = process.env.CLOUDFRONT_DOMAIN || '';

  const fallback = () => {
    const seed = Math.floor(Math.random() * 900) + 100;
    return { imageUrl: 'https://picsum.photos/seed/' + seed + '/1200/630', imageKey: 'picsum/' + seed };
  };

  if (!apiKey || !bucket) {
    log.error('Image gen: missing GEMINI_API_KEY or S3_BUCKET_NAME — using fallback');
    return fallback();
  }

  const styleMap: Record<NewsTag, string> = {
    'AI':          'futuristic neural network, glowing blue nodes, dark background, no text',
    'Security':    'cybersecurity concept, digital lock, red circuit patterns, dark background, no text',
    'Cloud':       'cloud computing servers, soft blue lighting, data center, no text',
    'Tools':       'developer tools, code editor dark theme, clean workspace, no text',
    'Web':         'modern web UI components, colorful minimal interface design, no text',
    'Mobile':      'smartphone app interface, clean product shot, gradient background, no text',
    'Open Source': 'open source collaboration, glowing code, network nodes, dark theme, no text',
    'Startups':    'startup growth chart, modern minimal office concept, no text',
  };

  const style   = styleMap[category] || 'modern technology concept, professional, clean, no text';
  const imgPrompt =
    'Professional tech blog featured image for article: "' + title + '". ' +
    'Visual style: ' + style + '. ' +
    'Wide 16:9 format, photorealistic or high-quality digital art. No text, no watermarks.';

  log.ai('Generating image: "' + title.slice(0, 55) + '..."');

  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: imgPrompt }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
        signal: AbortSignal.timeout(45_000),
      }
    );

    if (!res.ok) {
      log.error('Image gen HTTP ' + res.status + ' — using fallback');
      return fallback();
    }

    const data = await res.json() as {
      candidates?: { content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[]
    };
    const part = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data);
    if (!part?.inlineData?.data) {
      log.error('Image gen: no image in Gemini response — using fallback');
      return fallback();
    }

    const mimeType  = part.inlineData.mimeType || 'image/png';
    const imgBuffer = Buffer.from(part.inlineData.data, 'base64');
    const ext       = mimeType === 'image/jpeg' ? 'jpg' : 'png';
    const imageKey  = 'auto/news/' + Date.now() + '-' + Math.random().toString(36).slice(2) + '.' + ext;

    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId:     process.env.AWS_ACCESS_KEY_ID     || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    await s3.send(new PutObjectCommand({
      Bucket: bucket, Key: imageKey, Body: imgBuffer,
      ContentType: mimeType, CacheControl: 'public, max-age=31536000',
    }));

    const imageUrl = cfDomain
      ? cfDomain.replace(/\/$/, '') + '/' + imageKey
      : 'https://' + bucket + '.s3.' + region + '.amazonaws.com/' + imageKey;

    log.ok('Image uploaded → ' + imageUrl.slice(0, 80));
    return { imageUrl, imageKey };

  } catch (e) {
    log.error('Image gen error: ' + e + ' — using fallback');
    return fallback();
  }
}

// ─── MAIN PIPELINE ────────────────────────────────────────────────────────────
export async function runNewsAutomation(): Promise<void> {
  const runStart = Date.now();
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log.info('Starting hourly news run — target: ' + TOTAL_ARTICLES_PER_RUN + ' articles');
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!process.env.GEMINI_API_KEY) {
    log.error('GEMINI_API_KEY is not set. Add it to .env.local and restart.');
    log.error('Get a free key at: https://aistudio.google.com/app/apikey');
    return;
  }

  await connectDB();
  const News     = getNewsModel();
  const authorId = await getBotUserId();

  // ── Step 1: Collect RSS items ──────────────────────────────────────────────
  const items = await collectTopItems();
  if (items.length === 0) {
    log.error('No RSS items found — check network or RSS feeds');
    return;
  }

  const stats = { total: items.length, inserted: 0, skipped: 0, failed: 0 };

  // ── Process each article ONE BY ONE — fully sequential, each step awaited ──
  for (let i = 0; i < items.length; i++) {
    const item  = items[i];
    const n     = i + 1;
    const total = items.length;

    console.log('');
    log.info(`━━━ Article ${n}/${total} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    log.info(`Title: "${item.title.slice(0, 70)}"`);

    try {
      // ── STAGE 1: Resolve real URL ──────────────────────────────────────────
      log.info(`[${n}/${total}] 🔗 STAGE 1/5 — Resolving URL...`);
      const realUrl = await resolveUrl(item.link);
      log.info(`[${n}/${total}] URL → ${realUrl.slice(0, 90)}`);

      // ── Duplicate check ────────────────────────────────────────────────────
      const exists = await News.exists({ sourceUrl: realUrl });
      if (exists) {
        log.skip(`[${n}/${total}] Already in DB — skipping`);
        stats.skipped++;
        continue;
      }

      // ── STAGE 2: Scrape article text ───────────────────────────────────────
      log.info(`[${n}/${total}] 📄 STAGE 2/5 — Scraping article text...`);
      const scrapedText = await scrapeText(realUrl);
      const bodyText = (scrapedText && scrapedText.length > 300)
        ? scrapedText
        : item.description;

      if (!bodyText || bodyText.length < 60) {
        log.skip(`[${n}/${total}] No usable content scraped — skipping`);
        stats.skipped++;
        continue;
      }
      log.info(`[${n}/${total}] Scraped ${bodyText.length} chars`);

      // ── STAGE 3: Gemini writes the article text ────────────────────────────
      log.info(`[${n}/${total}] 🤖 STAGE 3/5 — Gemini writing article text... (waiting)`);
      const t3start  = Date.now();
      const aiResult = await rewriteWithGemini(
        item.title, bodyText, item.source, realUrl, item.category
      );
      log.info(`[${n}/${total}] Text done in ${((Date.now() - t3start) / 1000).toFixed(1)}s`);

      if (!aiResult || !aiResult.content || aiResult.content.length < 100) {
        log.error(`[${n}/${total}] Gemini text unusable — skipping`);
        stats.failed++;
        continue;
      }

      // ── STAGE 4: Gemini generates image — WAIT for it ─────────────────────
      log.info(`[${n}/${total}] 🎨 STAGE 4/5 — Gemini generating image... (waiting)`);
      const t4start  = Date.now();
      const finalCategory = detectCategory(aiResult.title + ' ' + aiResult.content) || item.category;
      const { imageUrl, imageKey } = await generateAndUploadImage(
        aiResult.title || item.title,
        finalCategory,
      );
      log.info(`[${n}/${total}] Image ready in ${((Date.now() - t4start) / 1000).toFixed(1)}s → ${imageUrl.slice(0, 70)}`);

      // ── STAGE 5: Insert into DB ────────────────────────────────────────────
      log.info(`[${n}/${total}] 💾 STAGE 5/5 — Saving to database...`);
      const wordCount = aiResult.content.trim().split(/\s+/).length;
      const readTime  = Math.max(1, Math.ceil(wordCount / 200));
      await News.create({
        title:       aiResult.title || item.title,
        summary:     aiResult.summary,
        content:     aiResult.content,
        tag:         finalCategory,
        tagColor:    TAG_COLORS[finalCategory] || '#6B7FD7',
        imageUrl,
        imageKey,
        source:      item.source,
        sourceUrl:   realUrl,
        readTime,
        featured:    false,
        published:   true,
        author:      authorId,
        contentType: 'news',
      });

      log.ok(`[${n}/${total}] ✅ PUBLISHED: "${(aiResult.title || item.title).slice(0, 65)}"`);
      stats.inserted++;

      // Delay before next article to avoid Gemini rate limiting
      if (i < items.length - 1) {
        log.info(`[${n}/${total}] ⏳ Waiting ${DELAY_BETWEEN_ARTICLES / 1000}s before next article...`);
        await new Promise(r => setTimeout(r, DELAY_BETWEEN_ARTICLES));
      }

    } catch (err) {
      log.error(`[${i + 1}/${items.length}] Unexpected error: ${err}`);
      stats.failed++;
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  const elapsed = ((Date.now() - runStart) / 1000).toFixed(1);
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log.info(`Run complete in ${elapsed}s`);
  log.info(`  ✅ Published : ${stats.inserted}`);
  log.info(`  ⏭️  Skipped   : ${stats.skipped} (duplicates or no content)`);
  log.info(`  ❌ Failed    : ${stats.failed}`);
  log.info(`  📰 Total     : ${stats.total}`);
  log.info('Next run in 1 hour');
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}