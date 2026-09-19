# Content Guide — Adding a Lesson

This is the exact workflow for adding a lesson (88, or any future number)
with Claude Code, or by hand.

> Three parallel content collections exist: **reading**
> (`content/lessons/`, this guide's default examples), **writing**
> (`content/writing/`), and **speaking** (`content/speaking/`). Same file
> shape throughout. Writing and speaking are paired 1:1 by number with
> reading — writing-NNN and speaking-NNN practice exactly what reading
> lesson-NNN just taught (lesson 0, course orientation, is exempt — it has
> no pair). A plain `npm run new:lesson` scaffolds all three files at once
> for this reason; pass `--no-pair` to scaffold only the reading lesson,
> or use `npm run new:writing` / `npm run new:speaking` with `--number` to
> fill a single missing pair by hand. See ARCHITECTURE.md for why the
> pairing is a numbering convention plus this scaffold, not a routing
> table, and the writing/speaking-only block types further down.

> This guide covers the *mechanics* — file structure, frontmatter,
> available blocks. For the *voice* the lesson body should be written in
> (and the English/Bangla language rule), see [`CLAUDE.md`](./CLAUDE.md)
> first — raw material the user sends is never uploaded as-is.

## The one-command path

```bash
npm run new:lesson -- --title "Evidence Boundaries and Calibrated Conclusions"
```

This:

1. Reads every folder under `content/lessons/` to find the highest existing
   lesson number and uses `number + 1`.
2. Guesses a `level` and `module` from `content/curriculum/modules.js`'
   `lessonRangeHint`s (override with `--level <slug> --module <slug>` if the
   guess is wrong — the ranges are approximate, not authoritative).
3. Writes `content/lessons/lesson-NNN/lesson.md` with frontmatter filled in
   and every content block stubbed out with `TODO`s, `status: "draft"`.
4. Scaffolds the matching `content/writing/writing-NNN/lesson.md` and
   `content/speaking/speaking-NNN/lesson.md` at the same number, each
   linking back to the reading lesson and placed via that track's own
   `suggestPlacement()` — skipped automatically for number 0, and skippable
   entirely with `--no-pair`.

Then, for each of the (up to three) files it created:

1. Open the file and replace every `TODO` with real content — for the
   writing/speaking pair, the task must require *producing* or *speaking*
   the exact structure the reading lesson just taught, not generic
   practice at that level.
2. Set `prerequisites` (the reading collection's convention is the full
   cumulative array of every earlier number, not just `n-1` — check a
   recent lesson for the pattern), `skills` (see `content/curriculum/skills.js`,
   `writing-skills.js`, or `speaking-skills.js` for the valid slugs per
   collection), `objectives`, and `tags`.
3. Change `status` to `"published"` when it's ready to appear in navigation,
   search, and the lessons index.
4. `npm run build` (runs `validate:content` first automatically — it also
   warns, without failing the build, about any published reading lesson
   still missing its writing or speaking pair).

That's it. Each item automatically:

- appears in its collection's index (`/lessons/`, `/writing/`, or
  `/speaking/`), its level page, and (reading only) its module page
- gets previous/next navigation (by number, among published items in that
  collection)
- cross-links to/from its pair automatically once both exist and are
  published (a "Practice this lesson" bar on the reading page, a back-link
  on the writing/speaking page) — no manual wiring needed
- is searchable (title, description, tags, skills) via `/search-index.json`
- has any `::: vocabulary` blocks it uses aggregated into `/vocabulary/`
- is included in `sitemap.xml`
- gets a real static page (e.g. `/lessons/<number>/index.html`) with SEO
  metadata from its `title`/`description`

No other file needs editing. If you find yourself editing a template
function or a routing bit of `scripts/build.js` to "add" a lesson, stop —
that's a sign something is wrong with the content, not a normal step.

## Doing it by hand

Copy `content/lessons/_template/lesson.md` (it demonstrates every content
block) to `content/lessons/lesson-NNN/lesson.md`, using a zero-padded
3-digit number, and fill in the frontmatter yourself:

