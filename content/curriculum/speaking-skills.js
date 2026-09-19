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
  { slug: 'spontaneous-explanation', name: 'Spontaneous Explanation', group: 'intermediate' },
  { slug: 'spoken-argument', name: 'Spoken Argument', group: 'upper-intermediate' },
  { slug: 'extended-spoken-explanation', name: 'Extended Spoken Explanation', group: 'advanced' },
  { slug: 'technical-explanation', name: 'Technical Explanation', group: 'advanced' },
  { slug: 'spoken-evaluation', name: 'Spoken Evaluation', group: 'advanced' },
];

const GROUP_LABELS = {
  foundation: 'Foundation',
  intermediate: 'Intermediate',
  'upper-intermediate': 'Upper Intermediate',
  advanced: 'Advanced',
};

function getSkill(slug) {
  return skills.find((s) => s.slug === slug);
}

module.exports = { skills, GROUP_LABELS, getSkill };
