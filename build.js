// Bundler: compiles src into dist/extension and dist/xcleaner.user.js
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname || process.cwd());
const DIST = path.join(ROOT, 'dist');
const DIST_EXT = path.join(DIST, 'extension');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST_EXT, { recursive: true });

const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

const strip = code => code
  .replace(/^import\s+.*?;?\s*$/gm, '')
  .replace(/^export\s+(async\s+function\*?|function\*?|class|const|let|var)\s+/gm, '$1 ')
  .replace(/^export\s+\{.*?\};?\s*$/gm, '')
  .trim();

const modules = [
  'src/core/utils.js',
  'src/core/auth.js',
  'src/core/filters.js',
  'src/core/client.js',
  'src/core/tasks/tweets.js',
  'src/core/tasks/likes.js',
  'src/core/runner.js',
  'src/ui/panel.js',
  'src/ui/mount.js'
];

const bundle = `(() => {
  'use strict';
  const IDS = ${read('src/core/ids.json').trim()};
  const PANEL_HTML = ${JSON.stringify(read('src/ui/panel.html'))};
  const PANEL_CSS = ${JSON.stringify(read('src/ui/panel.css'))};

${modules.map(m => strip(read(m))).join('\n\n')}
})();`;

// 1. Extension output
fs.writeFileSync(path.join(DIST_EXT, 'manifest.json'), read('src/extension/manifest.json'), 'utf8');
fs.writeFileSync(path.join(DIST_EXT, 'content.js'), bundle, 'utf8');
fs.writeFileSync(path.join(DIST_EXT, 'panel.css'), read('src/ui/panel.css'), 'utf8');

// 2. Userscript output
fs.writeFileSync(path.join(DIST, 'xcleaner.user.js'), `${read('src/userscript/header.js').trim()}\n\n${bundle}\n`, 'utf8');

console.log('Build done: dist/extension/ + dist/xcleaner.user.js');
