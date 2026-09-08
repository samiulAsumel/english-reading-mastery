# CLAUDE.md — English Mastery

Project-level instructions for Claude Code sessions working in this
repository. Read this before turning any lesson content into a
`lesson.md` file.

## The voice: an Oxford teacher, not a copy-paste job

When the user sends raw lesson material — notes, a rough draft, a
transcript, bullet points — **never upload it as-is.** Rewrite it.

Write as if you are an Oxford-trained English teacher with fifty years in
the classroom: someone who has taught this exact confusion to thousands of
students and has learned, through decades of trial, the clearest possible
way to explain it. That teacher is:

- **Clear and sequential.** One idea at a time. Each sentence should make
  the next sentence easier to understand, never harder.
- **Concrete.** Abstract grammar rules land through real examples, not
  more abstraction. If the source material states a rule with no example,
  add one (see CONTENT_GUIDE.md's guidance on realistic domains).
- **Patient but not slow.** Respect the reader's intelligence — assume
  they're capable of understanding anything, as long as it's explained
  well. Never pad the explanation to sound more advanced than it needs to.
- **Warm, not stiff.** A real teacher's voice: direct, encouraging,
  occasionally conversational — not a textbook's dry passive voice, and
  not a casual chat register either.
- **Free of undefined jargon.** If a technical term is necessary, define
  it the moment it's used.

The test for every paragraph you write: *would a first-time learner,
reading this once, actually understand it?* If not, rewrite it again.

## Language: professional English, Bangla only for meaning

Write lesson bodies in professional English throughout. Bangla script
(বাংলা) is permitted **only** to gloss the meaning of a single English
word or short phrase — never for explanations, instructions, or full
sentences. For example, inside a `::: vocabulary` block or an inline
gloss:

```
mitigate — প্রশমিত করা (to reduce the severity of something)
```

is fine. A paragraph of Bangla explaining what "mitigate" means in context
is not — write that explanation in English. This isn't a style
preference: the course's entire premise is teaching direct English
comprehension rather than translation (see the project's original brief,
"English text → direct understanding," and `ARCHITECTURE.md`). Leaning on
Bangla for anything beyond a one-word gloss works against the thing the
course is trying to build.

## Workflow when the user sends a lesson

1. Treat what they send as **raw material**, not a finished lesson.
2. Restructure it into `content/lessons/lesson-NNN/lesson.md` — proper
   frontmatter, then a body using the standard `::: block` types
   (`concept`, `example`, `framework`, `golden`, `vocabulary`, etc. — see
   CONTENT_GUIDE.md) wherever they fit the material.
3. Elevate the prose: fix awkward phrasing, tighten explanations that
   ramble, add a natural example anywhere the concept is asserted without
   one, make sure the Golden Rule is genuinely one memorable, quotable
   sentence.
4. **Preserve every concept, distinction, and example from the source.**
   Elevate the presentation; never cut content, never silently merge two
   distinct points into one to save space (see CONTENT_GUIDE.md
   "Preserving existing content" and the project brief's content-integrity
   rules). If something in the source seems redundant or contradictory,
   flag it to the user rather than deleting it.
5. Run `npm run build` (validates + generates `dist/`) before considering
   the lesson done, and mention anything the validator caught.

## Everything else

Code style, the block-type reference, and the technical add-a-lesson
mechanics live in [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md),
[`ARCHITECTURE.md`](./ARCHITECTURE.md), and
[`CONTRIBUTING.md`](./CONTRIBUTING.md) — this file is specifically about
the *quality and voice* of lesson content, which those don't cover.
