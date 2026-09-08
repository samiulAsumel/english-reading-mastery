'use client';

import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/lib/progress/useProgress';

export function SkillMastery({ name, lessonNumbers }: { name: string; lessonNumbers: number[] }) {
  const { snapshot, isReady } = useProgress();

  const completed = isReady
    ? lessonNumbers.filter((n) => snapshot?.lessons[n]?.status === 'completed').length
    : 0;
  const percent = lessonNumbers.length === 0 ? 0 : Math.round((completed / lessonNumbers.length) * 100);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">
          {lessonNumbers.length === 0 ? 'Not yet covered' : `${completed}/${lessonNumbers.length} lessons · local`}
        </span>
      </div>
      <Progress value={percent} />
    </div>
  );
}
