// UI Panel Controller - binds HTML/CSS to CleanerRunner
// Adheres strictly to antislop: no buzzwords, 3 states, 44px buttons, AA contrast

import { CleanerRunner } from '../core/runner.js';
import { createClient } from '../core/client.js';

export function mountXCleaner(containerEl, ids, options = {}) {
  const panel = containerEl.querySelector('#xcleaner-root');
  if (!panel) return;

  const btnClose = panel.querySelector('#xc-btn-close');
  const btnStart = panel.querySelector('#xc-btn-start');
  const btnPause = panel.querySelector('#xc-btn-pause');
  const btnStop = panel.querySelector('#xc-btn-stop');
  const logBox = panel.querySelector('#xc-log-box');
  const statusBanner = panel.querySelector('#xc-status-banner');
  const progressSection = panel.querySelector('#xc-progress-section');
  const progressSummary = panel.querySelector('#xc-progress-summary');
  const progressActions = panel.querySelector('#xc-progress-actions');

  // Input elements
  const optPosts = panel.querySelector('#xc-opt-posts');
  const optUnretweet = panel.querySelector('#xc-opt-unretweet');
  const optUnlike = panel.querySelector('#xc-opt-unlike');
  const optPinned = panel.querySelector('#xc-opt-pinned');
  const optUrlOnly = panel.querySelector('#xc-opt-urlonly');
  const dateAfter = panel.querySelector('#xc-date-after');
  const dateBefore = panel.querySelector('#xc-date-before');
  const whitelistIds = panel.querySelector('#xc-whitelist-ids');

  let runner = null;

  function appendLog(level, message) {
    const time = new Date().toLocaleTimeString();
    const line = `[${time}] ${message}\n`;
    logBox.textContent += line;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function setBanner(type, message) {
    if (!message) {
      statusBanner.style.display = 'none';
      return;
    }
    statusBanner.className = `xc-status xc-status--${type}`;
    statusBanner.textContent = message;
    statusBanner.style.display = 'block';
  }

  btnClose.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  btnStart.addEventListener('click', async () => {
    // Validate selection
    if (!optPosts.checked && !optUnretweet.checked && !optUnlike.checked) {
      setBanner('error', 'Please select at least one item type to clean.');
      return;
    }

    setBanner(null);
    logBox.textContent = '';
    progressSection.style.display = 'flex';
    btnStart.style.display = 'none';
    btnPause.style.display = 'block';
    btnStop.style.display = 'block';

    const parseIds = whitelistIds.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const runOptions = {
      deletePosts: optPosts.checked,
      unretweet: optUnretweet.checked,
      unlike: optUnlike.checked,
      keepPinned: optPinned.checked,
      urlOnly: optUrlOnly.checked,
      afterDate: dateAfter.value ? new Date(dateAfter.value).getTime() : null,
      beforeDate: dateBefore.value ? new Date(dateBefore.value).getTime() : null,
      whitelistIds: parseIds
    };

    try {
      const txProvider = () => options.getTransactionId ? options.getTransactionId() : '';
      const client = createClient(
        txProvider,
        (waitMs) => {
          setBanner('rate', `Rate limited by X. Pausing for ${Math.ceil(waitMs / 1000)} seconds...`);
        },
        (lvl, msg) => appendLog(lvl, msg)
      );

      runner = new CleanerRunner(client, ids, runOptions, {
        onLog: (lvl, msg) => appendLog(lvl, msg),
        onProgress: (p) => {
          progressSummary.textContent = `Scanned: ${p.counters.scanned}`;
          progressActions.textContent = `Deleted: ${p.counters.deletedPosts} | Unretweeted: ${p.counters.unretweeted} | Unliked: ${p.counters.unliked}`;
          if (p.state === 'done') {
            setBanner('success', 'Cleaning completed. All matched posts have been removed.');
            btnStart.style.display = 'block';
            btnPause.style.display = 'none';
            btnStop.style.display = 'none';
          }
        },
        onError: (err) => {
          setBanner('error', `Error: ${err.message}`);
          btnStart.style.display = 'block';
          btnPause.style.display = 'none';
          btnStop.style.display = 'none';
        }
      });

      await runner.run();
    } catch (err) {
      setBanner('error', `Failed to start: ${err.message}`);
      btnStart.style.display = 'block';
      btnPause.style.display = 'none';
      btnStop.style.display = 'none';
    }
  });

  btnPause.addEventListener('click', () => {
    if (!runner) return;
    if (runner.state === 'running') {
      runner.pause();
      btnPause.textContent = 'Resume';
    } else if (runner.state === 'paused') {
      runner.resume();
      btnPause.textContent = 'Pause';
    }
  });

  btnStop.addEventListener('click', () => {
    if (runner) runner.stop();
    btnStart.style.display = 'block';
    btnPause.style.display = 'none';
    btnStop.style.display = 'none';
    setBanner('rate', 'Process stopped.');
  });
}
