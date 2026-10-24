# Gowa Dive Center — versi review

> Revisi terbaru ada pada folder ini (`revision-v3`). Baca `REVISION_V3.md` untuk CTA WhatsApp langsung, daftar paket form, Google Sheet/email, dan variasi visual.

Landing page premium untuk Blogger: HTML5, CSS3, vanilla JavaScript. **Belum dipublikasikan.** Pemilik dapat mengoreksi desain dan konten sebelum pemasangan. Tidak ada backend, pembayaran, sinkronisasi Google Forms, konfirmasi slot, atau pengiriman otomatis.

## Membuka dan menguji

Di direktori `/workspace/Landing-Page-Dive`:

```sh
python -m http.server 3000 --bind 0.0.0.0
```

Halaman `index.html` dilayani server statis. Server tidak diperlukan setelah tema terpasang di Blogger. Lingkungan cloud memakai checkout yang tersedia; tidak perlu worktree.

```sh
npm ci --cache /workspace/.npm-cache --ignore-scripts --no-audit --no-fund
python -m venv .venv
.venv/bin/python -m pip install --cache-dir /workspace/.cache/pip -r requirements-dev.txt
node --check app.js
node tests/browser.cjs
npm run test:a11y
node tests/theme.cjs
.venv/bin/python scripts/build_theme.py
```

Pengujian browser menggunakan Playwright dan Chromium. Dependensi pengembangan hanya untuk pengujian/build tema, bukan untuk pengunjung. Chromium pada lingkungan ini tersedia di `/usr/bin/chromium`. Hasil terakhir tersimpan dalam `tests/results.json`. Jangan menganggap pass lokal membuktikan impor Blogger atau semua aplikasi WhatsApp bekerja.

## File dan arsitektur

- `index.html`: halaman review; header, hero, kategori, katalog, training, konservasi, konsultansi, tentang, galeri, FAQ, inquiry dan footer.
- `styles.css`: warna, layout responsif, fokus keyboard, reduced motion.
- `packages.js`: konfigurasi terpusat seluruh paket, WhatsApp, dan Instagram.
- `app.js`: filter, modal native dialog, lightbox, menu seluler, FAQ, validasi dan encoding WhatsApp; memiliki penjaga inisialisasi ganda.
- `blogger-theme.xml`: tema hasil build, CSS dan JS inline di CDATA, gambar tertanam. Tidak memerlukan hosting file JS/CSS. Widget Blog1 tetap digunakan pada artikel dan Pages lama; landing page hanya untuk beranda.
- `scripts/build_theme.py`: membangun ulang XML serta memvalidasi parsing. Membutuhkan Pillow; mengoptimalkan ilustrasi tertanam untuk tema.
- `assets/logo-original.png`: logo asli dari situs sumber, sama dengan lampiran. Footer menampilkan bagian logo dengan CSS crop tanpa mengubah file asli. `assets/logo.svg`: adaptasi vektor untuk header, perlu review kemiripan.
- `assets/*.webp`: ilustrasi buatan untuk rancangan, bukan foto trip/destinasi asli. Label ilustrasi selalu ditampilkan.
- `CONTENT_AUDIT.md`: sumber, rekonsiliasi tarif, keterbatasan dan keputusan pemilik.
- `review-desktop.png`, `review-mobile.png`: tangkapan browser untuk review, bukan jaminan kompatibilitas semua perangkat.
- `TEST_REPORT.md`: cakupan dan keterbatasan pengujian.

Tidak ada request font eksternal pada versi review; fallback lokal Arial/Georgia dipakai agar tampilan tetap bekerja saat jaringan dibatasi. Deklarasi DM Sans/Manrope bisa memakai font lokal apabila dipasang oleh pemilik. Tidak menggunakan CDN library, kunci API atau font icon. Panah dibuat dengan SVG agar tidak bergantung pada kelengkapan glyph font.

## Mengubah konten dan gambar

