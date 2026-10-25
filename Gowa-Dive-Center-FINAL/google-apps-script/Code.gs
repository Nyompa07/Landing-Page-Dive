/**
 * Gowa Dive Center inquiry endpoint.
 * Spreadsheet target: https://docs.google.com/spreadsheets/d/1lxIrSflXGuPCQiLzb_3itq3WpVasWxdhuoOvSSW58nw/edit
 * Deploy this Apps Script as a Web App. See SETUP.md before deploying.
 */
const CONFIG = {
  spreadsheetId: '1lxIrSflXGuPCQiLzb_3itq3WpVasWxdhuoOvSSW58nw',
  sheetName: 'Inquiry',
  notificationEmail: 'celebesdiveco@gmail.com'
};

const HEADERS = [
  'Submitted at', 'Status', 'Source', 'Name', 'Package / service',
  'Planned date', 'Participants', 'Dive experience', 'WhatsApp', 'Message'
];

function doGet() {
  return respond({ ok: true, service: 'Gowa Dive Center inquiry endpoint' });
}

function doPost(event) {
  try {
    const payload = parsePayload_(event);
    validate_(payload);
    const sheet = getSheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow([
        new Date(), 'New', payload.source || '', payload.name, payload.interest,
        payload.date, Number(payload.participants), payload.experience || '',
        payload.phone || '', payload.message || ''
      ]);
      MailApp.sendEmail({
        to: CONFIG.notificationEmail,
        subject: `Inquiry Gowa Dive Center — ${payload.interest}`,
        body: formatEmail_(payload)
      });
    } finally {
      lock.releaseLock();
    }
    return respond({ ok: true });
  } catch (error) {
    console.error(error);
    return respond({ ok: false, error: error.message });
  }
}

function formatEmail_(payload) {
  return [
    'Inquiry baru dari landing page Gowa Dive Center', '',
    `Nama: ${payload.name}`,
    `Paket / layanan: ${payload.interest}`,
    `Tanggal rencana: ${payload.date}`,
    `Jumlah peserta: ${payload.participants}`,
    `Pengalaman selam: ${payload.experience || '-'}`,
    `WhatsApp: ${payload.phone || '-'}`,
    `Pesan: ${payload.message || '-'}`,
    `Sumber: ${payload.source || '-'}`
  ].join('\n');
}

function parsePayload_(event) {
  const raw = event && event.parameter && event.parameter.payload;
  if (!raw) throw new Error('Payload tidak ditemukan.');
  const payload = JSON.parse(raw);
  if (payload.website) throw new Error('Permintaan tidak valid.'); // Honeypot reserved for future use.
  return payload;
}

function validate_(payload) {
  ['name', 'interest', 'date', 'participants'].forEach(key => {
    if (!String(payload[key] || '').trim()) throw new Error(`Kolom ${key} wajib diisi.`);
  });
  const participants = Number(payload.participants);
  if (!Number.isInteger(participants) || participants < 1 || participants > 100) {
    throw new Error('Jumlah peserta harus 1 sampai 100.');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) throw new Error('Tanggal tidak valid.');
}

function getSheet_() {
  const book = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = book.getSheetByName(CONFIG.sheetName) || book.insertSheet(CONFIG.sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  return sheet;
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
