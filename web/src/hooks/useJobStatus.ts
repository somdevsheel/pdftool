'use client';

import { useState, useCallback, useRef } from 'react';
import { getJob } from '../lib/jobsClient';
import { Job } from '../types/web.types';

export function useJobStatus() {
  const [job, setJob]         = useState<Job | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const intervalRef           = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const poll = useCallback(
    async (jobId: string, onDone?: (job: Job) => void) => {
      setError(null);
      stopPolling();

      // Fetch immediately
      try {
        const initial = await getJob(jobId) as unknown as Job;
        setJob(initial);
        if (initial.status === 'COMPLETED' || initial.status === 'FAILED') {
          if (onDone) onDone(initial);
          return;
        }
      } catch (err: any) {
        setError(err.message);
        return;
      }

      intervalRef.current = setInterval(async () => {
        try {
          const updated = await getJob(jobId) as unknown as Job;
          setJob(updated);
          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            stopPolling();
            if (updated.status === 'FAILED') setError(updated.error || 'Job failed');
            if (onDone) onDone(updated);
          }
        } catch (err: any) {
          stopPolling();
          setError(err.message);
        }
      }, 1500);
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