import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { getAdjacentLessons, getLessonByNumber, getPublishedLessons, toSummary } from '@/lib/content/lessons';
import { extractToc } from '@/lib/content/toc';
import { getLevel } from '@content/curriculum/levels';
import { getModule } from '@content/curriculum/modules';
import { mdxComponents } from '@/components/content/mdx-components';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { LessonTOC } from '@/components/lesson/LessonTOC';
import { LessonNavigation } from '@/components/lesson/LessonNavigation';
import { MarkCompleteButton } from '@/components/lesson/MarkCompleteButton';

type Params = Promise<{ number: string }>;

export function generateStaticParams() {
  return getPublishedLessons().map((lesson) => ({ number: String(lesson.frontmatter.number) }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { number } = await params;
  const lesson = getLessonByNumber(Number(number));
  if (!lesson) return {};
  return {
    title: `Lesson ${lesson.frontmatter.number}: ${lesson.frontmatter.title}`,
    description: lesson.frontmatter.description,
    alternates: { canonical: `/lessons/${lesson.frontmatter.number}` },
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { number } = await params;
  const lessonNumber = Number(number);
  const lesson = getLessonByNumber(lessonNumber);
  if (!lesson || lesson.frontmatter.status !== 'published') notFound();

  const summary = toSummary(lesson);
  const level = getLevel(lesson.frontmatter.level);
  const mod = getModule(lesson.frontmatter.module);
  const { previous, next } = getAdjacentLessons(lessonNumber);
  const toc = extractToc(lesson.content);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Lessons', href: '/lessons' },
          { label: `Lesson ${lesson.frontmatter.number}` },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <article className="mx-auto w-full max-w-[var(--reading-max-width)]">
          <LessonHeader lesson={summary} level={level} module={mod} />

          {lesson.frontmatter.objectives.length > 0 && (
            <div className="mb-8 rounded-lg border-l-4 border-brand-accent bg-brand-accent/5 p-5">
              <p className="mb-2 text-sm font-semibold text-foreground">Learning Objectives</p>
              <ul className="flex flex-col gap-1 text-sm text-foreground/90">
                {lesson.frontmatter.objectives.map((obj) => (
                  <li key={obj} className="flex gap-2">
                    <span className="text-brand-accent" aria-hidden>✓</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose-content">
            <MDXRemote
              source={lesson.content}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
            />
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              {summary.readingTimeMinutes} min read · Lesson {summary.number} of the {level?.name ?? 'course'}
            </p>
            <MarkCompleteButton lessonNumber={summary.number} />
          </div>

          <LessonNavigation previous={previous?.frontmatter} next={next?.frontmatter} />
        </article>

        <aside>
          <LessonTOC entries={toc} />
        </aside>
      </div>
    </div>
  );
}
