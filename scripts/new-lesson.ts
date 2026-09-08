/**
 * Scaffolds the next lesson folder. Usage:
 *
 *   npm run new:lesson -- --title "Evidence Boundaries and Calibrated Conclusions"
 *
 * Optional flags: --level <slug> --module <slug> --number <n> (override the
 * auto-detected next number). See CONTENT_GUIDE.md for the full workflow.
 */
import fs from 'node:fs';
import path from 'node:path';
import { suggestPlacement } from '../content/curriculum/modules';
import { getLevel } from '../content/curriculum/levels';

const LESSONS_DIR = path.join(process.cwd(), 'content', 'lessons');

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      out[key] = value;
    }
  }
  return out;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function getHighestLessonNumber(): number {
  if (!fs.existsSync(LESSONS_DIR)) return 0;
  const dirs = fs.readdirSync(LESSONS_DIR).filter((d) => /^lesson-\d{3,}$/.test(d));
  if (dirs.length === 0) return 0;
  return Math.max(...dirs.map((d) => Number(d.replace('lesson-', ''))));
}

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
  const difficultyByLevel: Record<string, string> = {
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

  const frontmatter = `---
id: "lesson-${String(number).padStart(3, '0')}"
number: ${number}
slug: "${slug}"
title: "${title}"
description: "TODO: one to two sentence summary for search results and SEO."
level: "${placement.level}"
module: "${placement.module}"
estimatedTime: "20 min"
difficulty: "${difficultyByLevel[placement.level] ?? 'intermediate'}"
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

<LearningObjectives>
  <li>TODO: first learning objective</li>
  <li>TODO: second learning objective</li>
</LearningObjectives>

## Core Concept

<KeyConcept>
TODO.
</KeyConcept>

## Examples

<Example>
TODO.
</Example>

## Vocabulary

<Vocabulary word="example" partOfSpeech="noun" meaning="TODO meaning" example="TODO example sentence." />

## Master Framework

<Framework>
  <Step>TODO Step 1</Step>
  <Step>TODO Step 2</Step>
  <Step last>TODO Step 3</Step>
</Framework>

## Golden Rule

<GoldenRule>TODO golden rule, one memorable sentence.</GoldenRule>

## Lesson Summary

TODO.
`;

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'lesson.mdx'), frontmatter + body, 'utf-8');

  console.log(`Created content/lessons/${dirName}/lesson.mdx`);
  console.log(`  level: ${level?.name ?? placement.level}`);
  console.log(`  module: ${placement.module}`);
  console.log('  status: draft — flip to "published" when the content is ready.');
}

main();
