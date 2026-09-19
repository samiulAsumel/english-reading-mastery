'use strict';

const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const { Marked } = require('marked');
const { levels } = require('../../content/curriculum/levels');
const { modules } = require('../../content/curriculum/modules');
const { COLLECTIONS } = require('../../content/curriculum/collections');
const { icon } = require('./icons');

const CONTENT_ROOT = path.join(__dirname, '..', '..', 'content');
const LESSONS_DIR = path.join(CONTENT_ROOT, 'lessons');

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
function validateFrontmatter(data, dirName, collectionDirName = 'lessons', fileName = 'lesson.md') {
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

  return errors.map((e) => `content/${collectionDirName}/${dirName}/${fileName}: ${e}`);
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
  concept: { title: 'Core Concept', tone: 'concept', icon: 'target' },
  example: { title: 'Example', tone: 'example', icon: 'edit' },
  important: { title: 'Important', tone: 'important', icon: 'info' },
  warning: { title: 'Common Mistake', tone: 'warning', icon: 'alertTriangle' },
  note: { title: 'Note', tone: 'note', icon: 'info' },
  // Self-assessment checklist for writing/speaking tasks. Ships as a
  // static callout (author writes a `- ` list) — interactive/persisted
  // checkboxes are a real second feature, deliberately deferred past this
  // phase so the format can ship without it (see the approved plan §0.2).
  rubric: { title: 'Self-Check', tone: 'rubric', icon: 'checkSquare' },
};

function renderCallout(type, attrs, bodyText, marked) {
  const def = CALLOUT_DEFAULTS[type];
  const title = attrs.title || def.title;
  const bodyHtml = marked.parse(bodyText.trim());
  return `<div class="callout callout-${def.tone}">
  <p class="callout-title">${icon(def.icon, 'callout-glyph')}${escapeHtml(title)}</p>
  <div class="callout-body">${bodyHtml}</div>
</div>`;
}

