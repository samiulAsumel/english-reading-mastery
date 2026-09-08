import { NextResponse } from 'next/server';
import { getPublishedLessons, toSummary } from '@/lib/content/lessons';

export interface SearchRecord {
  [key: string]: string | number | string[];
  number: number;
  title: string;
  description: string;
  level: string;
  module: string;
  tags: string[];
  skills: string[];
  href: string;
}

/**
 * Search data source. Reads content/lessons directly, so adding a new
 * lesson file makes it searchable immediately — no separate index-build
 * step to remember.
 */
export function GET() {
  const records: SearchRecord[] = getPublishedLessons().map((lesson) => {
    const summary = toSummary(lesson);
    return {
      number: summary.number,
      title: summary.title,
      description: summary.description,
      level: summary.level,
      module: summary.module,
      tags: summary.tags,
      skills: summary.skills,
      href: `/lessons/${summary.number}`,
    };
  });
  return NextResponse.json({ records });
}
