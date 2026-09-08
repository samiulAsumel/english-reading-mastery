'use client';

import { useCallback, useEffect, useState } from 'react';
import { localStorageStore } from './localStorageStore';
import { ProgressSnapshot } from './types';

/** Active adapter. Swap this to a backend-backed ProgressStore later. */
const PROGRESS_ADAPTER = localStorageStore;

export function useProgress() {
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so the real snapshot can only
    // be read post-mount — server and first client render intentionally
    // both start from `null` (see isReady below) to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnapshot(PROGRESS_ADAPTER.getSnapshot());
  }, []);

  const markStarted = useCallback((lessonNumber: number) => {
    setSnapshot(PROGRESS_ADAPTER.markStarted(lessonNumber));
  }, []);

  const markCompleted = useCallback((lessonNumber: number) => {
    setSnapshot(PROGRESS_ADAPTER.markCompleted(lessonNumber));
  }, []);

  const reset = useCallback(() => {
    setSnapshot(PROGRESS_ADAPTER.reset());
  }, []);

  return { snapshot, markStarted, markCompleted, reset, isReady: snapshot !== null };
}