function renderGolden(attrs, bodyText, marked) {
  const html = marked.parseInline(bodyText.trim());
  return `<div class="callout callout-golden">
  <p class="callout-title">${icon('star', 'callout-glyph')}Golden Rule</p>
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
      return `<div class="framework-step"><span class="framework-step-index">${i + 1}</span>${marked.parseInline(step)}</div>${
        isLast ? '' : `<div class="framework-arrow">${icon('arrowDown')}</div>`
      }`;
    })
    .join('\n');

  return `<div class="callout callout-framework">
  <p class="callout-title">${icon('list', 'callout-glyph')}${escapeHtml(title)}</p>
  <div class="framework-steps">${stepsHtml}</div>
</div>`;
}

// `register` and `collocation` are optional so older cards keep rendering unchanged.
function renderVocabulary(attrs) {
  const { word = '', pos = '', register = '', meaning = '', collocation = '', example = '' } = attrs;
  const tags = [pos, register].filter(Boolean);
  const tagsHtml = tags.map((tag) => `<span class="vocab-pos">${escapeHtml(tag)}</span>`).join('');
  return `<div class="vocab-entry">
  <p class="vocab-word">${escapeHtml(word)}${tagsHtml}</p>
  <p class="vocab-meaning">${escapeHtml(meaning)}</p>
  ${collocation ? `<p class="vocab-collocation"><span>Often with</span> ${escapeHtml(collocation)}</p>` : ''}
  ${example ? `<p class="vocab-example">&ldquo;${escapeHtml(example)}&rdquo;</p>` : ''}
</div>`;
}

// Self-check answer reveal for a writing/speaking task — same collapsible
// markup and CSS as the reading course's hand-written practice-question
// answers (main.css `.prose details.answer`), just authorable as a block
// instead of raw HTML.
function renderModelAnswer(attrs, bodyText, marked) {
  const label = attrs.label || 'Show a model answer';
  const bodyHtml = marked.parse(bodyText.trim());
  return `<details class="answer"><summary>${escapeHtml(label)}</summary><div class="answer-body">${bodyHtml}</div></details>`;
}

// The task itself for a writing/speaking lesson. `words="150-200"`,
// `time="60s"`, `register="formal"` attrs render as a small meta-chip row
// above the prompt text.
function renderPrompt(attrs, bodyText, marked) {
  const title = attrs.title || 'Your Turn';
  const chips = [];
  // `words` is authored as a full phrase already ("5 sentences", "60-90
  // words") rather than a bare number, so it's used verbatim here.
  if (attrs.words) chips.push({ glyph: 'edit', text: attrs.words });
  if (attrs.time) chips.push({ glyph: 'clock', text: attrs.time });
  if (attrs.register) chips.push({ glyph: 'messageCircle', text: attrs.register });
  const chipsHtml = chips.length
    ? `<div class="prompt-meta">${chips.map((c) => `<span class="prompt-chip">${icon(c.glyph)}${escapeHtml(c.text)}</span>`).join('')}</div>`
    : '';
  const bodyHtml = marked.parse(bodyText.trim());
  return `<div class="callout callout-prompt">
  <p class="callout-title">${icon('edit', 'callout-glyph')}${escapeHtml(title)}</p>
  ${chipsHtml}
  <div class="callout-body">${bodyHtml}</div>
</div>`;
}

// Countdown timer — the core anti-translation mechanic for speaking
// drills (see the approved plan): a visible countdown forces an
// immediate response, with nothing to translate from in the first place.
// Behavior lives in src/scripts/timer.js, activated by [data-timer].
function renderTimer(attrs) {
  const seconds = Number(attrs.seconds) || 10;
  const label = attrs.label || 'Respond before time runs out';
  return `<div class="timer-box" data-timer data-timer-seconds="${seconds}">
  <p class="timer-label">${escapeHtml(label)}</p>
  <div class="timer-display" data-timer-display>${seconds}</div>
  <button type="button" class="btn btn-accent btn-sm" data-timer-start>${icon('play')}<span>Start</span></button>
</div>`;
}

// Text-to-speech shadowing — the sentence to repeat, spoken via
// window.speechSynthesis (src/scripts/speak.js, [data-shadow-text]) so
// native-voice audio needs no hosted files.
function renderShadow(attrs, bodyText, marked) {
  const rate = attrs.rate || '0.9';
  const text = bodyText.trim();
  return `<div class="shadow-box" data-shadow-text="${escapeHtml(text)}" data-shadow-rate="${escapeHtml(rate)}">
  <p class="shadow-sentence">${marked.parseInline(text)}</p>
  <button type="button" class="btn btn-outline btn-sm" data-shadow-play>${icon('volume2')}<span>Listen</span></button>
</div>`;
}

// Self-recording — MediaRecorder capture, kept in-memory only, never
// uploaded or persisted (src/scripts/recorder.js, [data-recorder]). See
// the approved plan §0.3 for why this never touches localStorage.
function renderRecord(attrs) {
  const label = attrs.label || 'Record yourself, then compare to the model answer above.';
  return `<div class="recorder" data-recorder>
  <p class="recorder-label">${escapeHtml(label)}</p>
  <div class="recorder-controls">
    <button type="button" class="btn btn-outline btn-sm" data-recorder-start>${icon('mic')}<span>Record</span></button>
    <button type="button" class="btn btn-outline btn-sm" data-recorder-stop hidden>${icon('square')}<span>Stop</span></button>
    <span class="recorder-status" data-recorder-status>Not recorded yet</span>
  </div>
  <audio data-recorder-playback hidden controls></audio>
</div>`;
}

// A free-text scratch space for a writing task — plain textarea, nothing
// persisted (no backend, and localStorage is reserved for progress state
// per the approved plan). `placeholder="..."` overrides the default hint.
function renderDraft(attrs) {
  const placeholder = attrs.placeholder || 'Write your answer here before checking the model answer below…';
  return `<textarea class="textarea-input" placeholder="${escapeHtml(placeholder)}" rows="6"></textarea>`;
}

function renderBlock(type, attrs, bodyText, marked) {
  if (type === 'golden') return renderGolden(attrs, bodyText, marked);
  if (type === 'framework') return renderFramework(attrs, bodyText, marked);
  if (type === 'vocabulary') return renderVocabulary(attrs);
  if (type === 'model-answer') return renderModelAnswer(attrs, bodyText, marked);
  if (type === 'prompt') return renderPrompt(attrs, bodyText, marked);
  if (type === 'timer') return renderTimer(attrs);
  if (type === 'shadow') return renderShadow(attrs, bodyText, marked);
  if (type === 'record') return renderRecord(attrs);
  if (type === 'draft') return renderDraft(attrs);
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
      // Numbers are rendered as real text (not CSS counter(list-item)) so
      // an <ol start="8"> continuing a multi-part question list (see
      // CONTENT_GUIDE.md's practice-question convention) always shows the
      // right number — Chrome's implicit list-item counter does not
      // reliably pick up `start` the way `<ol>`'s own default marker does.
      list(token) {
        if (!token.ordered) {
          const items = token.items.map((item) => this.listitem(item)).join('');
          return `<ul>\n${items}</ul>\n`;
        }
        const items = token.items
          .map((item, i) => {
            const inner = this.parser.parse(item.tokens, !!item.loose);
            return `<li><span class="li-num" aria-hidden="true">${token.start + i}</span><div class="li-body">${inner}</div></li>\n`;
          })
          .join('');
        return `<ol>\n${items}</ol>\n`;
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

/** `prefix` defaults to "lesson" so every existing call site (new-lesson.js, validate-content.js) is unchanged. */
function isLessonDir(name, prefix = 'lesson') {
  const re = new RegExp(`^${prefix}-\\d{3,}$`);
  return re.test(name);
}

/**
 * Reads + validates every item in one content collection (reading,
 * writing, or speaking — see content/curriculum/collections.js). Throws
 * with all collected errors if any are invalid. Generalized out of the
 * old lesson-only `loadLessons()`, which is now a thin alias below.
 */
function loadCollection(collection) {
  const dir = path.join(CONTENT_ROOT, collection.dirName);
  if (!fs.existsSync(dir)) return [];
  const dirNames = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== '_template' && isLessonDir(e.name, collection.dirPrefix))
    .map((e) => e.name);

  const items = [];
  const allErrors = [];

  for (const dirName of dirNames) {
    const file = path.join(dir, dirName, collection.fileName);
    if (!fs.existsSync(file)) {
      allErrors.push(`content/${collection.dirName}/${dirName}: missing ${collection.fileName}`);
      continue;
    }
    const raw = fs.readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);
    const errors = validateFrontmatter(data, dirName, collection.dirName, collection.fileName);
    if (errors.length > 0) {
      allErrors.push(...errors);
      continue;
    }
    const expectedDir = `${collection.dirPrefix}-${String(data.number).padStart(3, '0')}`;
    if (dirName !== expectedDir) {
      allErrors.push(
        `content/${collection.dirName}/${dirName}: number ${data.number} implies folder "${expectedDir}", found "${dirName}"`
      );
    }
    if (content.trim().length === 0) {
      allErrors.push(`content/${collection.dirName}/${dirName}/${collection.fileName}: has no content body`);
    }
    items.push({ frontmatter: normalizeFrontmatter(data), rawBody: content, dirName });
  }

  if (allErrors.length > 0) {
    const err = new Error(`Content validation failed:\n${allErrors.map((e) => `  - ${e}`).join('\n')}`);
    err.contentErrors = allErrors;
    throw err;
  }

  items.sort((a, b) => a.frontmatter.number - b.frontmatter.number);
  return items;
}

/** Back-compat alias — every existing caller keeps working unchanged. */
function loadLessons() {
  return loadCollection(COLLECTIONS.reading);
}

function getPublishedLessons(lessons) {
  return lessons.filter((l) => l.frontmatter.status === 'published');
}

module.exports = {
  CONTENT_ROOT,
  LESSONS_DIR,
  DIFFICULTIES,
  STATUSES,
  levels,
  modules,
  loadLessons,
  loadCollection,
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
