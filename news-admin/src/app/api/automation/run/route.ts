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
import { safeEqual } from '@/lib/security';
import { runNewsAutomation } from '@/services/newsAutomation/newsAutomation';

let isRunning = false;

function isCronRequest(req: NextRequest): boolean {
  // Header only: a secret in the query string ends up in access logs and browser history.
  return safeEqual(req.headers.get('x-cron-secret'), process.env.CRON_SECRET);
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