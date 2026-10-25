# Revisi v3 — CTA, form, paket, dan visual

## Perbaikan utama

- Tombol **Rencanakan Trip**, **Konsultasi via WhatsApp**, dan tombol mengambang **Chat WhatsApp** sudah memiliki tautan WhatsApp langsung `https://wa.me/6281524677335` pada HTML. Mereka tetap bekerja bila JavaScript gagal dimuat.
- Dropdown **Paket / layanan yang diminati** sekarang berisi 16 pilihan nyata langsung di HTML: 8 kandidat perjalanan dari Google Form lama, diving/snorkeling/discovery, rental kapal/peralatan, training, konservasi, konsultansi, dan konsultasi paket. Pengunjung tidak lagi bergantung pada JavaScript untuk melihat pilihan.
- Harga tidak dimasukkan ke dropdown maupun dijual sebagai harga aktif, karena satuan, fasilitas, dan ketersediaan belum disetujui pemilik. Label paket mengikuti data yang sudah diaudit.
- `Kirim inquiry` memakai tiga jalur: Sheet dan email otomatis setelah Apps Script aktif; fallback `mailto:celebesdiveco@gmail.com`; serta tombol Google Form resmi yang selalu tersedia.
- `Code.gs` sekarang menyimpan data ke Sheet yang Anda berikan dan mengirim notifikasi inquiry ke `celebesdiveco@gmail.com` setelah Web App Apps Script di-deploy.
- Enam ilustrasi baru menambah variasi visual kapal/pulau, penyu, snorkeling, canyon diving, pantai, dan kehidupan terumbu. Semuanya tetap ilustrasi konsep.

## Mengaktifkan pencatatan otomatis

Pencatatan otomatis tidak dapat diaktifkan dari browser hanya dengan URL spreadsheet. Ikuti [google-apps-script/SETUP.md](google-apps-script/SETUP.md), deploy `Code.gs` sebagai Web App, lalu salin URL `/exec` ke `sheetWebAppUrl` di `packages.js`. Deployment ini memerlukan izin akun pemilik Google karena ia menulis ke Sheet dan mengirim email.

## Yang sudah diuji

50 pemeriksaan lulus: CTA WhatsApp langsung, dropdown paket tanpa JavaScript, validasi form, payload endpoint Sheet yang dimock di browser, fallback email, slider, responsivitas 320–1440 px, enam halaman mandiri, aksesibilitas otomatis, dan tema XML. Pengiriman ke Sheet/email sungguhan belum dijalankan karena URL deployment Apps Script belum diberikan.
