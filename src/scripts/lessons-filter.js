// Progressive-enhancement filter for the /lessons/, /writing/, and
// /speaking/ index pages. Every card is already in the static HTML
// (works with JS off); this just hides/shows them client-side. The
// "X of Y ___" noun comes from #lessons-filter-count's data-noun-plural
// attribute (defaults to "lessons" for pages that don't set it).
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    const textInput = document.getElementById('lessons-filter-text');
    const levelSelect = document.getElementById('lessons-filter-level');
    const grid = document.getElementById('lessons-grid');
    const countEl = document.getElementById('lessons-filter-count');
    const emptyEl = document.getElementById('lessons-empty');
    if (!textInput || !grid) return;

    const cards = Array.from(grid.querySelectorAll('.card'));
    const total = cards.length;
    const nounPlural = (countEl && countEl.getAttribute('data-noun-plural')) || 'lessons';

    function apply() {
      const query = textInput.value.trim().toLowerCase();
      const level = levelSelect ? levelSelect.value : 'all';
      let visible = 0;
      cards.forEach((card) => {
        const matchesLevel = level === 'all' || card.getAttribute('data-level') === level;
        const matchesText = !query || (card.getAttribute('data-search') || '').includes(query);
        const show = matchesLevel && matchesText;
        card.hidden = !show;
        if (show) visible++;
      });
      if (countEl) countEl.textContent = visible + ' of ' + total + ' ' + nounPlural;
      if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    textInput.addEventListener('input', apply);
    if (levelSelect) levelSelect.addEventListener('change', apply);
    apply();
  });
})();
