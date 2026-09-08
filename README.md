# English Mastery

A structured English reading course, built as a content-driven static
site: sentence-level foundations through near-native critical reading,
across nine skill levels. **Pure HTML, CSS, and vanilla JavaScript** —
no framework runtime ships to the browser. A small dependency-light Node
script generates real `.html` files from Markdown lesson content at build
time.

This is a long-term platform, not a one-off site — every lesson is a
version-controlled content file, and the architecture is built to grow
past lesson 85 without redesign. See [`ARCHITECTURE.md`](./ARCHITECTURE.md)
for why it's built this way, and [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md)
for how to add a lesson.

**Live:** [englishmastery.pages.dev](https://englishmastery.pages.dev) —
auto-deploys on every push to `main` (Cloudflare Pages).

> **If you're Claude Code and the user just handed you raw lesson
> material:** read [`CLAUDE.md`](./CLAUDE.md) first. Lesson content gets
> rewritten to a specific voice and quality bar before it's saved — it is
> never uploaded verbatim.

## Prerequisites

- Node.js 18+ (build tooling only — nothing Node-specific ships to the browser)
- npm

> **This repo lives on an exFAT drive**, which has no symlink support.
> `.npmrc` sets `bin-links=false` (one dependency, `marked`, ships a CLI
> bin npm would otherwise try to symlink) — not that it matters much here,
> since every script is already just `node scripts/whatever.js`, never a
> `node_modules/.bin` shim.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:4000](http://localhost:4000). `npm run dev`
rebuilds automatically when you edit anything under `content/` or `src/`
— refresh the browser after a rebuild finishes (logged to the terminal).
There's no hot-reload/HMR; it's a full static rebuild, and it's fast.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Build once, serve `dist/` at :4000, rebuild on file changes |
| `npm run build` | Validate content, then generate the full site into `dist/` |
| `npm run serve` | Serve the already-built `dist/` (no rebuilding) |
| `npm run validate:content` | Check every lesson file against the content schema (see CONTENT_GUIDE.md) |
| `npm run new:lesson -- --title "..."` | Scaffold the next lesson file with number/level/module pre-filled |

## Deploying

`dist/` after `npm run build` is the entire site — plain files. Any static
host works (upload the folder, or point a host at this repo with build
command `npm run build` and publish directory `dist`). Set
`SITE_URL=https://yourdomain.com` in the environment before building so
canonical URLs, Open Graph tags, and `sitemap.xml` point at the real
domain instead of `http://localhost:4000`.

## Project structure

```
content/
  curriculum/       Levels, modules, skills — the taxonomy lessons plug into (plain .js data)
  lessons/
    _template/       Reference lesson.md showing every content block (not a real page)
    lesson-XXX/       One folder per lesson, numbered, containing lesson.md
src/
  styles/main.css     The entire hand-written design system (no build step)
  scripts/            Vanilla JS shipped to the browser (theme, search, progress, TOC, nav)
  assets/             favicon.svg etc. — copied to dist/ as-is
scripts/               Node build tooling — none of this ships to the browser
  lib/
    content.js          Loads + validates lessons, renders Markdown+custom blocks to HTML
    templates.js         Page shell (head, header, footer, search dialog) + shared card partials
    pages.js              One function per page type, building on templates.js
  build.js              Orchestrates the whole build → dist/
  serve.js               Zero-dependency static file server
  dev.js                  build + serve + rebuild on change
  validate-content.js    Content integrity checks (also runs before every build)
  new-lesson.js           Scaffold a new lesson
dist/                     Generated output (gitignored) — this is what you deploy
```

## Docs

- [`CLAUDE.md`](./CLAUDE.md) — the voice and quality bar for lesson content, and the English/Bangla language rule (read this before writing any lesson)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — how the content/curriculum/build system works and why
- [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md) — the exact steps to add Lesson 86 (or any lesson), and every custom content block
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — code style and PR expectations