Edit teks bagian di `index.html`; FAQ di array `faq` pada `app.js`. Selalu tulis nama **Gowa Dive Center**. Tidak ada sakelar bahasa dekoratif: konten utama Indonesia dengan headline editorial Inggris.

Ganti aset WebP dengan foto berizin milik usaha. Ubah `alt`, label ilustrasi, dan caption hanya apabila gambar benar-benar dokumentasi yang terverifikasi. Ukuran rekomendasi hero 1536×1024, kartu 900×650; gunakan WebP terkompresi. Gambar bawah fold lazy-loaded; gambar yang gagal memiliki fallback teks dan warna.

Untuk memakai logo asli pada header, ganti sumber `img` dan sesuaikan CSS dengan rasio file; jangan merentangkan gambar. Header versi review memakai adaptasi vektor supaya lebih mudah dibaca pada ukuran kecil.

## Paket dan harga

Edit `window.GOWA_CONFIG.packages` di `packages.js`. Field:
`id`, `name`, `category`, `destination`, `duration`, `price`, `currency`, `priceUnit`, `priceStatus`, `inclusions`, `exclusions`, `minimumParticipants`, `bookingUrl`, `description`, `image`, `lastVerified`.

Kategori: `diving`, `snorkeling`, `discovery`, `multiday`, `private`, `boat`.

Tambah paket dengan menyalin satu objek dan memberi `id` unik. Pilihan formulir otomatis mengikuti konfigurasi paket. `sourceLabel` hanya catatan audit; tidak ditampilkan sebagai harga aktif. `bookingUrl` adalah metadata, jalur konsultasi utama dibentuk dari nomor WhatsApp terpusat.

Semua harga awal `needs_confirmation`; tidak ada harga aktif. `historical` dan `unavailable` juga ditampilkan sebagai konsultasi. Aktifkan harga **hanya setelah pemilik menyetujui** nominal, satuan dan fasilitas, misalnya:

```js
price: 999000,
priceUnit: 'peserta',
priceStatus: 'approved'
```

Contoh di atas menunjukkan format, bukan persetujuan harga Samalona. Isi `inclusions`, `exclusions`, `minimumParticipants` dari kesepakatan nyata. `lastVerified` adalah tanggal pemeriksaan sumber UTC, bukan jaminan masih berlaku. Jangan normalisasi label Couple `4.500k` sebelum jelas satuannya. Tidak ada biaya internal yang ditampilkan.

Setelah perubahan, jalankan ulang build dan tes, lalu periksa hasil pratinjau sebelum impor. Perubahan Google Form **tidak** memperbarui konfigurasi situs secara otomatis.

## Mengubah kontak

Nomor terpusat `whatsapp` pada `packages.js` memakai format internasional angka saja (`6281524677335`). Ubah juga teks nomor pada `index.html`, tautan bookingUrl data, Instagram di header/footer/kontak dan Schema Organization. Seluruh CTA WhatsApp menggunakan `data-wa`, diproses menjadi URL `wa.me` dengan encoding.

Form hanya menyiapkan pesan; tombol kedua membuka WhatsApp untuk ditinjau dan dikirim pengguna. Tidak ada data dikirim ke server ini, disimpan ke database, atau direkam ke localStorage. Google Form adalah alternatif terpisah yang memiliki pertanyaan/data pribadi dan ketentuan sendiri.

## Memasang tema Blogger dengan aman

