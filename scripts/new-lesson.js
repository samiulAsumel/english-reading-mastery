'use strict';

/**
 * Scaffolds the next lesson folder. Usage:
 *
 *   npm run new:lesson -- --title "Evidence Boundaries and Calibrated Conclusions"
 *   npm run new:writing -- --title "Describing a Daily Routine"
 *   npm run new:speaking -- --title "Naming Objects Under Time Pressure"
 *
 * Optional flags: --type reading|writing|speaking (default reading)
 * --level <slug> --module <slug> --number <n> (override the auto-detected
 * next number). See CONTENT_GUIDE.md for the full workflow.
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

const READING_BODY = `
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

const WRITING_BODY = `
## Introduction

TODO — what this task practices and why it matters.

## Your Turn

::: prompt words="TODO" time="TODO"
TODO the writing task itself.
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

const SPEAKING_BODY = `
## Introduction

TODO — what this drill practices and why it matters (frame it around
speaking without translating from Bangla first).

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

function main() {
  const args = parseArgs(process.argv.slice(2));
  const title = args.title;
  const type = args.type || 'reading';
  const collection = COLLECTIONS[type];
  if (!title || !collection) {
    console.error('Usage: npm run new:lesson -- --title "Lesson Title" [--type reading|writing|speaking] [--level slug] [--module slug] [--number n]');
    process.exit(1);
  }

  const highest = getHighestNumber(collection);
  const number = args.number ? Number(args.number) : highest + 1;
  const dirName = `${collection.dirPrefix}-${String(number).padStart(3, '0')}`;
  const dir = path.join(CONTENT_ROOT, collection.dirName, dirName);

  if (fs.existsSync(dir)) {
    console.error(`content/${collection.dirName}/${dirName} already exists.`);
    process.exit(1);
  }

  const placement = args.level && args.module ? { level: args.level, module: args.module } : collection.suggestPlacement(number);
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
prerequisites: [${highest > 0 ? highest : ''}]
skills: []
objectives:
  - "TODO: first learning objective"
  - "TODO: second learning objective"
tags: []
status: "draft"
---
`;

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, collection.fileName), frontmatter + BODY_BY_TYPE[type], 'utf-8');

  console.log(`Created content/${collection.dirName}/${dirName}/${collection.fileName}`);
  console.log(`  level: ${level ? level.name : placement.level}`);
  console.log(`  module: ${placement.module}`);
  console.log('  status: draft — flip to "published" when the content is ready.');
}

main();
