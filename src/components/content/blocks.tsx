import { ReactNode } from 'react';
import { Target, Lightbulb, BookOpenText, Sparkles, AlertTriangle, Info, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

function Callout({
  icon,
  title,
  children,
  className,
  tone,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  tone: 'concept' | 'example' | 'framework' | 'golden' | 'important' | 'warning' | 'note';
}) {
  const tones: Record<typeof tone, string> = {
    concept: 'border-l-4 border-brand-accent bg-brand-accent/5',
    example: 'border-l-4 border-sky-500 bg-sky-500/5 dark:bg-sky-400/10',
    framework: 'border border-border bg-muted/40',
    golden: 'border-l-4 border-amber-500 bg-amber-500/8 dark:bg-amber-400/10',
    important: 'border-l-4 border-brand-primary bg-brand-primary/5',
    warning: 'border-l-4 border-red-500 bg-red-500/5 dark:bg-red-400/10',
    note: 'border border-dashed border-border bg-transparent',
  };
  return (
    <div className={cn('my-6 rounded-lg p-5', tones[tone], className)}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground">
        {icon}
        <span>{title}</span>
      </div>
      <div className="prose-content-body text-[0.975rem] leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

export function LearningObjectives({ children }: { children: ReactNode }) {
  return (
    <Callout tone="concept" icon={<Target className="h-4 w-4" />} title="Learning Objectives">
      <p className="mb-2 text-sm text-muted-foreground">By the end of this lesson, you should be able to:</p>
      {children}
    </Callout>
  );
}

export function KeyConcept({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Callout tone="concept" icon={<Lightbulb className="h-4 w-4" />} title={title ?? 'Core Concept'}>
      {children}
    </Callout>
  );
}

export function Example({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Callout tone="example" icon={<BookOpenText className="h-4 w-4" />} title={title ?? 'Example'}>
      {children}
    </Callout>
  );
}

export function Framework({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Callout tone="framework" icon={<ListChecks className="h-4 w-4" />} title={title ?? 'Master Framework'}>
      <div className="flex flex-col items-stretch gap-0 font-mono text-sm">{children}</div>
    </Callout>
  );
}

/** One step in a <Framework>. Renders as a labeled box with a connecting arrow below it. */
export function Step({ children, last }: { children: ReactNode; last?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-md border border-border bg-background px-4 py-2 text-center font-sans font-medium">
        {children}
      </div>
      {!last && <div className="py-1 text-muted-foreground" aria-hidden>↓</div>}
    </div>
  );
}

export function GoldenRule({ children }: { children: ReactNode }) {
  return (
    <Callout tone="golden" icon={<Sparkles className="h-4 w-4" />} title="Golden Rule">
      <p className="text-base font-medium italic text-foreground">{children}</p>
    </Callout>
  );
}

export function Important({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Callout tone="important" icon={<Info className="h-4 w-4" />} title={title ?? 'Important'}>
      {children}
    </Callout>
  );
}

export function Warning({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Callout tone="warning" icon={<AlertTriangle className="h-4 w-4" />} title={title ?? 'Common Mistake'}>
      {children}
    </Callout>
  );
}

export function Note({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Callout tone="note" icon={<Info className="h-4 w-4" />} title={title ?? 'Note'}>
      {children}
    </Callout>
  );
}

export function Vocabulary({
  word,
  partOfSpeech,
  meaning,
  example,
}: {
  word: string;
  partOfSpeech?: string;
  meaning: string;
  example?: string;
}) {
  return (
    <div className="my-3 rounded-md border border-border bg-card px-4 py-3">
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-lg font-semibold text-foreground">{word}</span>
        {partOfSpeech && <span className="text-xs italic text-muted-foreground">{partOfSpeech}</span>}
      </div>
      <p className="mt-1 text-sm text-foreground/90">{meaning}</p>
      {example && <p className="mt-1 text-sm italic text-muted-foreground">&ldquo;{example}&rdquo;</p>}
    </div>
  );
}

export function Collocation({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">{children}</code>
  );
}

export function ComparisonTable({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}
