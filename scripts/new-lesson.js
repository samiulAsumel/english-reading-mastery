'use strict';

/**
 * Scaffolds the next lesson folder. Usage:
 *
 *   npm run new:lesson -- --title "Evidence Boundaries and Calibrated Conclusions"
 *   npm run new:writing -- --title "Describing a Daily Routine" --number 12
 *   npm run new:speaking -- --title "Naming Objects Under Time Pressure" --number 12
 *
 * A plain `new:lesson` run also scaffolds the matching writing-NNN and
 * speaking-NNN pair at the same number (skipped for number 0, the course
 * orientation lesson, which has no writing/speaking pair) — see
 * ARCHITECTURE.md "Writing & speaking tracks: one platform, three
 * collections" for why the pairing is a numbering convention plus this
 * scaffold, not a routing table. Pass --no-pair to skip that and scaffold
 * only the reading lesson; use `new:writing`/`new:speaking` with
 * --number to fill in a single missing pair by hand.
 *
 * Optional flags: --type reading|writing|speaking (default reading)
 * --level <slug> --module <slug> --number <n> (override the auto-detected
 * next number) --no-pair (reading only: skip auto-scaffolding the pair).
 * See CONTENT_GUIDE.md for the full workflow.
 */
const fs = require('node:fs');
const path = require('node:path');
const { CONTENT_ROOT, isLessonDir } = require('./lib/content');
const { getLevel } = require('../content/curriculum/levels');
const { COLLECTIONS } = require('../content/curriculum/collections');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      out[key] = value;
    }
  }
  return out;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function getHighestNumber(collection) {
  const dir = path.join(CONTENT_ROOT, collection.dirName);
  if (!fs.existsSync(dir)) return 0;
  const dirs = fs.readdirSync(dir).filter((d) => isLessonDir(d, collection.dirPrefix));
  if (dirs.length === 0) return 0;
  return Math.max(...dirs.map((d) => Number(d.replace(`${collection.dirPrefix}-`, ''))));
}

const DIFFICULTY_BY_LEVEL = {
  orientation: 'beginner',
  foundation: 'beginner',
  elementary: 'elementary',
  intermediate: 'intermediate',
  'upper-intermediate': 'upper-intermediate',
  advanced: 'advanced',
  'c1-mastery': 'c1',
  'c2-mastery': 'c2',
  'near-native': 'c2',
};

const READING_BODY = () => `
## Introduction

TODO.

## Core Concept

::: concept
TODO.
:::

## Examples

::: example
TODO.
:::

## Vocabulary

::: vocabulary word="example" pos="noun" meaning="TODO meaning" example="TODO example sentence."
:::

## Master Framework

::: framework
- TODO Step 1
- TODO Step 2
- TODO Step 3
:::

## Golden Rule

::: golden
TODO golden rule, one memorable sentence.
:::

## Lesson Summary

TODO.
`;

const WRITING_BODY = (readingNumber) => `
## Introduction

TODO — what this task practices, and a link back to what it pairs with:
[Lesson ${readingNumber}](/lessons/${readingNumber}/) — TODO reading lesson title.

## Your Turn

::: prompt words="TODO" time="TODO"
TODO the writing task itself — it should require producing the exact
structure the paired reading lesson taught.
:::

::: draft
:::

## Model Answer

::: model-answer
TODO a model answer to compare your own writing against.
:::

## Self-Check

::: rubric
- TODO accuracy check
- TODO completeness check
- TODO one specific thing to notice
:::

## Vocabulary

::: vocabulary word="example" pos="noun" meaning="TODO meaning" example="TODO example sentence."
:::
`;

const SPEAKING_BODY = (readingNumber) => `
## Introduction

TODO — what this drill practices, and a link back to what it pairs with:
[Lesson ${readingNumber}](/lessons/${readingNumber}/) — TODO reading lesson title
(frame it around speaking without translating from Bangla first).

## Your Turn

::: prompt time="TODO"
TODO the speaking task itself — nothing to translate, just a scenario to
respond to immediately.
:::

## Model Answer

::: model-answer
TODO a model spoken response to compare yourself against.
:::

## Self-Check

::: rubric
- TODO rhythm/pace check
- TODO no-translation check
- TODO one specific thing to notice
:::

## Vocabulary

::: vocabulary word="example" pos="noun" meaning="TODO meaning" example="TODO example sentence."
:::
`;

