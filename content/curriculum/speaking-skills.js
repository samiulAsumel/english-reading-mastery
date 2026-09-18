'use strict';

/**
 * Named skills a speaking drill can teach (referenced by slug in
 * frontmatter `skills: []`). Same shape and consuming pattern as
 * skills.js (reading) — kept in its own file per track for the same
 * collision-safety reason as speaking-modules.js.
 *
 * Shape: { slug, name, group }
 */
const skills = [
  { slug: 'instant-naming', name: 'Instant Naming (No Translation)', group: 'foundation' },
  { slug: 'shadowing-rhythm', name: 'Shadowing & Rhythm', group: 'foundation' },
  { slug: 'spoken-sentence-building', name: 'Spoken Sentence Building', group: 'foundation' },
];

const GROUP_LABELS = {
  foundation: 'Foundation',
};

function getSkill(slug) {
  return skills.find((s) => s.slug === slug);
}

module.exports = { skills, GROUP_LABELS, getSkill };
