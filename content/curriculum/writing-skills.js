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
  { slug: 'cohesive-writing', name: 'Cohesive Writing', group: 'intermediate' },
  { slug: 'argument-writing', name: 'Argument Writing', group: 'upper-intermediate' },
  { slug: 'academic-writing', name: 'Academic Writing', group: 'advanced' },
  { slug: 'technical-writing', name: 'Technical Writing', group: 'advanced' },
  { slug: 'evidence-writing', name: 'Evidence-Based Writing', group: 'advanced' },
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
