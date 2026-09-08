/**
 * Content integrity check — run via `npm run validate:content` (also runs
 * automatically before every `npm run build`). See CONTENT_GUIDE.md §
 * "What validation checks" for the full list this enforces.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { LessonFrontmatterSchema } from '../src/lib/content/types';
import { levels } from '../content/curriculum/levels';
import { modules } from '../content/curriculum/modules';

const LESSONS_DIR = path.join(process.cwd(), 'content', 'lessons');
const levelSlugs = new Set(levels.map((l) => l.slug));
const moduleBySlug = new Map(modules.map((m) => [m.slug, m]));

interface ParsedLesson {
  dirName: string;
  number: number;
  slug: string;
  id: string;
  level: string;
  module: string;
  prerequisites: number[];
}

function fail(errors: string[]): never {
  console.error(`\n✗ Content validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}

function main() {
  const errors: string[] = [];

  if (!fs.existsSync(LESSONS_DIR)) {
    console.log('No content/lessons directory yet — nothing to validate.');
    return;
  }

  const dirNames = fs
    .readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== '_template')
    .map((e) => e.name);

  const parsed: ParsedLesson[] = [];

  for (const dirName of dirNames) {
    if (!/^lesson-\d{3,}$/.test(dirName)) {
      errors.push(`content/lessons/${dirName}: folder name must match "lesson-NNN" (e.g. lesson-001)`);
      continue;
    }

    const file = path.join(LESSONS_DIR, dirName, 'lesson.mdx');
    if (!fs.existsSync(file)) {
      errors.push(`content/lessons/${dirName}: missing lesson.mdx`);
      continue;
    }

    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    const result = LessonFrontmatterSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`content/lessons/${dirName}/lesson.mdx: frontmatter.${issue.path.join('.')} — ${issue.message}`);
      }
      continue;
    }

    const fm = result.data;

    const expectedDir = `lesson-${String(fm.number).padStart(3, '0')}`;
    if (dirName !== expectedDir) {
      errors.push(`content/lessons/${dirName}: number ${fm.number} implies folder "${expectedDir}", found "${dirName}"`);
    }

    if (!levelSlugs.has(fm.level)) {
      errors.push(`content/lessons/${dirName}: level "${fm.level}" is not defined in content/curriculum/levels.ts`);
    }

    const mod = moduleBySlug.get(fm.module);
    if (!mod) {
      errors.push(`content/lessons/${dirName}: module "${fm.module}" is not defined in content/curriculum/modules.ts`);
    } else if (mod.level !== fm.level) {
      errors.push(
        `content/lessons/${dirName}: module "${fm.module}" belongs to level "${mod.level}", but lesson declares level "${fm.level}"`
      );
    }

    if (content.trim().length === 0) {
      errors.push(`content/lessons/${dirName}: lesson.mdx has no content body`);
    }

    parsed.push({
      dirName,
      number: fm.number,
      slug: fm.slug,
      id: fm.id,
      level: fm.level,
      module: fm.module,
      prerequisites: fm.prerequisites,
    });
  }

  const byNumber = new Map<number, string[]>();
  const bySlug = new Map<string, string[]>();
  const byId = new Map<string, string[]>();
  for (const l of parsed) {
    byNumber.set(l.number, [...(byNumber.get(l.number) ?? []), l.dirName]);
    bySlug.set(l.slug, [...(bySlug.get(l.slug) ?? []), l.dirName]);
    byId.set(l.id, [...(byId.get(l.id) ?? []), l.dirName]);
  }
  for (const [number, dirs] of byNumber) {
    if (dirs.length > 1) errors.push(`Duplicate lesson number ${number}: ${dirs.join(', ')}`);
  }
  for (const [slug, dirs] of bySlug) {
    if (dirs.length > 1) errors.push(`Duplicate lesson slug "${slug}": ${dirs.join(', ')}`);
  }
  for (const [id, dirs] of byId) {
    if (dirs.length > 1) errors.push(`Duplicate lesson id "${id}": ${dirs.join(', ')}`);
  }

  const knownNumbers = new Set(parsed.map((l) => l.number));
  for (const l of parsed) {
    for (const prereq of l.prerequisites) {
      if (!knownNumbers.has(prereq)) {
        errors.push(`content/lessons/${l.dirName}: prerequisite lesson ${prereq} does not exist yet`);
      }
    }
  }

  if (errors.length > 0) fail(errors);

  console.log(`✓ Content validation passed — ${parsed.length} lesson${parsed.length === 1 ? '' : 's'} checked.`);
}

main();
