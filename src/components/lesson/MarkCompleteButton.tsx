'use client';

import { useEffect } from 'react';
import { Check, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/lib/progress/useProgress';

export function MarkCompleteButton({ lessonNumber }: { lessonNumber: number }) {
  const { snapshot, isReady, markStarted, markCompleted } = useProgress();

  useEffect(() => {
    if (isReady) markStarted(lessonNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, lessonNumber]);

  if (!isReady) return null;

  const completed = snapshot?.lessons[lessonNumber]?.status === 'completed';

  return (
    <Button
      variant={completed ? 'default' : 'outline'}
      size="sm"
      onClick={() => markCompleted(lessonNumber)}
      className="gap-1.5"
    >
      {completed ? <Check className="h-3.5 w-3.5" /> : <CircleDot className="h-3.5 w-3.5" />}
      {completed ? 'Completed' : 'Mark as complete'}
    </Button>
  );
}
