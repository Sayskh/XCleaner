// Mount logic: injects FAB + panel into x.com page
// Uses globals: IDS, PANEL_HTML, PANEL_CSS, mountXCleaner (defined by build.js inlining)

function detectTheme() {
  const cls = document.documentElement.classList;
  if (cls.contains('dark')) return 'dark';
  if (cls.contains('light')) return 'light';
  return null;
}

function applyTheme(panel) {
  const theme = detectTheme();
  if (theme) panel.setAttribute('data-xc-theme', theme);
  else panel.removeAttribute('data-xc-theme');
}

function injectFloatingUI() {
  if (document.getElementById('xcleaner-fab') || document.getElementById('xcleaner-root')) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'xcleaner-styles';
  styleEl.textContent = PANEL_CSS;
  document.head.appendChild(styleEl);

  const fab = document.createElement('button');
  fab.id = 'xcleaner-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Open XCleaner');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M4 7h16M4 12h10M4 17h16"/><path d="M17 10l4 4M21 10l-4 4"/></svg>';
  document.body.appendChild(fab);

  const container = document.createElement('div');
  container.id = 'xcleaner-container';
  container.innerHTML = PANEL_HTML;
  document.body.appendChild(container);

  const panel = container.querySelector('#xcleaner-root');
  panel.style.display = 'none';
  applyTheme(panel);

  // Follow x.com theme changes (SPA theme toggle, no reload)
  const rootEl = document.documentElement;
  const observer = new MutationObserver(() => applyTheme(panel));
  observer.observe(rootEl, { attributes: true, attributeFilter: ['class'] });

  fab.addEventListener('click', () => {
    const open = panel.style.display === 'none';
    panel.style.display = open ? 'flex' : 'none'; // flex preserves pinned footer layout
    fab.setAttribute('aria-expanded', String(open));
  });

  mountXCleaner(container, IDS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFloatingUI);
} else {
  injectFloatingUI();
}
