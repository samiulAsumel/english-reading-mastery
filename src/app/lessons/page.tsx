import type { Metadata } from 'next';
import { getPublishedLessons, toSummary } from '@/lib/content/lessons';
import { levels } from '@content/curriculum/levels';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LessonsBrowser } from '@/components/course/LessonsBrowser';

export const metadata: Metadata = {
  title: 'All Lessons',
  description: 'Browse and search every published lesson in the English Reading Mastery course.',
};

export default function LessonsIndexPage() {
  const lessons = getPublishedLessons().map(toSummary);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Lessons' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">All Lessons</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'} published so far.
      </p>
      <div className="mt-8">
        <LessonsBrowser lessons={lessons} levels={levels} />
      </div>
    </div>
  );
}
