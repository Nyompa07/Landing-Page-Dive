(() => {
  'use strict';
  const config = window.GOWA_CONFIG;
  const form = document.querySelector('#inquiry-form');
  if (!config || !form) return;
  const select = document.querySelector('#interest');
  const status = document.querySelector('#form-status');
  const ready = document.querySelector('#whatsapp-ready');
  const submit = document.querySelector('#inquiry-submit');
  const date = form.elements.date;
  const localDate = () => new Date().toISOString().slice(0, 10);
  date.min = localDate();
  [...config.packages.map(item => item.name), 'Pelatihan Selam', 'Konservasi & Edukasi', 'Konsultansi Kelautan'].forEach(name => {
    const option = document.createElement('option'); option.value = name; option.textContent = name; select.append(option);
  });
  const reset = () => { ready.hidden = true; ready.removeAttribute('href'); status.textContent = ''; };
  form.addEventListener('input', reset);
  const configured = () => /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:[?#].*)?$/.test(config.sheetWebAppUrl || '');
  form.addEventListener('submit', async event => {
    event.preventDefault(); reset(); date.min = localDate();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    const record = { ...values, source: location.href };
    const message = `Halo Gowa Dive Center!\nSaya ingin meminta informasi perjalanan.\n\nNama: ${values.name}\nPaket / layanan: ${values.interest}\nTanggal rencana: ${values.date}\nJumlah peserta: ${values.participants}\nPengalaman: ${values.experience || '-'}\nNomor WhatsApp: ${values.phone || '-'}\nPesan: ${values.message || '-'}\n\nSaya memahami ini belum merupakan pemesanan terkonfirmasi.`;
    submit.disabled = true;
    try {
      if (configured()) await fetch(config.sheetWebAppUrl, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ action: 'inquiry', payload: JSON.stringify(record) }), keepalive: true });
      status.textContent = configured() ? 'Permintaan diteruskan ke Sheet. Silakan lanjutkan ke WhatsApp; booking belum terkonfirmasi.' : 'Endpoint Google Sheet belum dikonfigurasi. Anda tetap dapat melanjutkan ke WhatsApp.';
    } catch {
      status.textContent = 'Sheet tidak dapat dihubungi. Anda tetap dapat melanjutkan ke WhatsApp.';
    } finally {
      ready.href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`; ready.hidden = false; submit.disabled = false;
    }
  });
})();
