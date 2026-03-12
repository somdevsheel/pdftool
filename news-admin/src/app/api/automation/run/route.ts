/**
 * news-admin/src/app/api/automation/run/route.ts
 *
 * POST /api/automation/run
 * Manually triggers a news automation run from the admin dashboard.
 * Protected — admin/editor only.
 */

// import { NextResponse } from 'next/server';
// import { getAuthUser } from '@/lib/auth';
// import { runNewsAutomation } from '@/services/newsAutomation/newsAutomation';

// // Track running state to prevent concurrent runs
// let isRunning = false;

// export async function POST() {
//   const user = await getAuthUser();
//   if (!user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   if (isRunning) {
//     return NextResponse.json(
//       { error: 'Automation is already running. Please wait.' },
//       { status: 409 }
//     );
//   }

//   // Fire and forget — don't await so the HTTP response returns immediately
//   isRunning = true;
//   runNewsAutomation()
//     .catch(err => console.error('[AUTOMATION API] Run failed:', err))
//     .finally(() => { isRunning = false; });

//   return NextResponse.json({
//     success: true,
//     message: 'News automation started. Articles will appear within 1–2 minutes.',
//     startedAt: new Date().toISOString(),
//   });
// }

// export async function GET() {
//   const user = await getAuthUser();
//   if (!user) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }
//   return NextResponse.json({ isRunning });
// }


/**
 * news-admin/src/app/api/automation/run/route.ts
 *
 * POST /api/automation/run
 * Triggered either by:
 *   1. Admin user from dashboard (cookie auth)
 *   2. Server cron job via secret token:
 *      curl -X POST https://... -H "x-cron-secret: YOUR_SECRET"
 *
 * Add to .env.local and Vercel:
 *   CRON_SECRET=any-long-random-string
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { runNewsAutomation } from '@/services/newsAutomation/newsAutomation';

let isRunning = false;

function isCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  // Accept secret via header or query param
  const headerSecret = req.headers.get('x-cron-secret');
  const querySecret  = req.nextUrl.searchParams.get('secret');
  return headerSecret === secret || querySecret === secret;
}

export async function POST(req: NextRequest) {
  // Allow if valid cron secret OR logged-in admin user
  const cronOk = isCronRequest(req);
  const user   = cronOk ? true : await getAuthUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isRunning) {
    return NextResponse.json(
      { message: 'Already running — skipping this trigger' },
      { status: 409 }
    );
  }

  isRunning = true;
  const triggeredBy = cronOk ? 'server-cron' : 'admin-dashboard';
  console.log(`[AUTOMATION] Triggered by: ${triggeredBy}`);

  runNewsAutomation()
    .catch(err => console.error('[AUTOMATION] Run failed:', err))
    .finally(() => { isRunning = false; });

  return NextResponse.json({
    success:     true,
    triggeredBy,
    message:     'News automation started.',
    startedAt:   new Date().toISOString(),
  });
}

export async function GET(req: NextRequest) {
  const cronOk = isCronRequest(req);
  const user   = cronOk ? true : await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ isRunning });
}