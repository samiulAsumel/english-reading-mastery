'use strict';

/**
 * Scaffolds the next lesson folder. Usage:
 *
 *   npm run new:lesson -- --title "Evidence Boundaries and Calibrated Conclusions"
 *
 * Optional flags: --level <slug> --module <slug> --number <n> (override the
 * auto-detected next number). See CONTENT_GUIDE.md for the full workflow.
 */
const fs = require('node:fs');
const path = require('node:path');
const { LESSONS_DIR, isLessonDir } = require('./lib/content');
const { getLevel } = require('../content/curriculum/levels');
const { suggestPlacement } = require('../content/curriculum/modules');

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

function getHighestLessonNumber() {
  if (!fs.existsSync(LESSONS_DIR)) return 0;
  const dirs = fs.readdirSync(LESSONS_DIR).filter(isLessonDir);
  if (dirs.length === 0) return 0;
  return Math.max(...dirs.map((d) => Number(d.replace('lesson-', ''))));
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

function main() {
  const args = parseArgs(process.argv.slice(2));
  const title = args.title;
  if (!title) {
    console.error('Usage: npm run new:lesson -- --title "Lesson Title" [--level slug] [--module slug] [--number n]');
    process.exit(1);
  }

  const highest = getHighestLessonNumber();
  const number = args.number ? Number(args.number) : highest + 1;
  const dirName = `lesson-${String(number).padStart(3, '0')}`;
  const dir = path.join(LESSONS_DIR, dirName);

  if (fs.existsSync(dir)) {
    console.error(`content/lessons/${dirName} already exists.`);
    process.exit(1);
  }

  const placement = args.level && args.module ? { level: args.level, module: args.module } : suggestPlacement(number);
  const level = getLevel(placement.level);
  const slug = slugify(title);

  const frontmatter = `---
id: "lesson-${String(number).padStart(3, '0')}"
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

  const body = `
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

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'lesson.md'), frontmatter + body, 'utf-8');

  console.log(`Created content/lessons/${dirName}/lesson.md`);
  console.log(`  level: ${level ? level.name : placement.level}`);
  console.log(`  module: ${placement.module}`);
  console.log('  status: draft — flip to "published" when the content is ready.');
}

main();
