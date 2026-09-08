# Architecture

## Stack

Next.js 16 (App Router, RSC by default), TypeScript, Tailwind CSS v4,
`next-mdx-remote/rsc` for content, Zod for schema validation, `next-themes`
for dark mode, `cmdk` + FlexSearch for the command-palette search, Radix UI
primitives behind a small `src/components/ui/` shadcn-style layer.

No database, no auth, no CMS. Content is Git-versioned MDX files. This is
deliberate — see "Why filesystem content, not a CMS" below.

## Content vs. curriculum vs. UI — three separate systems

This is the load-bearing decision in the whole codebase, so it's worth
being explicit about the boundary:

1. **`content/lessons/lesson-NNN/lesson.mdx`** — one file per lesson: its
   own frontmatter (metadata) and MDX body (the actual teaching content).
   This is the only place lesson content lives.
2. **`content/curriculum/{levels,modules,skills}.ts`** — the *taxonomy*
   lessons plug into. A level or module doesn't know which lessons belong
   to it; a lesson declares its own `level`/`module`/`skills` in
   frontmatter. This file only defines what each level/module/skill means.
3. **`src/components/`, `src/app/`** — presentation. Pages read lessons and
   curriculum data through `src/lib/content/lessons.ts` and render them;
   they never contain lesson content themselves.

The reason this split matters: **nothing in `src/app` or `src/components`
hard-codes a lesson number, title, or count.** `getPublishedLessons()`
reads whatever is on disk. Add lesson 86 and every page that lists lessons,
every prev/next link, the search index, the vocabulary index, and the
sitemap update themselves — because they were never told about lesson 85
specifically in the first place. This is what makes "add lesson 86" a
one-file change instead of a ten-file change (see CONTENT_GUIDE.md).

## Why no lesson-number routing table

It would be easy to write a single big `LESSONS = { 1: {...}, 2: {...} }`
object and index everything off it. Don't do this — it's explicitly the
anti-pattern the project brief calls out ("never hard-code all lessons into
one giant file"). Two concrete reasons it breaks down:

- **Merge conflicts.** Every new lesson would touch the same file/object
  that every other lesson touches. With one file per lesson, adding lesson
  86 touches exactly one new file.
- **It re-couples content and code.** The whole point of the frontmatter +
  MDX split is that a lesson is *data*, checked by a schema
  (`src/lib/content/types.ts`), not application code. A routing table
  blurs that line back together.

`content/curriculum/modules.ts`'s `lessonRangeHint` looks similar to a
routing table but isn't one: it's read only by `scripts/new-lesson.ts` as a
scaffolding suggestion, never by any page at runtime. See the comment on
`suggestPlacement()` if you're tempted to import it from `src/app`.

## Why filesystem content, not a CMS

The brief explicitly says "don't over-engineer authentication initially"
and "don't create unnecessary backend infrastructure." For a single-author
course where lessons are written with Claude Code, a CMS adds an admin UI,
a database, and a sync step with no corresponding benefit — Git already
gives version history, diffs, and review. `src/lib/content/lessons.ts` is
the one seam where this could change later (swap the filesystem reader for
a database query) without touching any page component.

## Progress tracking: the swap point

`src/lib/progress/types.ts` defines a `ProgressStore` interface.
`src/lib/progress/localStorageStore.ts` is the only implementation today,
selected in `src/lib/progress/useProgress.ts` via the `PROGRESS_ADAPTER`
constant. Every dashboard/skill component calls `useProgress()`, never
`localStorageStore` directly. Adding a real backend later means writing one
new file implementing `ProgressStore` and changing one line in
`useProgress.ts` — no component changes.

This is intentionally the only piece of "fake-looking" data in the app,
and it's labeled as such everywhere it's shown (`/progress`, `/skills`) —
see the brief's "never use fake progress statistics without labeling them."
Course-structure data (lesson counts, module coverage) is never fake; it's
always a live read of `content/lessons/`.

## Vocabulary index: derived, not hand-maintained

`/vocabulary` doesn't come from a separate vocabulary data file. It's built
by `src/lib/content/vocabulary.ts` scanning every published lesson's raw
MDX for `<Vocabulary word="..." meaning="..." .../>` tags. An author writes
the tag once, in the lesson where the word is introduced, and the index —
including "appears in Lesson N, Lesson M" — updates automatically. See
CONTENT_GUIDE.md for the tag's exact shape (plain string attributes; it's a
regex scan, not a full MDX parse, by design — pulling in a full AST parser
for one feature wasn't worth the dependency weight at this stage).

## Rendering pipeline

`src/app/lessons/[number]/page.tsx` is the whole path:
`getLessonByNumber()` (fs + gray-matter + Zod, in `src/lib/content/lessons.ts`)
→ `extractToc()` for the sidebar (`src/lib/content/toc.ts`, using the same
`github-slugger` algorithm as the `rehype-slug` plugin so anchor links
match) → `<MDXRemote>` from `next-mdx-remote/rsc` with the component map in
`src/components/content/mdx-components.tsx`.

`generateStaticParams` on that page (and on `/levels/[level]` and
`/modules/[module]`) statically generates a route per published lesson at
build time — this is what keeps hundreds of lessons fast (no per-request
filesystem scan in production; see the brief's performance section on
"85 → 150 → 300 → 500+ lessons").

## Search

`/api/search` is a route handler that calls `getPublishedLessons()` and
returns a flat JSON array — no build-time search index file to regenerate.
`SearchDialog` fetches it once when opened and filters client-side with
FlexSearch. This trades a small amount of payload size (fine at hundreds of
lessons; would need revisiting well past that) for zero index-maintenance
steps, which matters more given how often content changes early on.

## Design tokens

Colors live as CSS custom properties in `src/app/globals.css`
(`--brand-primary` / `--brand-accent`, the port navy/orange from the
project's global style guide), redefined under `.dark`, and exposed to
Tailwind via `@theme inline`. Dark mode uses `next-themes`' class strategy
(`.dark` on `<html>`), not `prefers-color-scheme` alone, so the toggle in
the header actually overrides the OS setting.

## What's deliberately not built yet (see brief §45, Phase 2+)

Quizzes/exercises, flashcard spaced review, sentence/paragraph/argument
analyzers, and any backend (auth, real database, AI features). The content
schema (`src/lib/content/types.ts`) and MDX component list are written so
none of these require a schema migration to add — they're additive.
