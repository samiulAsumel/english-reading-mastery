---
id: "writing-058"
number: 58
slug: "explaining-a-mechanism"
title: "Explaining a Mechanism"
description: "Show not just what happens, but exactly how a cause produces its effect — naming the intermediate steps with by/through/via, the writing side of Lesson 58's mechanism-reading strategy."
level: "advanced"
module: "technical-conceptual-writing"
estimatedTime: "20 min"
difficulty: "advanced"
prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
skills: ["technical-writing"]
objectives:
  - "State a cause and effect, then add the intermediate mechanism connecting them"
  - "Use a mechanism marker (by, through, via) instead of leaving the pathway unstated"
  - "Distinguish an immediate trigger from a deeper root cause where both are relevant"
tags: ["mechanism", "causal-chains", "advanced-writing"]
status: "published"
---

## Introduction

[Lesson 58](/lessons/58/) taught you the gap between stating that
something happened and explaining how it happened — the difference between
"automation reduced errors" and the actual mechanism that produced that
result. Writing a mechanism explanation means supplying that missing middle
step yourself, instead of leaving a reader to assume it.

## The Rule, for Writing

::: concept
A weak explanation states only cause and effect: "Training improved
performance." A strong one names the mechanism connecting them, using a
marker like by, through, or via, and — where it matters — separates the
immediate trigger of a problem from its deeper root cause instead of
treating them as the same thing.
:::

::: example
The new inspection checklist reduced shipment delays by catching
documentation errors before a container reached the gate, rather than after
it was already queued for loading. The delay's trigger was usually a missing
customs form; the deeper root cause was that the old process only checked
documents once the container had already arrived at the terminal.
:::

## Your Turn

::: prompt words="110-160 words" time="20 min"
Explain a mechanism you understand well — how a tool, policy, or process
actually produces one of its effects. State the cause and the effect, then
add the mechanism using "by," "through," or "via" to name the intermediate
step. If a trigger and a root cause are both relevant, name both separately.
:::

::: draft placeholder="State the cause and effect / then the mechanism using 'by/through/via' / then, if relevant, the trigger vs. the root cause"
:::

## Vocabulary in Context

::: vocabulary word="mechanism" pos="noun" meaning="the intermediate process through which a cause actually produces its effect — কার্যপ্রণালী" example="The mechanism behind the cost reduction was fewer manual re-entries, not automation in the abstract."
:::

::: vocabulary word="via" pos="preposition" meaning="through, or by means of, a specific stated pathway — মাধ্যমে" example="The alert reaches the on-call engineer via an automated paging system."
:::

::: vocabulary word="root cause" pos="noun phrase" meaning="the deeper, underlying condition responsible for a problem, distinct from its immediate trigger — মূল কারণ" example="The trigger was a failed login; the root cause was an expired security certificate nobody had renewed."
:::

## Model Answer

::: model-answer
The new alerting system cut server downtime by notifying engineers within
thirty seconds of a failure, rather than waiting for a customer complaint to
surface the problem. The mechanism runs through automated health checks:
every server reports its status every ten seconds, and a missed report
triggers an immediate page to the on-call engineer. The trigger for most
incidents was a single overloaded process; the deeper root cause was that
the servers had never been configured with automatic resource limits, so one
runaway process could exhaust memory for the whole machine. Fixing the alert
sped up the response; fixing the resource limits addressed the root cause
itself.
:::

## Self-Check

::: rubric
- Did you state the cause and effect before explaining the mechanism?
- Did you use "by," "through," or "via" to name the intermediate step, not leave it implied?
- If relevant, did you separate the trigger from the root cause rather than treating them as one thing?
- Did you avoid inventing intermediate steps you don't actually know are true?
:::

Next: Writing 59 — Using an Example as Evidence: showing exactly what one
case proves, and being honest about what it doesn't.
