import type { Metadata } from 'next';
import { levels } from '@content/curriculum/levels';
import { getLessonsByLevel } from '@/lib/content/lessons';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LevelCard } from '@/components/course/LevelCard';

export const metadata: Metadata = {
  title: 'Levels',
  description: 'Browse the nine skill levels of English Reading Mastery, from orientation to near-native reading.',
};

export default function LevelsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Levels' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Levels</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Each level is a stage of reading capability, not just a lesson-number range.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((level) => (
          <LevelCard key={level.slug} level={level} lessonCount={getLessonsByLevel(level.slug).length} />
        ))}
      </div>
    </div>
  );
}
