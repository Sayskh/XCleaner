// Bundler: compiles src into dist/xcleaner.user.js
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname || process.cwd());
const DIST = path.join(ROOT, 'dist');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

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

fs.writeFileSync(path.join(DIST, 'xcleaner.user.js'), `${read('src/userscript/header.js').trim()}\n\n${bundle}\n`, 'utf8');

console.log('Build done: dist/xcleaner.user.js');
