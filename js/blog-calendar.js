(function () {
  const CARD_ID = 'blog-contrib-card';
  const DAYS = 364;

  function isoDate(d) {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  function levelByCount(count) {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
  }

  function createCard() {
    const card = document.createElement('div');
    card.className = 'card-widget card-blog-calendar';
    card.id = CARD_ID;
    card.innerHTML = `
      <div class="item-headline">
        <i class="fas fa-chart-bar"></i>
        <span>Writing Activity</span>
      </div>
      <div class="blog-calendar-summary"><b id="blog-contrib-total">0</b> posts in the last year</div>
      <div class="blog-calendar-wrap">
        <div class="blog-calendar-grid" id="blog-calendar-grid"></div>
      </div>
      <div class="blog-calendar-legend">
        <span>Less</span>
        <i data-level="0"></i><i data-level="1"></i><i data-level="2"></i><i data-level="3"></i><i data-level="4"></i>
        <span>More</span>
      </div>
    `;
    return card;
  }

  function buildGrid(counts) {
    const fragment = document.createDocumentFragment();
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - DAYS);

    let total = 0;
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const key = isoDate(date);
      const count = counts[key] || 0;
      total += count;
      const level = levelByCount(count);
      const cell = document.createElement('span');
      cell.className = 'blog-calendar-cell';
      cell.dataset.level = String(level);
      cell.title = `${key}: ${count} post(s)`;
      fragment.appendChild(cell);
    }
    return { fragment: fragment, total: total };
  }

  async function mountCard() {
    const asideRoot = document.querySelector('#aside-content .sticky_layout') || document.querySelector('#aside-content');
    if (!asideRoot) return;

    const old = document.getElementById(CARD_ID);
    if (old) old.remove();

    const card = createCard();
    const recentPostCard = asideRoot.querySelector('.card-recent-post');
    if (recentPostCard && recentPostCard.parentNode) {
      recentPostCard.parentNode.insertBefore(card, recentPostCard.nextSibling);
    } else {
      asideRoot.appendChild(card);
    }

    try {
      const res = await fetch('/blog-calendar.json', { cache: 'no-store' });
      const data = await res.json();
      const counts = (data && data.counts) || {};
      const built = buildGrid(counts);
      const grid = card.querySelector('#blog-calendar-grid');
      const total = card.querySelector('#blog-contrib-total');
      if (!grid || !total) return;
      grid.innerHTML = '';
      grid.appendChild(built.fragment);
      total.textContent = String(built.total);
    } catch (e) {
      const summary = card.querySelector('.blog-calendar-summary');
      if (summary) summary.textContent = 'Failed to load writing activity data';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCard);
  } else {
    mountCard();
  }
  document.addEventListener('pjax:complete', mountCard);
})();
