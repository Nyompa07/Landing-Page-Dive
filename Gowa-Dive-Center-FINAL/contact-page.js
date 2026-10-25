(() => {
  'use strict';
  const config = window.GOWA_CONFIG;
  const form = document.querySelector('#inquiry-form');
  if (!config || !form) return;
  const select = document.querySelector('#interest');
  const status = document.querySelector('#form-status');
  const ready = document.querySelector('#whatsapp-ready');
  const emailReady = document.querySelector('#email-ready');
  const submit = document.querySelector('#inquiry-submit');
  const date = form.elements.date;
  const localDate = () => new Date().toISOString().slice(0, 10);
  date.min = localDate();
  const reset = () => { ready.hidden = true; ready.removeAttribute('href'); if (emailReady) { emailReady.hidden = true; emailReady.removeAttribute('href'); } status.textContent = ''; };
  form.addEventListener('input', reset);
  const configured = () => /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:[?#].*)?$/.test(config.sheetWebAppUrl || '');
  form.addEventListener('submit', async event => {
    event.preventDefault(); reset(); date.min = localDate();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const record = { ...values, source: location.href };
    const message = `Halo Gowa Dive Center!\nSaya ingin meminta informasi perjalanan.\n\nNama: ${values.name}\nPaket / layanan: ${values.interest}\nTanggal rencana: ${values.date}\nJumlah peserta: ${values.participants}\nPengalaman: ${values.experience || '-'}\nNomor WhatsApp: ${values.phone || '-'}\nPesan: ${values.message || '-'}\n\nSaya memahami ini belum merupakan pemesanan terkonfirmasi.`;
    const email = `mailto:celebesdiveco@gmail.com?subject=${encodeURIComponent(`Inquiry Gowa Dive Center — ${values.interest}`)}&body=${encodeURIComponent(message)}`;
    submit.disabled = true;
    try {
      if (configured()) await fetch(config.sheetWebAppUrl, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ action: 'inquiry', payload: JSON.stringify(record) }), keepalive: true });
      status.textContent = configured() ? 'Permintaan diteruskan ke Sheet dan notifikasi email akan dikirim oleh Apps Script.' : 'Google Sheet belum aktif. Draf email akan dibuka; Google Form resmi juga tersedia.';
    } catch {
      status.textContent = 'Sheet tidak dapat dihubungi. Gunakan email atau Google Form resmi.';
    } finally {
      ready.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`; ready.hidden = false;
      if (emailReady) { emailReady.href = email; emailReady.hidden = false; } submit.disabled = false;
      if (!configured()) window.location.href = email;
    }
  });
})();
