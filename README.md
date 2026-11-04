# DompetKu - Aplikasi Pencatat Keuangan Pribadi & Usaha

Aplikasi pencatatan keuangan modern, elegan, dan intuitif yang dirancang berdasarkan Software Requirements Specification (SRS) versi 1.0.

---

## Fitur Utama (MVP)

1. **Beranda & Dompet Otomatis**
   - Kartu saldo dompet utama dengan kalkulasi dinamis (`Saldo = Saldo Awal + Total Pendapatan - Total Pengeluaran`).
   - Ringkasan total pendapatan dan pengeluaran.
   - Tombol cepat `+ Pendapatan` dan `− Pengeluaran`.
   - Daftar transaksi terbaru beserta status relatif waktu (*Hari ini*, *Kemarin*, *2 hari lalu*).

2. **Pencatatan Transaksi**
   - Pilihan kategori fleksibel dengan chip interaktif.
   - Shortcut langsung `+ Kategori baru`.
   - Pratinjau dinamis *Saldo setelah transaksi*.
   - Validasi saldo: Peringatan otomatis jika pengeluaran melebihi saldo dompet saat ini.

3. **Riwayat Transaksi**
   - Pencarian cerdas berdasarkan catatan atau nama kategori.
   - Filter cepat (*Semua*, *Pendapatan*, *Pengeluaran*, dan filter Bulan).
   - Pengelompokan transaksi rapi berdasarkan tanggal.
   - Ubah (*Edit*) dan Hapus transaksi dengan konfirmasi aman.

4. **Kelola Kategori**
   - Kategori bawaan (*Gaji, Usaha, Bonus, Makan, Transport, Belanja, Tagihan, dll.*).
   - Tambah kategori baru dengan palet warna dan pratinjau badge inisial huruf.
   - Proteksi bisnis: Kategori yang sedang digunakan oleh transaksi tidak dapat dihapus.

5. **Grafik & Visualisasi**
   - Tab Pendapatan dan Pengeluaran.
   - Pilihan periode: *Harian (7 hari)*, *Mingguan (per minggu dalam bulan)*, *Bulanan (12 bulan)*, dan *Tahunan*.
   - Diagram batang interaktif (*hover/touch tooltip* menampilkan nominal dan label).
   - Daftar rincian persentase dan progres per kategori (*Sumber pendapatan* & *Pengeluaran per kategori*).

6. **Ekspor Rekap (Excel & CSV)**
   - Pilihan rentang waktu (*Harian, Mingguan, Bulanan, Tahunan, Kustom*).
   - Pilihan format: **Excel (.xlsx)** dan **CSV (Google Sheets)**.
   - Opsi sertakan baris ringkasan total (*Pendapatan, Pengeluaran, Selisih*).
   - Pratinjau tabel sebelum file diunduh.

7. **Pengaturan & Keamanan**
   - Pengaturan saldo awal.
   - Backup & Restore data lengkap dalam format JSON.
   - Mode Gelap (*Dark Mode*).
   - Kunci Aplikasi (*PIN Lock demo*).

---

## Teknologi

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Google Fonts (Playfair Display & Plus Jakarta Sans)
- **Visualisasi**: Recharts
- **Ekspor Dokumen**: SheetJS (`xlsx`)
- **Penyimpanan**: Local Storage & Persistent Repository Pattern (Offline-first, 0ms latency)

---

## Cara Menjalankan di Lokal (Development)

1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka browser pada alamat yang muncul (biasanya `http://localhost:5173`).

3. Untuk membuat build produksi:
   ```bash
   npm run build
   ```
   File hasil build akan berada di folder `dist/`.

---

## Panduan Hosting & Deployment

Aplikasi ini sudah dilengkapi file konfigurasi `vercel.json` dan `netlify.toml` sehingga dapat di-deploy secara instan dan 100% gratis.

### Opsi 1: Deploy ke Vercel (Rekomendasi Cepat)

1. Buat akun di [Vercel](https://vercel.com).
2. Hubungkan repository GitHub Anda ke Vercel:
   - Buat repo baru di GitHub dan lakukan `git push`.
   - Di dashboard Vercel, klik **Add New...** -> **Project**.
   - Pilih repository **Project-Dompetku**.
   - Vercel akan otomatis mendeteksi konfigurasi Vite (`npm run build` dan folder output `dist`).
   - Klik **Deploy**.
3. Selesai! Aplikasi Anda akan mendapatkan URL publik gratis (misal: `https://dompetku.vercel.app`) dengan HTTPS aktif otomatis.

### Opsi 2: Deploy ke Netlify

1. Masuk ke [Netlify](https://app.netlify.com).
2. Anda bisa langsung melakukan *Drag & Drop* folder `dist` ke dashboard Netlify Drop, atau hubungkan dengan repository GitHub.
3. Aplikasi langsung online dengan domain gratis `.netlify.app`.

---

## Tahap 2: Export ke Aplikasi Mobile (Android / iOS)

Aplikasi dirancang secara *mobile-first* dan siap dibungkus menggunakan **Capacitor**:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init DompetKu com.dompetku.app --web-dir dist
npm run build
npx cap add android
npx cap open android
```
Dokumen ini membuka Android Studio dan siap di-build menjadi APK / AAB untuk Google Play Store.
