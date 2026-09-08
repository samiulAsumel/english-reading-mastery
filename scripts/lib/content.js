'use strict';

const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const { Marked } = require('marked');
const { levels } = require('../../content/curriculum/levels');
const { modules } = require('../../content/curriculum/modules');

const LESSONS_DIR = path.join(__dirname, '..', '..', 'content', 'lessons');

const DIFFICULTIES = ['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'c1', 'c2'];
const STATUSES = ['draft', 'published'];

// ---------------------------------------------------------------------------
// Slugify — used for both heading ids (during markdown render) and the TOC
// (during heading extraction), so the two always agree without a shared
// external "slugger" dependency.
// ---------------------------------------------------------------------------
function baseSlugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Returns a slugify function that de-dupes repeated headings within one call scope. */
function createSlugger() {
  const seen = new Map();
  return function slug(text) {
    const base = baseSlugify(text) || 'section';
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------------------------------------------------------------------------
// Frontmatter validation — shared by the loader (throws) and
// scripts/validate-content.js (collects + reports). Keep in one place so
// the two never drift.
// ---------------------------------------------------------------------------
function validateFrontmatter(data, dirName) {
  const errors = [];
  const req = (field, type) => {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`frontmatter.${field}: required`);
      return false;
    }
    if (type === 'array' && !Array.isArray(data[field])) {
      errors.push(`frontmatter.${field}: must be an array`);
      return false;
    }
    if (type !== 'array' && typeof data[field] !== type) {
      errors.push(`frontmatter.${field}: must be a ${type}`);
      return false;
    }
    return true;
  };

  req('id', 'string');
  req('number', 'number');
  req('slug', 'string');
  req('title', 'string');
  req('description', 'string');
  req('level', 'string');
  req('module', 'string');
  req('estimatedTime', 'string');
  req('difficulty', 'string');

  if (typeof data.slug === 'string' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) {
    errors.push('frontmatter.slug: must be kebab-case (lowercase, digits, single hyphens)');
  }
  if (typeof data.difficulty === 'string' && !DIFFICULTIES.includes(data.difficulty)) {
    errors.push(`frontmatter.difficulty: must be one of ${DIFFICULTIES.join(', ')}`);
  }
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    errors.push(`frontmatter.status: must be one of ${STATUSES.join(', ')}`);
  }
  for (const field of ['prerequisites', 'skills', 'objectives', 'tags']) {
    if (data[field] !== undefined && !Array.isArray(data[field])) {
      errors.push(`frontmatter.${field}: must be an array`);
    }
  }
  if (Array.isArray(data.prerequisites) && data.prerequisites.some((p) => typeof p !== 'number')) {
    errors.push('frontmatter.prerequisites: every entry must be a lesson number');
  }

  return errors.map((e) => `content/lessons/${dirName}/lesson.md: ${e}`);
}

function normalizeFrontmatter(data) {
  return {
    id: data.id,
    number: data.number,
    slug: data.slug,
    title: data.title,
    description: data.description,
    level: data.level,
    module: data.module,
    estimatedTime: data.estimatedTime,
    difficulty: data.difficulty,
    prerequisites: data.prerequisites || [],
    skills: data.skills || [],
    objectives: data.objectives || [],
    tags: data.tags || [],
    status: data.status || 'published',
  };
}

// ---------------------------------------------------------------------------
// Custom block syntax:
//
//   ::: type key="value" key2="value2"
//   body (markdown, optional)
//   :::
//
// Extracted before the surrounding prose is handed to `marked`, then
// spliced back in as pre-rendered HTML. See CONTENT_GUIDE.md for the full
// authoring reference.
// ---------------------------------------------------------------------------
const BLOCK_OPEN_RE = /^:::\s*([a-zA-Z][\w-]*)\s*(.*)$/;
const ATTR_RE = /([a-zA-Z][\w-]*)="([^"]*)"/g;

function parseAttrs(raw) {
  const attrs = {};
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(raw))) attrs[m[1]] = m[2];
  return attrs;
}

