(function () {
  const ID = 'hero-pixel-lab';
  const FALLBACK = [
    { name: 'Action Recognition', count: 1 },
    { name: 'Event-based Vision', count: 1 },
    { name: 'Vision-Language Models', count: 1 },
    { name: 'Agent Systems', count: 1 },
    { name: 'Eye Tracking', count: 1 },
    { name: 'Embodied AI', count: 1 }
  ];

  function isHome() {
    return window.location.pathname === '/' || window.location.pathname === '/index.html';
  }

  function normalize(tags) {
    const sorted = tags
      .filter((item) => item && item.name)
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 6);

    const max = Math.max.apply(null, sorted.map((item) => item.count || 0)) || 1;
    return sorted.map((item) => ({
      name: item.name,
      count: item.count || 0,
      level: Math.max(1, Math.round(((item.count || 0) / max) * 12))
    }));
  }

  function buildBars(items) {
    return items.map((item) => `
      <div class="pixel-item">
        <div class="pixel-bar" style="--level: ${item.level};" data-count="${item.count}">
          <div class="pixel-fill"></div>
        </div>
        <div class="pixel-label">${item.name}</div>
      </div>
    `).join('');
  }

  async function loadFocus() {
    try {
      const res = await fetch('/tag-focus.json', { cache: 'no-store' });
      const data = await res.json();
      return normalize((data && data.tags) || FALLBACK);
    } catch (e) {
      return normalize(FALLBACK);
    }
  }

  async function mount() {
    if (!isHome()) return;
    const header = document.querySelector('#page-header.full_page');
    if (!header || document.getElementById(ID)) return;

    const focus = await loadFocus();
    const lab = document.createElement('div');
    lab.id = ID;
    lab.innerHTML = `
      <div class="pixel-chart-wrap">
        <div class="pixel-chart" aria-label="Post count by tag">
          ${buildBars(focus)}
        </div>
      </div>
    `;
    header.appendChild(lab);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
  document.addEventListener('pjax:complete', mount);
})();
