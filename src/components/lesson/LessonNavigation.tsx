import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { LessonFrontmatter } from '@/lib/content/types';

export function LessonNavigation({
  previous,
  next,
}: {
  previous?: LessonFrontmatter;
  next?: LessonFrontmatter;
}) {
  return (
    <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-border pt-8 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/lessons/${previous.number}`}
          className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand-accent/60"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3 w-3" /> Previous Lesson
          </span>
          <span className="font-medium text-foreground">
            {previous.number}. {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/lessons/${next.number}`}
          className="flex flex-col items-end gap-1 rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-brand-accent/60"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next Lesson <ArrowRight className="h-3 w-3" />
          </span>
          <span className="font-medium text-foreground">
            {next.number}. {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
