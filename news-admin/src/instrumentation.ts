/**
 * news-admin/src/instrumentation.ts
 *
 * Next.js instrumentation hook — runs once on server startup.
 * This is the official Next.js way to run server-side init code.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Make sure next.config.js has:
 *   experimental: { instrumentationHook: true }
 */

// export async function register() {
//   // Only run in the Node.js runtime (not Edge), and only in production
//   // or when explicitly enabled in development via env var.
//   if (process.env.NEXT_RUNTIME !== 'nodejs') return;

//   if (process.env.NEWS_AUTOMATION_ENABLED !== 'true') {
//     console.log('[INSTRUMENTATION] NEWS_AUTOMATION_ENABLED is not true — skipping cron init');
//     return;
//   }

//   const { initNewsCron } = await import('./services/newsAutomation/cron');
//   initNewsCron();
// }




/**
 * news-admin/src/instrumentation.ts
 *
 * Next.js instrumentation hook — runs once on server startup.
 *
 * FIX: NEXT_RUNTIME is 'nodejs' in production but often UNDEFINED in dev.
 * Checking for !== 'nodejs' was blocking the cron from ever starting in dev.
 * Correct check: only block 'edge' runtime, allow everything else (nodejs + undefined).
 */

export async function register() {
  // Block Edge runtime only — allow nodejs and undefined (dev mode)
  if (process.env.NEXT_RUNTIME === 'edge') return;

  if (process.env.NEWS_AUTOMATION_ENABLED !== 'true') {
    console.log('[INSTRUMENTATION] NEWS_AUTOMATION_ENABLED is not "true" — skipping cron');
    return;
  }

  console.log('[INSTRUMENTATION] ✅ Starting news automation cron...');
  const { initNewsCron } = await import('./services/newsAutomation/cron');
  initNewsCron();
}