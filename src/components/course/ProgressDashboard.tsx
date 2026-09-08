'use client';

import Link from 'next/link';
import { Flame, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/lib/progress/useProgress';
import { getLevel } from '@content/curriculum/levels';
import type { LessonSummary } from '@/lib/content/types';

export function ProgressDashboard({ lessons }: { lessons: LessonSummary[] }) {
  const { snapshot, isReady, reset } = useProgress();

  if (!isReady || !snapshot) {
    return <div className="h-40 animate-pulse rounded-lg border border-border bg-muted/40" />;
  }

  if (lessons.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No lessons published yet — progress tracking will populate as soon as there&rsquo;s something to track.
      </div>
    );
  }

  const completedNumbers = new Set(
    Object.values(snapshot.lessons)
      .filter((l) => l.status === 'completed')
      .map((l) => l.lessonNumber)
  );
  const completedCount = lessons.filter((l) => completedNumbers.has(l.number)).length;
  const percent = Math.round((completedCount / lessons.length) * 100);

  const nextLesson = lessons.find((l) => !completedNumbers.has(l.number)) ?? lessons[lessons.length - 1];
  const currentLevel = getLevel(nextLesson.level);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{percent}%</span>
        </div>
        <Progress value={percent} className="mt-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          {completedCount} of {lessons.length} published lessons completed
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Current Level</p>
          <p className="mt-1 font-serif text-lg font-semibold text-foreground">{currentLevel?.name ?? '—'}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Continue Learning</p>
          <Link href={`/lessons/${nextLesson.number}`} className="mt-1 block font-serif text-lg font-semibold text-brand-primary hover:underline">
            Lesson {nextLesson.number}
          </Link>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-5">
          <Flame className="h-6 w-6 text-brand-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Learning Streak</p>
            <p className="font-serif text-lg font-semibold text-foreground">{snapshot.streakDays} days</p>
          </div>
        </div>
      </div>

      <Button variant="ghost" size="sm" className="w-fit gap-1.5 text-muted-foreground" onClick={reset}>
        <RotateCcw className="h-3.5 w-3.5" /> Reset local progress
      </Button>
    </div>
  );
}
