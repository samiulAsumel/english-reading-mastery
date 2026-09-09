'use strict';

const { levels, getLevel } = require('../../content/curriculum/levels');
const { modules, getModule, getModulesForLevel } = require('../../content/curriculum/modules');
const { skills, GROUP_LABELS } = require('../../content/curriculum/skills');
const { escapeHtml } = require('./content');
const { icon } = require('./icons');
const {
  layout,
  breadcrumbsHtml,
  badgeHtml,
  badgeIconHtml,
  levelCardHtml,
  moduleCardHtml,
  lessonCardHtml,
} = require('./templates');

function lessonsForLevel(publishedLessons, levelSlug) {
  return publishedLessons.filter((l) => l.frontmatter.level === levelSlug);
}
function lessonsForModule(publishedLessons, moduleSlug) {
  return publishedLessons.filter((l) => l.frontmatter.module === moduleSlug);
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
const READING_PROGRESSION = [
  { label: 'Beginner', text: 'Simple everyday English — instructions, short messages, basic labels.' },
  { label: 'Intermediate', text: 'News, websites, workplace communication, and straightforward nonfiction.' },
  { label: 'Upper Intermediate', text: 'Technical documentation, business articles, and longer nonfiction.' },
  { label: 'Advanced', text: 'Academic writing, research summaries, and professional documentation.' },
  { label: 'C1 / C2', text: 'Dense arguments, sophisticated essays, technical books, philosophy, and history.' },
  { label: 'Near-Native', text: 'Fast direct comprehension across domains, including implicit meaning and rhetorical nuance.' },
];

function journeyHtml() {
  return levels
    .map((level, i) => {
      const connector = i < levels.length - 1 ? '<div class="journey-connector" aria-hidden="true"></div>' : '';
      return `<a href="/levels/${level.slug}/" class="journey-item">
          <span class="journey-index">${i}</span>
          <span class="journey-row"><span>${escapeHtml(level.name)}</span><span class="xs muted">${escapeHtml(level.cefrRange)}</span></span>
        </a>
        ${connector}`;
    })
    .join('\n      ');
}

function homePage(publishedLessons) {
  const lessonCount = publishedLessons.length;
  const stats = [
    { value: String(lessonCount), label: lessonCount === 1 ? 'Lesson published' : 'Lessons published' },
    { value: String(levels.length), label: 'Skill levels' },
    { value: String(modules.length), label: 'Modules mapped' },
  ];

  const body = `
    <section class="hero">
      <div class="container-md">
        <h1 class="h1">Master English Reading.<br>Understand English Directly.</h1>
        <p class="lede" style="margin-inline:auto;">A structured journey from foundational English to advanced academic, technical, and critical reading — built to take you from sentence-level basics toward near-native comprehension, one lesson at a time.</p>
        <div class="hero-actions">
          <a href="/lessons/" class="btn btn-accent btn-lg">Start Learning &#8594;</a>
          <a href="/course/" class="btn btn-outline btn-lg">Explore Curriculum</a>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="stats-grid">
        ${stats.map((s) => `<div class="stat-card"><div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div></div>`).join('\n        ')}
      </div>
      ${lessonCount === 0 ? `<p class="small muted" style="margin-top:1rem;">The platform is live and the curriculum is mapped — lessons are being added now. <a href="/course/" style="color:var(--brand-primary);text-decoration:underline;">See the full course structure &#8594;</a></p>` : ''}
    </section>

    <section class="border-y bg-muted">
      <div class="container-md" style="padding-block:4rem;">
        <div style="text-align:center;margin-bottom:2rem;">
          <h2 class="h2">Where you&rsquo;re going</h2>
          <p class="muted" style="margin-top:0.5rem;">Nine levels, from orientation to near-native reading.</p>
        </div>
        <div class="journey">
          ${journeyHtml()}
        </div>
      </div>
    </section>

    <section class="section container-md">
      <h2 class="h2" style="margin-bottom:2rem;">What you&rsquo;ll eventually be able to read</h2>
      <div class="progression-grid">
        ${READING_PROGRESSION.map((item) => `<div class="progression-item"><div class="progression-label">${item.label}</div><p class="progression-text">${item.text}</p></div>`).join('\n        ')}
      </div>
      <p class="xs muted" style="margin-top:1.5rem;">The curriculum is architected toward these outcomes. Completing a level builds these capabilities progressively — it isn&rsquo;t a guarantee of a CEFR certification.</p>
    </section>

    <section style="border-top:1px solid var(--border);">
      <div class="container-sm" style="padding-block:4rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <h2 class="h2">Find any lesson instantly</h2>
        <p class="muted small" style="max-width:24rem;">Search titles, vocabulary, and frameworks across the entire course with <kbd style="border:1px solid var(--border);background:var(--muted-bg);border-radius:0.25rem;padding:0.05rem 0.4rem;">&#8984;K</kbd>.</p>
      </div>
    </section>`;

  return layout({
    title: 'Home',
    description: 'A structured journey from foundational English to advanced academic, technical, and critical reading — direct understanding, not translation.',
    path: '/',
    bodyHtml: body,
  });
}

// ---------------------------------------------------------------------------
// Course overview
// ---------------------------------------------------------------------------
function coursePage(publishedLessons) {
  const items = levels
    .map((level, i) => {
      const modulesForLevel = getModulesForLevel(level.slug);
      const lessonCount = lessonsForLevel(publishedLessons, level.slug).length;
      const connector = i < levels.length - 1 ? '<div class="outline-connector" aria-hidden="true"></div>' : '';
      const modulesHtml = modulesForLevel.length
        ? `<div class="outline-modules">
            ${modulesForLevel
              .map((mod) => `<a href="/modules/${mod.slug}/" class="outline-module"><span class="name">${escapeHtml(mod.name)}</span><span class="desc">— ${escapeHtml(mod.description)}</span></a>`)
              .join('\n            ')}
          </div>`
        : '';
      return `<li class="outline-item" style="margin-bottom:2.5rem;">
        <span class="outline-marker">${i}</span>
        ${connector}
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;">
          <a href="/levels/${level.slug}/" class="h2" style="text-decoration:none;">${escapeHtml(level.name)}</a>
          ${badgeHtml(level.cefrRange, 'muted')}
          <span class="xs muted">${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'} published</span>
        </div>
        <p class="small muted" style="margin-top:0.35rem;max-width:42rem;">${escapeHtml(level.description)}</p>
        ${modulesHtml}
      </li>`;
    })
    .join('\n      ');

  const body = `
    <div class="container-md section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Course' }])}
      <h1 class="h1" style="margin-top:1rem;">Course Overview</h1>
      <p class="lede" style="margin-top:0.75rem;">Nine levels carry the course from orientation to near-native reading. Every lesson belongs to exactly one module within one level — browse the whole map below, or jump straight to <a href="/lessons/" style="color:var(--brand-primary);text-decoration:underline;">all lessons</a>.</p>
      <ol style="margin-top:2.5rem;">
        ${items}
      </ol>
    </div>`;

  return layout({
    title: 'Course Overview',
    description: 'The full English Mastery curriculum: nine levels, their modules, and what each stage teaches.',
    path: '/course/',
    bodyHtml: body,
  });
}

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------
function levelsIndexPage(publishedLessons) {
  const cards = levels.map((level) => levelCardHtml(level, lessonsForLevel(publishedLessons, level.slug).length)).join('\n        ');
  const body = `
    <div class="container section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Levels' }])}
      <h1 class="h1" style="margin-top:1rem;">Levels</h1>
      <p class="lede" style="margin-top:0.75rem;">Each level is a stage of reading capability, not just a lesson-number range.</p>
      <div class="card-grid card-grid-3" style="margin-top:2rem;">
        ${cards}
      </div>
    </div>`;
  return layout({
    title: 'Levels',
    description: 'Browse the nine skill levels of English Mastery, from orientation to near-native reading.',
    path: '/levels/',
    bodyHtml: body,
  });
}

function levelDetailPage(level, publishedLessons) {
  const modulesForLevel = getModulesForLevel(level.slug);
  const modulesHtml = modulesForLevel.length
    ? modulesForLevel.map((mod) => moduleCardHtml(mod, lessonsForModule(publishedLessons, mod.slug).length)).join('\n        ')
    : `<p class="small muted">No modules mapped to this level yet.</p>`;
  const canReadHtml = level.canRead.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  const body = `
    <div class="container-md section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Levels', href: '/levels/' }, { label: level.name }])}
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;margin-top:1rem;">
        <h1 class="h1">${escapeHtml(level.name)}</h1>
        ${badgeHtml(level.cefrRange, 'muted')}
      </div>
      <p class="lede" style="margin-top:0.75rem;">${escapeHtml(level.description)}</p>

      <div class="callout callout-note" style="margin-top:1.5rem;">
        <p class="callout-title">What you can read at this level</p>
        <ul style="list-style:disc;margin-left:1.25rem;font-size:0.9375rem;">${canReadHtml}</ul>
      </div>

      <h2 class="h2" style="margin-top:2.5rem;margin-bottom:1rem;">Modules</h2>
      <div style="display:flex;flex-direction:column;gap:1rem;">
        ${modulesHtml}
      </div>
    </div>`;

  return layout({
    title: level.name,
    description: level.description,
    path: `/levels/${level.slug}/`,
    bodyHtml: body,
  });
}

// ---------------------------------------------------------------------------
// Modules
// ---------------------------------------------------------------------------
function modulesIndexPage(publishedLessons) {
  const items = modules
    .map((mod) => {
      const level = getLevel(mod.level);
      return `<div style="display:flex;flex-direction:column;gap:0.4rem;">
        <span class="xs muted" style="text-transform:uppercase;letter-spacing:0.02em;">${level ? escapeHtml(level.name) : ''}</span>
        ${moduleCardHtml(mod, lessonsForModule(publishedLessons, mod.slug).length)}
      </div>`;
    })
    .join('\n      ');

  const body = `
    <div class="container-md section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Modules' }])}
      <h1 class="h1" style="margin-top:1rem;">Modules</h1>
      <p class="lede" style="margin-top:0.75rem;">Modules group lessons that build the same skill within a level.</p>
      <div style="margin-top:2rem;display:flex;flex-direction:column;gap:1rem;">
        ${items}
      </div>
    </div>`;

  return layout({
    title: 'Modules',
    description: 'Every module in the English Mastery curriculum, grouped by skill level.',
    path: '/modules/',
    bodyHtml: body,
  });
}

function moduleDetailPage(mod, publishedLessons) {
  const level = getLevel(mod.level);
  const lessons = lessonsForModule(publishedLessons, mod.slug);
  const lessonsHtml = lessons.length
    ? `<div class="card-grid card-grid-2">${lessons.map(lessonCardHtml).join('\n        ')}</div>`
    : `<p class="small muted">No lessons published in this module yet.</p>`;

  const body = `
    <div class="container-md section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Modules', href: '/modules/' }, { label: mod.name }])}
      <h1 class="h1" style="margin-top:1rem;">${escapeHtml(mod.name)}</h1>
      ${level ? `<p class="small muted" style="margin-top:0.25rem;">Part of <span style="color:var(--fg);">${escapeHtml(level.name)}</span></p>` : ''}
      <p class="lede" style="margin-top:0.75rem;">${escapeHtml(mod.description)}</p>

      <h2 class="h2" style="margin-top:2.5rem;margin-bottom:1rem;">Lessons</h2>
      ${lessonsHtml}
    </div>`;

  return layout({
    title: mod.name,
    description: mod.description,
    path: `/modules/${mod.slug}/`,
    bodyHtml: body,
  });
}

// ---------------------------------------------------------------------------
// Lessons index
// ---------------------------------------------------------------------------
function lessonsIndexPage(publishedLessons) {
  const levelOptions = levels.map((l) => `<option value="${l.slug}">${escapeHtml(l.name)}</option>`).join('');
  const cards = publishedLessons.map(lessonCardHtml).join('\n        ');
  const emptyMessage = publishedLessons.length === 0
    ? 'No lessons have been published yet. Check back soon.'
    : 'No lessons match your filters.';

  const body = `
    <div class="container section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Lessons' }])}
      <h1 class="h1" style="margin-top:1rem;">All Lessons</h1>
      <p class="lede" style="margin-top:0.75rem;">${publishedLessons.length} ${publishedLessons.length === 1 ? 'lesson' : 'lessons'} published so far.</p>

      <div class="filter-bar" style="margin-top:2rem;">
        <input type="search" id="lessons-filter-text" class="text-input" placeholder="Filter by title, tag, or skill…">
        <select id="lessons-filter-level" class="select-input">
          <option value="all">All levels</option>
          ${levelOptions}
        </select>
      </div>
      <p class="xs muted" id="lessons-filter-count" style="margin-top:0.75rem;">${publishedLessons.length} of ${publishedLessons.length} lessons</p>

      <div class="empty-state" id="lessons-empty" ${publishedLessons.length === 0 ? '' : 'hidden'} style="margin-top:1.5rem;">${emptyMessage}</div>
      <div class="card-grid card-grid-2" id="lessons-grid" style="margin-top:1.5rem;">
        ${cards}
      </div>
    </div>`;

  return layout({
    title: 'All Lessons',
    description: 'Browse and search every published lesson in the English Mastery course.',
    path: '/lessons/',
    bodyHtml: body,
    extraScripts: '<script defer src="/scripts/lessons-filter.js"></script>',
  });
}

// ---------------------------------------------------------------------------
// Lesson detail
// ---------------------------------------------------------------------------
function lessonDetailPage({ lesson, bodyHtml, toc, previous, next }) {
  const fm = lesson.frontmatter;
  const level = getLevel(fm.level);
  const mod = getModule(fm.module);

  const objectivesHtml = fm.objectives.length
    ? `<div class="objectives-box">
        <p class="callout-title">${icon('target', 'callout-glyph')}Learning Objectives</p>
        <p class="small muted" style="margin-bottom:0.5rem;">By the end of this lesson, you should be able to:</p>
        <ul>${fm.objectives.map((o) => `<li>${icon('check')}<span>${escapeHtml(o)}</span></li>`).join('')}</ul>
      </div>`
    : '';

  const tagsHtml = fm.tags.slice(0, 4).map((t) => badgeHtml(t, 'outline')).join(' ');

  const tocHtml = toc.length
    ? `<aside>
        <nav class="lesson-toc" aria-label="On this page">
          <p class="lesson-toc-title">On this page</p>
          <ul>
            ${toc.map((entry) => `<li><a href="#${entry.slug}"${entry.depth === 3 ? ' class="depth-3"' : ''}>${escapeHtml(entry.text)}</a></li>`).join('\n            ')}
          </ul>
        </nav>
      </aside>`
    : '<aside></aside>';

  const prevHtml = previous
    ? `<a href="/lessons/${previous.frontmatter.number}/" class="lesson-nav-link prev">
        <span class="lesson-nav-eyebrow">${icon('arrowLeft')}Previous Lesson</span>
        <span class="lesson-nav-title">${previous.frontmatter.number}. ${escapeHtml(previous.frontmatter.title)}</span>
      </a>`
    : '<span></span>';
  const nextHtml = next
    ? `<a href="/lessons/${next.frontmatter.number}/" class="lesson-nav-link next">
        <span class="lesson-nav-eyebrow">Next Lesson${icon('arrowRight')}</span>
        <span class="lesson-nav-title">${next.frontmatter.number}. ${escapeHtml(next.frontmatter.title)}</span>
      </a>`
    : '<span></span>';

  const body = `
    <div class="container section-tight">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Lessons', href: '/lessons/' }, { label: `Lesson ${fm.number}` }])}
      <div class="lesson-layout" style="margin-top:1.5rem;">
        <article class="lesson-article">
          <header style="margin-bottom:2.5rem;">
            <p class="lesson-eyebrow">${level ? escapeHtml(level.name) : ''}${mod ? ` &middot; ${escapeHtml(mod.name)}` : ''}</p>
            <h1 class="h1" style="margin-top:0.5rem;">Lesson ${fm.number}: ${escapeHtml(fm.title)}</h1>
            <p class="lesson-desc">${escapeHtml(fm.description)}</p>
            <div class="lesson-meta">
              ${badgeIconHtml('gauge', fm.difficulty, 'muted')}
              ${badgeIconHtml('clock', fm.estimatedTime, 'muted')}
              ${tagsHtml}
            </div>
          </header>

          ${objectivesHtml}

          <div class="prose">
            ${bodyHtml}
          </div>

          <div class="lesson-footer-bar">
            <p class="xs muted">Lesson ${fm.number} of ${level ? escapeHtml(level.name) : 'the course'}</p>
            <button type="button" class="btn btn-outline btn-sm" id="mark-complete-btn" data-lesson-number="${fm.number}">${icon('circle')}<span>Mark as complete</span></button>
          </div>

          <nav class="lesson-nav">
            ${prevHtml}
            ${nextHtml}
          </nav>
        </article>

        ${tocHtml}
      </div>
    </div>`;

  return layout({
    title: `Lesson ${fm.number}: ${fm.title}`,
    description: fm.description,
    path: `/lessons/${fm.number}/`,
    bodyHtml: body,
    readingProgress: true,
    extraScripts: '<script defer src="/scripts/toc.js"></script>\n  <script defer src="/scripts/reading-progress.js"></script>',
  });
}

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------
function vocabularyPage(entries) {
  const listHtml = entries.length
    ? entries
        .map((entry) => {
          const links = entry.lessonNumbers.map((n) => `<a href="/lessons/${n}/">Lesson ${n}</a>`).join(', ');
          return `<div class="vocab-list-item">
            <p class="vocab-word">${escapeHtml(entry.word)}${entry.pos ? `<span class="vocab-pos">${escapeHtml(entry.pos)}</span>` : ''}</p>
            <p class="vocab-meaning">${escapeHtml(entry.meaning)}</p>
            ${entry.example ? `<p class="vocab-example">&ldquo;${escapeHtml(entry.example)}&rdquo;</p>` : ''}
            <p class="vocab-appears">Appears in ${links}</p>
          </div>`;
        })
        .join('\n        ')
    : `<div class="empty-state">No vocabulary indexed yet — it appears here as soon as lessons use the <code>::: vocabulary</code> block.</div>`;

  const body = `
    <div class="container-md section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Vocabulary' }])}
      <h1 class="h1" style="margin-top:1rem;">Vocabulary</h1>
      <p class="lede" style="margin-top:0.75rem;">${entries.length} ${entries.length === 1 ? 'word' : 'words'} indexed automatically from every lesson that introduces it.</p>
      <div class="vocab-list" style="margin-top:2rem;border:1px solid var(--border);border-radius:0.5rem;padding:0 1.25rem;">
        ${listHtml}
      </div>
    </div>`;

  return layout({
    title: 'Vocabulary',
    description: 'Every vocabulary item taught across the course, aggregated automatically from lesson content.',
    path: '/vocabulary/',
    bodyHtml: body,
  });
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
function skillsPage(publishedLessons) {
  const lessonNumbersBySkill = new Map();
  for (const lesson of publishedLessons) {
    for (const skillSlug of lesson.frontmatter.skills) {
      const list = lessonNumbersBySkill.get(skillSlug) || [];
      list.push(lesson.frontmatter.number);
      lessonNumbersBySkill.set(skillSlug, list);
    }
  }

  const grouped = {};
  for (const skill of skills) {
    (grouped[skill.group] = grouped[skill.group] || []).push(skill);
  }

  const sectionsHtml = Object.keys(grouped)
    .map((group) => {
      const rows = grouped[group]
        .map((skill) => {
          const lessonNumbers = lessonNumbersBySkill.get(skill.slug) || [];
          return `<div class="skill-row" data-skill-lessons='${JSON.stringify(lessonNumbers)}'>
            <div class="skill-row-top">
              <span>${escapeHtml(skill.name)}</span>
              <span class="skill-count xs muted">${lessonNumbers.length === 0 ? 'Not yet covered' : `0/${lessonNumbers.length} lessons · local`}</span>
            </div>
            <div class="progress-track"><div class="progress-fill"></div></div>
          </div>`;
        })
        .join('\n          ');
      return `<section style="margin-top:2.5rem;">
        <h2 class="h2" style="margin-bottom:1rem;">${GROUP_LABELS[group] || group}</h2>
        ${rows}
      </section>`;
    })
    .join('\n      ');

  const body = `
    <div class="container-md section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Skills' }])}
      <h1 class="h1" style="margin-top:1rem;">Skills</h1>
      <p class="lede" style="margin-top:0.75rem;">Course coverage below reflects published lessons only. Your personal mastery bars are a local prototype — stored only in this browser, not a certified assessment.</p>
      ${sectionsHtml}
    </div>`;

  return layout({
    title: 'Skills',
    description: 'Every reading skill the course teaches, with how much content covers it so far.',
    path: '/skills/',
    bodyHtml: body,
  });
}

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
function progressPage(publishedLessons) {
  const lessonsData = publishedLessons.map((l) => ({
    number: l.frontmatter.number,
    level: l.frontmatter.level,
    levelName: (getLevel(l.frontmatter.level) || {}).name || '',
  }));

  const body = `
    <div class="container-md section">
      ${breadcrumbsHtml([{ label: 'Home', href: '/' }, { label: 'Progress' }])}
      <h1 class="h1" style="margin-top:1rem;">Your Progress</h1>
      <p class="lede" style="margin-top:0.75rem;">Stored locally in this browser only — a prototype. Clearing site data resets it.</p>

      <div id="progress-app" data-lessons='${JSON.stringify(lessonsData)}' style="margin-top:2rem;display:flex;flex-direction:column;gap:1.5rem;">
        <div class="dashboard-card">
          <div class="dashboard-top"><span>Overall Progress</span><span id="progress-percent">0%</span></div>
          <div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div>
          <p class="xs muted" id="progress-summary" style="margin-top:0.5rem;">${lessonsData.length === 0 ? 'No lessons published yet.' : ''}</p>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-tile">
            <p class="dashboard-tile-label">Current Level</p>
            <p class="dashboard-tile-value" id="progress-level">&mdash;</p>
          </div>
          <div class="dashboard-tile">
            <p class="dashboard-tile-label">Continue Learning</p>
            <a class="dashboard-tile-value" id="progress-continue" href="/lessons/" style="color:var(--brand-primary);text-decoration:none;">&mdash;</a>
          </div>
          <div class="dashboard-tile dashboard-tile-icon">
            ${icon('trendingUp', 'dashboard-tile-icon-glyph')}
            <div>
              <p class="dashboard-tile-label">Learning Streak</p>
              <p class="dashboard-tile-value" id="progress-streak">0 days</p>
            </div>
          </div>
        </div>

        <button type="button" class="btn btn-ghost btn-sm" id="progress-reset" style="width:fit-content;">${icon('rotateCcw')}<span>Reset local progress</span></button>
      </div>
    </div>`;

  return layout({
    title: 'Your Progress',
    description: 'Track lessons completed, current level, and streak.',
    path: '/progress/',
    bodyHtml: body,
  });
}

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------
function notFoundPage() {
  const body = `
    <div class="not-found">
      <p class="xs muted" style="font-family:var(--font-mono);">404</p>
      <h1 class="h2">Page not found</h1>
      <p class="small muted">That lesson, level, or module doesn&rsquo;t exist yet.</p>
      <a href="/" class="btn btn-primary">Back to home</a>
    </div>`;
  return layout({
    title: 'Page Not Found',
    description: 'That page does not exist.',
    path: '/404.html',
    bodyHtml: body,
  });
}

module.exports = {
  homePage,
  coursePage,
  levelsIndexPage,
  levelDetailPage,
  modulesIndexPage,
  moduleDetailPage,
  lessonsIndexPage,
  lessonDetailPage,
  vocabularyPage,
  skillsPage,
  progressPage,
  notFoundPage,
};
