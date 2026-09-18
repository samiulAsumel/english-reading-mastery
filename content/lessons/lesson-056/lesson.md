---
id: "lesson-056"
number: 56
slug: "advanced-reading-of-data-charts-tables-and-quantitative-arguments"
title: "Advanced Reading of Data, Charts, Tables & Quantitative Arguments"
description: "Why a number is never the argument itself — separating observation from interpretation from causal claim, tracking a percentage's exact denominator, and catching survivorship bias, selection bias, and confounding before accepting a quantitative conclusion."
level: "advanced"
module: "technical-conceptual-reading"
estimatedTime: "120 min"
difficulty: "advanced"
prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55]
skills: ["sentence-structure", "phrases-and-clauses", "grammar-mechanics"]
objectives:
  - "Separate a data observation from the interpretation built on top of it, and that interpretation from a further, stronger causal claim"
  - "Read before-and-after and control-group data critically, checking what else changed over the same period before accepting a causal reading"
  - "Track a percentage claim's exact denominator — 'of these,' stacked percentages, response rate — since the same number can mean very different things depending on what it's a share of"
  - "Recognise trend vocabulary (outlier, anomaly, plateau, peak, trough, volatility) and distinguish a meaningful highest value from the largest increase"
  - "Apply a full quantitative-argument framework — data, measure, baseline, sample, uncertainty, alternative explanations — to judge whether a conclusion actually matches its evidence"
tags: ["quantitative-reasoning", "data-interpretation", "causal-inference", "bias", "denominator-tracking", "academic-english"]
status: "published"
---

## Introduction

Lesson 55 built precise quantitative language: percentages, percentage
points, averages, and chart axes. Today's lesson goes one step
further, into the actual *argument* a number is being used to support.
Understanding "sales increased by 20%" is not the same as understanding
what an author is entitled to conclude from it — and that gap is
exactly what this lesson closes.

## Data Is Not Yet an Argument

::: framework title="Three levels a single number can be pushed through"
- Observation: productivity increased by 25%
- Interpretation: productivity improved after AI adoption
- Causal claim: AI adoption caused the improvement
:::

Each step up this ladder demands more evidence than the one below it.
*Employee productivity increased by 25% after the company introduced
AI tools* is the observation. *AI tools improved employee
productivity* is already an interpretation. *AI adoption caused the
25% improvement* is a full causal claim — and the one an author most
needs to earn, not simply assert.

## "After" Still Doesn't Mean "Because Of"

::: note title="This course's most-repeated warning, now at data scale — see Lessons 29, 32, and 54"
*After the new system was introduced, processing time decreased* tells
you only that the system came first and the decrease came second. It
does not establish that the system *caused* the decrease — something
else may have changed over the same period.
:::

## Before-and-After Data, and What It Doesn't Tell You

::: warning title="A before/after comparison alone rarely settles causation"
| Period | Processing Time |
|---|---|
| Before | 20 min |
| After | 14 min |

You can accurately say *processing time decreased by 30%.* Before
crediting the new system, ask: did workload change? Were employees
retrained? Did staffing increase? Was the measurement method changed?
Was the sample comparable? Did another system change at the same
time?
:::

## Control Groups and the Difference-in-Differences Intuition

::: example title="A comparison group estimates what would have happened anyway"
| Group | Before | After |
|---|---|---|
| New system | 20 | 14 |
| Control | 19 | 18 |

New system improved by 6 minutes; the control group, with no
intervention, still improved by 1 minute on its own. The **additional**
improvement plausibly associated with the treatment is roughly 5
minutes — exactly the difference-in-differences intuition Lesson 46
introduced, now applied directly to reading a data table.
:::

## "Compared With" and Whether the Comparison Is Fair

::: warning title="Check whether the two groups are otherwise comparable"
*Companies using automated systems processed 18% more shipments than
companies using manual systems* compares automated companies against
manual ones — but if automated companies are also larger, richer, more
experienced, or better staffed, the 18% difference may not be about
automation at all.
:::

## Confounding, Revisited

