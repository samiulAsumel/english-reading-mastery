import type { Metadata } from 'next';
import { skills } from '@content/curriculum/skills';
import { getPublishedLessons } from '@/lib/content/lessons';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SkillMastery } from '@/components/course/SkillMastery';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Every reading skill the course teaches, with how much content covers it so far.',
};

const GROUP_LABELS: Record<string, string> = {
  foundation: 'Foundation',
  intermediate: 'Intermediate',
  'upper-intermediate': 'Upper Intermediate',
  advanced: 'Advanced',
  c2: 'C1 / C2',
};

export default function SkillsPage() {
  const lessons = getPublishedLessons();
  const lessonNumbersBySkill = new Map<string, number[]>();
  for (const lesson of lessons) {
    for (const skillSlug of lesson.frontmatter.skills) {
      const list = lessonNumbersBySkill.get(skillSlug) ?? [];
      list.push(lesson.frontmatter.number);
      lessonNumbersBySkill.set(skillSlug, list);
    }
  }

  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    (acc[skill.group] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Skills' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Skills</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Course coverage below reflects published lessons only. Your personal mastery bars are a
        local prototype — stored only in this browser, not a certified assessment.
      </p>

      {Object.entries(grouped).map(([group, groupSkills]) => (
        <section key={group} className="mt-10">
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">{GROUP_LABELS[group] ?? group}</h2>
          <div className="flex flex-col gap-3">
            {groupSkills.map((skill) => (
              <SkillMastery
                key={skill.slug}
                name={skill.name}
                lessonNumbers={lessonNumbersBySkill.get(skill.slug) ?? []}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
