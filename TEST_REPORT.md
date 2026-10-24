# Hasil pengujian — versi review

Dijalankan 25 Oktober 2026 WITA (24 Oktober UTC), Chromium headless asli di lingkungan cloud. Bukan uji browser pada perangkat fisik dan bukan uji compiler Blogger.

## Lulus

- 35 pemeriksaan perilaku pada `tests/browser.cjs`; hasil rinci `tests/results.json`.
- Filter kategori, tampilkan semua/lebih sedikit, detail paket, Escape, fokus kembali ke pemicu, pemilihan paket ke formulir.
- Harga belum disetujui/historis tidak dijual sebagai aktif; harga approved tampil dengan satuan; harga tanpa satuan disembunyikan.
- Form kosong, tanggal lampau, dan peserta nol ditolak. Encoding `&`, `+`, `#`, Unicode serta baris baru WhatsApp sesuai. Tidak mengirim pesan; hanya memeriksa URL dan isi pesan.
- Mengubah input membatalkan pesan lama; feedback tidak mengklaim pesan sudah terkirim atau slot terkonfirmasi.
- FAQ, galeri lightbox, menu ponsel, tautan internal, semua gambar lokal dan fallback gambar rusak.
- Tidak ada overflow horizontal pada lebar 320, 375, 390, 768, 1024, 1440 px. Ini tidak menggantikan pemeriksaan setiap perangkat.
- Reduced motion, penjaga inisialisasi ganda, tidak ada error JavaScript saat skenario utama.
- `tests/accessibility.cjs`: axe-core 4.14.0, tag WCAG 2 A/AA dan 2.1 AA, **0 pelanggaran otomatis** pada halaman desktop awal. Lihat `tests/accessibility-results.json` untuk pemeriksaan yang memerlukan review manual; nol temuan tidak menjamin kepatuhan penuh.
- `node --check app.js` dan `packages.js`; XML parse, satu skin/section, widget Blog1; JS hasil ekspor lolos pemeriksaan sintaks.
- `tests/theme.cjs`: ekstraksi cabang beranda dari XML, render Chromium, kartu, filter boat, modal, tanpa error runtime. Ini menguji isi ekspor, tidak meniru seluruh Blogger.
- Sumber blog A, B, About, Trip Selam, Snorkeling, Discovery, Boat, Alat, dan Google Form: HTTP 200 setelah retry jaringan. URL rental tambahan HTTP 404. Tidak mengirim Google Form.
- Inspeksi visual screenshot desktop dan ponsel. Panah dibuat SVG untuk memperbaiki glyph font yang tidak tersedia.

## Belum diuji / perlu pemilik

- Impor tema, validasi compiler dan render widget Blogger pada akun/blog uji. URL artikel/Pages lama perlu diperiksa setelah pemasangan; tidak ada data blog yang diubah.
- Pembukaan aplikasi WhatsApp pada Android/iOS, perilaku Google Form setelah submit, Instagram autentikasi, dan pemesanan sungguhan. Tautan tujuan disusun benar, tetapi tidak ada inquiry/pesan eksternal yang dikirim.
- Screen reader manual, Safari/Firefox, jaringan lambat nyata dan semua variasi zoom/perangkat.
- Harga, minimum peserta, fasilitas, jadwal, profil, kapasitas/kompetensi dan izin foto. Semua harga masih needs_confirmation.
- Gambar adalah ilustrasi AI; bukan bukti portofolio, destinasi, atau kualitas layanan. Header memakai adaptasi vektor logo; logo PNG asli ada di footer dan assets.

## Reproduksi

Jalankan server sesuai README, kemudian:

```sh
npm ci --cache /workspace/.npm-cache --ignore-scripts --no-audit --no-fund
npm test
npm run test:a11y
node tests/theme.cjs
.venv/bin/python scripts/build_theme.py
```

Screenshot dibuat ulang oleh tes browser. Jangan menafsirkan hasil ini sebagai jaminan bebas bug mutlak. Versi ini ditujukan untuk koreksi pemilik sebelum finalisasi/publikasi.
