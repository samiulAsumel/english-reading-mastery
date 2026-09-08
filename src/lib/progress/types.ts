export interface LessonProgressRecord {
  lessonNumber: number;
  status: 'started' | 'completed';
  startedAt: string;
  completedAt?: string;
}

export interface ProgressSnapshot {
  lessons: Record<number, LessonProgressRecord>;
  streakDays: number;
  lastStudyDate?: string;
}

/**
 * Storage contract for learner progress. `localStorageStore` is the only
 * implementation today (see PROGRESS_ADAPTER below). Swapping to a real
 * backend later means writing a new class against this interface and
 * pointing PROGRESS_ADAPTER at it — nothing in the UI layer changes.
 */
export interface ProgressStore {
  getSnapshot(): ProgressSnapshot;
  markStarted(lessonNumber: number): ProgressSnapshot;
  markCompleted(lessonNumber: number): ProgressSnapshot;
  reset(): ProgressSnapshot;
}
