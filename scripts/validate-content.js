'use strict';

/**
 * Content integrity check — run via `npm run validate:content` (also runs
 * automatically before every `npm run build`). See CONTENT_GUIDE.md
 * "What validation checks" for the full list this enforces.
 */
const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const { validateFrontmatter, isLessonDir, CONTENT_ROOT, levels } = require('./lib/content');
const { COLLECTION_LIST } = require('../content/curriculum/collections');

function fail(errors) {
  console.error(`\n✗ Content validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}

/** Validates one collection (reading, writing, or speaking). Duplicate-number/slug/id detection stays scoped to this collection — writing-001 and lesson-001 are not a collision. */
function validateCollection(collection, levelSlugs, errors) {
  const dir = path.join(CONTENT_ROOT, collection.dirName);
  if (!fs.existsSync(dir)) return [];

  const moduleBySlug = new Map(collection.modules.map((m) => [m.slug, m]));

  const dirNames = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== '_template')
    .map((e) => e.name);

  const parsed = [];

  for (const dirName of dirNames) {
    if (!isLessonDir(dirName, collection.dirPrefix)) {
      errors.push(`content/${collection.dirName}/${dirName}: folder name must match "${collection.dirPrefix}-NNN" (e.g. ${collection.dirPrefix}-001)`);
      continue;
    }

    const file = path.join(dir, dirName, collection.fileName);
    if (!fs.existsSync(file)) {
      errors.push(`content/${collection.dirName}/${dirName}: missing ${collection.fileName}`);
      continue;
    }

    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    const fmErrors = validateFrontmatter(data, dirName, collection.dirName, collection.fileName);
    if (fmErrors.length > 0) {
      errors.push(...fmErrors);
      continue;
    }

    const expectedDir = `${collection.dirPrefix}-${String(data.number).padStart(3, '0')}`;
    if (dirName !== expectedDir) {
      errors.push(`content/${collection.dirName}/${dirName}: number ${data.number} implies folder "${expectedDir}", found "${dirName}"`);
    }
    if (!levelSlugs.has(data.level)) {
      errors.push(`content/${collection.dirName}/${dirName}: level "${data.level}" is not defined in content/curriculum/levels.js`);
    }
    const mod = moduleBySlug.get(data.module);
    if (!mod) {
      errors.push(`content/${collection.dirName}/${dirName}: module "${data.module}" is not defined for the ${collection.key} collection`);
    } else if (mod.level !== data.level) {
      errors.push(
        `content/${collection.dirName}/${dirName}: module "${data.module}" belongs to level "${mod.level}", but ${collection.fileName} declares level "${data.level}"`
      );
    }
    if (content.trim().length === 0) {
      errors.push(`content/${collection.dirName}/${dirName}: ${collection.fileName} has no content body`);
    }

    parsed.push({
      dirName,
      number: data.number,
      slug: data.slug,
      id: data.id,
      prerequisites: data.prerequisites || [],
      status: data.status || 'published',
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
  for (const [number, dirs] of byNumber) if (dirs.length > 1) errors.push(`Duplicate ${collection.key} number ${number}: ${dirs.join(', ')}`);
  for (const [slugv, dirs] of bySlug) if (dirs.length > 1) errors.push(`Duplicate ${collection.key} slug "${slugv}": ${dirs.join(', ')}`);
  for (const [id, dirs] of byId) if (dirs.length > 1) errors.push(`Duplicate ${collection.key} id "${id}": ${dirs.join(', ')}`);

  const knownNumbers = new Set(parsed.map((l) => l.number));
  for (const l of parsed) {
    for (const prereq of l.prerequisites) {
      if (!knownNumbers.has(prereq)) {
        errors.push(`content/${collection.dirName}/${l.dirName}: prerequisite ${prereq} does not exist yet in the ${collection.key} collection`);
      }
    }
  }

  return parsed;
}

/**
 * Every published reading lesson numbered 1+ should have a matching
 * writing-NNN and speaking-NNN (lesson 0, course orientation, is exempt —
 * it has no writing/speaking pair by design). This is a warning, not a
 * build failure, so a lesson mid-authoring doesn't block everything else.
 */
function reportMissingPairs(byCollection) {
  const reading = byCollection.reading || [];
  const writingNumbers = new Set((byCollection.writing || []).map((l) => l.number));
  const speakingNumbers = new Set((byCollection.speaking || []).map((l) => l.number));

  const missing = [];
  for (const l of reading) {
    if (l.number === 0 || l.status !== 'published') continue;
    const gaps = [];
    if (!writingNumbers.has(l.number)) gaps.push('writing');
    if (!speakingNumbers.has(l.number)) gaps.push('speaking');
    if (gaps.length > 0) missing.push(`  - lesson-${String(l.number).padStart(3, '0')}: missing ${gaps.join(' & ')}`);
  }

  if (missing.length > 0) {
    console.warn(`\n⚠ ${missing.length} published reading lesson(s) without a full writing/speaking pair:`);
    console.warn(missing.join('\n'));
    console.warn('');
  }
}

function main() {
  const levelSlugs = new Set(levels.map((l) => l.slug));
  const errors = [];
  const counts = [];
  const byCollection = {};

  for (const collection of COLLECTION_LIST) {
    const parsed = validateCollection(collection, levelSlugs, errors);
    counts.push(`${parsed.length} ${collection.key}`);
    byCollection[collection.key] = parsed;
  }

  if (errors.length > 0) fail(errors);

  console.log(`✓ Content validation passed — ${counts.join(', ')}.`);
  reportMissingPairs(byCollection);
}

main();
