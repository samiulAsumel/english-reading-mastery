# Contributing

This is currently a single-author course built with Claude Code. This file
covers the code-side conventions; for adding lesson content, see
[`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) instead.

## Before committing

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run build
```

All four must pass. `npm run build` runs `validate:content` first
automatically, but running it standalone gives a faster error loop while
editing lesson files.

## Code style

- TypeScript everywhere, no `any`, no `@ts-ignore` — see the root
  `CLAUDE.md` for the full TS conventions this project follows (2-space
  indent, single quotes, explicit return types, named exports except for
  Next.js route/page files).
- Server Components by default; add `'use client'` only when a file uses
  hooks, event handlers, or browser APIs (localStorage, IntersectionObserver).
- New UI primitive → `src/components/ui/`. New MDX-authorable block → both
  `src/components/content/blocks.tsx` (or a focused new file) *and*
  `src/components/content/mdx-components.tsx`'s export map *and* a row in
  CONTENT_GUIDE.md's block table — those three move together.
- Don't add a lesson-number or lesson-count constant anywhere outside
  `content/`. If a feature seems to need one, it's a sign the data should
  come from `getPublishedLessons()` instead — see ARCHITECTURE.md.

## Commits

Conventional Commits (`feat:`, `fix:`, `docs:`, `content:`, `chore:`, ...).
Use `content:` for lesson additions/edits, e.g.
`content: add lesson 86 (evidence boundaries)`.