```yaml
---
id: "lesson-086"
number: 86
slug: "evidence-boundaries-and-calibrated-conclusions"
title: "Evidence Boundaries and Calibrated Conclusions"
description: "One to two sentences — shows up in search results and social previews."
level: "c2-mastery"          # must match a slug in content/curriculum/levels.js
module: "book-level-reasoning"  # must match a slug in content/curriculum/modules.js,
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

## Writing the body: Markdown + custom blocks

The body is plain Markdown (headings, **bold**, lists, links, tables,
blockquotes, `` `code` `` all work as-is) plus a small custom block syntax
for the platform's special content types:

```markdown
::: TYPE key="value" key2="value2"
Body content, treated as Markdown (except `vocabulary`, which is
self-contained in its attributes and needs no body).
:::
```

See `content/lessons/_template/lesson.md` for one of every block in
context. The block types:

| Type | Renders as | Notes |
|---|---|---|
| `::: concept` | "Core Concept" callout | optional `title="..."` overrides the heading |
| `::: example` | "Example" callout | optional `title="..."` |
| `::: important` | "Important" callout | optional `title="..."` |
| `::: warning` | "Common Mistake" callout | optional `title="..."` |
| `::: note` | Reading-strategy callout | optional `title="..."` |
| `::: golden` | Golden Rule callout | body rendered as one inline sentence, no paragraph wrapping |
| `::: framework` | Vertical step diagram with arrows | body is a Markdown list (`- Step text`); each `- ` line becomes one box |
| `::: vocabulary word="..." pos="..." register="..." meaning="..." collocation="..." example="..."` | Vocabulary card | self-closing (empty body between the `:::` lines is fine); attributes are plain strings, no Markdown inside them; `register` and `collocation` are optional but expected on every new card — see "Vocabulary card standard" below |
| `::: prompt words="..." time="..." register="..."` | The task itself, as a callout with meta chips | used on writing/speaking tasks; each attr is a full phrase already ("5 sentences", "60-90 words", "8s") — don't add a unit again in the content, the chip renders the attribute verbatim |
| `::: draft placeholder="..."` | A blank `<textarea>` for the learner to write in | self-closing; writing tasks only. `placeholder` must be a single line (attribute values can't span multiple lines) — use `/` to separate ideas within it if needed |
| `::: model-answer label="..."` | Collapsible answer reveal (`<details>`) | same markup/CSS as the reading course's hand-written practice-question answers |
| `::: rubric` | "Self-Check" callout, self-assessment only | body is a Markdown list; no persisted/interactive checkboxes yet — see ARCHITECTURE.md |
| `::: timer seconds="10" label="..."` | Countdown widget | self-closing; speaking tasks — the anti-translation mechanic (see ARCHITECTURE.md) |
| `::: shadow rate="0.9"` | Text-to-speech shadowing widget | body is the sentence to speak (plain text, one line or short paragraph); `rate` is optional, defaults to 0.9 |
| `::: record label="..."` | Self-recording widget (record + playback) | self-closing; audio never leaves the browser — see ARCHITECTURE.md |

Two more things baked into the Markdown itself (no block needed):

- `` ==text== `` → highlighted inline "collocation" styling, e.g. `mitigate ==risk==`.
- `## Heading` and `### Subheading` automatically get an `id` and show up
  in the lesson's "On this page" sidebar — no extra markup.

`objectives:` (the "By the end of this lesson…" list) comes from
frontmatter, not a content block — it renders automatically above the body.

### Adding a new block type

