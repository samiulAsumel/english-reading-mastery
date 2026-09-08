'use strict';

/**
 * The whole static site generator. `node scripts/build.js` (normally run
 * via `npm run build`, which validates content first). Reads
 * content/lessons/*, content/curriculum/*, renders every page with
 * scripts/lib/pages.js, and writes plain .html/.css/.js to dist/.
 */
const fs = require('node:fs');
const path = require('node:path');
const {
  loadLessons,
  getPublishedLessons,
  renderLessonBody,
  extractToc,
  extractVocabularyFromBody,
} = require('./lib/content');
const { levels } = require('../content/curriculum/levels');
const { modules } = require('../content/curriculum/modules');
const { SITE_URL } = require('./lib/templates');
const pages = require('./lib/pages');
const { notFoundPage } = pages;

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

function writeFile(relPath, content) {
  const fullPath = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
}

function writePage(routePath, html) {
  // routePath like "/" or "/levels/foundation/" -> dist/index.html or dist/levels/foundation/index.html
  const rel = routePath === '/' ? 'index.html' : path.join(routePath.replace(/^\//, ''), 'index.html');
  writeFile(rel, html);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

function buildVocabulary(publishedLessons) {
  const byWord = new Map();
  for (const lesson of publishedLessons) {
    for (const attrs of extractVocabularyFromBody(lesson.rawBody)) {
      if (!attrs.word || !attrs.meaning) continue;
      const key = attrs.word.toLowerCase();
      const existing = byWord.get(key);
      if (existing) {
        if (!existing.lessonNumbers.includes(lesson.frontmatter.number)) {
          existing.lessonNumbers.push(lesson.frontmatter.number);
        }
      } else {
        byWord.set(key, {
          word: attrs.word,
          pos: attrs.pos,
          meaning: attrs.meaning,
          example: attrs.example,
          lessonNumbers: [lesson.frontmatter.number],
        });
      }
    }
  }
  return Array.from(byWord.values()).sort((a, b) => a.word.localeCompare(b.word));
}

function buildSearchIndex(publishedLessons) {
  const records = publishedLessons.map((l) => ({
    number: l.frontmatter.number,
    title: l.frontmatter.title,
    description: l.frontmatter.description,
    level: l.frontmatter.level,
    module: l.frontmatter.module,
    tags: l.frontmatter.tags,
    skills: l.frontmatter.skills,
    href: `/lessons/${l.frontmatter.number}/`,
  }));
  return { records };
}

function buildSitemap(publishedLessons) {
  const staticRoutes = ['/', '/course/', '/levels/', '/modules/', '/lessons/', '/vocabulary/', '/skills/', '/progress/'];
  const levelRoutes = levels.map((l) => `/levels/${l.slug}/`);
  const moduleRoutes = modules.map((m) => `/modules/${m.slug}/`);
  const lessonRoutes = publishedLessons.map((l) => `/lessons/${l.frontmatter.number}/`);
  const all = [...staticRoutes, ...levelRoutes, ...moduleRoutes, ...lessonRoutes];
  const urls = all.map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function main() {
  const started = Date.now();

  // Clean dist/
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const allLessons = loadLessons(); // throws with all collected errors if any lesson is invalid
  const publishedLessons = getPublishedLessons(allLessons);

  // ---- Static pages -------------------------------------------------
  writePage('/', pages.homePage(publishedLessons));
  writePage('/course/', pages.coursePage(publishedLessons));
  writePage('/levels/', pages.levelsIndexPage(publishedLessons));
  writePage('/modules/', pages.modulesIndexPage(publishedLessons));
  writePage('/lessons/', pages.lessonsIndexPage(publishedLessons));
  writePage('/vocabulary/', pages.vocabularyPage(buildVocabulary(publishedLessons)));
  writePage('/skills/', pages.skillsPage(publishedLessons));
  writePage('/progress/', pages.progressPage(publishedLessons));
  writeFile('404.html', notFoundPage());

  // ---- Level / module detail pages -----------------------------------
  for (const level of levels) {
    writePage(`/levels/${level.slug}/`, pages.levelDetailPage(level, publishedLessons));
  }
  for (const mod of modules) {
    writePage(`/modules/${mod.slug}/`, pages.moduleDetailPage(mod, publishedLessons));
  }

  // ---- Lesson pages ----------------------------------------------------
  publishedLessons.forEach((lesson, i) => {
    const bodyHtml = renderLessonBody(lesson.rawBody);
    const toc = extractToc(lesson.rawBody);
    const previous = publishedLessons[i - 1];
    const next = publishedLessons[i + 1];
    writePage(`/lessons/${lesson.frontmatter.number}/`, pages.lessonDetailPage({ lesson, bodyHtml, toc, previous, next }));
  });

  // ---- Derived data files ------------------------------------------
  writeFile('search-index.json', JSON.stringify(buildSearchIndex(publishedLessons)));
  writeFile('sitemap.xml', buildSitemap(publishedLessons));
  writeFile('robots.txt', buildRobots());

  // ---- Static assets --------------------------------------------------
  copyDir(path.join(ROOT, 'src', 'styles'), path.join(DIST, 'styles'));
  copyDir(path.join(ROOT, 'src', 'scripts'), path.join(DIST, 'scripts'));
  copyDir(path.join(ROOT, 'src', 'assets'), DIST);

  const ms = Date.now() - started;
  console.log(`✓ Built ${publishedLessons.length} lesson${publishedLessons.length === 1 ? '' : 's'} (${allLessons.length} total, ${allLessons.length - publishedLessons.length} draft) → dist/ in ${ms}ms`);
}

main();