::: concept title="One observed relationship, several possible explanations"
If technology adoption rises alongside productivity, but employee
training and management quality are also rising at the same time, the
real causal picture may branch three ways at once — technology,
training, and management quality all potentially feeding into
productivity independently. *Associated with* signals a relationship
exists; it does not, by itself, tell you which of several possible
causes is responsible.
:::

## "Explains" Is Not "Causes"

::: warning title="A statistical explanation is weaker than it sounds"
*Training explains part of the variation in performance* uses
*explains* in a statistical/explanatory sense. It does not mean
*training directly caused all performance differences* — the exact
strength depends on context, not on the word alone.
:::

## Regression Language: "After Controlling For" and "Holding Constant"

::: important title="Two phrases that sound conclusive but aren't proof of causation"
*After controlling for age, experience, and education, system use
remained associated with higher productivity* means researchers
statistically accounted for those specific listed variables — not
every possible explanation. *Holding other factors constant, system
adoption was associated with a 12% increase in productivity* means the
relationship held up within the model's own measured factors. Neither
phrase guarantees absolute causal certainty; both narrow, but don't
eliminate, the space of alternative explanations.
:::

## Outliers and Anomalies

::: concept title="An unusual point can distort a summary statistic — and deserves a question"
In 10, 11, 12, 13, 14, 100, the value 100 is an **outlier** — it can
inflate the mean, distort a trend, and skew a regression result. An
**anomaly** is an unusual observation relative to an expected pattern:
*monthly sales were stable except for an unusually large spike in
December* — the December spike is anomaly-like, though *outlier* and
*anomaly* aren't perfectly interchangeable across every context. Either
way, an unusual point earns the question: *why is this point
different?*
:::

## Trend vs. Noise

::: example title="Small fluctuations don't cancel an overall direction"
100, 102, 101, 104, 103, 107, 106 still shows an overall **upward
trend** despite small up-and-down fluctuations along the way. Don't
treat every small movement as its own meaningful causal event.
:::

## Volatility

::: important title="Level and variability are two separate properties"
*Prices remained high but showed considerable volatility* separates
**level** (high) from **variability** (also high) — high is not the
same as stable, and volatile doesn't automatically mean either high or
low.
:::

## Plateau, Turning Point, Peak, and Trough

::: framework title="Four shape-words for describing how a trend moves"
- Plateau: growth slows and settles at a relatively stable level
- Turning point: the moment a trend's direction or nature changes ("growth accelerated after 2024")
- Peak: the highest point ("sales reached a peak in July")
- Trough: the lowest point ("demand reached a trough in January")
:::

## Sharp vs. Gradual

::: concept title="Speed and magnitude are two different dimensions"
*Sales rose sharply* signals a fast or large upward movement. *Sales
rose gradually* signals a slow one. Neither word alone tells you which
dimension — speed or size — is actually being described; check the
surrounding context.
:::

## A Logical Order for Describing a Chart

::: framework title="Overall pattern first, exceptions and comparisons last"
- Overall pattern: "overall, sales increased over the period"
- Major change: "the most substantial increase occurred between 2023 and 2024"
- Exception: "however, sales declined slightly in 2025"
- Comparison: "by 2026, sales had exceeded their 2024 level"
:::

::: important title="Don't try to read every number"
Facing a fifty-row table, don't aim to memorize every value. Look
first for the maximum, the minimum, the overall trend, the major
change, any unusual value, the relevant comparison, and the author's
actual conclusion — that's the efficient reading pass.
:::

## Highest Value vs. Largest Increase

::: warning title="These are two different questions about the same data"
| Year | Sales |
|---|---|
| 2022 | 100 |
| 2023 | 120 |
| 2024 | 180 |
| 2025 | 190 |

Highest value: 2025 (190). Largest year-over-year increase: 2024
(+60). *The largest increase occurred in 2024* does **not** mean *2024
had the highest sales* — they're two separate claims about the same
table.
:::

## "Fastest Growth" and Absolute vs. Relative Growth, Recapped

::: note title="Recapping Lesson 55's absolute-vs-relative distinction, applied to growth claims"
*Company A experienced the fastest growth* likely refers to growth
*rate*, not total sales — it doesn't mean Company A had the highest
total. Company A: 100 → 150 (+50 absolute, +50% relative). Company B:
1,000 → 1,200 (+200 absolute, +20% relative). B grew more in absolute
terms; A grew faster proportionally — both statements are true at the
same time, about the same pair of companies.
:::

