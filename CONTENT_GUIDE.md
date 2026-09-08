# Content Guide — Adding a Lesson

This is the exact workflow for adding a lesson (86, 87, or any future
number) with Claude Code, or by hand. Nothing outside `content/lessons/`
needs to change for a normal new lesson.

## The one-command path

```bash
npm run new:lesson -- --title "Evidence Boundaries and Calibrated Conclusions"
```

This:

1. Reads every folder under `content/lessons/` to find the highest existing
   lesson number and uses `number + 1`.
2. Guesses a `level` and `module` from `content/curriculum/modules.ts`'
   `lessonRangeHint`s (override with `--level <slug> --module <slug>` if the
   guess is wrong — the ranges are approximate, not authoritative).
3. Writes `content/lessons/lesson-NNN/lesson.mdx` with frontmatter filled in
   and every content block stubbed out with `TODO`s, `status: "draft"`.

Then:

1. Open the new file and replace every `TODO` with real content.
2. Set `prerequisites`, `skills` (see `content/curriculum/skills.ts` for the
   valid slugs), `objectives`, and `tags`.
3. Change `status` to `"published"` when it's ready to appear in navigation,
   search, and the lessons index.
4. `npm run validate:content` (also runs automatically as part of `npm run
   build`).

That's it. The lesson automatically:

- appears in `/lessons`, its level page, and its module page
- gets previous/next navigation (by lesson number, among published lessons)
- is searchable (title, description, tags, skills) via the search index at `/api/search`
- has any `<Vocabulary />` blocks it uses aggregated into `/vocabulary`
- is included in `sitemap.xml`
- gets a route at `/lessons/<number>` with SEO metadata from its `title`/`description`

No other file needs editing. If you find yourself editing a page component
or a routing file to "add" a lesson, stop — that's a sign something is
wrong with the content, not a normal step.

## Doing it by hand

Copy `content/lessons/_template/lesson.mdx` (it demonstrates every content
block) to `content/lessons/lesson-NNN/lesson.mdx`, using a zero-padded
3-digit number, and fill in the frontmatter yourself:

```yaml
---
id: "lesson-086"
number: 86
slug: "evidence-boundaries-and-calibrated-conclusions"
title: "Evidence Boundaries and Calibrated Conclusions"
description: "One to two sentences — shows up in search results and social previews."
level: "c2-mastery"          # must match a slug in content/curriculum/levels.ts
module: "book-level-reasoning"  # must match a slug in content/curriculum/modules.ts,
                                  # and that module's `level` must equal the level above
estimatedTime: "25 min"
difficulty: "c2"              # beginner | elementary | intermediate | upper-intermediate | advanced | c1 | c2
prerequisites: [85]           # lesson numbers, not slugs
skills: ["evidence-evaluation", "calibrated-conclusions"]
objectives:
  - "Distinguish evidence from inference"
  - "Preserve author uncertainty rather than overstating a conclusion"
tags: ["evidence", "uncertainty"]
status: "draft"                # draft lessons build but stay out of nav/search/prev-next
---
```

## Content blocks available in the MDX body

All registered in `src/components/content/mdx-components.tsx`. See
`content/lessons/_template/lesson.mdx` for one of each in context.

| Block | Use for |
|---|---|
| `<LearningObjectives>` | "By the end of this lesson..." list (wrap `<li>`s) |
| `<KeyConcept>` | The core idea of the lesson |
| `<Example>` | A worked example |
| `<Framework>` + `<Step>` (`last` prop on the final one) | A vertical process/argument diagram |
| `<GoldenRule>` | The one-sentence memorable rule |
| `<Important>` | Something the reader must not skim past |
| `<Warning>` | A common mistake |
| `<Note>` | A reading-strategy tip |
| `<Vocabulary word="..." partOfSpeech="..." meaning="..." example="..." />` | A vocabulary entry — self-closing, plain string attributes only (it's picked up by regex for `/vocabulary`, not a full MDX parse) |
| `<Collocation>` | Inline collocation styling, e.g. `mitigate <Collocation>risk</Collocation>` |
| `<ComparisonTable>` | Wraps a markdown table for consistent styling |

All of `<KeyConcept>`, `<Example>`, `<Framework>`, `<Important>`, `<Warning>`,
and `<Note>` accept an optional `title="..."` prop to override their default
heading. Standard markdown (`##`/`###` headings, lists, tables, `**bold**`,
blockquotes, links) works as-is and picks up the platform's reading
typography automatically — you don't need a custom block for everyday prose.

`##` and `###` headings automatically appear in the lesson's "On this page"
sidebar navigation.

## What validation checks

`npm run validate:content` (and therefore `npm run build`) fails the build
if:

- a lesson folder name doesn't match `lesson-NNN`, or doesn't match its own
  frontmatter `number`
- frontmatter fails the schema in `src/lib/content/types.ts` (missing
  required field, wrong type, bad `slug` format, etc.)
- `level` or `module` isn't defined in `content/curriculum/`, or the module
  belongs to a different level than the lesson declares
- two lessons share a `number`, `slug`, or `id`
- a `prerequisites` entry references a lesson number that doesn't exist
- the MDX body is empty

Fix the reported file and re-run — the error message names the exact file
and field.

## Preserving existing content

Never renumber an existing lesson, merge two lessons, or summarize a
lesson's content when editing it. If you notice a contradiction or
duplicate concept between lessons, flag it in the PR/commit description
rather than silently deleting either one — see the root `CLAUDE.md` /
project instructions for the full rule.
