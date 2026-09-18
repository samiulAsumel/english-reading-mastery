// Local-only progress tracking (localStorage). No backend — see
// ARCHITECTURE.md "Progress tracking: the swap point". Tracks three
// collections — reading ("lessons", kept as the original key name for
// backward compatibility with existing saved snapshots), writing, and
// speaking — sharing one unified streak (studying any of the three on a
// given day keeps it alive; see the approved plan §0.4). Powers three
// independent bits of UI, each only activated if its markup is present:
//   1. the mark-complete button on an item page (#mark-complete-btn)
//   2. the per-track cards on /progress/ (.dashboard-card[data-track])
//   3. the per-skill bars on /skills/ (.skill-row[data-skill-lessons])
(function () {
  'use strict';

  const KEY = 'erm:progress:v1';
  const COLLECTIONS = ['lessons', 'writing', 'speaking'];

  function today() { return new Date().toISOString().slice(0, 10); }

  function emptySnapshot() { return { lessons: {}, writing: {}, speaking: {}, streakDays: 0, lastStudyDate: undefined }; }

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      // Shallow merge onto emptySnapshot() so an existing v1 snapshot
      // (saved before writing/speaking existed) picks up the new empty
      // maps automatically — no version bump, no migration step.
      return raw ? Object.assign(emptySnapshot(), JSON.parse(raw)) : emptySnapshot();
    } catch (e) {
      return emptySnapshot();
    }
  }

  function write(snapshot) {
    try { localStorage.setItem(KEY, JSON.stringify(snapshot)); } catch (e) {}
  }

  function bumpStreak(snapshot) {
    const now = today();
    if (snapshot.lastStudyDate === now) return snapshot;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streakDays = snapshot.lastStudyDate === yesterday ? snapshot.streakDays + 1 : 1;
    return Object.assign({}, snapshot, { streakDays: streakDays, lastStudyDate: now });
  }

  function bucketFor(collection) {
    return COLLECTIONS.indexOf(collection) === -1 ? 'lessons' : collection;
  }

  const Store = {
    getSnapshot: read,
    markStarted: function (itemNumber, collection) {
      const bucket = bucketFor(collection);
      const snapshot = bumpStreak(read());
      if (!snapshot[bucket][itemNumber]) {
        snapshot[bucket][itemNumber] = { lessonNumber: itemNumber, status: 'started', startedAt: new Date().toISOString() };
      }
      write(snapshot);
      return snapshot;
    },
    markCompleted: function (itemNumber, collection) {
      const bucket = bucketFor(collection);
      const snapshot = bumpStreak(read());
      const existing = snapshot[bucket][itemNumber];
      snapshot[bucket][itemNumber] = {
        lessonNumber: itemNumber,
        status: 'completed',
        startedAt: existing ? existing.startedAt : new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      write(snapshot);
      return snapshot;
    },
    reset: function () {
      const snapshot = emptySnapshot();
      write(snapshot);
      return snapshot;
    },
  };

  window.ErmProgress = Store;

  function completedSet(snapshot, collection) {
    const bucket = bucketFor(collection);
    const set = new Set();
    Object.keys(snapshot[bucket]).forEach((k) => {
      if (snapshot[bucket][k].status === 'completed') set.add(Number(k));
    });
    return set;
  }

  function initMarkComplete() {
    const btn = document.getElementById('mark-complete-btn');
    if (!btn) return;
    const number = Number(btn.getAttribute('data-lesson-number'));
    const collection = btn.getAttribute('data-collection') || 'lessons';
    Store.markStarted(number, collection);

    var CHECK = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
    var CIRCLE = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>';

    function refresh() {
      const done = completedSet(Store.getSnapshot(), collection).has(number);
      btn.innerHTML = (done ? CHECK : CIRCLE) + '<span>' + (done ? 'Completed' : 'Mark as complete') + '</span>';
      btn.classList.toggle('btn-primary', done);
      btn.classList.toggle('btn-outline', !done);
    }
    refresh();
    btn.addEventListener('click', function () {
      Store.markCompleted(number, collection);
      refresh();
    });
  }

  function initDashboard() {
    const cards = document.querySelectorAll('.dashboard-card[data-track]');
    const streakEl = document.getElementById('progress-streak');
    if (cards.length === 0 && !streakEl) return;

    function render() {
      const snapshot = Store.getSnapshot();
      if (streakEl) streakEl.textContent = snapshot.streakDays + (snapshot.streakDays === 1 ? ' day' : ' days');

      cards.forEach((card) => {
        const collection = card.getAttribute('data-track');
        let items = [];
        try { items = JSON.parse(card.getAttribute('data-items') || '[]'); } catch (e) {}
        if (items.length === 0) return;

        const done = completedSet(snapshot, collection);
        const percentEl = card.querySelector('[data-role="percent"]');
        const fillEl = card.querySelector('[data-role="fill"]');
        const summaryEl = card.querySelector('[data-role="summary"]');
        const levelEl = card.querySelector('[data-role="level"]');
        const continueEl = card.querySelector('[data-role="continue"]');

        const completedCount = items.filter((it) => done.has(it.number)).length;
        const percent = Math.round((completedCount / items.length) * 100);
        const next = items.find((it) => !done.has(it.number)) || items[items.length - 1];

        if (percentEl) percentEl.textContent = percent + '%';
        if (fillEl) fillEl.style.width = percent + '%';
        if (summaryEl) summaryEl.textContent = completedCount + ' of ' + items.length + ' published, completed';
        if (levelEl) levelEl.textContent = next.levelName || '—';
        if (continueEl) {
          // href starts out as the collection's own routeBase (e.g.
          // "/writing/", set server-side) — read it once via a data
          // attribute so re-renders (after Reset) don't compound a number
          // onto an already-numbered href.
          if (!continueEl.getAttribute('data-route-base')) {
            continueEl.setAttribute('data-route-base', continueEl.getAttribute('href'));
          }
          const routeBase = continueEl.getAttribute('data-route-base');
          continueEl.textContent = '#' + next.number;
          continueEl.href = routeBase + next.number + '/';
        }
      });
    }

    render();

    const resetBtn = document.getElementById('progress-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        Store.reset();
        render();
      });
    }
  }

  function initSkills() {
    const rows = document.querySelectorAll('.skill-row[data-skill-lessons]');
    if (rows.length === 0) return;
    const done = completedSet(Store.getSnapshot(), 'lessons');
    rows.forEach((row) => {
      let lessonNumbers = [];
      try { lessonNumbers = JSON.parse(row.getAttribute('data-skill-lessons') || '[]'); } catch (e) {}
      if (lessonNumbers.length === 0) return;
      const completedCount = lessonNumbers.filter((n) => done.has(n)).length;
      const percent = Math.round((completedCount / lessonNumbers.length) * 100);
      const countEl = row.querySelector('.skill-count');
      const fillEl = row.querySelector('.progress-fill');
      if (countEl) countEl.textContent = completedCount + '/' + lessonNumbers.length + ' lessons · local';
      if (fillEl) fillEl.style.width = percent + '%';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMarkComplete();
    initDashboard();
    initSkills();
  });
})();
