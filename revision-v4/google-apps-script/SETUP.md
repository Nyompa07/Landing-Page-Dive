# Hubungkan formulir ke Google Sheet

File `Code.gs` sudah menargetkan spreadsheet yang Anda berikan (`1lxIrSflXGuPCQiLzb_3itq3WpVasWxdhuoOvSSW58nw`). Proses ini perlu dilakukan oleh pemilik Sheet karena Google meminta otorisasi akun dan menerbitkan URL Web App.

1. Buka spreadsheet tersebut dengan akun yang memiliki akses Editor.
2. Pilih **Extensions → Apps Script**. Hapus kode contoh, lalu salin seluruh isi `Code.gs`.
3. Simpan project, misalnya dengan nama `Gowa Inquiry Endpoint`.
4. Pilih **Deploy → New deployment → Web app**.
5. Atur **Execute as: Me** dan akses ke **Anyone**. Akses publik diperlukan agar pengunjung halaman dapat mengirim inquiry tanpa login Google.
6. Klik **Deploy**, setujui izin Spreadsheet saat Google meminta. Salin URL yang berakhir `/exec` — jangan gunakan URL `/dev`.
7. Buka `revision-v3/packages.js`, ganti `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` dengan URL `/exec` tadi. Jangan memasukkan URL editor spreadsheet ke field ini.
8. Build ulang tema dengan `.venv/bin/python scripts/build_theme.py`, lalu unggah `blogger-theme.xml` ke blog uji.
9. Kirim satu inquiry uji. Periksa tab `Inquiry` pada Sheet: baris harus berisi timestamp, status `New`, sumber, detail trip, dan pesan.

Endpoint sengaja menerima data yang terbatas dari form: nama, layanan, tanggal, jumlah peserta, pengalaman, nomor WhatsApp opsional, pesan dan URL sumber. Ia tidak menyalin alamat, umur, atau akun media sosial dari Google Form lama. Setiap inquiry yang berhasil disimpan juga mengirim notifikasi ke `celebesdiveco@gmail.com`; izin MailApp akan muncul ketika deployment pertama.

## Batasan dan keamanan

- Browser menggunakan `no-cors`, karena Google Apps Script Web App tidak memberi respons CORS yang dapat dibaca dari halaman Blogger. Jika browser menunjukkan “diteruskan ke Sheet”, itu berarti permintaan telah dikirim dari browser, tetapi pemilik tetap perlu mengecek Sheet saat pertama kali menguji.
- Jangan membagikan URL `/exec` sebagai rahasia; URL itu memang perlu terlihat di browser. Sheet tidak dibagikan kepada pengunjung.
- Endpoint publik berisiko menerima spam. Kode memvalidasi field dan jumlah peserta, tetapi tidak menggantikan CAPTCHA atau backend khusus. Jika spam menjadi masalah, nonaktifkan deployment lalu gunakan Google Form atau backend yang memiliki proteksi tambahan.
- Pemasangan Web App, izin Google, dan pengujian baris benar-benar masuk Sheet belum dilakukan oleh agent karena membutuhkan akun pemilik spreadsheet.
