/* ============================================
   PROPERTY LISTING PAGE — property-listing.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar hide on scroll ── */
  const navbar = document.getElementById('mainNav');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    if (cur > lastY && cur > 100) navbar.classList.add('nav-hide');
    else navbar.classList.remove('nav-hide');
    lastY = cur;
  }, { passive: true });

  /* ── Hamburger menu ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
  }

  /* ── Favourite toggle ── */
  document.querySelectorAll('.pl-card-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      icon.className = btn.classList.contains('active')
        ? 'fa-solid fa-heart'
        : 'fa-regular fa-heart';
    });
  });

  /* ── Filter & Search ── */
  const cards    = Array.from(document.querySelectorAll('.pl-card'));
  const chips    = document.querySelectorAll('.pl-chip');
  const searchEl = document.getElementById('plSearch');
  const noRes    = document.getElementById('noResults');
  const countEl  = document.getElementById('resultCount');
  const sortEl   = document.getElementById('plSort');

  let activeFilter = 'all';
  let searchQuery  = '';

  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const types = (card.dataset.type || '').split(' ');
      const cats  = (card.dataset.category || '').split(' ');
      const name  = (card.dataset.name || '').toLowerCase();
      const loc   = card.querySelector('.pl-card-loc')?.textContent.toLowerCase() || '';

      const matchFilter = activeFilter === 'all'
        || types.includes(activeFilter)
        || cats.includes(activeFilter);
      const matchSearch = !searchQuery
        || name.includes(searchQuery)
        || loc.includes(searchQuery);

      if (matchFilter && matchSearch) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    countEl.textContent = visible;
    noRes.style.display = visible === 0 ? 'block' : 'none';
  }

  /* ── Chip clicks ── */
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      applyFilters();
    });
  });

  /* ── Live search ── */
  searchEl.addEventListener('input', () => {
    searchQuery = searchEl.value.toLowerCase().trim();
    applyFilters();
  });

  /* ── Sort ── */
  sortEl.addEventListener('change', () => {
    const grid    = document.getElementById('plGrid');
    const sortVal = sortEl.value;
    const visibleCards = cards.filter(c => c.style.display !== 'none');

    visibleCards.sort((a, b) => {
      if (sortVal === 'name')       return a.dataset.name.localeCompare(b.dataset.name);
      if (sortVal === 'price-asc')  return +a.dataset.price - +b.dataset.price;
      if (sortVal === 'price-desc') return +b.dataset.price - +a.dataset.price;
      return 0;
    });

    visibleCards.forEach(c => grid.appendChild(c));
  });

  /* ── Reset (called from no-results button) ── */
  window.resetFilters = function () {
    chips.forEach(c => c.classList.remove('active'));
    document.querySelector('[data-filter="all"]').classList.add('active');
    activeFilter   = 'all';
    searchQuery    = '';
    searchEl.value = '';
    applyFilters();
  };

  /* ── Auto-filter from URL param e.g. ?filter=commercial ── */
  const params = new URLSearchParams(window.location.search);
  const f = params.get('filter');
  if (f) {
    const target = document.querySelector(`[data-filter="${f}"]`);
    if (target) {
      chips.forEach(c => c.classList.remove('active'));
      target.classList.add('active');
      activeFilter = f;
      applyFilters();
    }
  }

});