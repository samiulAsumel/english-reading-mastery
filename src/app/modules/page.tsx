import type { Metadata } from 'next';
import { modules } from '@content/curriculum/modules';
import { getLevel } from '@content/curriculum/levels';
import { getLessonsByModule } from '@/lib/content/lessons';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ModuleCard } from '@/components/course/ModuleCard';

export const metadata: Metadata = {
  title: 'Modules',
  description: 'Every module in the English Reading Mastery curriculum, grouped by skill level.',
};

export default function ModulesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Modules' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Modules</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Modules group lessons that build the same skill within a level.
      </p>
      <div className="mt-8 flex flex-col gap-4">
        {modules.map((mod) => (
          <div key={mod.slug} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {getLevel(mod.level)?.name}
            </span>
            <ModuleCard module={mod} lessonCount={getLessonsByModule(mod.slug).length} />
          </div>
        ))}
      </div>
    </div>
  );
}
