'use strict';

/**
 * Named skills a writing task can teach (referenced by slug in frontmatter
 * `skills: []`). Same shape and consuming pattern as skills.js (reading) —
 * kept in its own file per track for the same collision-safety reason as
 * writing-modules.js.
 *
 * Shape: { slug, name, group }
 */
const skills = [
  { slug: 'sentence-accuracy', name: 'Sentence Accuracy', group: 'foundation' },
  { slug: 'connecting-ideas', name: 'Connecting Ideas', group: 'foundation' },
  { slug: 'paragraph-writing', name: 'Paragraph Writing', group: 'foundation' },
];

const GROUP_LABELS = {
  foundation: 'Foundation',
};

function getSkill(slug) {
  return skills.find((s) => s.slug === slug);
}

module.exports = { skills, GROUP_LABELS, getSkill };
