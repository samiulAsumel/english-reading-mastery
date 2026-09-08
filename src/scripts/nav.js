// Mobile nav toggle.
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
})();
