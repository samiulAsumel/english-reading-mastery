import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getModule, modules } from '@content/curriculum/modules';
import { getLevel } from '@content/curriculum/levels';
import { getLessonsByModule, toSummary } from '@/lib/content/lessons';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LessonCard } from '@/components/course/LessonCard';

type Params = Promise<{ module: string }>;

export function generateStaticParams() {
  return modules.map((mod) => ({ module: mod.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { module: moduleSlug } = await params;
  const mod = getModule(moduleSlug);
  if (!mod) return {};
  return { title: mod.name, description: mod.description };
}

export default async function ModuleDetailPage({ params }: { params: Params }) {
  const { module: moduleSlug } = await params;
  const mod = getModule(moduleSlug);
  if (!mod) notFound();

  const level = getLevel(mod.level);
  const lessons = getLessonsByModule(mod.slug).map(toSummary);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Modules', href: '/modules' },
          { label: mod.name },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">{mod.name}</h1>
      {level && (
        <p className="mt-1 text-sm text-muted-foreground">
          Part of <span className="text-foreground">{level.name}</span>
        </p>
      )}
      <p className="mt-3 max-w-2xl text-muted-foreground">{mod.description}</p>

      <h2 className="mt-10 mb-4 font-serif text-xl font-semibold text-foreground">Lessons</h2>
      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">No lessons published in this module yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.number} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
