import { Clock, Gauge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LessonSummary } from '@/lib/content/types';
import type { Level } from '@content/curriculum/levels';
import type { Module } from '@content/curriculum/modules';

export function LessonHeader({
  lesson,
  level,
  module: mod,
}: {
  lesson: LessonSummary;
  level?: Level;
  module?: Module;
}) {
  return (
    <header className="mb-10">
      <p className="text-sm text-muted-foreground">
        {level?.name}
        {mod && <> · {mod.name}</>}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        Lesson {lesson.number}: {lesson.title}
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">{lesson.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Badge variant="muted" className="flex items-center gap-1 capitalize">
          <Gauge className="h-3 w-3" /> {lesson.difficulty}
        </Badge>
        <Badge variant="muted" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {lesson.estimatedTime}
        </Badge>
        {lesson.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </header>
  );
}
