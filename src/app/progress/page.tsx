import type { Metadata } from 'next';
import { getPublishedLessons, toSummary } from '@/lib/content/lessons';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProgressDashboard } from '@/components/course/ProgressDashboard';

export const metadata: Metadata = {
  title: 'Your Progress',
  description: 'Track lessons completed, current level, and streak.',
};

export default function ProgressPage() {
  const lessons = getPublishedLessons().map(toSummary);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Progress' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Your Progress</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Stored locally in this browser only — a prototype. Clearing site data resets it.
      </p>
      <div className="mt-8">
        <ProgressDashboard lessons={lessons} />
      </div>
    </div>
  );
}