Register it in `scripts/lib/content.js`'s `renderBlock()`/`CALLOUT_DEFAULTS`
(or write a dedicated `render<Type>()` function next to `renderFramework`/
`renderGolden` for anything that isn't a simple callout), style it in
`src/styles/main.css`, and add its row to the table above. All three need
to move together or content authoring quietly breaks.

## What validation checks

`npm run validate:content` (and therefore `npm run build`) fails the build
if:

- a lesson folder name doesn't match `lesson-NNN`, or doesn't match its own
  frontmatter `number`
- frontmatter is missing a required field, has the wrong type, or has a
  malformed `slug`/`difficulty`/`status` (checked in
  `scripts/lib/content.js`'s `validateFrontmatter()`)
- `level` or `module` isn't defined in `content/curriculum/`, or the module
  belongs to a different level than the lesson declares
- two lessons share a `number`, `slug`, or `id` (scoped per collection —
  `lesson-001` and `writing-001` sharing a number is not a collision)
- a `prerequisites` entry references a number that doesn't exist yet
  *within that same collection*
- the Markdown body is empty

Fix the reported file and re-run — the error message names the exact file
and field.

Separately, it **warns without failing the build** when a published
reading lesson numbered 1+ has no matching writing-NNN and/or
speaking-NNN — a nudge to close the gap, not a hard requirement while a
pair is still being authored.

## Preserving existing content

Never renumber an existing lesson, merge two lessons, or summarize a
lesson's content when editing it. If you notice a contradiction or
duplicate concept between lessons, flag it in the PR/commit description
rather than silently deleting either one — see the root `CLAUDE.md` /
project instructions for the full rule.

## Course-specific structure conventions

Beyond the block-type mechanics above, every lesson in this course
(Level 1 Foundation onward) follows one locked skeleton. `content/lessons/_template/lesson.md`
demonstrates it directly — treat deviations from it as bugs to fix, not
stylistic variation.

**Frontmatter**
- `skills`: always exactly `["sentence-structure", "phrases-and-clauses", "grammar-mechanics"]`, in that order.
- `objectives`: always exactly 5.
- `tags`: 4-6 kebab-case tags; never reuse a skill slug as a tag.
- `estimatedTime`: should track the file's actual length/density, not be picked arbitrarily.

**Vocabulary card standard**

Every card must read like an entry from a good learner's dictionary, not a
classroom exercise:

- `word` — a real, commonly used professional word or phrase. A term coined
  by the course itself (e.g. "removal test") is allowed only if the lesson
  body actually uses it, and then it carries `register="course term"`.
- `pos` — part of speech.
- `register` — `formal`, `neutral`, `technical`, or `course term`.
- `meaning` — one line, plain words, no jargon. A Bangla gloss goes in
  parentheses and only for the word itself, e.g. `(প্রশমিত করা)`.
- `collocation` — two or three natural pairings, comma-separated.
- `example` — one realistic sentence from a workplace, report, news, policy,
  port/logistics or IT setting. Never a bare textbook sentence like
  "I understand the problem."

**Body, in this order**
1. `## Introduction`
2. Topic sections. Never let a heading run straight into a block or bare
   list with zero connecting prose — that reads as a glossary entry, not
   teaching.
3. `## Vocabulary in Context` (this exact heading) — 6-10 `::: vocabulary`
   cards. Reusing an earlier word with a new collocation is fine; say so
   explicitly with `Connecting back to Lesson N:` rather than silently
   re-teaching it as if new.
4. `## Guided Reading Practice` (this exact heading, singular — never
   split into "...Practice 1" / "...Practice 2"). Vary the intro line
   every lesson and name what to watch for; don't repeat a generic
   "read the paragraph, no dictionary" instruction verbatim lesson after
   lesson.
5. `## Golden Rule` (this exact heading, not "Today's Mental Model" or
   similar). The `::: golden` block must be a portable *reading
   instruction* — never a restatement of whatever the lesson's own worked
   example happened to conclude.
6. `## Lesson Summary` — vary the opening beyond "Today you learned...".
7. `## Practice: Test What You've Learned` (this exact heading). 5 parts
   (`### Part A` through `### Part E`), numbered continuously across
   parts (never resetting), roughly 12-18 items total. Vary the
   "Before you start" reminder's wording each time.
8. Closing paragraph — exactly one form: `Next: Lesson N — Title:
   one-sentence teaser.` No "send me your answers, I will mark them"
   promise — this is a static self-study site with no submission or
   marking mechanism, so that promise doesn't match how the site works.

Every lesson should contain at least one `::: framework` block and
exactly one `::: golden` block. `::: warning` is optional — use it only
where a genuine, common learner confusion exists, not as decoration.
