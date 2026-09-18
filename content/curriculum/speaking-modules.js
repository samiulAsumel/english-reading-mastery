'use strict';

/**
 * Modules for the speaking track. Same shape and lookup pattern as
 * modules.js (reading) — kept in its own file so a slug collision between
 * tracks is structurally impossible. See modules.js for the full
 * field-by-field rationale (lessonRangeHint is scaffolding-only, never
 * read by the render pipeline).
 *
 * Shape: { slug, level, order, name, description, lessonRangeHint?: [n,n] }
 */
const modules = [
  {
    slug: 'foundation-speaking',
    level: 'foundation',
    order: 1,
    name: 'Instant English — No Translation',
    description:
      'Speak English straight from a scenario, with no Bangla sentence to translate first: instant naming under a timer, shadowing native rhythm, and building spoken sentences on the spot.',
    lessonRangeHint: [1, 8],
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
