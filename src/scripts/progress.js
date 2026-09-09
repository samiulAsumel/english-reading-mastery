// Local-only progress tracking (localStorage). No backend — see
// ARCHITECTURE.md "Progress tracking: the swap point". Powers three
// independent bits of UI, each only activated if its markup is present:
//   1. the mark-complete button on a lesson page (#mark-complete-btn)
//   2. the dashboard on /progress/ (#progress-app)
//   3. the per-skill bars on /skills/ (.skill-row[data-skill-lessons])
(function () {
  'use strict';

  const KEY = 'erm:progress:v1';

  function today() { return new Date().toISOString().slice(0, 10); }

  function emptySnapshot() { return { lessons: {}, streakDays: 0, lastStudyDate: undefined }; }

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : emptySnapshot();
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

  const Store = {
    getSnapshot: read,
    markStarted: function (lessonNumber) {
      const snapshot = bumpStreak(read());
      if (!snapshot.lessons[lessonNumber]) {
        snapshot.lessons[lessonNumber] = { lessonNumber: lessonNumber, status: 'started', startedAt: new Date().toISOString() };
      }
      write(snapshot);
      return snapshot;
    },
    markCompleted: function (lessonNumber) {
      const snapshot = bumpStreak(read());
      const existing = snapshot.lessons[lessonNumber];
      snapshot.lessons[lessonNumber] = {
        lessonNumber: lessonNumber,
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

  function completedSet(snapshot) {
    const set = new Set();
    Object.keys(snapshot.lessons).forEach((k) => {
      if (snapshot.lessons[k].status === 'completed') set.add(Number(k));
    });
    return set;
  }

  function initMarkComplete() {
    const btn = document.getElementById('mark-complete-btn');
    if (!btn) return;
    const number = Number(btn.getAttribute('data-lesson-number'));
    Store.markStarted(number);

    var CHECK = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
    var CIRCLE = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>';

    function refresh() {
      const done = completedSet(Store.getSnapshot()).has(number);
      btn.innerHTML = (done ? CHECK : CIRCLE) + '<span>' + (done ? 'Completed' : 'Mark as complete') + '</span>';
      btn.classList.toggle('btn-primary', done);
      btn.classList.toggle('btn-outline', !done);
    }
    refresh();
    btn.addEventListener('click', function () {
      Store.markCompleted(number);
      refresh();
    });
  }

  function initDashboard() {
    const app = document.getElementById('progress-app');
    if (!app) return;
    let lessons = [];
    try { lessons = JSON.parse(app.getAttribute('data-lessons') || '[]'); } catch (e) {}

    function render() {
      const snapshot = Store.getSnapshot();
      const done = completedSet(snapshot);

      const percentEl = document.getElementById('progress-percent');
      const fillEl = document.getElementById('progress-fill');
      const summaryEl = document.getElementById('progress-summary');
      const levelEl = document.getElementById('progress-level');
      const continueEl = document.getElementById('progress-continue');
      const streakEl = document.getElementById('progress-streak');

      if (lessons.length === 0) {
        if (summaryEl) summaryEl.textContent = 'No lessons published yet.';
        return;
      }

      const completedCount = lessons.filter((l) => done.has(l.number)).length;
      const percent = Math.round((completedCount / lessons.length) * 100);
      const next = lessons.find((l) => !done.has(l.number)) || lessons[lessons.length - 1];

      if (percentEl) percentEl.textContent = percent + '%';
      if (fillEl) fillEl.style.width = percent + '%';
      if (summaryEl) summaryEl.textContent = completedCount + ' of ' + lessons.length + ' published lessons completed';
      if (levelEl) levelEl.textContent = next.levelName || '—';
      if (continueEl) { continueEl.textContent = 'Lesson ' + next.number; continueEl.href = '/lessons/' + next.number + '/'; }
      if (streakEl) streakEl.textContent = snapshot.streakDays + (snapshot.streakDays === 1 ? ' day' : ' days');
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
    const done = completedSet(Store.getSnapshot());
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
