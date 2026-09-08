'use strict';

/**
 * `npm run dev`: build once, serve dist/, then rebuild on every change
 * under content/ or src/. No hot-reload in the browser — just refresh
 * after a rebuild finishes (logged to the terminal).
 */
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const { createServer, PORT } = require('./serve');

const ROOT = path.join(__dirname, '..');

function build() {
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'validate-content.js')], { stdio: 'inherit', cwd: ROOT });
    execFileSync(process.execPath, [path.join(__dirname, 'build.js')], { stdio: 'inherit', cwd: ROOT });
  } catch (e) {
    console.error('Build failed — fix the error above and save again.');
  }
}

function debounce(fn, ms) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function watch(dir, onChange) {
  if (!fs.existsSync(dir)) return;
  try {
    fs.watch(dir, { recursive: true }, onChange);
  } catch (e) {
    // Recursive fs.watch isn't supported on every platform — fall back to
    // watching just the top-level directory (still catches most edits;
    // a new nested folder needs a dev-server restart to be picked up).
    fs.watch(dir, {}, onChange);
  }
}

build();
const server = createServer();
server.listen(PORT, () => {
  console.log(`Serving dist/ at http://localhost:${PORT} (watching content/ and src/ for changes)`);
});

const rebuild = debounce(() => {
  console.log('\nChange detected, rebuilding…');
  build();
}, 150);

watch(path.join(ROOT, 'content'), rebuild);
watch(path.join(ROOT, 'src'), rebuild);