## Share of a Total: "Accounted For" and "Made Up"

::: important title="A share of a total is not an absolute amount"
*Logistics accounted for 40% of total operating costs* states a
**ratio** (logistics cost ÷ total operating cost), not an absolute cost
figure. *Fuel accounted for 25% of operating expenses* means fuel is
one-quarter of the total. *Made up* works similarly (*software costs
made up 15% of total expenditure*), though *accounted for* tends to
read as the more formal choice.
:::

## Denominator Tracking: Stacked Percentages and "Of These"

::: warning title="The most important skill in this entire lesson"
*60% of employees use system A, and 40% of these users use feature B*
— *these* refers to the 60% group, so feature B's actual share of all
employees is 60% × 40% = **24%**, not 40%. *70% of employees completed
the training. Of these, 80% passed the assessment* — the actual
pass rate across all employees is 0.70 × 0.80 = **56%**, not 80%.
Every time a percentage is applied to "of these" or a similarly
narrowed group, recompute the real denominator before repeating the
number.
:::

## Respectively, In Both Cases, Whereas, Despite, Even Though

::: framework title="Five connectors that map, compare, or set up an unexpected quantitative relationship"
- Respectively: "sales and profit increased by 20% and 10%, respectively" — maps sales→20%, profit→10%, in that order
- In both cases: "processing time decreased in both cases" — direction confirmed for two groups, magnitude not necessarily equal
- Whereas: "System A reduced processing time, whereas System B reduced error rates" — two systems, two different outcome dimensions
- Despite: "despite a 20% increase in workload, processing time remained stable" — an unexpected resilience, not yet a proven cause
- Even though: "even though demand increased, service quality did not decline" — signals the author expected one outcome and observed another
:::

## Data Plus Qualification

::: example title="An overall figure can hide exactly where the real story is"
*Although average processing time decreased by 25%, the reduction was
concentrated among high-volume operations* gives an overall figure
(25%) and then a qualification (concentrated among high-volume
operations) — you cannot conclude that *all* operations improved
equally.
:::

## Why Distribution Matters More Than the Average

::: warning title="The same mean can hide very different underlying realities"
A mean of 10 minutes could come from 5, 5, 5, 5, 30 or from 9, 10, 10,
10, 11 — nearly identical averages, wildly different operational
realities. If **mean** is notably higher than **median** (say, mean =
20, median = 12), that's a signal of a **skewed distribution**, with a
few high values pulling the mean upward — though you can't be fully
certain of the shape without seeing the actual distribution.
:::

## Evaluative Quantifiers: "The Majority" and "Only"

::: important title="A quantifier can carry the author's own evaluation, not just a number"
*The majority of users preferred option A* means over 50% — but
*overwhelming majority* signals much stronger magnitude than a bare
*majority.* *Only 15% of users completed the process* frames 15% as
small or disappointing — compare the neutral *15% of users completed
the process* against the more evaluative *only 15%…* — the same
number, framed differently by one added word.
:::

## Framing Through Data Presentation

::: concept title="Mathematically identical, rhetorically different"
*95% of users succeeded* and *5% of users failed* are mathematically
equivalent statements about the same data, but they foreground
opposite halves of the picture — this is **framing**, and noticing
which half an author chose to lead with is part of critical
quantitative reading.
:::

## Denominator Manipulation and Missing Data

::: warning title="Always ask who or what is actually in the denominator"
*90% of selected users reported satisfaction* sounds strong — but who
are *selected users*? If dissatisfied users were excluded from the
selection, the result can be genuinely misleading. Separately,
*results were based on 70% of the original sample* should prompt: where
did the missing 30% go, and did the people who dropped out differ
systematically from those who stayed? Non-random missingness can bias
a result just as much as a manipulated denominator.
:::

## Response Rate, Survivorship Bias, and Selection Bias

