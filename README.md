# English Reading Mastery

A structured English reading course, built as a content-driven Next.js
platform: sentence-level foundations through near-native critical reading,
across nine skill levels.

This is a long-term platform, not a one-off site — every lesson is a
version-controlled content file, and the architecture is built to grow past
lesson 85 without redesign. See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for
why it's built this way, and [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) for
how to add a lesson.

## Prerequisites

- Node.js 20+
- npm

> **This repo lives on an exFAT drive**, which has no symlink support. Two
> consequences baked into `package.json`, both there on purpose — don't
> "simplify" them back:
> - `.npmrc` sets `bin-links=false`, and every script calls its tool's JS
>   entrypoint directly (`node node_modules/next/dist/bin/next dev`)
>   instead of relying on `node_modules/.bin`, which npm can't populate here.
> - `dev` and `build` pass `--webpack`. Turbopack (Next.js 16's default)
>   symlinks `.next/node_modules/*` back into `node_modules/` as part of
>   its build cache, which also fails on exFAT — webpack doesn't need to.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Validate content, then production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run validate:content` | Check every lesson file against the content schema (see CONTENT_GUIDE.md) |
| `npm run new:lesson -- --title "..."` | Scaffold the next lesson file with the right number/level/module pre-filled |

## Environment variables

See [`.env.example`](./.env.example) — currently just the public site URL
used for SEO metadata. There's no backend yet; progress tracking is
local-only (see `src/lib/progress/`).

## Project structure

```
content/
  curriculum/       Levels, modules, skills — the taxonomy lessons plug into
  lessons/
    _template/       Reference lesson.mdx showing every content block (not a real route)
    lesson-XXX/       One folder per lesson, numbered, containing lesson.mdx
src/
  app/               Routes (App Router)
  components/
    content/          MDX blocks lessons can use (<GoldenRule>, <Framework>, ...)
    course/, lesson/  UI for curriculum browsing and the lesson reading page
    layout/, search/, ui/
  lib/
    content/           Filesystem content loader, Zod schema, TOC/vocab extraction
    progress/          LocalStorage-backed progress tracking behind a swappable interface
scripts/
  new-lesson.ts        Scaffold a new lesson
  validate-content.ts  Content integrity checks (runs before every build)
```

## Docs

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — how the content/curriculum system works and why
- [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) — the exact steps to add Lesson 86 (or any lesson)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — code style and PR expectations
