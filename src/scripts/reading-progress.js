// Thin progress bar fixed under the header, filling as the reader scrolls
// through the lesson article. Only present on lesson pages (the bar
// element itself is only rendered there — see layout()'s readingProgress
// option), so this script simply no-ops everywhere else.
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    const fill = document.getElementById('reading-progress-fill');
    const article = document.querySelector('.lesson-article');
    if (!fill || !article) return;

    let ticking = false;
    function update() {
      ticking = false;
      const rect = article.getBoundingClientRect();
      const articleHeight = rect.height - window.innerHeight * 0.5;
      const scrolled = -rect.top;
      const percent = articleHeight <= 0 ? 100 : Math.min(100, Math.max(0, (scrolled / articleHeight) * 100));
      fill.style.width = percent + '%';
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  });
})();
