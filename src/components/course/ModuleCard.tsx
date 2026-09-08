import Link from 'next/link';
import type { Module } from '@content/curriculum/modules';

export function ModuleCard({ module: mod, lessonCount }: { module: Module; lessonCount: number }) {
  return (
    <Link
      href={`/modules/${mod.slug}`}
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand-accent/60"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">{mod.name}</h4>
        <span className="shrink-0 text-xs text-muted-foreground">
          {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{mod.description}</p>
    </Link>
  );
}
