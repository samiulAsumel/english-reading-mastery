import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { Lesson, LessonFrontmatterSchema, LessonSummary } from './types';

const LESSONS_DIR = path.join(process.cwd(), 'content', 'lessons');

function isLessonDir(name: string): boolean {
  return /^lesson-\d{3,}$/.test(name);
}

function readLessonDir(dirName: string): Lesson | null {
  const dir = path.join(LESSONS_DIR, dirName);
  const file = path.join(dir, 'lesson.mdx');
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  const parsed = LessonFrontmatterSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/lessons/${dirName}/lesson.mdx:\n${parsed.error.issues
        .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
        .join('\n')}`
    );
  }

  return { frontmatter: parsed.data, content, dirName };
}

/** All lesson folder names present on disk, unsorted. */
function listLessonDirs(): string[] {
  if (!fs.existsSync(LESSONS_DIR)) return [];
  return fs.readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && isLessonDir(e.name))
    .map((e) => e.name);
}

let cache: Lesson[] | null = null;

/** Every lesson on disk, sorted by lesson number. Published + draft. */
export function getAllLessons(): Lesson[] {
  if (cache) return cache;
  const lessons = listLessonDirs()
    .map(readLessonDir)
    .filter((l): l is Lesson => l !== null)
    .sort((a, b) => a.frontmatter.number - b.frontmatter.number);
  cache = lessons;
  return lessons;
}

export function getPublishedLessons(): Lesson[] {
  return getAllLessons().filter((l) => l.frontmatter.status === 'published');
}

export function getLessonByNumber(number: number): Lesson | undefined {
  return getAllLessons().find((l) => l.frontmatter.number === number);
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return getAllLessons().find((l) => l.frontmatter.slug === slug);
}

export interface AdjacentLessons {
  previous: Lesson | undefined;
  next: Lesson | undefined;
}

export function getAdjacentLessons(number: number): AdjacentLessons {
  const lessons = getPublishedLessons();
  const idx = lessons.findIndex((l) => l.frontmatter.number === number);
  if (idx === -1) return { previous: undefined, next: undefined };
  return { previous: lessons[idx - 1], next: lessons[idx + 1] };
}

export function getLessonsByModule(moduleSlug: string): Lesson[] {
  return getPublishedLessons().filter((l) => l.frontmatter.module === moduleSlug);
}

export function getLessonsByLevel(levelSlug: string): Lesson[] {
  return getPublishedLessons().filter((l) => l.frontmatter.level === levelSlug);
}

export function toSummary(lesson: Lesson): LessonSummary {
  return {
    ...lesson.frontmatter,
    dirName: lesson.dirName,
    readingTimeMinutes: Math.max(1, Math.round(readingTime(lesson.content).minutes)),
  };
}

export function getLessonCount(): number {
  return getPublishedLessons().length;
}

export function getHighestLessonNumber(): number {
  const lessons = getAllLessons();
  if (lessons.length === 0) return 0;
  return Math.max(...lessons.map((l) => l.frontmatter.number));
}
