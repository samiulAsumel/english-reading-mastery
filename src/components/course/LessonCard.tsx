import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LessonSummary } from '@/lib/content/types';

export function LessonCard({ lesson }: { lesson: LessonSummary }) {
  return (
    <Link
      href={`/lessons/${lesson.number}`}
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand-accent/60"
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Lesson {lesson.number}</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {lesson.estimatedTime}
        </span>
      </div>
      <h4 className="font-serif text-base font-semibold text-foreground">{lesson.title}</h4>
      <p className="line-clamp-2 text-sm text-muted-foreground">{lesson.description}</p>
      <Badge variant="muted" className="mt-1 w-fit capitalize">
        {lesson.difficulty}
      </Badge>
    </Link>
  );
}
