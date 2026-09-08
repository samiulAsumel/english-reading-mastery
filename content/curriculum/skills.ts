/**
 * Named skills a lesson can teach (referenced by slug in lesson
 * frontmatter `skills: []`). The Skills page aggregates real lesson data
 * against this list — it does not invent mastery numbers.
 */
export interface Skill {
  slug: string;
  name: string;
  group: 'foundation' | 'intermediate' | 'upper-intermediate' | 'advanced' | 'c2';
}

export const skills: Skill[] = [
  { slug: 'sentence-structure', name: 'Sentence Structure', group: 'foundation' },
  { slug: 'phrases-and-clauses', name: 'Phrases & Clauses', group: 'foundation' },
  { slug: 'grammar-mechanics', name: 'Grammar Mechanics', group: 'foundation' },
  { slug: 'paragraph-architecture', name: 'Paragraph Architecture', group: 'intermediate' },
  { slug: 'cohesion-and-reference', name: 'Cohesion & Reference Tracking', group: 'intermediate' },
  { slug: 'vocabulary-in-context', name: 'Vocabulary in Context', group: 'intermediate' },
  { slug: 'inference', name: 'Inference', group: 'intermediate' },
  { slug: 'argument-structure', name: 'Argument Structure', group: 'upper-intermediate' },
  { slug: 'evidence-evaluation', name: 'Evidence Evaluation', group: 'upper-intermediate' },
  { slug: 'causation-and-comparison', name: 'Causation & Comparison', group: 'upper-intermediate' },
  { slug: 'technical-reading', name: 'Technical Reading', group: 'advanced' },
  { slug: 'data-interpretation', name: 'Data Interpretation', group: 'advanced' },
  { slug: 'book-level-comprehension', name: 'Book-Level Comprehension', group: 'advanced' },
  { slug: 'rhetorical-understanding', name: 'Rhetorical Understanding', group: 'c2' },
  { slug: 'bias-and-framing', name: 'Bias & Framing Detection', group: 'c2' },
  { slug: 'calibrated-conclusions', name: 'Calibrated Conclusions', group: 'c2' },
];

export function getSkill(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug);
}
