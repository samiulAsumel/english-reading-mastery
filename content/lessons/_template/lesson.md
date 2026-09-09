---
id: "lesson-000"
number: 0
slug: "lesson-template-reference"
title: "Lesson Template — Reference Only"
description: "Every custom block available to lesson authors, with example usage, and this course's locked structural conventions. Not a real lesson."
level: "foundation"
module: "sentence-foundations"
estimatedTime: "60 min"
difficulty: "beginner"
prerequisites: []
skills: ["sentence-structure", "phrases-and-clauses", "grammar-mechanics"]
objectives:
  - "See every available content block in one place"
  - "See this course's fixed lesson skeleton in one place"
  - "Objectives arrays should always contain exactly 5 items"
  - "Skills should always be exactly these 3, in this order"
  - "Tags should never repeat a skill slug"
status: "draft"
tags: ["reference", "template", "reading-strategy"]
---

<!--
  This folder is intentionally named "_template", not "lesson-000" — the
  content loader only recognizes folders matching lesson-NNN, so this file
  is never built into a real page. Copy it (or run `npm run new:lesson`,
  which generates a slimmer version of the same skeleton) when starting a
  new lesson. See CONTENT_GUIDE.md for the block-type authoring guide, and
  its "Course-specific structure conventions" section for the rules this
  template encodes.

  Locked skeleton, in this order: Introduction -> topic sections (never a
  heading followed directly by a block/list with zero connecting prose) ->
  Vocabulary in Context (6-10 ::: vocabulary cards) -> Guided Reading
  Practice (vary the intro line; name what to watch for) -> Golden Rule
  (a portable READING INSTRUCTION, never a restatement of the lesson's own
  example) -> Lesson Summary (vary the opening beyond "Today you
  learned...") -> Practice: Test What You've Learned (5 parts, A-E,
  continuous numbering, vary the "Before you start" line) -> closing
  "Next: Lesson N — Title: one-sentence teaser." paragraph.
-->

## Introduction

Plain paragraphs read like this. Use **bold** for emphasis, `inline code`
for terms you want set in monospace, and `==text==` for an inline
collocation highlight, like ==mitigate risk==.

Learning objectives come from frontmatter (`objectives:`), not a content
block — they render automatically at the top of the lesson page.

## Core Concept

::: concept
The main idea of the lesson, explained plainly before the detailed
explanation below. Add `title="..."` to the opening line to override the
default heading, e.g. `::: concept title="Custom Title"`.
:::

## Detailed Explanation

Regular prose, headings (`##`, `###`), lists, tables, and blockquotes all
render with the platform's reading typography automatically — no extra
markup needed. Every section needs at least a sentence or two of real
prose around any block or list — a heading followed immediately by a
bare list with nothing else reads as a glossary entry, not teaching.

### A subsection

Subsections show up in the right-hand "On this page" navigation just like
top-level `##` sections.

## Examples

::: example
A concrete example that makes the concept click. Realistic domains
(technology, business, logistics, ports) are preferred over invented ones.
:::

## Vocabulary in Context

::: vocabulary word="mitigate" pos="verb" meaning="to reduce the severity or impact of something" example="The new policy is designed to mitigate risk."
:::

Aim for 6-10 vocabulary cards per lesson. Reusing an earlier lesson's word
with a new collocation is fine and often useful — say so explicitly
("Connecting back to Lesson N:") rather than silently re-teaching it.

## Guided Reading Practice

Read the paragraph once, slowly — vary this intro line lesson to lesson,
and name what the reader should watch for this time (a tense, a
connector, a clause type) rather than repeating a generic instruction
verbatim every time.

> A short reading passage goes here as a blockquote, then a sentence-by-
> sentence decode below it.

## Reading Strategy

::: note
A short strategic tip for applying this lesson while reading real text.
:::

## Common Mistakes

::: warning
A frequent misunderstanding learners have at this stage, and how to avoid
it. Not every lesson needs one of these — use it only when a genuine,
common confusion exists.
:::

## Master Framework

::: framework
- Claim
- Evidence
- Conclusion
:::

Every lesson should have at least one `::: framework` block somewhere —
it's the clearest way to hand the reader a repeatable step sequence.

## Golden Rule

::: golden
One memorable, quotable sentence that captures the lesson's core reading
rule. This must be an instruction about *how to read*, never a summary of
whatever the lesson's own example sentence happened to say.
:::

## Lesson Summary

A short recap of what was covered, in plain prose. Vary the opening
sentence — not every lesson's summary needs to start with "Today you
learned..." — and vary how the final, most-important point is
introduced.

::: important
Use this for anything the reader must not skim past.
:::

## Practice: Test What You've Learned

Work through every question yourself before checking anything.

::: important title="Before you start"
Vary this reminder's exact wording lesson to lesson; the underlying point
— don't translate the questions with a tool, a wrong answer is useful
information — stays the same.
:::

### Part A — Identify

1. First practice item.

### Part B — Explain

2. Second practice item, continuing the numbering.

### Part C — Decode

3. Third practice item.

### Part D — Create

4. Fourth practice item.

### Part E — Reading

5. Fifth practice item.

Aim for 5 parts (A-E) and roughly 12-18 total items, numbered
continuously across parts (never resetting per part).

Next: Lesson N — Title: one-sentence teaser of what's coming and why it
matters. This is the only closing-paragraph form to use — no
"send me your answers" chat-style promise, since this is a static
self-study site with no submission or marking mechanism.
