'use client';

import { useMemo, useState } from 'react';
import { LessonCard } from './LessonCard';
import type { LessonSummary } from '@/lib/content/types';
import type { Level } from '@content/curriculum/levels';

export function LessonsBrowser({ lessons, levels }: { lessons: LessonSummary[]; levels: Level[] }) {
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (levelFilter !== 'all' && l.level !== levelFilter) return false;
      if (!query.trim()) return true;
      const haystack = `${l.title} ${l.description} ${l.tags.join(' ')} ${l.skills.join(' ')}`.toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [lessons, query, levelFilter]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by title, tag, or skill…"
          className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <option value="all">All levels</option>
          {levels.map((level) => (
            <option key={level.slug} value={level.slug}>
              {level.name}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {filtered.length} of {lessons.length} lessons
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {lessons.length === 0
            ? 'No lessons have been published yet. Check back soon.'
            : 'No lessons match your filters.'}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((lesson) => (
            <LessonCard key={lesson.number} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
