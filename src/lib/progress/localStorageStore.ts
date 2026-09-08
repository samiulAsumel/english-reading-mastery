import { ProgressSnapshot, ProgressStore } from './types';

const KEY = 'erm:progress:v1';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptySnapshot(): ProgressSnapshot {
  return { lessons: {}, streakDays: 0, lastStudyDate: undefined };
}

function read(): ProgressSnapshot {
  if (typeof window === 'undefined') return emptySnapshot();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptySnapshot();
    return JSON.parse(raw) as ProgressSnapshot;
  } catch {
    return emptySnapshot();
  }
}

function write(snapshot: ProgressSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    // Storage unavailable (private mode, quota) — progress just won't persist.
  }
}

function bumpStreak(snapshot: ProgressSnapshot): ProgressSnapshot {
  const now = today();
  if (snapshot.lastStudyDate === now) return snapshot;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const streakDays = snapshot.lastStudyDate === yesterday ? snapshot.streakDays + 1 : 1;
  return { ...snapshot, streakDays, lastStudyDate: now };
}

/** LocalStorage-backed implementation of ProgressStore — see types.ts. */
export const localStorageStore: ProgressStore = {
  getSnapshot: () => read(),

  markStarted: (lessonNumber) => {
    const snapshot = bumpStreak(read());
    const existing = snapshot.lessons[lessonNumber];
    const next: ProgressSnapshot = {
      ...snapshot,
      lessons: {
        ...snapshot.lessons,
        [lessonNumber]: existing ?? {
          lessonNumber,
          status: 'started',
          startedAt: new Date().toISOString(),
        },
      },
    };
    write(next);
    return next;
  },

  markCompleted: (lessonNumber) => {
    const snapshot = bumpStreak(read());
    const existing = snapshot.lessons[lessonNumber];
    const next: ProgressSnapshot = {
      ...snapshot,
      lessons: {
        ...snapshot.lessons,
        [lessonNumber]: {
          lessonNumber,
          status: 'completed',
          startedAt: existing?.startedAt ?? new Date().toISOString(),
          completedAt: new Date().toISOString(),
        },
      },
    };
    write(next);
    return next;
  },

  reset: () => {
    const next = emptySnapshot();
    write(next);
    return next;
  },
};
