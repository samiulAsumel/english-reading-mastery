import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllVocabulary } from '@/lib/content/vocabulary';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Vocabulary',
  description: 'Every vocabulary item taught across the course, aggregated automatically from lesson content.',
};

export default function VocabularyPage() {
  const entries = getAllVocabulary();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Vocabulary' }]} />
      <h1 className="mt-4 font-serif text-3xl font-bold text-foreground">Vocabulary</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {entries.length} {entries.length === 1 ? 'word' : 'words'} indexed automatically from every lesson
        that introduces it.
      </p>

      {entries.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No vocabulary indexed yet — it appears here as soon as lessons use the{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">&lt;Vocabulary /&gt;</code> block.
        </div>
      ) : (
        <dl className="mt-8 flex flex-col divide-y divide-border rounded-lg border border-border">
          {entries.map((entry) => (
            <div key={entry.word} className="p-5">
              <div className="flex items-baseline gap-2">
                <dt className="font-serif text-lg font-semibold text-foreground">{entry.word}</dt>
                {entry.partOfSpeech && <span className="text-xs italic text-muted-foreground">{entry.partOfSpeech}</span>}
              </div>
              <dd className="mt-1 text-sm text-foreground/90">{entry.meaning}</dd>
              {entry.example && <p className="mt-1 text-sm italic text-muted-foreground">&ldquo;{entry.example}&rdquo;</p>}
              <p className="mt-2 text-xs text-muted-foreground">
                Appears in{' '}
                {entry.lessonNumbers.map((n, i) => (
                  <span key={n}>
                    {i > 0 && ', '}
                    <Link href={`/lessons/${n}`} className="text-brand-primary underline underline-offset-2">
                      Lesson {n}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
