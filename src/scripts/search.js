// Command-palette search. Uses the native <dialog> element (Esc-to-close,
// ::backdrop, and focus handling all come free). Data comes from
// /search-index.json, generated at build time from published lessons.
(function () {
  'use strict';

  let records = null;
  let loading = null;

  function loadRecords() {
    if (records) return Promise.resolve(records);
    if (loading) return loading;
    loading = fetch('/search-index.json')
      .then((res) => res.json())
      .then((data) => {
        records = data.records || [];
        return records;
      })
      .catch(() => {
        records = [];
        return records;
      });
    return loading;
  }

  function score(record, query) {
    const q = query.toLowerCase();
    const haystacks = [
      { text: record.title.toLowerCase(), weight: 3 },
      { text: (record.tags || []).join(' ').toLowerCase(), weight: 2 },
      { text: (record.skills || []).join(' ').toLowerCase(), weight: 2 },
      { text: record.description.toLowerCase(), weight: 1 },
    ];
    let best = 0;
    for (const h of haystacks) {
      if (h.text.startsWith(q)) best = Math.max(best, h.weight * 3);
      else if (h.text.includes(q)) best = Math.max(best, h.weight);
    }
    return best;
  }

  function filterRecords(all, query) {
    if (!query.trim()) return all.slice(0, 8);
    return all
      .map((r) => ({ r, s: score(r, query) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 20)
      .map((x) => x.r);
  }

  function render(list, container, query) {
    container.innerHTML = '';
    if (list.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = records && records.length === 0
        ? 'No lessons published yet.'
        : 'No lessons match “' + query + '”.';
      container.appendChild(empty);
      return;
    }
    list.forEach((r, i) => {
      const a = document.createElement('a');
      a.href = r.href;
      a.className = 'search-result' + (i === 0 ? ' active' : '');
      a.innerHTML =
        '<span class="search-result-title">Lesson ' + r.number + ' · ' + escapeHtml(r.title) + '</span>' +
        '<span class="search-result-desc">' + escapeHtml(r.description) + '</span>';
      container.appendChild(a);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  document.addEventListener('DOMContentLoaded', function () {
    const dialog = document.getElementById('search-dialog');
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    const openBtns = document.querySelectorAll('[data-search-open]');
    if (!dialog || !input || !results) return;

    function openDialog() {
      dialog.showModal();
      input.value = '';
      input.focus();
      loadRecords().then((all) => render(filterRecords(all, ''), results, ''));
    }

    openBtns.forEach((btn) => btn.addEventListener('click', openDialog));

    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.open) dialog.close();
        else openDialog();
      }
    });

    // Click on the ::backdrop (outside the panel) closes the dialog.
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });

    input.addEventListener('input', function () {
      if (!records) return;
      render(filterRecords(records, input.value), results, input.value);
    });

    results.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const items = Array.from(results.querySelectorAll('.search-result'));
      if (items.length === 0) return;
      const activeIdx = items.findIndex((el) => el.classList.contains('active'));
      const nextIdx = e.key === 'ArrowDown'
        ? Math.min(items.length - 1, activeIdx + 1)
        : Math.max(0, activeIdx - 1);
      items.forEach((el) => el.classList.remove('active'));
      items[nextIdx].classList.add('active');
      items[nextIdx].scrollIntoView({ block: 'nearest' });
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const active = results.querySelector('.search-result.active') || results.querySelector('.search-result');
        if (active) { e.preventDefault(); window.location.href = active.getAttribute('href'); }
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        results.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }));
      }
    });
  });
})();
