import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLevel, levels } from '@content/curriculum/levels';
import { getModulesForLevel } from '@content/curriculum/modules';
import { getLessonsByModule } from '@/lib/content/lessons';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { ModuleCard } from '@/components/course/ModuleCard';

type Params = Promise<{ level: string }>;

export function generateStaticParams() {
  return levels.map((level) => ({ level: level.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { level: levelSlug } = await params;
  const level = getLevel(levelSlug);
  if (!level) return {};
  return { title: level.name, description: level.description };
}

export default async function LevelDetailPage({ params }: { params: Params }) {
  const { level: levelSlug } = await params;
  const level = getLevel(levelSlug);
  if (!level) notFound();

  const modulesForLevel = getModulesForLevel(level.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Levels', href: '/levels' }, { label: level.name }]} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl font-bold text-foreground">{level.name}</h1>
        <Badge variant="muted">{level.cefrRange}</Badge>
      </div>
      <p className="mt-3 max-w-2xl text-muted-foreground">{level.description}</p>

      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">What you can read at this level</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {level.canRead.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <h2 className="mt-10 mb-4 font-serif text-xl font-semibold text-foreground">Modules</h2>
      {modulesForLevel.length === 0 ? (
        <p className="text-sm text-muted-foreground">No modules mapped to this level yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {modulesForLevel.map((mod) => (
            <ModuleCard key={mod.slug} module={mod} lessonCount={getLessonsByModule(mod.slug).length} />
          ))}
        </div>
      )}
    </div>
  );
}
