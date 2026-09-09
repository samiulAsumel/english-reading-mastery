// Mobile nav toggle. Swaps the button's menu/close icon via a CSS class
// (see .icon-menu-open/.icon-menu-close in main.css) rather than
// swapping innerHTML, since both icons are already server-rendered.
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Toggle menu');
    });
  });
})();