::: important title="Three distinct ways a sample can misrepresent the population it claims to describe"
**Response rate:** *the survey had a response rate of 35%* means 35%
of the invited/eligible population responded — not that 35% of
respondents agreed with something; the denominator here is the invited
population, not the respondents. **Survivorship bias:** studying only
*successful companies that adopted AI* and concluding *AI adoption
leads to business success* ignores companies that adopted AI and later
failed — they're missing from the sample entirely. **Selection bias:**
surveying 100 technology managers and concluding *all workers prefer
AI* generalizes far beyond a sample that was never representative of
"all workers" in the first place.
:::

## Data → Generalization

::: framework title="Each step demands more evidence than the one before it"
- Observed sample
- Sample pattern
- Population claim
- General principle
:::

## Reporting-Verb Strength, Recapped

::: note title="Recapping Lesson 45's reporting-verb ladder, applied to data claims specifically"
*The data suggests that automation may improve efficiency* stacks two
hedges (*suggests* + *may*) — a genuinely cautious claim. *The
experiment demonstrates that…* is stronger wording, but "demonstrates"
being written doesn't automatically make the underlying evidence
design sound — check it anyway. *The data proves that…* is the
strongest claim of the three, and in academic or scientific writing
deserves the sharpest scrutiny: does the evidence actually justify
that level of certainty?
:::

## A Master Quantitative-Argument Framework

::: framework title="Run this on any data-based claim before accepting its conclusion"
- Claim
- What data?
- What measure?
- What baseline?
- What comparison?
- What denominator?
- What sample?
- What trend?
- What uncertainty?
- What alternative explanations?
- Causation or association?
- What qualifications?
- Does the conclusion match the data?
:::

## A Full Worked Example

::: example title="Applying the full framework to one dense paragraph"
**Following the introduction of an automated cargo-tracking system,
average vessel-processing time decreased from 24 minutes to 18
minutes. The authors therefore conclude that automation improved port
efficiency. However, the study covered only three terminals, and cargo
volumes increased substantially during the same period.**

Data: 24 → 18 minutes. Absolute reduction: 6 minutes. Relative
reduction: 25%. Author's claim: automation improved efficiency.
Limitation: only three terminals. Confounding possibility: cargo
volumes rose over the same period. Causal certainty: limited. Better
interpretation: *processing time decreased after automation was
introduced, but the evidence does not establish that automation alone
caused the improvement.*
:::

## A Combined Master Framework

::: framework title="Lessons 55 and 56, assembled into one sequence"
- Data
- Measure
- Unit
- Baseline
- Denominator
- Absolute / relative change
- Percent / percentage point
- Trend
- Distribution
- Outlier / anomaly
- Comparison
- Sample
- Uncertainty
- Observed pattern
- Interpretation
- Association / causation
- Alternative explanations
- Qualification
- Author's claim
- Does the data support the claim?
:::

## Vocabulary in Context

::: vocabulary word="confounding" pos="adjective" meaning="describing a factor that changes alongside the proposed cause, making it hard to isolate which one produced the observed effect (বিভ্রান্তিকর)" example="Rising employee training is a confounding factor in the claim that technology alone raised productivity."
:::

::: vocabulary word="outlier" pos="noun" meaning="a data point far removed from the rest of the values, capable of distorting an average or trend (ব্যতিক্রমী মান)" example="The single unusually high value was an outlier that inflated the reported average."
:::

::: vocabulary word="volatility" pos="noun" meaning="the degree to which a value fluctuates, independent of whether its overall level is high or low (অস্থিরতা)" example="Prices remained high but showed considerable volatility from month to month."
:::

::: vocabulary word="of these" pos="phrase" meaning="restricting a following percentage to a previously named subgroup, not the full original population (এদের মধ্যে)" example="70% completed the training; of these, 80% passed — meaning 56% of everyone passed, not 80%."
:::

::: vocabulary word="response rate" pos="noun phrase" meaning="the proportion of an invited or eligible population that actually responded, not a proportion of the respondents themselves (প্রতিক্রিয়ার হার)" example="A 35% response rate means over a third of those invited answered — it says nothing about what percentage agreed."
:::

::: vocabulary word="survivorship bias" pos="noun phrase" meaning="a distortion caused by studying only the cases that succeeded or persisted, while the failed or missing cases are left out of the sample (উত্তরজীবী পক্ষপাত)" example="Studying only companies that survived AI adoption, while ignoring those that failed, produces survivorship bias."
:::

