// Text-to-speech shadowing ([data-shadow-text], produced by the
// `::: shadow` content block). Wraps window.speechSynthesis so a native
// spoken model is available for every sentence with zero hosted audio
// files. A no-op on any page without a [data-shadow-text] element, and
// degrades to a disabled button if the browser has no speechSynthesis.
(function () {
  'use strict';

  function initShadow(box) {
    const text = box.getAttribute('data-shadow-text') || '';
    const rate = parseFloat(box.getAttribute('data-shadow-rate')) || 0.9;
    const btn = box.querySelector('[data-shadow-play]');
    if (!btn || !text) return;

    if (!('speechSynthesis' in window)) {
      btn.disabled = true;
      btn.title = 'Speech playback is not supported in this browser.';
      return;
    }

    var VOLUME = btn.innerHTML;
    var STOP = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/></svg><span>Stop</span>';

    btn.addEventListener('click', function () {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btn.innerHTML = VOLUME;
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = 'en-US';
      utterance.onend = function () { btn.innerHTML = VOLUME; };
      utterance.onerror = function () { btn.innerHTML = VOLUME; };
      btn.innerHTML = STOP;
      window.speechSynthesis.speak(utterance);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-shadow-text]').forEach(initShadow);
  });
})();
