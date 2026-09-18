// Countdown timer for speaking/writing drills ([data-timer], produced by
// the `::: timer` content block). Pure setInterval — no dependency. The
// countdown is the anti-translation mechanic itself: it forces an
// immediate response, and the prompt gives nothing to translate from in
// the first place. A no-op on any page without a [data-timer] element.
(function () {
  'use strict';

  function initTimer(box) {
    const seconds = Number(box.getAttribute('data-timer-seconds')) || 10;
    const display = box.querySelector('[data-timer-display]');
    const startBtn = box.querySelector('[data-timer-start]');
    if (!display || !startBtn) return;

    let remaining = seconds;
    let intervalId = null;

    var PLAY = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    var STOP = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>';

    function render() {
      display.textContent = String(remaining);
      box.classList.toggle('timer-running', intervalId !== null);
      box.classList.toggle('timer-done', remaining === 0 && intervalId === null);
    }

    function stop(done) {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
      startBtn.innerHTML = PLAY + '<span>' + (done ? 'Start again' : 'Start') + '</span>';
      render();
    }

    function start() {
      remaining = seconds;
      startBtn.innerHTML = STOP + '<span>Restart</span>';
      render();
      intervalId = setInterval(function () {
        remaining -= 1;
        if (remaining <= 0) {
          remaining = 0;
          render();
          stop(true);
          return;
        }
        render();
      }, 1000);
    }

    startBtn.addEventListener('click', start);
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-timer]').forEach(initTimer);
  });
})();
