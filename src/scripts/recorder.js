// Self-recording for speaking drills ([data-recorder], produced by the
// `::: record` content block). Records to an in-memory Blob only — never
// persisted to localStorage (which is ~5MB and string-only; a single
// clip would risk quota errors that progress.js's write() would swallow
// silently, see the approved plan §0.3) and never uploaded anywhere.
// Playback URL is revoked on re-record/teardown. Self-assessment only —
// no analysis of the recording happens anywhere in this file.
(function () {
  'use strict';

  function initRecorder(box) {
    const startBtn = box.querySelector('[data-recorder-start]');
    const stopBtn = box.querySelector('[data-recorder-stop]');
    const statusEl = box.querySelector('[data-recorder-status]');
    const audioEl = box.querySelector('[data-recorder-playback]');
    if (!startBtn || !stopBtn || !statusEl || !audioEl) return;

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      statusEl.textContent = 'Recording is not supported in this browser.';
      startBtn.disabled = true;
      return;
    }

    let mediaRecorder = null;
    let chunks = [];
    let objectUrl = null;

    function setStatus(text) { statusEl.textContent = text; }

    function teardownStream() {
      if (mediaRecorder && mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    }

    startBtn.addEventListener('click', function () {
      if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
          chunks = [];
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.addEventListener('dataavailable', function (e) {
            if (e.data && e.data.size > 0) chunks.push(e.data);
          });
          mediaRecorder.addEventListener('stop', function () {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            objectUrl = URL.createObjectURL(blob);
            audioEl.src = objectUrl;
            audioEl.hidden = false;
            setStatus('Recorded — compare yourself to the model answer above.');
            teardownStream();
          });
          mediaRecorder.start();
          setStatus('Recording…');
          startBtn.hidden = true;
          stopBtn.hidden = false;
        })
        .catch(function () {
          setStatus('Microphone access was denied or unavailable.');
        });
    });

    stopBtn.addEventListener('click', function () {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      startBtn.hidden = false;
      stopBtn.hidden = true;
    });

    window.addEventListener('beforeunload', function () {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      teardownStream();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-recorder]').forEach(initRecorder);
  });
})();
