---
id: "writing-000"
number: 0
slug: "writing-template-reference"
title: "Writing Task Template — Reference Only"
description: "Every custom block available to writing-task authors, with example usage, and this track's locked structural conventions. Not a real task."
level: "foundation"
module: "sentence-foundations-writing"
estimatedTime: "15 min"
difficulty: "beginner"
prerequisites: []
skills: ["sentence-accuracy"]
objectives:
  - "See every available writing-task block in one place"
  - "See this track's fixed skeleton in one place"
  - "Objectives arrays should always contain exactly 3 items"
status: "draft"
tags: ["reference", "template"]
---

<!--
  This folder is intentionally named "_template", not "writing-NNN" — the
  content loader only recognizes folders matching writing-NNN, so this
  file is never built into a real page. Copy it (or run `npm run
  new:lesson`, which now scaffolds writing-NNN automatically alongside
  lesson-NNN) when starting a new writing task. See CONTENT_GUIDE.md for
  the block-type authoring guide.

  Writing tasks are paired 1:1 with reading lessons by number: writing-NNN
  is the task where the learner PRODUCES the exact structure lesson-NNN
  just taught them to read. The Introduction must name and link the
  paired reading lesson.

  Locked skeleton, in this order: Introduction (names/links the paired
  reading lesson) -> 1-2 short teaching sections (::: concept / :::
  example, re-stating the rule for writing rather than reading) -> Your
  Turn (::: prompt + a self-closing ::: draft) -> Vocabulary in Context
  (2-3 ::: vocabulary cards) -> Model Answer (::: model-answer) ->
  Self-Check (::: rubric, 3-4 bullets) -> closing "Next: Writing N+1 —
  Title: one-sentence teaser." paragraph.
-->

## Introduction

Open by naming what [Lesson N](/lessons/N/) just taught and what this
task asks the learner to *produce* with it — writing is reading's mirror
image: reading decodes a structure, writing builds one.

## The Rule, for Writing

::: concept
Restate the grammar/structure rule from the paired reading lesson, but
angled toward production: not "notice this when you read it" but "here
is exactly how to build it yourself."
:::

::: example
One worked example showing the rule applied correctly in a sentence or
two, ideally in a realistic domain (technology, business, logistics,
ports) rather than an invented one.
:::

## Your Turn

::: prompt words="..." time="..."
The task itself. Each attribute is a full phrase already ("5 sentences",
"60-90 words", "10 min") — don't add a unit again in the prompt body.
State exactly what to write and what rule from the paired lesson it must
demonstrate.
:::

::: draft placeholder="A short hint of how to start, one line, use / to separate ideas if needed"
:::

## Vocabulary in Context

::: vocabulary word="..." pos="..." register="formal|neutral|technical" meaning="one-line meaning (বাংলা gloss)" collocation="common pairing, common pairing" example="one realistic workplace sentence."
:::

Aim for 2-3 vocabulary cards, directly useful for this specific task.

## Model Answer

::: model-answer
A complete, correct worked answer to the prompt above, demonstrating the
rule cleanly.
:::

## Self-Check

::: rubric
- A question checking the specific rule this task targets.
- A question checking a common mistake at this level.
- A question checking the writing was composed directly in English, not
  translated from Bangla first.
:::

Next: Writing N+1 — Title: one-sentence teaser of what's coming and why
it matters. This is the only closing-paragraph form to use — no
"send me your answers" chat-style promise, since this is a static
self-study site with no submission or marking mechanism.
