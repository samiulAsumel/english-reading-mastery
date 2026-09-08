import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Level } from '@content/curriculum/levels';
import { Badge } from '@/components/ui/badge';

export function LevelCard({ level, lessonCount }: { level: Level; lessonCount: number }) {
  return (
    <Link
      href={`/levels/${level.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand-accent/60"
    >
      <div className="flex items-center justify-between">
        <Badge variant="muted">{level.cefrRange}</Badge>
        <span className="text-xs text-muted-foreground">
          {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
        </span>
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground">{level.name}</h3>
      <p className="text-sm text-muted-foreground">{level.tagline}</p>
      <span className="mt-auto flex items-center gap-1 text-sm font-medium text-brand-primary opacity-0 transition-opacity group-hover:opacity-100">
        Explore level <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
