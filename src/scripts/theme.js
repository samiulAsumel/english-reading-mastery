// Theme toggle. The initial theme is applied by an inline script in
// <head> (see templates.js `THEME_INIT_SCRIPT`) so there's no flash
// before this file loads — this only wires up the button and swaps its
// icon. Icon markup mirrors scripts/lib/icons.js's "sun"/"moon" entries
// (duplicated here since client scripts stay dependency-free — see
// CONTRIBUTING.md).
(function () {
  'use strict';

  var ICON_SVG_OPEN = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var SUN = ICON_SVG_OPEN + '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var MOON = ICON_SVG_OPEN + '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function isDarkRendered() {
    const explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark') return true;
    if (explicit === 'light') return false;
    return systemPrefersDark();
  }

  function apply(theme) {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.removeItem('erm:theme'); } catch (e) {}
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('erm:theme', theme); } catch (e) {}
    }
    updateToggle();
  }

  function updateToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const dark = isDarkRendered();
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = dark ? SUN : MOON;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    updateToggle();
    if (btn) {
      btn.addEventListener('click', function () {
        apply(isDarkRendered() ? 'light' : 'dark');
      });
    }
  });
})();
