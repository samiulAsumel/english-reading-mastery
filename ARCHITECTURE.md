# Architecture

## Stack

Pure static HTML/CSS/vanilla JS at runtime — no framework ships to the
browser. A small Node build script (`scripts/build.js`) generates it from
Markdown lesson files. Two runtime dependencies: `gray-matter`
(frontmatter parsing) and `marked` (Markdown → HTML). No bundler, no
TypeScript, no CSS framework, no client-side router.

This is a rebuild of an earlier Next.js/React/TypeScript version of this
same project (see git history) — the user explicitly wanted pure
HTML/CSS/JS instead. The content model and curriculum taxonomy carried
over unchanged; only the rendering layer changed.

## Content vs. curriculum vs. rendering — three separate systems

This is the load-bearing decision in the whole codebase, so it's worth
being explicit about the boundary:

1. **`content/lessons/lesson-NNN/lesson.md`** — one file per lesson: its
   own frontmatter (metadata) and Markdown+custom-block body (the actual
   teaching content). This is the only place lesson content lives.
2. **`content/curriculum/{levels,modules,skills}.js`** — the *taxonomy*
   lessons plug into. A level or module doesn't know which lessons belong
   to it; a lesson declares its own `level`/`module`/`skills` in
   frontmatter. These files only define what each level/module/skill means.
3. **`scripts/lib/templates.js` + `scripts/lib/pages.js`** — presentation.
   Functions that read lessons and curriculum data through
   `scripts/lib/content.js` and return HTML strings; they never contain
   lesson content themselves.

The reason this split matters: **nothing in `scripts/lib/pages.js` or
`scripts/build.js` hard-codes a lesson number, title, or count.**
`loadLessons()` reads whatever is on disk. Add lesson 86 and every page
that lists lessons, every prev/next link, the search index, the vocabulary
index, and the sitemap regenerate themselves on the next `npm run build` —
because they were never told about lesson 85 specifically in the first
place. This is what makes "add lesson 86" a one-file change instead of a
many-file change (see CONTENT_GUIDE.md).

## Why no lesson-number routing table

