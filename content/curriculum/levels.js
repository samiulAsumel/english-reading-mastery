'use strict';

/**
 * The eight-level skill journey (plus Level 0 orientation). Lesson numbers
 * never determine level — each lesson declares its own `level` slug in
 * frontmatter. This file only defines what a level means, not which
 * lessons belong to it.
 *
 * Shape: { slug, order, name, cefrRange, tagline, description, canRead[] }
 */
const levels = [
  {
    slug: 'orientation',
    order: 0,
    name: 'Level 0 — Orientation',
    cefrRange: 'Pre-A1',
    tagline: 'Learn how the course works before learning English through it.',
    description:
      'A short on-ramp that explains the reading-first philosophy, how to use the platform, and what "direct understanding" means before the skill levels begin.',
    canRead: ['Course navigation', 'Basic instructions', 'Simple labels and prompts'],
  },
  {
    slug: 'foundation',
    order: 1,
    name: 'Level 1 — Foundation',
    cefrRange: 'A1',
    tagline: 'Words, phrases, and the shape of a sentence.',
    description:
      'Builds the raw materials of English: sentence structure, phrases, clauses, tense, articles, and the smallest units of meaning learners need before anything else makes sense.',
    canRead: ['Simple everyday sentences', 'Basic instructions and labels', 'Short personal messages'],
  },
  {
    slug: 'elementary',
    order: 2,
    name: 'Level 2 — Elementary',
    cefrRange: 'A2',
    tagline: 'From sentences to paragraphs.',
    description:
      'Extends single-sentence understanding into connected paragraphs: conjunctions, discourse markers, and the first patterns of paragraph architecture.',
    canRead: ['Everyday news items', 'Simple emails and notices', 'Short descriptive paragraphs'],
  },
  {
    slug: 'intermediate',
    order: 3,
    name: 'Level 3 — Intermediate',
    cefrRange: 'B1',
    tagline: 'Complex sentences and logical precision.',
    description:
      'Introduces inference, cohesion, reference chains, and complex noun phrases — the machinery needed to follow an idea across several sentences without losing the thread.',
    canRead: ['General news and websites', 'Workplace communication', 'Straightforward nonfiction'],
  },
  {
    slug: 'upper-intermediate',
    order: 4,
    name: 'Level 4 — Upper Intermediate',
    cefrRange: 'B2',
    tagline: 'Arguments, evidence, and academic English.',
    description:
      'Moves into argument structure: claims, evidence, assumptions, causation, comparison, and the academic vocabulary that carries them.',
    canRead: ['Technical documentation', 'Business and trade articles', 'Longer nonfiction'],
  },
  {
    slug: 'advanced',
    order: 5,
    name: 'Level 5 — Advanced',
    cefrRange: 'B2/C1',
    tagline: 'Structural and domain reading at speed.',
    description:
      'Coordinates and embeds ideas across paragraphs and chapters: academic collocations, technical processes, data interpretation, and conceptual models.',
    canRead: ['Academic writing', 'Research summaries', 'Professional/technical manuals'],
  },
  {
    slug: 'c1-mastery',
    order: 6,
    name: 'Level 6 — C1 Mastery',
    cefrRange: 'C1',
    tagline: 'Author stance and rhetorical structure.',
    description:
      'Reads for argument development across a whole chapter or book: premises, evidence hierarchies, hidden assumptions, and rhetorical moves.',
    canRead: ['Dense argumentative essays', 'Policy and evaluation reports', 'Full-length nonfiction books'],
  },
  {
    slug: 'c2-mastery',
    order: 7,
    name: 'Level 7 — C2 Mastery',
    cefrRange: 'C2',
    tagline: 'Implicit meaning and calibrated conclusions.',
    description:
      'Handles ambiguity, irony, bias, and evidence sufficiency — evaluating not just what a text argues, but how far its conclusions are actually entitled to travel.',
    canRead: ['Philosophy, history, and science writing', 'Dense technical books', 'Sophisticated professional documentation'],
  },
  {
    slug: 'near-native',
    order: 8,
    name: 'Level 8 — Near-Native Reading',
    cefrRange: 'C2+',
    tagline: 'Fast, direct comprehension across domains.',
    description:
      'The long-term destination: reading complex English at speed, across unfamiliar domains, tracking implicit meaning and argument structure without conscious translation.',
    canRead: ['Cross-domain professional literature', 'Literary and rhetorical nuance', 'Fast first-pass reading of anything'],
  },
];

function getLevel(slug) {
  return levels.find((l) => l.slug === slug);
}

module.exports = { levels, getLevel };