1. Selesaikan review desain dan keputusan `CONTENT_AUDIT.md`. Konfirmasi kontak, harga, izin foto, profil, serta layanan aktif. Jangan memasang ke blog utama sebelum review.
2. Di Blogger: **Tema → menu di samping Sesuaikan → Cadangkan → Download**. Simpan XML lama dengan tanggal. Cadangkan konten dari Setelan → Kelola blog → Cadangkan konten. Catat URL artikel/Pages yang perlu dipertahankan.
3. Buat **blog uji privat/terbatas**. Pastikan judul blog Gowa Dive Center. Jalankan `.venv/bin/python scripts/build_theme.py` setelah sumber terakhir diedit.
4. Pada blog uji pilih **Tema → Pulihkan → Upload** `blogger-theme.xml`. Jika XML ditolak, simpan pesan error dan jangan mengganti tema utama. Parsing XML lokal telah diuji; compiler Blogger belum diuji dengan akun Anda.
5. Periksa beranda desktop/ponsel, filter, semua modal, Escape/fokus, FAQ, form invalid, karakter `& + #` dalam pesan WhatsApp, navigasi, gambar dan semua CTA. Tidak perlu mengirim inquiry sungguhan untuk menguji pembentukan URL.
6. Periksa artikel dan `/p/...html` lama, paginasi, komentar, canonical dan metadata lewat halaman sumber. `all-head-content` menghasilkan canonical native Blogger; jangan menambahkan canonical beranda secara global. Periksa jika Blogger menambahkan meta description bawaan yang sama.
7. Tema berukuran sekitar 1 MB karena gambar tertanam; jika Blogger menolak ukuran/aset data URI, unggah foto ke media Blogger, ganti URI dengan URL HTTPS resmi milik Anda dan build ulang. Jangan memotong bagian XML sembarangan. Tidak ada klaim bahwa data URI telah diterima Blogger.
8. Setelah pemilik menyetujui dan blog uji lolos, lakukan langkah Pulihkan yang sama di blog utama. Tidak ada langkah ini yang dijalankan otomatis oleh agent.
9. Uji kembali hasil publikasi: WhatsApp, Google Form, Instagram, paket, harga, gambar, responsivitas. Konten lama tidak dihapus, URL tidak diarahkan ulang. Sesuaikan arsip/footer agar menuju blog lama atau URL produksi yang benar.

### Mengubah data sesudah dipasang

Pilihan yang dianjurkan: edit sumber di repo, build, backup tema aktif, uji, lalu upload ulang. Alternatif lewat **Tema → Edit HTML**, cari `window.GOWA_CONFIG`, ubah objek data dalam CDATA; jangan menghapus pembatas CDATA, tanda kutip atau koma. Cadangkan dahulu dan periksa semua filter setelah menyimpan. Tidak ada sinkronisasi dengan Forms.

### Alternatif Blogger Pages yang aman

Pertahankan tema utama. Host file statis review beserta aset pada hosting HTTPS yang Anda kelola (misalnya GitHub Pages setelah konfigurasi terpisah). Buat Blogger Page baru, mode HTML, dan sematkan iframe dengan URL HTTPS **yang sudah benar-benar diterbitkan**, `title="Gowa Dive Center"`, `width="100%"`, `height="1800"`, `loading="lazy"`; sertakan tautan pembuka halaman penuh agar navigasi panjang tetap nyaman. Izinkan popup bila memakai atribut sandbox (`allow-scripts allow-popups allow-popups-to-escape-sandbox` diperlukan untuk WhatsApp). Jangan menempelkan CSS global ke tema yang ada karena dapat merusak blog. Alternatif iframe memerlukan hosting eksternal dan belum diuji di Blogger; tema XML adalah jalur utama native Blogger. Tidak ada URL hosting rekaan dalam deliverable.

### Rollback

Jika impor/tampilan gagal: **Tema → Pulihkan → Upload** file backup lama. Jangan menghapus artikel/Pages. Bandingkan URL lama, navigasi, dan kontak. Pulihkan konten hanya jika konten memang berubah; penggantian tema tidak memerlukan penghapusan konten.

## Keterbatasan sebelum final

Tidak mungkin menjamin bebas bug mutlak. Tes lokal mencakup perilaku utama, tetapi impor di Blogger, perangkat iOS/Android nyata, pembukaan aplikasi WhatsApp, dan kebijakan bisnis memerlukan verifikasi lanjut. Tidak ada publikasi, push Git, pengiriman form eksternal, atau perubahan blog produksi yang dilakukan.
