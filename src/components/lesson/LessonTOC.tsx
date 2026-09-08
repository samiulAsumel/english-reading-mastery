'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TocEntry } from '@/lib/content/toc';

export function LessonTOC({ entries }: { entries: TocEntry[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return;
    const observer = new IntersectionObserver(
      (observedEntries) => {
        const visible = observedEntries.find((e) => e.isIntersecting);
        if (visible) setActiveSlug(visible.target.id);
      },
      { rootMargin: '-96px 0px -70% 0px' }
    );
    entries.forEach((entry) => {
      const el = document.getElementById(entry.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="On this page" className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
      <ul className="flex flex-col gap-1.5 border-l border-border text-sm">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <a
              href={`#${entry.slug}`}
              className={cn(
                'block border-l-2 border-transparent py-0.5 pl-3 text-muted-foreground hover:text-foreground',
                entry.depth === 3 && 'pl-6',
                activeSlug === entry.slug && '-ml-px border-brand-accent text-foreground'
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