::: vocabulary word="selection bias" pos="noun phrase" meaning="a distortion arising because the sample studied is not representative of the population a conclusion is being generalized to (নির্বাচন পক্ষপাত)" example="Surveying only technology managers and generalizing to all workers introduces selection bias."
:::

## Guided Reading Practice

Read this passage once, then apply the master quantitative-argument
framework before checking your reading against the notes that follow.

> After a regional retailer introduced a new inventory-forecasting
> algorithm, stockouts fell by 30% across the stores that adopted it
> within the first year. Store managers reported the algorithm as a
> clear success. However, the stores that adopted the algorithm first
> were also the retailer's highest-volume locations, which had already
> been investing in improved staff training the same year, and the
> analysis did not include a comparison against stores that did not
> adopt the algorithm.

Data: stockouts fell 30% at adopting stores. Interpretation: managers
call it a success. Missing comparison: no control group of
non-adopting stores. Confounding factors: adopting stores were
already higher-volume and had concurrent staff-training investment.
Causal certainty: low — the 30% reduction may be partly or largely
attributable to training or store characteristics rather than the
algorithm alone. Better interpretation: stockouts fell substantially
at stores that adopted the algorithm, but the evidence does not
isolate the algorithm's contribution from other changes happening at
the same stores during the same period.

## Golden Rule

::: golden
Never ask only "what number does the chart show?" Ask "compared with what, measured how, based on whom, with what uncertainty, and what does that number actually justify me concluding?"
:::

## Lesson Summary

This lesson moved quantitative reading from vocabulary precision
(Lesson 55) to full argument evaluation: separating a data observation
from the interpretation and causal claim built on top of it, reading
before-and-after and control-group data critically, tracking a
percentage's exact denominator through phrases like "of these" and
stacked percentages, recognising trend vocabulary from outlier to
plateau to peak and trough, and naming three specific ways a sample can
misrepresent its population — response rate misreadings, survivorship
bias, and selection bias.

::: important title="Sixteen distinctions this lesson rests on"
Data ≠ interpretation. After ≠ because of. Correlation ≠ causation.
Highest ≠ largest increase. Absolute growth ≠ percentage growth.
Percentage ≠ percentage point. Average ≠ typical individual. "Of
these" changes the denominator. "Respectively" maps values in order. A
small sample limits generalization. Outliers can distort averages. A
chart's visual appearance can mislead. "Up to 40%" ≠ average 40%.
"Statistically significant" ≠ practically important. "Suggests" ≠
"proves." A quantitative claim must be judged against its baseline,
sample, comparison, uncertainty, and causal assumptions.
:::

## Practice: Test What You've Learned

Work through every question yourself before checking anything.

::: important title="Before you start"
For each item, explicitly identify the denominator or comparison group
before evaluating the claim — most of this lesson's traps hide exactly
there.
:::

### Part A — Observation, Interpretation, and Causal Claim

1. **Customer complaints fell by 15% after the company launched a new support chatbot.** Write this as three separate statements: an observation, an interpretation, and a causal claim. <details class="answer"><summary>Show answer</summary><div class="answer-body">Observation: customer complaints fell by 15% after the chatbot's launch. Interpretation: the chatbot improved customer support. Causal claim: the chatbot caused the drop in complaints.</div></details>
2. Explain what additional evidence would be needed to move confidently from the interpretation to the causal claim in question 1. <details class="answer"><summary>Show answer</summary><div class="answer-body">A comparable control group without the chatbot over the same period, ruling out other simultaneous changes such as staffing, product updates, or seasonal effects, and ideally a statistically significant result with a plausible mechanism linking the chatbot to fewer complaints, would all be needed to support the stronger causal claim.</div></details>

### Part B — Confounding and Control Groups

