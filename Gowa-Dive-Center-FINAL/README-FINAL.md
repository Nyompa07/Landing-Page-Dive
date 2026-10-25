# Gowa Dive Center — paket final

Paket ini menyatukan revisi terbaru landing page Gowa Dive Center.

## Pasang di Blogger

1. Cadangkan tema aktif di Blogger melalui **Tema → Cadangkan**.
2. Pilih **Tema → Pulihkan → Upload**.
3. Unggah `blogger-theme.xml`.
4. Buat enam Blogger Pages memakai isi file di `blogger-pages/`; petunjuknya ada di `blogger-pages/README.md`.

Katalog enam paket pada beranda tertanam langsung dalam tema. Kartu tetap tampil apabila JavaScript Blogger tidak berjalan. Tombol kartu, tombol rencana trip, konsultasi, dan chat mengarah ke WhatsApp `081524677335`.

## Formulir

Tautan Google Form tersedia langsung. Untuk menyimpan form landing page ke Google Sheet dan menerima notifikasi ke `celebesdiveco@gmail.com`, ikuti `google-apps-script/SETUP.md`.

## File utama

- `blogger-theme.xml`: satu file yang diunggah sebagai tema Blogger.
- `blogger-pages/`: isi enam halaman menu Blogger.
- `google-apps-script/`: endpoint Google Sheet dan email.
- `REVISION_V4.md`: perubahan katalog paket yang tampil tanpa JavaScript.
