'use strict';

/**
 * Modules for the speaking track. Same shape and lookup pattern as
 * modules.js (reading) — kept in its own file so a slug collision between
 * tracks is structurally impossible. See modules.js for the full
 * field-by-field rationale (lessonRangeHint is scaffolding-only, never
 * read by the render pipeline).
 *
 * Speaking drills are paired 1:1 with reading lessons by number
 * (speaking-NNN practices what lesson-NNN just taught, spoken instead of
 * written), so each module here mirrors one of reading's modules.js
 * entries — same level, same lesson-number range, a speaking-flavored
 * name/description. Lesson 0 (course orientation) has no speaking pair,
 * so the range starts at 1.
 *
 * Shape: { slug, level, order, name, description, lessonRangeHint?: [n,n] }
 */
const modules = [
  {
    slug: 'sentence-foundations-speaking',
    level: 'foundation',
    order: 1,
    name: 'Instant Sentences',
    description:
      'Say the sentence-level building blocks Lessons 1–10 just taught, instantly and under a timer — no Bangla sentence to translate first.',
    lessonRangeHint: [1, 10],
  },
  {
    slug: 'clause-and-paragraph-speaking',
    level: 'foundation',
    order: 2,
    name: 'Spoken Clauses & Connected Speech',
    description:
      'Speak the clause-level structures Lessons 11–20 taught — conditionals, passives, reported speech, modals — as connected, unscripted speech.',
    lessonRangeHint: [11, 20],
  },
  {
    slug: 'cohesion-and-reference-speaking',
    level: 'intermediate',
    order: 3,
    name: 'Spontaneous Explanation',
    description:
      'Speak explanations that hold together the way Lessons 21–25 analyzed: reference tracking, cause and effect, and deliberate emphasis, produced on the spot.',
    lessonRangeHint: [21, 25],
  },
  {
    slug: 'argument-basics-speaking',
    level: 'upper-intermediate',
    order: 4,
    name: 'Spoken Argument',
    description:
      'Argue out loud what Lessons 26–35 taught how to read: a claim, a reason, a piece of evidence, and an honest counterargument, unscripted and under time pressure.',
    lessonRangeHint: [26, 35],
  },
  {
    slug: 'structural-academic-speaking',
    level: 'advanced',
    order: 5,
    name: 'Extended Spoken Explanation',
    description:
      'Speak with the structural control Lessons 36–50 taught readers to notice: precise connectors, cohesive multi-sentence explanations, and academic paragraph logic, spoken not written.',
    lessonRangeHint: [36, 50],
  },
  {
    slug: 'technical-conceptual-speaking',
    level: 'advanced',
    order: 6,
    name: 'Technical & Evaluative Speaking',
    description:
      'Speak the technical and evaluative English Lessons 51–87 taught readers to decode: processes, data, definitions, evidence quality, bias, and calibrated conclusions — explained live, out loud.',
    lessonRangeHint: [51, 87],
  },
];

function getModule(slug) {
  return modules.find((m) => m.slug === slug);
}

function getModulesForLevel(levelSlug) {
  return modules.filter((m) => m.level === levelSlug).sort((a, b) => a.order - b.order);
}

/** Best-guess level/module for a new speaking drill number — a scaffolding aid only. */
function suggestPlacement(number) {
  const match = modules.find(
    (m) => m.lessonRangeHint && number >= m.lessonRangeHint[0] && number <= m.lessonRangeHint[1]
  );
  if (match) return { level: match.level, module: match.slug };
  const last = modules[modules.length - 1];
  return { level: last.level, module: last.slug };
}

module.exports = { modules, getModule, getModulesForLevel, suggestPlacement };