3. **A company's sales rose after it redesigned its website, but it also ran a major advertising campaign during the same period.** Identify the confounding factor, and explain why it complicates the causal claim. <details class="answer"><summary>Show answer</summary><div class="answer-body">The confounding factor is the advertising campaign run during the same period as the redesign. It complicates the causal claim because the sales increase could be due to the campaign, the redesign, or both together, and nothing in the passage isolates the two effects from each other.</div></details>
4. **Treatment group: 50 → 40 (a 10-point drop). Control group: 50 → 47 (a 3-point drop).** Using the difference-in-differences intuition from this lesson, estimate the improvement plausibly attributable to the treatment. <details class="answer"><summary>Show answer</summary><div class="answer-body">The treatment group dropped 10 points while the control group, with no intervention, still dropped 3 points on its own. The additional improvement plausibly attributable to the treatment is the difference: 10 minus 3, or 7 points.</div></details>

### Part C — Denominator Tracking

5. **80% of employees use the mobile app; of these, 25% use it daily.** Calculate what percentage of all employees use the app daily, and explain why "25%" alone would misrepresent the finding. <details class="answer"><summary>Show answer</summary><div class="answer-body">80% times 25% equals 20% of all employees who use the app daily. "25%" alone would misrepresent the finding because it applies only to the narrower subgroup of app users, not to all employees, so repeating it without the 80% context inflates the apparent daily-use rate.</div></details>
6. **The survey achieved a 40% response rate, and 90% of respondents were satisfied.** Explain why this does not mean 90% of all invited participants were satisfied. <details class="answer"><summary>Show answer</summary><div class="answer-body">The 90% figure is a share of respondents, who already chose to respond, not a share of everyone invited. With only a 40% response rate, the 60% who did not respond are unaccounted for and could be systematically less satisfied, so 90% cannot be assumed to hold across all invitees.</div></details>

### Part D — Trend Vocabulary and Bias

7. **Growth was steady from 2020 to 2023, then slowed sharply and has remained flat since.** Identify which trend-vocabulary term (plateau, peak, trough, turning point) best describes the period after 2023. <details class="answer"><summary>Show answer</summary><div class="answer-body">Plateau — growth slowed sharply and settled at a relatively stable level, matching "growth slows and settles," rather than describing a single highest or lowest point.</div></details>
8. **A study of top-performing hospitals found that all of them used a particular scheduling software, and concluded the software improves hospital performance.** Identify the type of bias most likely at work, and explain what evidence is missing. <details class="answer"><summary>Show answer</summary><div class="answer-body">This is survivorship bias. The study looked only at hospitals that were already top-performing, ignoring hospitals that used the same software but performed poorly or failed, so there is no way to know whether the software actually distinguishes successful hospitals from unsuccessful ones.</div></details>

### Part E — Full Passage Analysis

Return to this lesson's guided reading passage about the inventory-
forecasting algorithm.

9. Identify the two confounding factors the passage itself names. <details class="answer"><summary>Show answer</summary><div class="answer-body">The adopting stores were already the retailer's highest-volume locations, and those same stores had also been investing in improved staff training during the same year.</div></details>
10. Explain why the absence of a control group weakens the causal claim. <details class="answer"><summary>Show answer</summary><div class="answer-body">Without a control group of non-adopting stores, there is no way to estimate what would have happened to stockouts anyway, due to general trends or the two named confounding factors, absent the algorithm. So the full 30% reduction cannot be confidently attributed to the algorithm alone.</div></details>
11. Using the master quantitative-argument framework from this lesson, write your own faithful one-sentence interpretation of this passage's findings. <details class="answer"><summary>Show answer</summary><div class="answer-body">Stockouts fell substantially at stores that adopted the inventory-forecasting algorithm, but because those stores were already higher-volume and simultaneously investing in staff training, with no control group for comparison, the evidence does not isolate how much of the reduction the algorithm itself is responsible for.</div></details>
12. Explain what would be lost if this passage were summarized simply as "the algorithm reduced stockouts by 30%." <details class="answer"><summary>Show answer</summary><div class="answer-body">This drops the qualification that adopting stores differed systematically, being higher-volume with concurrent training investment, and that no control group existed. Without that qualification, the summary presents an unearned, unqualified causal claim, letting readers wrongly treat the 30% as clean proof of the algorithm's effect alone.</div></details>

Next: Lesson 57 — Advanced Reading of Technical Definitions,
Classifications & Taxonomies: how authors define, distinguish, and
divide concepts into categories.
