// Highlights the active section in the lesson's "On this page" sidebar as
// the reader scrolls. Scroll-based rather than IntersectionObserver: with
// short trailing sections (e.g. "Golden Rule", "Lesson Summary"), an
// observer with a narrow trigger band can end up with nothing intersecting
// at all near the bottom of the page, leaving a stale highlight. Picking
// "the last heading whose top has scrolled above the threshold" has no
// such gap.
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    const toc = document.querySelector('.lesson-toc');
    if (!toc) return;
    const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
    if (links.length === 0) return;

    const sections = links
      .map((link) => {
        const el = document.getElementById(link.getAttribute('href').slice(1));
        return el ? { link: link, el: el } : null;
      })
      .filter(Boolean);
    if (sections.length === 0) return;

    const THRESHOLD = 110; // px from top of viewport

    let ticking = false;
    function update() {
      ticking = false;
      let active = sections[0];
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top - THRESHOLD <= 0) active = s;
        else break;
      }
      links.forEach((l) => l.classList.remove('active'));
      active.link.classList.add('active');
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
