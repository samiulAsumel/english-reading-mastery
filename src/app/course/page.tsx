import type { Metadata } from 'next';
import Link from 'next/link';
import { levels } from '@content/curriculum/levels';
import { getModulesForLevel } from '@content/curriculum/modules';
import { getLessonsByLevel } from '@/lib/content/lessons';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Course Overview',
  description: 'The full English Reading Mastery curriculum: nine levels, their modules, and what each stage teaches.',
};

export default function CoursePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Course' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Course Overview</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Nine levels carry the course from orientation to near-native reading. Every lesson belongs
        to exactly one module within one level — browse the whole map below, or jump straight to{' '}
        <Link href="/lessons" className="text-brand-primary underline underline-offset-2">
          all lessons
        </Link>
        .
      </p>

      <ol className="mt-10 flex flex-col gap-10">
        {levels.map((level, i) => {
          const modulesForLevel = getModulesForLevel(level.slug);
          const lessonCount = getLessonsByLevel(level.slug).length;
          return (
            <li key={level.slug} className="relative pl-10">
              <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card font-mono text-xs text-muted-foreground">
                {i}
              </span>
              {i < levels.length - 1 && (
                <span className="absolute left-[13px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" aria-hidden />
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/levels/${level.slug}`} className="font-serif text-xl font-semibold text-foreground hover:text-brand-primary">
                  {level.name}
                </Link>
                <Badge variant="muted">{level.cefrRange}</Badge>
                <span className="text-xs text-muted-foreground">
                  {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'} published
                </span>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{level.description}</p>

              {modulesForLevel.length > 0 && (
                <ul className="mt-4 flex flex-col gap-2">
                  {modulesForLevel.map((mod) => (
                    <li key={mod.slug}>
                      <Link
                        href={`/modules/${mod.slug}`}
                        className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 rounded-md border border-border bg-card px-4 py-2.5 text-sm hover:border-brand-accent/60"
                      >
                        <span className="font-medium text-foreground">{mod.name}</span>
                        <span className="text-muted-foreground">— {mod.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
