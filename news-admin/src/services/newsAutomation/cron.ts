
// /**
//  * news-admin/src/services/newsAutomation/cron.ts
//  *
//  * Runs runNewsAutomation() on startup + every 60 minutes.
//  * Called once from src/instrumentation.ts when Next.js server boots.
//  */

// import { runNewsAutomation } from './newsAutomation';

// let initialized = false;
// const ONE_HOUR  = 60 * 60 * 1000; // 3,600,000 ms

// export function initNewsCron(): void {
//   if (initialized) return;
//   initialized = true;

//   console.log('[NEWS-CRON] Scheduler started — runs every 60 minutes');
//   console.log('[NEWS-CRON] First run in 15 seconds...');

//   // ── Run once on startup (short delay to let DB / server finish booting) ───
//   setTimeout(async () => {
//     console.log('[NEWS-CRON] ▶ Starting initial run...');
//     try {
//       await runNewsAutomation();
//     } catch (err) {
//       console.error('[NEWS-CRON] ✗ Initial run failed:', err);
//     }

//     // ── Schedule hourly repeats ─────────────────────────────────────────────
//     setInterval(async () => {
//       const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
//       console.log('[NEWS-CRON] ▶ Hourly run at', now);
//       try {
//         await runNewsAutomation();
//       } catch (err) {
//         console.error('[NEWS-CRON] ✗ Hourly run failed:', err);
//       }
//     }, ONE_HOUR);

//     console.log('[NEWS-CRON] Next run scheduled in 60 minutes');
//   }, 15_000);
// }




/**
 * news-admin/src/services/newsAutomation/cron.ts
 *
 * Runs runNewsAutomation() on startup (after 15s delay) then every 60 minutes.
 *
 * FIX: interval is scheduled immediately alongside the startup delay,
 * not nested inside the first run — so hourly timing is always accurate
 * regardless of how long each run takes.
 */

import { runNewsAutomation } from './newsAutomation';

let initialized = false;
const ONE_HOUR = 60 * 60 * 1000; // 3,600,000 ms
// const ONE_HOUR = 60 * 1000;

async function safeRun(label: string) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  console.log(`[NEWS-CRON] ▶ ${label} at ${now}`);
  try {
    await runNewsAutomation();
  } catch (err) {
    console.error(`[NEWS-CRON] ✗ ${label} failed:`, err);
  }
}

export function initNewsCron(): void {
  if (initialized) return;
  initialized = true;

  console.log('[NEWS-CRON] ✅ Scheduler initialized — runs every 60 minutes');
  console.log('[NEWS-CRON] ⏳ First run in 15 seconds...');

  // ── Run once shortly after server boot ───────────────────────────────────
  setTimeout(() => safeRun('Initial run'), 15_000);

  // ── Schedule hourly — interval starts NOW, independent of run duration ───
  // This means if server boots at 10:00, runs happen at 11:00, 12:00, 13:00
  // regardless of how long each individual run takes.
  setInterval(() => safeRun('Hourly run'), ONE_HOUR);

  // Log next scheduled time
  const nextRun = new Date(Date.now() + ONE_HOUR);
  console.log('[NEWS-CRON] 🕐 Next hourly run at:', nextRun.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
}