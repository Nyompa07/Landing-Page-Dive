# Revisi v2 — untuk review pemilik

## Perubahan

- Memperbaiki form inquiry: pilihan paket diisi dari `packages.js`, placeholder tidak bisa dipilih sebagai paket, tanggal/jumlah peserta tetap divalidasi, nomor WhatsApp opsional ditambahkan.
- Menambahkan koneksi Google Sheet melalui `google-apps-script/Code.gs`. Sheet target sudah diatur ke ID dari tautan yang Anda berikan, tetapi URL deployment Apps Script belum dapat dibuat tanpa otorisasi pemilik Google.
- Menambahkan empat ilustrasi kategori pada slider Find Your Next Blue: diving, snorkeling, discovery dive, dan perjalanan pulau/multi-day. Semua dilabeli ilustrasi, bukan dokumentasi Gowa.
- Menambahkan enam halaman mandiri: `adventures.html`, `dive-snorkel.html`, `training.html`, `conservation.html`, `consultancy.html`, dan `contact.html`.
- Menambahkan bahan Pages Blogger di `blogger-pages/`, serta header tema yang mengarahkan ke slug `/p/...html` setelah Pages dibuat.

## Cara mengaktifkan Sheet

Ikuti [panduan Apps Script](google-apps-script/SETUP.md). Setelah mendapatkan URL yang berakhir `/exec`, ganti nilai `sheetWebAppUrl` pada [packages.js](packages.js). Sebelum URL itu dipasang, form tetap menyiapkan WhatsApp dan memberi tahu bahwa Sheet belum dikonfigurasi.

## Cara memakai halaman mandiri pada Blogger

Import `blogger-theme.xml` ke blog uji. Buat Pages dengan slug yang dijelaskan di [blogger-pages/README.md](blogger-pages/README.md). Setelah Pages diterbitkan, tautan menu atas pada tema mengarah ke halaman tersebut. Halaman `contact` versi Blogger saat ini mengarahkan pengunjung ke form beranda; versi standalone `contact.html` memuat form lengkap untuk pengujian atau hosting statis.

## Perubahan harga

Tidak ada harga kompetitor yang dipakai sebagai harga GoWa. Semua data yang belum disetujui tetap `needs_confirmation` dan tidak ditampilkan sebagai harga jual.
