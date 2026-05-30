async function loadIncludes() {
  const elements = document.querySelectorAll('[include]');

  for (const el of elements) {
    const file = el.getAttribute('include');
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error('File tidak ditemukan: ' + file);
      const html = await res.text();
      const temp = document.createElement('div');
      temp.innerHTML = html;
      el.replaceWith(...temp.childNodes); // ganti elemen dengan konten asli
    } catch (e) {
      console.error(e);
    }
  }

  // Active nav
  const path = window.location.pathname;
  document.querySelectorAll('[data-nav]').forEach(link => {
    const nav = link.dataset.nav;
    const isActive =
      (nav === 'home' && (path === '/' || path === '/index.html')) ||
      (nav !== 'home' && path.includes(nav));
    if (isActive) {
      link.classList.add('text-primary', 'border-b-2', 'border-primary', 'pb-1');
      link.classList.remove('hover:text-primary');
    }
  });

  // Mobile menu toggle
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });
}

loadIncludes();