const CALLOUT_DEFAULTS = {
  concept: { title: 'Core Concept', tone: 'concept', glyph: '◆' },
  example: { title: 'Example', tone: 'example', glyph: '✎' },
  important: { title: 'Important', tone: 'important', glyph: 'ℹ' },
  warning: { title: 'Common Mistake', tone: 'warning', glyph: '⚠' },
  note: { title: 'Note', tone: 'note', glyph: 'ℹ' },
};

function renderCallout(type, attrs, bodyText, marked) {
  const def = CALLOUT_DEFAULTS[type];
  const title = attrs.title || def.title;
  const bodyHtml = marked.parse(bodyText.trim());
  return `<div class="callout callout-${def.tone}">
  <p class="callout-title"><span class="callout-glyph" aria-hidden="true">${def.glyph}</span>${escapeHtml(title)}</p>
  <div class="callout-body">${bodyHtml}</div>
</div>`;
}

function renderGolden(attrs, bodyText, marked) {
  const html = marked.parseInline(bodyText.trim());
  return `<div class="callout callout-golden">
  <p class="callout-title"><span class="callout-glyph" aria-hidden="true">★</span>Golden Rule</p>
  <p class="golden-rule-text">${html}</p>
</div>`;
}

function renderFramework(attrs, bodyText, marked) {
  const title = attrs.title || 'Master Framework';
  const steps = bodyText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());

  const stepsHtml = steps
    .map((step, i) => {
      const isLast = i === steps.length - 1;
      return `<div class="framework-step">${marked.parseInline(step)}</div>${
        isLast ? '' : '<div class="framework-arrow" aria-hidden="true">&#8595;</div>'
      }`;
    })
    .join('\n');

  return `<div class="callout callout-framework">
  <p class="callout-title"><span class="callout-glyph" aria-hidden="true">≡</span>${escapeHtml(title)}</p>
  <div class="framework-steps">${stepsHtml}</div>
</div>`;
}

function renderVocabulary(attrs) {
  const { word = '', pos = '', meaning = '', example = '' } = attrs;
  return `<div class="vocab-entry">
  <p class="vocab-word">${escapeHtml(word)}${pos ? `<span class="vocab-pos">${escapeHtml(pos)}</span>` : ''}</p>
  <p class="vocab-meaning">${escapeHtml(meaning)}</p>
  ${example ? `<p class="vocab-example">&ldquo;${escapeHtml(example)}&rdquo;</p>` : ''}
</div>`;
}

function renderBlock(type, attrs, bodyText, marked) {
  if (type === 'golden') return renderGolden(attrs, bodyText, marked);
  if (type === 'framework') return renderFramework(attrs, bodyText, marked);
  if (type === 'vocabulary') return renderVocabulary(attrs);
  if (CALLOUT_DEFAULTS[type]) return renderCallout(type, attrs, bodyText, marked);
  return `<!-- unknown block type: ${escapeHtml(type)} -->`;
}

/** Renders a lesson's raw MDX-like body into final HTML. */
function renderLessonBody(rawBody) {
  const lines = rawBody.split('\n');
  const placeholders = [];
  const proseLines = [];

  const slug = createSlugger();
  const marked = new Marked({
    gfm: true,
    breaks: false,
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const text = html.replace(/<[^>]+>/g, '');
        return `<h${depth} id="${slug(text)}">${html}</h${depth}>`;
      },
    },
  });

  // Inline ==collocation== highlighting — applied to prose before block
  // extraction so it never touches block bodies (which have their own
  // rendering path) or code spans (handled after, since marked already
  // escaped `<`/`>` inside them by the time this runs on raw text —
  // simplest to just also run it, `==` never appears meaningfully in code).
  const withMarks = (text) => text.replace(/==([^=\n]+)==/g, '<mark class="collocation">$1</mark>');

  let i = 0;
  while (i < lines.length) {
    const open = BLOCK_OPEN_RE.exec(lines[i]);
    if (open) {
      const type = open[1];
      const attrs = parseAttrs(open[2]);
      const bodyLines = [];
      i++;
      while (i < lines.length && lines[i].trim() !== ':::') {
        bodyLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ':::'
      const html = renderBlock(type, attrs, bodyLines.join('\n'), marked);
      const token = `<div data-erm-block="${placeholders.length}"></div>`;
      placeholders.push(html);
      proseLines.push(token);
    } else {
      proseLines.push(withMarks(lines[i]));
      i++;
    }
  }

  let html = marked.parse(proseLines.join('\n'));
  html = html.replace(/<div data-erm-block="(\d+)"><\/div>/g, (_, idx) => placeholders[Number(idx)]);
  return html;
}

