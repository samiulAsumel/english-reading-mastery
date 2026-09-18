'use strict';

/**
 * The eight-level skill journey (plus Level 0 orientation). Lesson numbers
 * never determine level — each lesson declares its own `level` slug in
 * frontmatter. This file only defines what a level means, not which
 * lessons belong to it.
 *
 * Shape: { slug, order, name, cefrRange, tagline, description, canRead[],
 * canWrite[], canSpeak[] }. The write/speak lists are the same kind of
 * aspirational per-level capability description as canRead — they don't
 * imply lessons already exist at that level (see content/writing/ and
 * content/speaking/ for what's actually published so far).
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
    canWrite: ['Simple labeled answers, single words'],
    canSpeak: ['Single words and short phrases, no pressure'],
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
    canWrite: ['Simple, correct sentences', 'A short 3–4 sentence paragraph'],
    canSpeak: ['Instant naming of everyday objects and actions', 'Short shadowed sentences with no translation step'],
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
    canWrite: ['Connected paragraphs using linking words', 'Short emails and messages'],
    canSpeak: ['Short spoken descriptions without rehearsing in Bangla first', 'Everyday conversational exchanges'],
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
    canWrite: ['Multi-paragraph explanations', 'Opinions supported with reasons and examples'],
    canSpeak: ['Spontaneous answers to everyday questions', 'Explaining a process out loud, in real time'],
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
    canWrite: ['Structured arguments backed by evidence', 'Workplace emails and short reports'],
    canSpeak: ['Presenting a short argument on the spot', 'Discussing work topics without translating first'],
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
    canWrite: ['Academic-style paragraphs and short essays', 'Clear technical explanations'],
    canSpeak: ['Explaining technical ideas fluently', 'Sustained spoken responses on familiar topics'],
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
    canWrite: ['Well-structured essays with counterarguments', 'Professional documentation'],
    canSpeak: ['Debating a position persuasively, unscripted', 'Near-native-paced conversational fluency'],
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
    canWrite: ['Nuanced, precisely worded arguments', 'Sophisticated professional writing'],
    canSpeak: ['Speaking with native-like rhythm and idiom', 'Handling ambiguity and nuance in live conversation'],
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
    canWrite: ['Writing indistinguishable in accuracy from a native professional'],
    canSpeak: ['Thinking and speaking in English with zero translation step, at conversational speed'],
  },
];

function getLevel(slug) {
  return levels.find((l) => l.slug === slug);
}

module.exports = { levels, getLevel };