const BODY_BY_TYPE = { reading: READING_BODY, writing: WRITING_BODY, speaking: SPEAKING_BODY };

/** Creates one scaffolded item. Throws if the target folder already exists. */
function scaffold({ type, title, number, prerequisites, placementOverride }) {
  const collection = COLLECTIONS[type];
  const dirName = `${collection.dirPrefix}-${String(number).padStart(3, '0')}`;
  const dir = path.join(CONTENT_ROOT, collection.dirName, dirName);

  if (fs.existsSync(dir)) {
    throw new Error(`content/${collection.dirName}/${dirName} already exists.`);
  }

  const placement = placementOverride || collection.suggestPlacement(number);
  const level = getLevel(placement.level);
  const slug = slugify(title);

  const frontmatter = `---
id: "${dirName}"
number: ${number}
slug: "${slug}"
title: "${title}"
description: "TODO: one to two sentence summary for search results and SEO."
level: "${placement.level}"
module: "${placement.module}"
estimatedTime: "20 min"
difficulty: "${DIFFICULTY_BY_LEVEL[placement.level] || 'intermediate'}"
prerequisites: [${prerequisites.join(', ')}]
skills: []
objectives:
  - "TODO: first learning objective"
  - "TODO: second learning objective"
tags: []
status: "draft"
---
`;

  const body = type === 'reading' ? BODY_BY_TYPE[type]() : BODY_BY_TYPE[type](number);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, collection.fileName), frontmatter + body, 'utf-8');

  return { dirName, collection, level, placement };
}

function report({ dirName, collection, level, placement }) {
  console.log(`Created content/${collection.dirName}/${dirName}/${collection.fileName}`);
  console.log(`  level: ${level ? level.name : placement.level}`);
  console.log(`  module: ${placement.module}`);
  console.log('  status: draft — flip to "published" when the content is ready.');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const title = args.title;
  const type = args.type || 'reading';
  const collection = COLLECTIONS[type];
  if (!title || !collection) {
    console.error(
      'Usage: npm run new:lesson -- --title "Lesson Title" [--type reading|writing|speaking] [--level slug] [--module slug] [--number n] [--no-pair]'
    );
    process.exit(1);
  }

  const highest = getHighestNumber(collection);
  const number = args.number ? Number(args.number) : highest + 1;
  const prerequisites = highest > 0 ? [highest] : [];

  const shouldPair = type === 'reading' && number > 0 && args['no-pair'] !== 'true';

  // Pre-flight: if pairing, make sure the writing/speaking numbers are free
  // too, before creating anything — a partial scaffold (reading created,
  // writing/speaking failed) would be worse than failing up front.
  if (shouldPair) {
    for (const pairType of ['writing', 'speaking']) {
      const pairCollection = COLLECTIONS[pairType];
      const pairDirName = `${pairCollection.dirPrefix}-${String(number).padStart(3, '0')}`;
      const pairDir = path.join(CONTENT_ROOT, pairCollection.dirName, pairDirName);
      if (fs.existsSync(pairDir)) {
        console.error(`content/${pairCollection.dirName}/${pairDirName} already exists — cannot auto-pair.`);
        console.error('Pass --no-pair to scaffold only the reading lesson.');
        process.exit(1);
      }
    }
  }

  const placementOverride = args.level && args.module ? { level: args.level, module: args.module } : null;

  try {
    const readingResult = scaffold({ type, title, number, prerequisites, placementOverride });
    report(readingResult);

    if (shouldPair) {
      const pairPrerequisites = number > 1 ? [number - 1] : [];
      const writingResult = scaffold({
        type: 'writing',
        title: `Writing Practice — ${title}`,
        number,
        prerequisites: pairPrerequisites,
      });
      report(writingResult);
      const speakingResult = scaffold({
        type: 'speaking',
        title: `Speaking Drill — ${title}`,
        number,
        prerequisites: pairPrerequisites,
      });
      report(speakingResult);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

main();
