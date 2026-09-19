'use strict';

/**
 * Modules for the writing track. Same shape and lookup pattern as
 * modules.js (reading) — kept in its own file so a slug collision between
 * tracks is structurally impossible, and so reading's module list stays
 * provably untouched by this feature. See ARCHITECTURE.md "Why no
 * lesson-number routing table" for why `lessonRangeHint` is scaffolding-only.
 *
 * Writing tasks are paired 1:1 with reading lessons by number (writing-NNN
 * practices what lesson-NNN just taught), so each module here mirrors one
 * of reading's modules.js entries — same level, same lesson-number range,
 * a writing-flavored name/description. Lesson 0 (course orientation) has
 * no writing pair, so the range starts at 1.
 *
 * Shape: { slug, level, order, name, description, lessonRangeHint?: [n,n] }
 */
const modules = [
  {
    slug: 'sentence-foundations-writing',
    level: 'foundation',
    order: 1,
    name: 'Sentence Accuracy',
    description:
      'Write the sentence-level building blocks Lessons 1–10 just taught: subject-verb-object accuracy, tense, articles, prepositions, conjunctions, and description — correctly, straight from a prompt.',
    lessonRangeHint: [1, 10],
  },
  {
    slug: 'clause-and-paragraph-writing',
    level: 'foundation',
    order: 2,
    name: 'Clauses & the First Paragraph',
    description:
      'Write the clause-level structures Lessons 11–20 taught — relative clauses, conditionals, passive voice, gerunds and infinitives, reported speech, modals — and combine them into connected paragraphs.',
    lessonRangeHint: [11, 20],
  },
  {
    slug: 'cohesion-and-reference-writing',
    level: 'intermediate',
    order: 3,
    name: 'Cohesion & Reference in Writing',
    description:
      'Write paragraphs that hold together the way Lessons 21–25 analyzed: complex noun phrases, reference chains, causation, and deliberate given/new information order.',
    lessonRangeHint: [21, 25],
  },
  {
    slug: 'argument-basics-writing',
    level: 'upper-intermediate',
    order: 4,
    name: 'Argument Writing',
    description:
      'Build the arguments Lessons 26–35 taught how to read: claims backed by evidence, comparison and concession, stance, counterfactuals, and honest handling of counterarguments.',
    lessonRangeHint: [26, 35],
  },
  {
    slug: 'structural-academic-writing',
    level: 'advanced',
    order: 5,
    name: 'Structural & Academic Writing',
    description:
      'Write with the structural control Lessons 36–50 taught readers to notice: compressed sentences, precise connectors, cohesion across paragraphs, and academic paragraph architecture.',
    lessonRangeHint: [36, 50],
  },
  {
    slug: 'technical-conceptual-writing',
    level: 'advanced',
    order: 6,
    name: 'Technical & Evidence-Based Writing',
    description:
      'Write the technical and evaluative English Lessons 51–87 taught readers to decode: processes, data, definitions, evidence quality, bias, and calibrated conclusions.',
    lessonRangeHint: [51, 87],
  },
];

function getModule(slug) {
  return modules.find((m) => m.slug === slug);
}

function getModulesForLevel(levelSlug) {
  return modules.filter((m) => m.level === levelSlug).sort((a, b) => a.order - b.order);
}

/** Best-guess level/module for a new writing task number — a scaffolding aid only. */
function suggestPlacement(number) {
  const match = modules.find(
    (m) => m.lessonRangeHint && number >= m.lessonRangeHint[0] && number <= m.lessonRangeHint[1]
  );
  if (match) return { level: match.level, module: match.slug };
  const last = modules[modules.length - 1];
  return { level: last.level, module: last.slug };
}

module.exports = { modules, getModule, getModulesForLevel, suggestPlacement };
