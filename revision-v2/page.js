(() => {
  'use strict';
  if (window.gowaPageInitialized) return;
  window.gowaPageInitialized = true;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  if (menu && nav) {
    const close = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  }
  document.querySelectorAll('[data-wa]').forEach(link => {
    const config = window.GOWA_CONFIG || {};
    link.href = `https://wa.me/${config.whatsapp || '6281524677335'}?text=${encodeURIComponent(link.dataset.wa || 'Halo Gowa Dive Center!')}`;
    link.target = '_blank'; link.rel = 'noopener noreferrer';
  });
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
})();
