// Theme toggle. The initial theme is applied by an inline script in
// <head> (see templates.js `themeInitScript`) so there's no flash before
// this file loads — this only wires up the button.
(function () {
  'use strict';

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'system';
  }

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
    updateToggleLabel();
  }

  function updateToggleLabel() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const dark = isDarkRendered();
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.textContent = dark ? '☀' : '☽'; // sun / crescent moon
  }

  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    updateToggleLabel();
    if (btn) {
      btn.addEventListener('click', function () {
        apply(isDarkRendered() ? 'light' : 'dark');
      });
    }
  });
})();
