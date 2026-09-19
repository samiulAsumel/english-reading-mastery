---
id: "speaking-000"
number: 0
slug: "speaking-template-reference"
title: "Speaking Drill Template — Reference Only"
description: "Every custom block available to speaking-drill authors, with example usage, and this track's locked structural conventions. Not a real drill."
level: "foundation"
module: "sentence-foundations-speaking"
estimatedTime: "10 min"
difficulty: "beginner"
prerequisites: []
skills: ["instant-naming"]
objectives:
  - "See every available speaking-drill block in one place"
  - "See this track's fixed skeleton in one place"
  - "Objectives arrays should always contain exactly 3 items"
status: "draft"
tags: ["reference", "template"]
---

<!--
  This folder is intentionally named "_template", not "speaking-NNN" —
  the content loader only recognizes folders matching speaking-NNN, so
  this file is never built into a real page. Copy it (or run `npm run
  new:lesson`, which now scaffolds speaking-NNN automatically alongside
  lesson-NNN) when starting a new speaking drill. See CONTENT_GUIDE.md
  for the block-type authoring guide.

  Speaking drills are paired 1:1 with reading lessons by number:
  speaking-NNN is the drill where the learner SAYS the exact structure
  lesson-NNN just taught them to read, live and under a timer — the
  anti-translation mechanic. The Introduction must name and link the
  paired reading lesson.

  Locked skeleton, in this order: Introduction (names/links the paired
  reading lesson) -> Shadow the Model (one or two ::: shadow blocks, with
  a prose line between/after naming what to listen for) -> Your Turn
  (::: prompt + a self-closing ::: timer, "time" and "seconds" attributes
  must match) -> Record Yourself (::: record) -> Model Answer (:::
  model-answer, noting there is usually no single correct reply) ->
  Vocabulary in Context (2-3 ::: vocabulary cards) -> Self-Check (:::
  rubric, 3-4 bullets) -> closing "Next: Speaking N+1 — Title:
  one-sentence teaser." paragraph.
-->

## Introduction

Open by naming what [Lesson N](/lessons/N/) just taught and what this
drill asks the learner to *say* with it, live — no time to translate from
Bangla first, and no script to read from.

## Shadow the Model

::: shadow rate="0.9"
A short native-paced sentence or exchange that demonstrates the paired
lesson's structure spoken naturally.
:::

Listen once all the way through without speaking, then shadow it,
matching rhythm and stress — name specifically what to listen for this
time (which words run together, which word carries the stress) rather
than a generic instruction.

## Your Turn

::: prompt time="...s"
The scenario. State exactly what to say and what structure from the
paired lesson it must demonstrate. When the timer starts, speak
immediately — no planning pause.
:::

::: timer seconds="..." label="..."
:::

## Record Yourself

::: record label="Say your answer out loud, then record it and compare against the model."
:::

## Model Answer

::: model-answer
A natural spoken answer to the prompt. Note explicitly when there is no
single correct reply, and name what actually matters (immediacy, rhythm,
correct structure) instead.
:::

## Vocabulary in Context

::: vocabulary word="..." pos="..." register="formal|neutral|technical" meaning="one-line meaning (বাংলা gloss)" collocation="common pairing, common pairing" example="one realistic workplace sentence."
:::

Aim for 2-3 vocabulary cards, directly useful for this specific drill.

## Self-Check

::: rubric
- A question checking the specific structure this drill targets.
- A question checking the reply was immediate, with no planning pause.
- A question checking rhythm/stress matched the shadowed model.
:::

Next: Speaking N+1 — Title: one-sentence teaser of what's coming and why
it matters. This is the only closing-paragraph form to use — no
"send me your answers" chat-style promise, since this is a static
self-study site with no submission or marking mechanism.
