---
id: "lesson-000"
number: 0
slug: "lesson-template-reference"
title: "Lesson Template — Reference Only"
description: "Every custom block available to lesson authors, with example usage. Not a real lesson."
level: "foundation"
module: "sentence-foundations"
estimatedTime: "5 min"
difficulty: "beginner"
prerequisites: []
skills: ["sentence-structure"]
objectives:
  - "See every available content block in one place"
status: "draft"
tags: ["reference"]
---

<!--
  This folder is intentionally named "_template", not "lesson-000" — the
  content loader only recognizes folders matching lesson-NNN, so this file
  is never built into a real page. Copy it (or run `npm run new:lesson`,
  which generates a slimmer version of the same skeleton) when starting a
  new lesson. See CONTENT_GUIDE.md for the authoring guide this backs.
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
markup needed.

### A subsection

Subsections show up in the right-hand "On this page" navigation just like
top-level `##` sections.

## Examples

::: example
A concrete example that makes the concept click. Realistic domains
(technology, business, logistics, ports) are preferred over invented ones.
:::

## Vocabulary

::: vocabulary word="mitigate" pos="verb" meaning="to reduce the severity or impact of something" example="The new policy is designed to mitigate risk."
:::

## Reading Strategy

::: note
A short strategic tip for applying this lesson while reading real text.
:::

## Common Mistakes

::: warning
A frequent misunderstanding learners have at this stage, and how to avoid it.
:::

## Master Framework

::: framework
- Claim
- Evidence
- Conclusion
:::

## Golden Rule

::: golden
One memorable, quotable sentence that captures the lesson's core rule.
:::

## Lesson Summary

A short recap of what was covered, in plain prose.

::: important
Use this for anything the reader must not skim past.
:::
