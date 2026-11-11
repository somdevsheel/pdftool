'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getJob } from '../lib/jobsClient';
import { Job } from '../types/web.types';

const POLL_INTERVAL_MS = 1500;
// Large Office conversions can take a few minutes; anything past this is stuck.
const MAX_POLL_MS = 10 * 60_000;
// A single dropped request (flaky Wi-Fi, mobile handover) shouldn't fail the job.
const MAX_CONSECUTIVE_ERRORS = 4;

export function useJobStatus() {
  const [job, setJob]         = useState<Job | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const intervalRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Stop polling when the component using this hook unmounts (user navigates away).
  useEffect(() => stopPolling, [stopPolling]);

  const poll = useCallback(
    async (jobId: string, onDone?: (job: Job) => void) => {
      setError(null);
      stopPolling();

      const startedAt = Date.now();
      let consecutiveErrors = 0;
      let last: Job | null = null;

      const finish = (j: Job) => {
        stopPolling();
        if (j.status === 'FAILED') setError(j.error || 'Processing failed. Please try again.');
        onDone?.(j);
      };

      // Pages only react to onDone, so a polling failure is reported as a failed job —
      // otherwise the page would show its spinner forever.
      const giveUp = (message: string) => {
        const failed = { ...(last ?? { id: jobId }), status: 'FAILED', error: message } as Job;
        setJob(failed);
        finish(failed);
      };

      const check = async () => {
        try {
          const updated = await getJob(jobId) as unknown as Job;
          consecutiveErrors = 0;
          last = updated;
          setJob(updated);
          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            finish(updated);
            return true;
          }
        } catch (err: any) {
          if (++consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
            giveUp(err.message);
            return true;
          }
        }
        if (Date.now() - startedAt > MAX_POLL_MS) {
          giveUp('This is taking much longer than expected. Please try again with a smaller file.');
          return true;
        }
        return false;
      };

      // Fetch immediately, then keep polling until the job finishes.
      if (await check()) return;
      intervalRef.current = setInterval(check, POLL_INTERVAL_MS);
    },
    [stopPolling],
  );

  const reset = useCallback(() => {
    stopPolling();
    setJob(null);
    setError(null);
  }, [stopPolling]);

  return { job, error, poll, reset, stopPolling };
}
