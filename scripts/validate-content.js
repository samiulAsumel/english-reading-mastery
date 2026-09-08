'use strict';

/**
 * Content integrity check — run via `npm run validate:content` (also runs
 * automatically before every `npm run build`). See CONTENT_GUIDE.md
 * "What validation checks" for the full list this enforces.
 */
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const { validateFrontmatter, LESSONS_DIR, isLessonDir, levels, modules } = require('./lib/content');

function fail(errors) {
  console.error(`\n✗ Content validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}

function main() {
  if (!fs.existsSync(LESSONS_DIR)) {
    console.log('No content/lessons directory yet — nothing to validate.');
    return;
  }

  const levelSlugs = new Set(levels.map((l) => l.slug));
  const moduleBySlug = new Map(modules.map((m) => [m.slug, m]));
  const errors = [];

  const dirNames = fs
    .readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== '_template')
    .map((e) => e.name);

  const parsed = [];

  for (const dirName of dirNames) {
    if (!isLessonDir(dirName)) {
      errors.push(`content/lessons/${dirName}: folder name must match "lesson-NNN" (e.g. lesson-001)`);
      continue;
    }

    const file = path.join(LESSONS_DIR, dirName, 'lesson.md');
    if (!fs.existsSync(file)) {
      errors.push(`content/lessons/${dirName}: missing lesson.md`);
      continue;
    }

    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    const fmErrors = validateFrontmatter(data, dirName);
    if (fmErrors.length > 0) {
      errors.push(...fmErrors);
      continue;
    }

    const expectedDir = `lesson-${String(data.number).padStart(3, '0')}`;
    if (dirName !== expectedDir) {
      errors.push(`content/lessons/${dirName}: number ${data.number} implies folder "${expectedDir}", found "${dirName}"`);
    }
    if (!levelSlugs.has(data.level)) {
      errors.push(`content/lessons/${dirName}: level "${data.level}" is not defined in content/curriculum/levels.js`);
    }
    const mod = moduleBySlug.get(data.module);
    if (!mod) {
      errors.push(`content/lessons/${dirName}: module "${data.module}" is not defined in content/curriculum/modules.js`);
    } else if (mod.level !== data.level) {
      errors.push(
        `content/lessons/${dirName}: module "${data.module}" belongs to level "${mod.level}", but lesson declares level "${data.level}"`
      );
    }
    if (content.trim().length === 0) {
      errors.push(`content/lessons/${dirName}: lesson.md has no content body`);
    }

    parsed.push({
      dirName,
      number: data.number,
      slug: data.slug,
      id: data.id,
      prerequisites: data.prerequisites || [],
    });
  }

  const byNumber = new Map();
  const bySlug = new Map();
  const byId = new Map();
  for (const l of parsed) {
    byNumber.set(l.number, [...(byNumber.get(l.number) || []), l.dirName]);
    bySlug.set(l.slug, [...(bySlug.get(l.slug) || []), l.dirName]);
    byId.set(l.id, [...(byId.get(l.id) || []), l.dirName]);
  }
  for (const [number, dirs] of byNumber) if (dirs.length > 1) errors.push(`Duplicate lesson number ${number}: ${dirs.join(', ')}`);
  for (const [slugv, dirs] of bySlug) if (dirs.length > 1) errors.push(`Duplicate lesson slug "${slugv}": ${dirs.join(', ')}`);
  for (const [id, dirs] of byId) if (dirs.length > 1) errors.push(`Duplicate lesson id "${id}": ${dirs.join(', ')}`);

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