It would be easy to write a single big `LESSONS = { 1: {...}, 2: {...} }`
object and index everything off it. Don't do this — it's explicitly the
anti-pattern the project brief calls out ("never hard-code all lessons into
one giant file"). Two concrete reasons it breaks down:

- **Merge conflicts.** Every new lesson would touch the same file/object
  that every other lesson touches. With one file per lesson, adding lesson
  86 touches exactly one new file.
- **It re-couples content and code.** The whole point of the frontmatter +
  Markdown split is that a lesson is *data*, checked by a schema
  (`validateFrontmatter()` in `scripts/lib/content.js`), not build code.
  A routing table blurs that line back together.

`content/curriculum/modules.js`'s `lessonRangeHint` looks similar to a
routing table but isn't one: it's read only by `scripts/new-lesson.js` as a
scaffolding suggestion, never by the build/render pipeline. See the
comment on `suggestPlacement()` if you're tempted to import it from
`scripts/build.js` or `scripts/lib/pages.js`.

## Why a generator, not a CMS or a client-side SPA

Three options were on the table: (1) fully hand-written HTML per lesson,
(2) a client-side single-page app that fetches lesson content at runtime,
(3) a static generator producing real per-lesson HTML at build time. (3)
won because:

- **vs. hand-written HTML:** with hundreds of lessons planned, the
  header/nav/footer/search-dialog markup repeated in every file would need
  to be kept in sync by hand across every one of them. A shared
  `layout()` function in `templates.js` means changing the header once
  changes it everywhere on the next build.
- **vs. a client-side SPA:** search engines and no-JS readers would see an
  empty shell per lesson instead of real content, and every lesson visit
  would show a loading flash while JSON is fetched and rendered. Real
  per-lesson `.html` files avoid both — this is genuinely "pure HTML," not
  JS pretending to be a page.

The generator itself (`scripts/build.js` and friends) never ships to the
browser — it's dev-time tooling, same category as a compiler.

## Content parsing pipeline

`scripts/lib/content.js`'s `renderLessonBody()`: the raw Markdown body is
scanned line-by-line for `::: type ... :::` blocks (regex
`BLOCK_OPEN_RE`); each one is rendered immediately by its own function
(`renderCallout`/`renderGolden`/`renderFramework`/`renderVocabulary`) and
replaced in the source with a placeholder (`<div data-erm-block="N">`) —
a raw HTML block that `marked` passes through untouched. The remaining
prose runs through a `Marked` instance with a custom `heading` renderer
that stamps `id`s using `baseSlugify()`. After `marked.parse()`, the
placeholders are string-replaced with the pre-rendered block HTML.

`extractToc()` (used to build the sidebar) walks the same raw body for
`##`/`###` lines and slugifies them with the identical `createSlugger()`
function used inside the heading renderer, via the same de-duplication
logic — so TOC links and actual heading `id`s never drift apart, without
needing a shared "slugger" npm package.

## Vocabulary index: derived, not hand-maintained

`/vocabulary/` doesn't come from a separate vocabulary data file. It's
built by `build.js`'s `buildVocabulary()`, scanning every published
lesson's raw Markdown for `::: vocabulary word="..." meaning="..." :::`
blocks via `extractVocabularyFromBody()`. An author writes the block once,
in the lesson where the word is introduced, and the index — including
"appears in Lesson N, Lesson M" — regenerates on every build.

## Progress tracking: the swap point

Progress is entirely client-side, in `src/scripts/progress.js`, backed by
`localStorage` (`window.ErmProgress`, mirroring the previous version's
`ProgressStore` interface but as a plain object since there's no
TypeScript here). Three independent pieces of UI hydrate themselves if
their markup is present on the page: the lesson mark-complete button
(`#mark-complete-btn`), the `/progress/` dashboard (`#progress-app`), and
the `/skills/` per-skill bars (`.skill-row[data-skill-lessons]`). Swapping
to a real backend later means replacing the `Store` object's
implementation in that one file — no page-template changes.

This is intentionally the only piece of "fake-looking" data in the app,
and it's labeled as such everywhere it's shown (`/progress/`, `/skills/`)
— see the brief's "never use fake progress statistics without labeling
them." Course-structure data (lesson counts, module coverage) is never
fake; it's always a live build-time read of `content/lessons/`.

## Search

`/search-index.json` is generated at build time from `getPublishedLessons()`
— a flat JSON array, no separate index-build step to remember (it's just
one more thing `build.js` writes). `src/scripts/search.js` fetches it once
when the search dialog (a native `<dialog>` element — Esc-to-close,
`::backdrop`, and modal focus all come free, no ARIA reimplementation
needed) is first opened, and filters it client-side with a small
hand-written scoring function. No search-library dependency.

## Design tokens

Colors live as CSS custom properties in `src/styles/main.css`
(`--brand-primary` / `--brand-accent`, the port navy/orange from the
project's global style guide), redefined for dark mode both via
`prefers-color-scheme` (system default) and `[data-theme="dark"]`/`"light"`
(explicit override, so the toggle always wins over the OS setting). The
toggle itself is `src/scripts/theme.js`; a tiny inline script in
`templates.js`'s `layout()` applies any saved choice before first paint,
so there's no flash of the wrong theme.

`--bg`/`--fg` deliberately diverge from that style guide's pure white
`#ffffff` / `#1f2937` — this course is read for long stretches at a time,
and near-maximum contrast on pure white causes real eye fatigue over a
study session. Both themes are retuned to a softer ~11:1 body-text
contrast (still WCAG AAA) on a warm paper ground in light mode and a
dimmed navy-black in dark mode, while keeping the navy/orange brand hues.
`--brand-accent` and `--brand-accent-strong` are split on purpose:
`--brand-accent` colors graphics (icons, borders, the focus ring — 3:1
floor), while `--brand-accent-strong` is for text-bearing button
backgrounds like `.btn-accent` (4.5:1 floor) — one value can't clear both
bars without either dulling the accent or failing text contrast. The six
semantic callout colors (`--concept-color`, `--example-color`, etc.) are
explicitly re-defined in both dark blocks rather than inherited from
light, since an unadjusted light-mode color can land under the 3:1
minimum against a dark background.

## What's deliberately not built yet (see brief §45, Phase 2+)

Quizzes/exercises, flashcard spaced review, sentence/paragraph/argument
analyzers, and any backend (auth, real database, AI features). The content
schema (`validateFrontmatter()` in `scripts/lib/content.js`) and block
type list are written so none of these require a schema migration to add
— they're additive.
