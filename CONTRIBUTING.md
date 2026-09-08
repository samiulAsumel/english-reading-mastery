# Contributing

This is currently a single-author course built with Claude Code. This file
covers the code-side conventions; for adding lesson content, see
[`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) instead.

## Before committing

```bash
npm run validate:content
npm run build
```

Both must pass (`npm run build` runs `validate:content` first
automatically, but running it standalone gives a faster error loop while
editing lesson files). There's no separate lint/typecheck step — this is
plain JS with no build-time type system; keep functions small and let
`validate-content.js` + a manual look at `dist/` output be the safety net.

## Code style

- Plain Node CommonJS (`require`/`module.exports`) throughout `scripts/`
  and `content/curriculum/`. No TypeScript, no ES module syntax in
  build-time code — see `README.md` for why (pure HTML/CSS/JS at runtime;
  the build tooling stays equally simple on purpose).
- Client-side JS in `src/scripts/` is vanilla, IIFE-wrapped
  (`(function () { 'use strict'; ... })()`), one file per concern (theme,
  search, progress, TOC, nav, lessons-filter). No bundler — each is loaded
  with a plain `<script defer src="...">` tag. Keep new client scripts in
  that same style rather than introducing modules/imports, which would
  need a bundler to work reliably everywhere.
- New page type → add a function to `scripts/lib/pages.js` that returns
  `layout({...})`'s output, wire it into `scripts/build.js`'s `main()`.
- New reusable HTML fragment used by 2+ pages → `scripts/lib/templates.js`.
- New MDX-style content block → see CONTENT_GUIDE.md "Adding a new block
  type" — it touches `scripts/lib/content.js`, `src/styles/main.css`, and
  the CONTENT_GUIDE.md table together.
- Don't add a lesson-number or lesson-count constant anywhere outside
  `content/`. If a feature seems to need one, it's a sign the data should
  come from `loadLessons()`/`getPublishedLessons()` instead — see
  ARCHITECTURE.md.
- `dist/` is generated and gitignored — never hand-edit it or commit it.

## Commits

Conventional Commits (`feat:`, `fix:`, `docs:`, `content:`, `chore:`, ...).
Use `content:` for lesson additions/edits, e.g.
`content: add lesson 86 (evidence boundaries)`.
