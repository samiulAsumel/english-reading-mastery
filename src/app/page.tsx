import Link from 'next/link';
import { ArrowRight, Search, TrendingUp, BookMarked, Layers, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseJourney } from '@/components/course/CourseJourney';
import { getPublishedLessons } from '@/lib/content/lessons';
import { levels } from '@content/curriculum/levels';
import { modules } from '@content/curriculum/modules';

const READING_PROGRESSION = [
  { label: 'Beginner', text: 'Simple everyday English — instructions, short messages, basic labels.' },
  { label: 'Intermediate', text: 'News, websites, workplace communication, and straightforward nonfiction.' },
  { label: 'Upper Intermediate', text: 'Technical documentation, business articles, and longer nonfiction.' },
  { label: 'Advanced', text: 'Academic writing, research summaries, and professional documentation.' },
  { label: 'C1 / C2', text: 'Dense arguments, sophisticated essays, technical books, philosophy, and history.' },
  { label: 'Near-Native', text: 'Fast direct comprehension across domains, including implicit meaning and rhetorical nuance.' },
];

export default function HomePage() {
  const lessonCount = getPublishedLessons().length;

  const stats = [
    { icon: BookMarked, label: 'Lessons published', value: String(lessonCount) },
    { icon: Layers, label: 'Skill levels', value: String(levels.length) },
    { icon: Gauge, label: 'Modules mapped', value: String(modules.length) },
  ];

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Master English Reading.
            <br />
            Understand English Directly.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A structured journey from foundational English to advanced academic, technical, and
            critical reading — built to take you from sentence-level basics toward near-native
            comprehension, one lesson at a time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href="/lessons">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/course">Explore Curriculum</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
              <s.icon className="h-8 w-8 shrink-0 text-brand-accent" />
              <div>
                <div className="text-2xl font-semibold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        {lessonCount === 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            The platform is live and the curriculum is mapped — lessons are being added now.{' '}
            <Link href="/course" className="text-brand-primary underline underline-offset-2">
              See the full course structure →
            </Link>
          </p>
        )}
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-semibold text-foreground">Where you&rsquo;re going</h2>
            <p className="mt-2 text-muted-foreground">
              Nine levels, from orientation to near-native reading.
            </p>
          </div>
          <CourseJourney />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-accent" />
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            What you&rsquo;ll eventually be able to read
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {READING_PROGRESSION.map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-1 text-sm font-semibold text-brand-primary">{item.label}</div>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          The curriculum is architected toward these outcomes. Completing a level builds these
          capabilities progressively — it isn&rsquo;t a guarantee of a CEFR certification.
        </p>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
          <Search className="h-6 w-6 text-brand-accent" />
          <h2 className="font-serif text-xl font-semibold text-foreground">Find any lesson instantly</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Search titles, vocabulary, and frameworks across the entire course with{' '}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>.
          </p>
        </div>
      </section>
    </div>
  );
}
