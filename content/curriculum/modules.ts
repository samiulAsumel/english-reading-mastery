/**
 * Modules group lessons within a level. Like levels, a lesson belongs to a
 * module because its own frontmatter says so — this file just defines what
 * each module covers.
 *
 * `lessonRangeHint` is a *suggestion* used only by `scripts/new-lesson.ts`
 * to pre-fill a sensible level/module when scaffolding a new lesson file.
 * It is never read at runtime — see ARCHITECTURE.md "Why no lesson-number
 * routing table" for why that boundary matters as the course grows past
 * lesson 85.
 */
export interface Module {
  slug: string;
  level: string;
  order: number;
  name: string;
  description: string;
  lessonRangeHint?: [number, number];
}

export const modules: Module[] = [
  {
    slug: 'sentence-foundations',
    level: 'foundation',
    order: 1,
    name: 'Sentence & Phrase Foundations',
    description:
      'Sentence structure, noun and verb phrases, tense, articles, prepositions, conjunctions, and the basic building blocks of an English sentence.',
    lessonRangeHint: [1, 10],
  },
  {
    slug: 'clause-and-paragraph',
    level: 'foundation',
    order: 2,
    name: 'Clauses & Paragraph Architecture',
    description:
      'Relative clauses, conditionals, passive voice, gerunds and infinitives, reported speech, modals, and how sentences combine into paragraphs.',
    lessonRangeHint: [11, 20],
  },
  {
    slug: 'cohesion-and-reference',
    level: 'intermediate',
    order: 3,
    name: 'Cohesion & Reference',
    description:
      'Inference, implication, complex noun phrases, reference chains, information structure, and the connective tissue that holds a passage together.',
    lessonRangeHint: [21, 30],
  },
  {
    slug: 'argument-basics',
    level: 'upper-intermediate',
    order: 4,
    name: 'Argument & Evidence Basics',
    description:
      'Argument structure, comparison, concession, modality, stance, assumptions, evidence, logical gaps, and academic vocabulary.',
    lessonRangeHint: [31, 40],
  },
  {
    slug: 'structural-academic-reading',
    level: 'advanced',
    order: 5,
    name: 'Structural & Academic Reading',
    description:
      'Coordination and subordination, embedding, advanced cohesion, paragraph argument flow, and chapter- and book-level reading strategy.',
    lessonRangeHint: [41, 50],
  },
  {
    slug: 'technical-conceptual-reading',
    level: 'advanced',
    order: 6,
    name: 'Technical & Conceptual Reading',
    description:
      'Technical processes, quantitative language, data interpretation, classifications, mechanisms, analogies, and conceptual models.',
    lessonRangeHint: [51, 60],
  },
  {
    slug: 'critical-reading-evaluation',
    level: 'c1-mastery',
    order: 7,
    name: 'Critical Reading & Argument Evaluation',
    description:
      'Problem/solution reasoning, evaluation, uncertainty, probability, risk, premises, hidden assumptions, and argument gaps.',
    lessonRangeHint: [61, 72],
  },
  {
    slug: 'book-level-reasoning',
    level: 'c2-mastery',
    order: 8,
    name: 'Book-Level Reasoning & Evidence Calibration',
    description:
      'Source quality, triangulation, bias, framing, author purpose, rhetorical moves, book-level thesis tracking, and calibrated conclusions.',
    lessonRangeHint: [73, 85],
  },
];

export function getModule(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getModulesForLevel(levelSlug: string): Module[] {
  return modules.filter((m) => m.level === levelSlug).sort((a, b) => a.order - b.order);
}

/** Best-guess level/module for a new lesson number — a scaffolding aid only. */
export function suggestPlacement(lessonNumber: number): { level: string; module: string } {
  const match = modules.find(
    (m) => m.lessonRangeHint && lessonNumber >= m.lessonRangeHint[0] && lessonNumber <= m.lessonRangeHint[1]
  );
  if (match) return { level: match.level, module: match.slug };
  const last = modules[modules.length - 1];
  return { level: last.level, module: last.slug };
}
