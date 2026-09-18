'use strict';

/**
 * Modules for the writing track. Same shape and lookup pattern as
 * modules.js (reading) — kept in its own file so a slug collision between
 * tracks is structurally impossible, and so reading's module list stays
 * provably untouched by this feature. See ARCHITECTURE.md "Why no
 * lesson-number routing table" for why `lessonRangeHint` is scaffolding-only.
 *
 * Shape: { slug, level, order, name, description, lessonRangeHint?: [n,n] }
 */
const modules = [
  {
    slug: 'foundation-writing',
    level: 'foundation',
    order: 1,
    name: 'Sentence Accuracy & the First Paragraph',
    description:
      'Write correct, natural English sentences straight from a prompt — subject-verb-object, articles, and basic tense — then connect them into a short paragraph.',
    lessonRangeHint: [1, 8],
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
