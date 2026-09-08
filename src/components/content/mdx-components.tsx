import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import {
  LearningObjectives,
  KeyConcept,
  Example,
  Framework,
  Step,
  GoldenRule,
  Important,
  Warning,
  Note,
  Vocabulary,
  Collocation,
  ComparisonTable,
} from './blocks';

/**
 * Every element a lesson.mdx file is allowed to use. New custom block?
 * Register it here and document it in CONTENT_GUIDE.md — those two things
 * must move together or content authoring quietly breaks.
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-10 mb-4 scroll-mt-24 font-serif text-2xl font-semibold text-foreground" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 mb-3 scroll-mt-24 font-serif text-xl font-semibold text-foreground" {...props} />
  ),
  h4: (props) => <h4 className="mt-6 mb-2 font-semibold text-foreground" {...props} />,
  p: (props) => <p className="mb-4 leading-[1.8] text-foreground/90" {...props} />,
  ul: (props) => <ul className="mb-4 ml-5 list-disc space-y-1.5 text-foreground/90" {...props} />,
  ol: (props) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-foreground/90" {...props} />,
  li: (props) => <li className="leading-[1.75]" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-4 border-l-2 border-border pl-4 italic text-muted-foreground" {...props} />
  ),
  a: (props) => {
    const href = props.href ?? '';
    if (href.startsWith('/')) {
      return <Link href={href} className="text-brand-primary underline underline-offset-2">{props.children}</Link>;
    }
    return <a className="text-brand-primary underline underline-offset-2" {...props} />;
  },
  code: (props) => <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />,
  pre: (props) => (
    <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 text-sm" {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-muted/60" {...props} />,
  th: (props) => <th className="border-b border-border px-3 py-2 text-left font-semibold" {...props} />,
  td: (props) => <td className="border-b border-border/60 px-3 py-2 align-top" {...props} />,

  LearningObjectives,
  KeyConcept,
  Example,
  Framework,
  Step,
  GoldenRule,
  Important,
  Warning,
  Note,
  Vocabulary,
  Collocation,
  ComparisonTable,
};
