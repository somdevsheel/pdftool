/**
 * news-admin/src/app/api/automation/run/route.ts
 *
 * POST /api/automation/run
 * Manually triggers a news automation run from the admin dashboard.
 * Protected — admin/editor only.
 */

import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { runNewsAutomation } from '@/services/newsAutomation/newsAutomation';

// Track running state to prevent concurrent runs
let isRunning = false;

export async function POST() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isRunning) {
    return NextResponse.json(
      { error: 'Automation is already running. Please wait.' },
      { status: 409 }
    );
  }

  // Fire and forget — don't await so the HTTP response returns immediately
  isRunning = true;
  runNewsAutomation()
    .catch(err => console.error('[AUTOMATION API] Run failed:', err))
    .finally(() => { isRunning = false; });

  return NextResponse.json({
    success: true,
    message: 'News automation started. Articles will appear within 1–2 minutes.',
    startedAt: new Date().toISOString(),
  });
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ isRunning });
}