/** Extracts ## / ### headings from raw body for the sticky lesson TOC. Slugs match renderLessonBody's heading ids. */
function extractToc(rawBody) {
  const slug = createSlugger();
  const entries = [];
  for (const line of rawBody.split('\n')) {
    const h2 = /^##\s+(.+)$/.exec(line);
    const h3 = /^###\s+(.+)$/.exec(line);
    const match = h2 || h3;
    if (!match) continue;
    entries.push({ depth: h2 ? 2 : 3, text: match[1].trim(), slug: slug(match[1].trim()) });
  }
  return entries;
}

/** Extracts every `::: vocabulary ... :::` block's attrs from raw body. */
function extractVocabularyFromBody(rawBody) {
  const lines = rawBody.split('\n');
  const entries = [];
  for (let i = 0; i < lines.length; i++) {
    const open = BLOCK_OPEN_RE.exec(lines[i]);
    if (open && open[1] === 'vocabulary') {
      entries.push(parseAttrs(open[2]));
    }
  }
  return entries;
}

function isLessonDir(name) {
  return /^lesson-\d{3,}$/.test(name);
}

/** Reads + validates every lesson on disk. Throws with all collected errors if any are invalid. */
function loadLessons() {
  if (!fs.existsSync(LESSONS_DIR)) return [];
  const dirNames = fs
    .readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== '_template' && isLessonDir(e.name))
    .map((e) => e.name);

  const lessons = [];
  const allErrors = [];

  for (const dirName of dirNames) {
    const file = path.join(LESSONS_DIR, dirName, 'lesson.md');
    if (!fs.existsSync(file)) {
      allErrors.push(`content/lessons/${dirName}: missing lesson.md`);
      continue;
    }
    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    const errors = validateFrontmatter(data, dirName);
    if (errors.length > 0) {
      allErrors.push(...errors);
      continue;
    }
    const expectedDir = `lesson-${String(data.number).padStart(3, '0')}`;
    if (dirName !== expectedDir) {
      allErrors.push(
        `content/lessons/${dirName}: number ${data.number} implies folder "${expectedDir}", found "${dirName}"`
      );
    }
    if (content.trim().length === 0) {
      allErrors.push(`content/lessons/${dirName}/lesson.md: has no content body`);
    }
    lessons.push({ frontmatter: normalizeFrontmatter(data), rawBody: content, dirName });
  }

  if (allErrors.length > 0) {
    const err = new Error(`Content validation failed:\n${allErrors.map((e) => `  - ${e}`).join('\n')}`);
    err.contentErrors = allErrors;
    throw err;
  }

  lessons.sort((a, b) => a.frontmatter.number - b.frontmatter.number);
  return lessons;
}

function getPublishedLessons(lessons) {
  return lessons.filter((l) => l.frontmatter.status === 'published');
}

module.exports = {
  LESSONS_DIR,
  DIFFICULTIES,
  STATUSES,
  levels,
  modules,
  loadLessons,
  validateFrontmatter,
  normalizeFrontmatter,
  isLessonDir,
  getPublishedLessons,
  renderLessonBody,
  extractToc,
  extractVocabularyFromBody,
  escapeHtml,
  baseSlugify,
};
