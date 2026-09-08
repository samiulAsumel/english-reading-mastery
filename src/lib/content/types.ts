import { z } from 'zod';

export const DifficultySchema = z.enum([
  'beginner',
  'elementary',
  'intermediate',
  'upper-intermediate',
  'advanced',
  'c1',
  'c2',
]);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const LessonStatusSchema = z.enum(['draft', 'published']);
export type LessonStatus = z.infer<typeof LessonStatusSchema>;

/**
 * Frontmatter contract for every `content/lessons/lesson-XXX/lesson.mdx`
 * file. This is the one place lesson metadata is validated — see
 * CONTENT_GUIDE.md before changing it, since every existing lesson file
 * must still satisfy it.
 */
export const LessonFrontmatterSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().positive(),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  title: z.string().min(1),
  description: z.string().min(1).max(300),
  level: z.string().min(1),
  module: z.string().min(1),
  estimatedTime: z.string().min(1),
  difficulty: DifficultySchema,
  prerequisites: z.array(z.number().int().positive()).default([]),
  skills: z.array(z.string()).default([]),
  objectives: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  status: LessonStatusSchema.default('published'),
});

export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;

export interface Lesson {
  frontmatter: LessonFrontmatter;
  /** Raw MDX source, compiled on demand by the page that renders it. */
  content: string;
  /** Folder name under content/lessons, e.g. "lesson-001". */
  dirName: string;
}

export interface LessonSummary extends LessonFrontmatter {
  dirName: string;
  readingTimeMinutes: number;
}
