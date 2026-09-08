import Link from 'next/link';
import { levels } from '@content/curriculum/levels';

export function CourseJourney() {
  return (
    <ol className="flex flex-col gap-2">
      {levels.map((level, i) => (
        <li key={level.slug}>
          <Link
            href={`/levels/${level.slug}`}
            className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-brand-accent/60"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs text-muted-foreground">
              {i}
            </span>
            <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-medium text-foreground">{level.name}</span>
              <span className="text-xs text-muted-foreground">{level.cefrRange}</span>
            </div>
          </Link>
          {i < levels.length - 1 && (
            <div className="ml-8 h-2 w-px bg-border" aria-hidden />
          )}
        </li>
      ))}
    </ol>
  );
}
