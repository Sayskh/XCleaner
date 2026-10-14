// Mount logic: injects FAB + panel into x.com page
// Uses globals: IDS, PANEL_HTML, PANEL_CSS, mountXCleaner (defined by build.js inlining)

function injectFloatingUI() {
  if (document.getElementById('xcleaner-fab') || document.getElementById('xcleaner-root')) return;

  const styleEl = document.createElement('style');
  styleEl.id = 'xcleaner-styles';
  styleEl.textContent = PANEL_CSS;
  document.head.appendChild(styleEl);

  const fab = document.createElement('button');
  fab.id = 'xcleaner-fab';
  fab.textContent = 'XC';
  fab.setAttribute('aria-label', 'Open XCleaner');
  fab.style.cssText =
    'position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:9999px;background:#0f1419;color:#ffffff;border:1px solid #2f3336;z-index:99998;cursor:pointer;font-weight:700;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
  document.body.appendChild(fab);

  const container = document.createElement('div');
  container.id = 'xcleaner-container';
  container.innerHTML = PANEL_HTML;
  document.body.appendChild(container);

  const panel = container.querySelector('#xcleaner-root');
  panel.style.display = 'none';

  fab.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  });

  mountXCleaner(container, IDS);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFloatingUI);
} else {
  injectFloatingUI();
}
