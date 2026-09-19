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
  loadCollection,
  getPublishedLessons,
  renderLessonBody,
  extractToc,
  extractVocabularyFromBody,
} = require('./lib/content');
const { levels } = require('../content/curriculum/levels');
const { modules } = require('../content/curriculum/modules');
const { COLLECTIONS, COLLECTION_LIST } = require('../content/curriculum/collections');
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

// Aggregates `::: vocabulary` blocks across all three collections — a word
// introduced in a writing task shows up on /vocabulary/ too, same as one
// introduced in a reading lesson.
function buildVocabulary(publishedByCollection) {
  const byWord = new Map();
  for (const collection of COLLECTION_LIST) {
    for (const item of publishedByCollection[collection.key]) {
      for (const attrs of extractVocabularyFromBody(item.rawBody)) {
        if (!attrs.word || !attrs.meaning) continue;
        const key = attrs.word.toLowerCase();
        const href = `${collection.routeBase}${item.frontmatter.number}/`;
        const label = `${collection.itemNoun} ${item.frontmatter.number}`;
        const existing = byWord.get(key);
        if (existing) {
          if (!existing.appearsIn.some((a) => a.href === href)) {
            existing.appearsIn.push({ label, href });
          }
        } else {
          byWord.set(key, {
            word: attrs.word,
            pos: attrs.pos,
            meaning: attrs.meaning,
            example: attrs.example,
            appearsIn: [{ label, href }],
          });
        }
      }
    }
  }
  return Array.from(byWord.values()).sort((a, b) => a.word.localeCompare(b.word));
}

function buildSearchIndex(publishedByCollection) {
  const records = [];
  for (const collection of COLLECTION_LIST) {
    for (const item of publishedByCollection[collection.key]) {
      records.push({
        number: item.frontmatter.number,
        noun: collection.itemNoun,
        title: item.frontmatter.title,
        description: item.frontmatter.description,
        level: item.frontmatter.level,
        module: item.frontmatter.module,
        tags: item.frontmatter.tags,
        skills: item.frontmatter.skills,
        href: `${collection.routeBase}${item.frontmatter.number}/`,
      });
    }
  }
  return { records };
}

function buildSitemap(publishedByCollection) {
  const staticRoutes = ['/', '/course/', '/levels/', '/modules/', '/lessons/', '/writing/', '/speaking/', '/vocabulary/', '/skills/', '/progress/'];
  const levelRoutes = levels.map((l) => `/levels/${l.slug}/`);
  const moduleRoutes = modules.map((m) => `/modules/${m.slug}/`);
  const itemRoutes = COLLECTION_LIST.flatMap((collection) =>
    publishedByCollection[collection.key].map((item) => `${collection.routeBase}${item.frontmatter.number}/`)
  );
  const all = [...staticRoutes, ...levelRoutes, ...moduleRoutes, ...itemRoutes];
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

  // ---- Load all three collections ------------------------------------
  const allByCollection = {};
  const publishedByCollection = {};
  for (const collection of COLLECTION_LIST) {
    allByCollection[collection.key] = loadCollection(collection); // throws with all collected errors if any item is invalid
    publishedByCollection[collection.key] = getPublishedLessons(allByCollection[collection.key]);
  }
  const allLessons = allByCollection.reading;
  const publishedLessons = publishedByCollection.reading;
  const publishedWriting = publishedByCollection.writing;
  const publishedSpeaking = publishedByCollection.speaking;

  // ---- Static pages -------------------------------------------------
  writePage('/', pages.homePage(publishedLessons));
  writePage('/course/', pages.coursePage(publishedLessons));
  writePage('/levels/', pages.levelsIndexPage(publishedLessons));
  writePage('/modules/', pages.modulesIndexPage(publishedLessons));
  writePage('/lessons/', pages.lessonsIndexPage(publishedLessons));
  writePage('/writing/', pages.writingLandingPage(publishedWriting));
  writePage('/speaking/', pages.speakingLandingPage(publishedSpeaking));
  writePage('/vocabulary/', pages.vocabularyPage(buildVocabulary(publishedByCollection)));
  writePage('/skills/', pages.skillsPage(publishedLessons));
  writePage('/progress/', pages.progressPage({ reading: publishedLessons, writing: publishedWriting, speaking: publishedSpeaking }));
  writeFile('404.html', notFoundPage());

  // ---- Level / module detail pages -----------------------------------
  for (const level of levels) {
    const tracks = {
      reading: publishedLessons.filter((l) => l.frontmatter.level === level.slug),
      writing: publishedWriting.filter((l) => l.frontmatter.level === level.slug),
      speaking: publishedSpeaking.filter((l) => l.frontmatter.level === level.slug),
    };
    writePage(`/levels/${level.slug}/`, pages.levelDetailPage(level, tracks));
  }
  for (const mod of modules) {
    writePage(`/modules/${mod.slug}/`, pages.moduleDetailPage(mod, publishedLessons));
  }

  // ---- Item detail pages, all three collections -----------------------
  // Writing/speaking tasks pair 1:1 by number with a reading lesson (see
  // ARCHITECTURE.md "Writing & speaking tracks"), so each detail page can
  // cross-link its counterpart(s) — only when they exist and are published.
  const byNumber = {};
  for (const collection of COLLECTION_LIST) {
    byNumber[collection.key] = new Map(publishedByCollection[collection.key].map((item) => [item.frontmatter.number, item]));
  }

  for (const collection of COLLECTION_LIST) {
    const items = publishedByCollection[collection.key];
    items.forEach((item, i) => {
      const bodyHtml = renderLessonBody(item.rawBody);
      const toc = extractToc(item.rawBody);
      const previous = items[i - 1];
      const next = items[i + 1];
      const number = item.frontmatter.number;
      const pair =
        collection.key === 'reading'
          ? { writing: byNumber.writing.get(number), speaking: byNumber.speaking.get(number) }
          : { reading: byNumber.reading.get(number) };
      writePage(`${collection.routeBase}${number}/`, pages.itemDetailPage({ item, bodyHtml, toc, previous, next, collection, pair }));
    });
  }

  // ---- Derived data files ------------------------------------------
  writeFile('search-index.json', JSON.stringify(buildSearchIndex(publishedByCollection)));
  writeFile('sitemap.xml', buildSitemap(publishedByCollection));
  writeFile('robots.txt', buildRobots());

  // ---- Static assets --------------------------------------------------
  copyDir(path.join(ROOT, 'src', 'styles'), path.join(DIST, 'styles'));
  copyDir(path.join(ROOT, 'src', 'scripts'), path.join(DIST, 'scripts'));
  copyDir(path.join(ROOT, 'src', 'assets'), DIST);

  const totalPublished = publishedLessons.length + publishedWriting.length + publishedSpeaking.length;
  const totalAll = allLessons.length + allByCollection.writing.length + allByCollection.speaking.length;
  const ms = Date.now() - started;
  console.log(
    `✓ Built ${publishedLessons.length} lesson${publishedLessons.length === 1 ? '' : 's'}, ${publishedWriting.length} writing task${publishedWriting.length === 1 ? '' : 's'}, ${publishedSpeaking.length} speaking drill${publishedSpeaking.length === 1 ? '' : 's'} (${totalPublished} published, ${totalAll - totalPublished} draft) → dist/ in ${ms}ms`
  );
}

main();
