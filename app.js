(() => {
  'use strict';
  if (window.gowaInitialized) return;
  window.gowaInitialized = true;
  const config = window.GOWA_CONFIG;
  if (!config) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const categories = { diving: 'Guided Diving', snorkeling: 'Snorkeling', discovery: 'Discovery Dive', multiday: 'Multi-day Trip', private: 'Private / Group', boat: 'Boat Rental' };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const wa = message => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
  const priceText = p => p.priceStatus === 'approved' && Number.isFinite(p.price) && p.price > 0 && p.priceUnit ? `${new Intl.NumberFormat('id-ID', {style:'currency', currency:p.currency, maximumFractionDigits:0}).format(p.price)} / ${p.priceUnit}` : 'Konsultasikan paket';
  const bindWhatsApp = root => $$('[data-wa]', root).forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  bindWhatsApp(document);
  $('#year').textContent = new Date().getFullYear();
  const menu = $('.menu-toggle'), nav = $('#navigation');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Buka menu'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu'); });
  nav.addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav.classList.contains('open')) {closeMenu();menu.focus();} });
  document.addEventListener('click', e => { if(!e.target.closest('.header')) closeMenu(); });
  let selected = 'all', expanded = false;
  function render() {
    const all = config.packages.filter(p => selected === 'all' || p.category === selected);
    const visible = expanded ? all : all.slice(0,6);
    $('#package-grid').innerHTML = visible.map(p => `<article class="package-card"><div class="card-photo"><img src="${escape(p.image)}" loading="lazy" width="900" height="650" alt="Ilustrasi laut untuk ${escape(p.destination)}; bukan dokumentasi destinasi" /><span class="card-badge">${escape(categories[p.category])}</span></div><div class="card-content"><p class="card-location">⌖ ${escape(p.destination)}</p><h3>${escape(p.name)}</h3><p>${escape(p.description)}</p><span class="card-duration">◷ ${escape(p.duration || 'Durasi sesuai konsultasi')}</span><div class="card-bottom"><strong>${escape(priceText(p))}</strong><button type="button" class="card-detail" data-package="${escape(p.id)}" aria-label="Detail paket ${escape(p.name)}"><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg></button></div></div></article>`).join('');
    $('#result-count').textContent = `${visible.length} dari ${all.length} pengalaman`;
    $('#show-more').hidden = all.length <= 6;
    $('#show-more').innerHTML = expanded ? 'Tampilkan lebih sedikit <span>↑</span>' : 'Lihat pengalaman lainnya <span>↓</span>';
    handleImages($('#package-grid'));
  }
  function filter(category) {
    selected = category; expanded = false;
    $$('[data-filter]').forEach(b => { const active = b.dataset.filter === category; b.classList.toggle('active',active); b.setAttribute('aria-pressed', String(active)); });
    render();
  }
  $$('[data-filter]').forEach(b => b.addEventListener('click', () => filter(b.dataset.filter)));
  $$('[data-filter-link]').forEach(a => a.addEventListener('click', () => filter(a.dataset.filterLink)));
  $('#show-more').addEventListener('click', () => { expanded = !expanded; render(); if(!expanded) $('#adventures').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}); });
  const detail = $('#detail-dialog');
  $('#package-grid').addEventListener('click', e => {
    const button = e.target.closest('[data-package]'); if(!button) return;
    const p = config.packages.find(p => p.id === button.dataset.package);
    const approved = p.priceStatus === 'approved';
    $('#detail-content').innerHTML = `<p class="eyebrow">${escape(categories[p.category])} · ${escape(p.destination)}</p><h2 id="detail-title">${escape(p.name)}</h2><p>${escape(p.description)}</p><h3>${escape(priceText(p))}</h3><p>Durasi: ${escape(p.duration || 'perlu konfirmasi')}<br />Minimum peserta: ${escape(approved && p.minimumParticipants ? p.minimumParticipants : 'perlu konfirmasi')}</p><h3>Fasilitas &amp; kebutuhan perjalanan</h3><p>${approved && p.inclusions.length ? escape(p.inclusions.join(', ')) : 'Transportasi, perlengkapan, konsumsi, dokumentasi, penginapan, jumlah aktivitas, dan fasilitas keselamatan perlu dikonfirmasi untuk paket ini.'}</p>${approved && p.exclusions.length ? `<p>Di luar paket: ${escape(p.exclusions.join(', '))}</p>` : ''}<p>Rute, kelayakan peserta, cuaca, dan ketersediaan dibahas bersama tim. Tidak ada jaminan pertemuan satwa. Permintaan informasi bukan konfirmasi pemesanan.</p><a class="button" href="#contact" data-choose="${escape(p.name)}">Tanyakan Paket <span><svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg></span></a>`;
    detail.showModal();
  });
  detail.addEventListener('click', e => { const a = e.target.closest('[data-choose]'); if(a) { chooseInterest(a.dataset.choose); detail.close(); setTimeout(() => $('#interest').focus({preventScroll:true}),100); } });
  $$('dialog').forEach(d => { $('.dialog-close',d).addEventListener('click', () => d.close()); d.addEventListener('click', e => {if(e.target === d) {const rect=d.getBoundingClientRect(); if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)d.close();}}); });
  $$('[data-gallery]').forEach(b => b.addEventListener('click', () => {const img=$('#gallery-image');img.src=b.dataset.gallery;img.alt=b.dataset.caption;$('#gallery-caption').textContent=b.dataset.caption;$('#gallery-dialog').showModal();}));
  const faq = [
    ['Bagaimana cara memesan trip?', 'Pilih pengalaman, isi formulir singkat, lalu lanjutkan percakapan di WhatsApp. Jadwal, fasilitas, harga, dan ketentuan harus disepakati langsung sebelum pemesanan dikonfirmasi.'],
    ['Paket mana yang sesuai untuk saya?', 'Ceritakan pengalaman selam, tanggal, jumlah peserta, dan tujuan Anda. Tim akan membantu membahas pilihan yang sesuai dengan kemampuan dan kondisi perjalanan.'],
    ['Apakah pemula bisa ikut?', 'Tanyakan snorkeling atau discovery dive. Kelayakan bergantung pada kondisi kesehatan, kenyamanan di air, persyaratan program dan pendampingan. Discovery dive bukan sertifikasi.'],
    ['Apa saja yang termasuk dalam harga?', 'Fasilitas berbeda untuk setiap paket dan perlu dikonfirmasi. Jangan menganggap kapal, alat, penginapan, transportasi, atau dokumentasi termasuk sebelum ada rincian tertulis.'],
    ['Bagaimana jika cuaca berubah?', 'Keselamatan menjadi pertimbangan perjalanan. Tanyakan ketentuan perubahan rute, penjadwalan ulang, pembatalan, dan pengembalian dana sebelum menyepakati pemesanan. Kebijakan final dikonfirmasi tim.'],
    ['Bisa menyewa alat selam atau kapal?', 'Bisa mengajukan permintaan melalui WhatsApp. Sebutkan kebutuhan alat, ukuran, tanggal, rute, dan jumlah peserta. Ketersediaan, kelayakan, tarif, dan prosedur dikonfirmasi langsung.'],
    ['Bagaimana mengajukan program konservasi atau konsultansi?', 'Ceritakan kebutuhan organisasi, lokasi, tujuan, dan perkiraan waktu. Lingkup pekerjaan, kapasitas, kompetensi dan kebutuhan kolaborasi akan didiskusikan terlebih dahulu.'],
    ['Apakah mengisi formulir berarti booking terkonfirmasi?', 'Belum. Formulir ini menyiapkan permintaan informasi melalui WhatsApp. Google Form juga merupakan jalur pengajuan; tidak ada sinkronisasi otomatis atau jaminan slot dari landing page ini.']
  ];
  $('#faq-list').innerHTML = faq.map(([q,a]) => `<details><summary>${escape(q)}<b>+</b></summary><p>${escape(a)}</p></details>`).join('');
  const interest=$('#interest');
  [...config.packages.map(p => p.name), 'Pelatihan Selam','Konservasi & Edukasi','Konsultansi Kelautan'].forEach(name => {const o=document.createElement('option');o.value=name;o.textContent=name;interest.append(o);});
  function chooseInterest(name) {interest.value=name;resetMessage();}
  $$('[data-interest]').forEach(a => a.addEventListener('click', () => chooseInterest(a.dataset.interest)));
  const form=$('#inquiry-form'), status=$('#form-status'), ready=$('#whatsapp-ready');
  const localDate = () => { const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; };
  form.elements.date.min=localDate();
  function resetMessage(){ready.hidden=true;ready.removeAttribute('href');status.textContent='';}
  form.addEventListener('input', resetMessage);
  form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));
  form.addEventListener('submit', e => {
    e.preventDefault(); resetMessage(); form.elements.date.min=localDate();
    form.elements.name.setCustomValidity(form.elements.name.value.trim()?'':'Silakan isi nama Anda.');
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const message=`Halo Gowa Dive Center!\nSaya ingin meminta informasi perjalanan.\n\nNama: ${data.get('name').trim()}\nPaket / layanan: ${data.get('interest')}\nTanggal rencana: ${data.get('date')}\nJumlah peserta: ${data.get('participants')}\nPengalaman: ${data.get('experience')}\nPesan: ${data.get('message').trim() || '-'}\n\nMohon informasi harga, fasilitas, persyaratan, dan ketersediaan. Saya memahami ini belum merupakan pemesanan terkonfirmasi.`;
    ready.href=wa(message);ready.hidden=false;status.textContent='Pesan siap. Pilih “Lanjutkan ke WhatsApp” untuk meninjau dan mengirimnya. Pesan belum terkirim.';
  });
  ready.addEventListener('click', () => {status.textContent='Tautan WhatsApp dibuka. Tinjau lalu kirim pesan di WhatsApp; pemesanan belum terkonfirmasi.';});
  function handleImages(root) { $$('img', root).forEach(img => { if(img.dataset.fallbackBound)return;img.dataset.fallbackBound='true';const fallback=()=>{img.classList.add('image-failed');img.alt='Visual belum tersedia — Gowa Dive Center';};img.addEventListener('error',fallback,{once:true});if(img.complete&&img.naturalWidth===0)fallback(); }); }
  render();handleImages(document);
})();
