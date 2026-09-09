'use strict';

const { escapeHtml } = require('./content');
const { icon } = require('./icons');

const SITE_NAME = 'English Mastery';
const SITE_URL = process.env.SITE_URL || 'http://localhost:4000';

function attrEscape(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

// Applied inline in <head>, before CSS/paint, so a saved dark-mode choice
// never flashes light first. External theme.js only wires up the toggle.
const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('erm:theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}`;

const NAV_ITEMS = [
  { href: '/course/', label: 'Course' },
  { href: '/lessons/', label: 'Lessons' },
  { href: '/vocabulary/', label: 'Vocabulary' },
  { href: '/skills/', label: 'Skills' },
  { href: '/progress/', label: 'Progress' },
];

function headerHtml(activePath) {
  const navLinks = NAV_ITEMS.map((item) => {
    const active = activePath.startsWith(item.href);
    return `<a href="${item.href}"${active ? ' aria-current="page"' : ''}>${item.label}</a>`;
  }).join('\n        ');

  const mobileLinks = NAV_ITEMS.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('\n          ');

  return `<header class="site-header">
    <div class="site-header-inner">
      <a href="/" class="brand">${icon('bookOpen', 'brand-mark')}${SITE_NAME}</a>
      <nav class="main-nav" aria-label="Main">
        ${navLinks}
      </nav>
      <div class="header-actions">
        <button type="button" class="btn btn-outline btn-sm search-trigger" data-search-open>
          ${icon('search')} Search <kbd>&#8984;K</kbd>
        </button>
        <button type="button" class="icon-btn search-icon-btn" data-search-open aria-label="Search">${icon('search')}</button>
        <button type="button" class="icon-btn" id="theme-toggle" aria-label="Toggle theme">${icon('moon')}</button>
        <button type="button" class="icon-btn mobile-nav-toggle" id="mobile-nav-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Toggle menu">${icon('menu', 'icon-menu-open')}${icon('x', 'icon-menu-close')}</button>
      </div>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">
      <ul>
        ${mobileLinks}
      </ul>
    </nav>
  </header>`;
}

function footerHtml() {
  return `<footer class="site-footer">
    <div class="site-footer-inner container">
      <p>${SITE_NAME} — a structured English reading course.</p>
      <nav aria-label="Footer">
        <a href="/course/">Course</a>
        <a href="/lessons/">Lessons</a>
        <a href="/skills/">Skills</a>
      </nav>
    </div>
  </footer>`;
}

function searchDialogHtml() {
  return `<dialog id="search-dialog" aria-label="Search lessons">
    <div class="search-panel">
      <div class="search-input-row">
        ${icon('search')}
        <input id="search-input" type="search" placeholder="Search lesson titles, concepts, vocabulary…" autocomplete="off">
      </div>
      <div id="search-results"></div>
    </div>
  </dialog>`;
}

function breadcrumbsHtml(items) {
  const parts = items.map((item, i) => {
    const sep = i > 0 ? `<span class="sep">${icon('chevronRight')}</span>` : '';
    const content = item.href
      ? `<a href="${item.href}">${escapeHtml(item.label)}</a>`
      : `<span aria-current="page">${escapeHtml(item.label)}</span>`;
    return `${sep}${content}`;
  }).join('\n      ');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
      ${parts}
    </nav>`;
}

function badgeHtml(text, variant) {
  const cls = variant ? ` badge-${variant}` : '';
  return `<span class="badge${cls}">${escapeHtml(text)}</span>`;
}

function badgeIconHtml(iconName, text, variant) {
  const cls = variant ? ` badge-${variant}` : '';
  return `<span class="badge badge-icon${cls}">${icon(iconName)}${escapeHtml(text)}</span>`;
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------
function layout({ title, description, path, bodyHtml, extraHead = '', extraScripts = '', readingProgress = false }) {
  const fullTitle = path === '/' ? SITE_NAME : `${title} · ${SITE_NAME}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${attrEscape(description)}">
  <link rel="canonical" href="${SITE_URL}${path}">
  <meta property="og:title" content="${attrEscape(fullTitle)}">
  <meta property="og:description" content="${attrEscape(description)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles/main.css">
  <script>${THEME_INIT_SCRIPT}</script>
  ${extraHead}
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to content</a>
  ${headerHtml(path)}
  ${readingProgress ? '<div id="reading-progress"><div id="reading-progress-fill"></div></div>' : ''}
  <main id="main-content">
${bodyHtml}
  </main>
  ${footerHtml()}
  ${searchDialogHtml()}
  <script defer src="/scripts/nav.js"></script>
  <script defer src="/scripts/theme.js"></script>
  <script defer src="/scripts/search.js"></script>
  <script defer src="/scripts/progress.js"></script>
  ${extraScripts}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Shared card partials
// ---------------------------------------------------------------------------
function levelCardHtml(level, lessonCount) {
  return `<a href="/levels/${level.slug}/" class="card">
        <div class="level-card-top">
          ${badgeHtml(level.cefrRange, 'muted')}
          <span class="xs muted">${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}</span>
        </div>
        <p class="level-card-title">${escapeHtml(level.name)}</p>
        <p class="level-card-tagline">${escapeHtml(level.tagline)}</p>
      </a>`;
}

function moduleCardHtml(mod, lessonCount) {
  return `<a href="/modules/${mod.slug}/" class="card">
        <div class="module-card-top">
          <span class="module-card-title">${escapeHtml(mod.name)}</span>
          <span class="xs muted" style="flex-shrink:0;">${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}</span>
        </div>
        <p class="module-card-desc">${escapeHtml(mod.description)}</p>
      </a>`;
}

function lessonCardHtml(lesson) {
  const fm = lesson.frontmatter;
  const searchBlob = [fm.title, fm.description, (fm.tags || []).join(' '), (fm.skills || []).join(' ')]
    .join(' ')
    .toLowerCase();
  return `<a href="/lessons/${fm.number}/" class="card" data-level="${fm.level}" data-search="${attrEscape(searchBlob)}">
        <div class="lesson-card-top">
          <span>Lesson ${fm.number}</span>
          <span class="lesson-card-time">${icon('clock')}${escapeHtml(fm.estimatedTime)}</span>
        </div>
        <p class="lesson-card-title">${escapeHtml(fm.title)}</p>
        <p class="lesson-card-desc">${escapeHtml(fm.description)}</p>
        ${badgeHtml(fm.difficulty, 'muted')}
      </a>`;
}

module.exports = {
  SITE_NAME,
  SITE_URL,
  attrEscape,
  layout,
  headerHtml,
  footerHtml,
  breadcrumbsHtml,
  badgeHtml,
  badgeIconHtml,
  levelCardHtml,
  moduleCardHtml,
  lessonCardHtml,
};
