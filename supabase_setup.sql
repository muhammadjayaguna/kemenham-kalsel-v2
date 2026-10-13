-- =========================================================================
-- KANWIL KEMENTERIAN HAK ASASI MANUSIA PROVINSI KALIMANTAN SELATAN
-- MASTER DATABASE SETUP & POLICIES (SUPABASE)
-- 
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih project Anda -> Masuk ke menu "SQL Editor"
-- 3. Buat "New Query", salin seluruh isi file ini, lalu klik "Run" (Ctrl + Enter)
-- =========================================================================

-- =========================================================================
-- BAGIAN 1: STRUKTUR TABEL LENGKAP (5 TABEL UTAMA)
-- =========================================================================

-- 1. TABEL BERITA & PUBLIKASI (berita_publikasi)
CREATE TABLE IF NOT EXISTS public.berita_publikasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL DEFAULT 'Siaran Pers',
    penulis TEXT DEFAULT 'Humas Kanwil Kalsel',
    image_url TEXT,
    ringkasan TEXT NOT NULL,
    konten TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PENGADUAN HAM YANKOMAS (pengaduan)
CREATE TABLE IF NOT EXISTS public.pengaduan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_tiket TEXT UNIQUE NOT NULL,
    nama_lengkap TEXT NOT NULL,
    nik TEXT,
    telepon TEXT NOT NULL,
    email TEXT,
    kabupaten_kota TEXT NOT NULL,
    alamat TEXT,
    terlapor TEXT,
    lokasi_kejadian TEXT,
    kategori_masalah TEXT NOT NULL,
    tanggal_kejadian DATE,
    kronologi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Dalam Penelaahan',
    catatan_petugas TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL PESAN KONTAK & KONSULTASI (pesan_kontak)
CREATE TABLE IF NOT EXISTS public.pesan_kontak (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap TEXT NOT NULL,
    telepon TEXT NOT NULL,
    email TEXT,
    subjek TEXT,
    pesan TEXT NOT NULL,
    status TEXT DEFAULT 'Belum Dibaca',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL GALERI KEGIATAN DOKUMENTASI (galeri_kegiatan)
CREATE TABLE IF NOT EXISTS public.galeri_kegiatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL DEFAULT 'Kegiatan',
    lokasi TEXT DEFAULT 'Kalimantan Selatan',
    tanggal TEXT DEFAULT '2026',
    image_url TEXT NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL RUNNING TEXT PENGUMUMAN MARQUEE (pengumuman_marquee)
CREATE TABLE IF NOT EXISTS public.pengumuman_marquee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teks TEXT NOT NULL,
    urutan INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- BAGIAN 2: INDEXING UNTUK PERFORMA QUERY
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_pengaduan_tiket ON public.pengaduan (nomor_tiket);
CREATE INDEX IF NOT EXISTS idx_pengaduan_status ON public.pengaduan (status);
CREATE INDEX IF NOT EXISTS idx_berita_published ON public.berita_publikasi (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_marquee_urutan ON public.pengumuman_marquee (urutan ASC);

-- =========================================================================
-- BAGIAN 3: ROW LEVEL SECURITY (RLS) & IZIN AKSES (SELECT, INSERT, UPDATE, DELETE)
-- =========================================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.berita_publikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaduan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan_kontak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman_marquee ENABLE ROW LEVEL SECURITY;

-- 1. Kebijakan Tabel Berita Publikasi
DROP POLICY IF EXISTS "Public Select Berita" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Public Insert Berita" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Public Update Berita" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Public Delete Berita" ON public.berita_publikasi;
CREATE POLICY "Public Select Berita" ON public.berita_publikasi FOR SELECT USING (true);
CREATE POLICY "Public Insert Berita" ON public.berita_publikasi FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Berita" ON public.berita_publikasi FOR UPDATE USING (true);
CREATE POLICY "Public Delete Berita" ON public.berita_publikasi FOR DELETE USING (true);

-- 2. Kebijakan Tabel Pengaduan
DROP POLICY IF EXISTS "Public Select Pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Public Insert Pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Public Update Pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Public Delete Pengaduan" ON public.pengaduan;
CREATE POLICY "Public Select Pengaduan" ON public.pengaduan FOR SELECT USING (true);
CREATE POLICY "Public Insert Pengaduan" ON public.pengaduan FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Pengaduan" ON public.pengaduan FOR UPDATE USING (true);
CREATE POLICY "Public Delete Pengaduan" ON public.pengaduan FOR DELETE USING (true);

-- 3. Kebijakan Tabel Pesan Kontak
DROP POLICY IF EXISTS "Public Select Pesan" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Public Insert Pesan" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Public Update Pesan" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Public Delete Pesan" ON public.pesan_kontak;
CREATE POLICY "Public Select Pesan" ON public.pesan_kontak FOR SELECT USING (true);
CREATE POLICY "Public Insert Pesan" ON public.pesan_kontak FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Pesan" ON public.pesan_kontak FOR UPDATE USING (true);
CREATE POLICY "Public Delete Pesan" ON public.pesan_kontak FOR DELETE USING (true);

-- 4. Kebijakan Tabel Galeri Kegiatan
DROP POLICY IF EXISTS "Public Select Galeri" ON public.galeri_kegiatan;
DROP POLICY IF EXISTS "Public Insert Galeri" ON public.galeri_kegiatan;
DROP POLICY IF EXISTS "Public Update Galeri" ON public.galeri_kegiatan;
DROP POLICY IF EXISTS "Public Delete Galeri" ON public.galeri_kegiatan;
CREATE POLICY "Public Select Galeri" ON public.galeri_kegiatan FOR SELECT USING (true);
CREATE POLICY "Public Insert Galeri" ON public.galeri_kegiatan FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Galeri" ON public.galeri_kegiatan FOR UPDATE USING (true);
CREATE POLICY "Public Delete Galeri" ON public.galeri_kegiatan FOR DELETE USING (true);

-- 5. Kebijakan Tabel Running Text (Marquee)
DROP POLICY IF EXISTS "Public Select Marquee" ON public.pengumuman_marquee;
DROP POLICY IF EXISTS "Public Insert Marquee" ON public.pengumuman_marquee;
DROP POLICY IF EXISTS "Public Update Marquee" ON public.pengumuman_marquee;
DROP POLICY IF EXISTS "Public Delete Marquee" ON public.pengumuman_marquee;
CREATE POLICY "Public Select Marquee" ON public.pengumuman_marquee FOR SELECT USING (true);
CREATE POLICY "Public Insert Marquee" ON public.pengumuman_marquee FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Marquee" ON public.pengumuman_marquee FOR UPDATE USING (true);
CREATE POLICY "Public Delete Marquee" ON public.pengumuman_marquee FOR DELETE USING (true);

-- =========================================================================
-- BAGIAN 4: DATA AWAL (SEED DATA STANDAR PORTAL KANWIL KEMENHAM KALSEL)
-- =========================================================================

-- A. Running Text Marquee
INSERT INTO public.pengumuman_marquee (teks, urutan, is_active)
VALUES 
    ('📢 Layanan Pengaduan HAM Online Kanwil KemenHAM Kalsel tersedia 24/7 — Gratis dan Rahasia', 1, true),
    ('🏛️ Zona Integritas Menuju Wilayah Bebas dari Korupsi (WBK) — Kanwil KemenHAM Kalsel', 2, true),
    ('📋 Pendaftaran Kabupaten/Kota Peduli HAM (KKHAM) Tahun 2026 telah dibuka', 3, true),
    ('🤝 Sosialisasi Desa Sadar HAM di 13 Kabupaten/Kota se-Kalimantan Selatan', 4, true)
ON CONFLICT DO NOTHING;

-- B. Warta Berita & Publikasi Resmi
INSERT INTO public.berita_publikasi (judul, kategori, penulis, image_url, ringkasan, konten, published_at)
VALUES 
(
    'Kanwil KemenHAM Kalsel Gelar Rapat Koordinasi Layanan Pengaduan HAM se-Kalimantan Selatan',
    'Siaran Pers',
    'Humas Kanwil Kalsel',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    'Kakanwil Karyadi, S.H., M.H. memimpin koordinasi percepatan penanganan aduan masyarakat dan penguatan pos Pelayanan Komunikasi Masyarakat (Yankomas) di 13 Kabupaten/Kota se-Kalsel.',
    '<p>Banjarmasin — Kantor Wilayah Kementerian Hak Asasi Manusia (Kanwil KemenHAM) Kalimantan Selatan menyelenggarakan Rapat Koordinasi Teknis Penanganan Pengaduan HAM bersama instansi pemerintah daerah dan aparat penegak hukum se-Kalimantan Selatan.</p><p>Acara dibuka secara resmi oleh Kepala Kantor Wilayah KemenHAM Kalsel, Karyadi, S.H., M.H., yang menegaskan pentingnya respons cepat dan akuntabel dalam menindaklanjuti setiap aduan dugaan pelanggaran HAM yang disampaikan oleh masyarakat.</p><blockquote>"Kanwil KemenHAM Kalsel berkomitmen penuh memperkuat perlindungan dan penegakan HAM melalui pengoptimalan Pos Yankomas di seluruh wilayah Kalimantan Selatan," tegas Kakanwil Karyadi, S.H., M.H.</blockquote><p>Melalui rakor ini, diharapkan penanganan aduan HAM di 13 Kabupaten/Kota dapat berjalan secara terintegrasi dan lebih transparan.</p>',
    NOW() - INTERVAL '2 days'
),
(
    'Penguatan Pelayanan Publik Berbasis HAM (P2HAM) pada Seluruh Jajaran KemenHAM Kalsel',
    'Pengawasan P2HAM',
    'Tim P2HAM Kalsel',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    'Pelaksanaan asesmen dan verifikasi sarana prasarana ramah disabilitas, ruang laktasi, serta standar pelayanan inklusif di lingkungan Kanwil KemenHAM Kalsel.',
    '<p>Banjarbaru — Kanwil KemenHAM Kalsel terus memperkuat komitmen pelaksanaan Pelayanan Publik Berbasis Hak Asasi Manusia (P2HAM) sesuai dengan Peraturan Menteri Hak Asasi Manusia Republik Indonesia.</p><p>Tim verifikasi P2HAM melakukan evaluasi menyeluruh terhadap ketersediaan aksesibilitas bagi penyandang disabilitas, kelompok rentan, serta fasilitas pendukung seperti sarana pemandu (guiding block), kursi roda, dan ruang pelayanan khusus.</p><p>Kakanwil Karyadi, S.H., M.H. menyampaikan bahwa P2HAM bukan sekadar pemenuhan standar administratif, melainkan wujud nyata penghormatan atas hak-hak setiap warga negara dalam memperoleh pelayanan publik yang setara dan bermartabat.</p>',
    NOW() - INTERVAL '5 days'
),
(
    'Harmonisasi Rancangan Peraturan Daerah Berperspektif HAM Bersama Pemerintah Daerah Kalsel',
    'Harmonisasi Perda',
    'Perancang Peraturan HAM',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    'Tim Perancang Kanwil KemenHAM Kalsel memfasilitasi analisa dan harmonisasi Raperda agar selaras dengan indikator P5HAM dan tidak diskriminatif.',
    '<p>Banjarmasin — Kanwil KemenHAM Kalsel menggelar rapat harmonisasi produk hukum daerah bersama jajaran Pemerintah Provinsi Kalimantan Selatan dan DPRD Kabupaten/Kota.</p><p>Harmonisasi ini bertujuan untuk memastikan seluruh Rancangan Peraturan Daerah (Raperda) yang disusun mencerminkan nilai-nilai Penghormatan, Pelindungan, Pemenuhan, Penegakan, dan Pemajuan HAM (P5HAM).</p><p>Dengan adanya proses harmonisasi ini, peraturan daerah di Kalsel dipastikan berorientasi pada kesejahteraan rakyat dan bebas dari norma hukum yang diskriminatif.</p>',
    NOW() - INTERVAL '10 days'
),
(
    'Sosialisasi Pembentukan Desa Sadar HAM di Kabupaten Barito Kuala Menuju Wilayah Inklusif',
    'Pemberdayaan HAM',
    'Divisi Pelayanan Hukum & HAM',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    'Peningkatan kapasitas aparatur desa dan tokoh masyarakat dalam mengimplementasikan prinsip kesetaraan hak, pencegahan perkawinan anak, serta pemenuhan hak administrasi kependudukan.',
    '<p>Marabahan — Kantor Wilayah Kementerian Hak Asasi Manusia Kalimantan Selatan menyelenggarakan bimbingan teknis dan sosialisasi Desa Sadar HAM di Kabupaten Barito Kuala.</p><p>Program ini bertujuan untuk membangun kesadaran hukum dan HAM dari tingkat akar rumput, sehingga setiap aparatur desa mampu menyelesaikan dinamika sosial warganya dengan mengedepankan mediasi berbasis kekeluargaan dan perlindungan hak-hak dasar kelompok rentan.</p><blockquote>"Desa Sadar HAM adalah fondasi kemajuan daerah. Ketika hak setiap warga desa dihormati dan dilindungi, keadilan sosial dapat terwujud secara nyata," ujar perwakilan Divisi Pelayanan Hukum dan HAM Kalsel.</blockquote>',
    NOW() - INTERVAL '15 days'
),
(
    'Akselerasi Verifikasi Penilaian Kabupaten/Kota Peduli HAM (KKHAM) Tahun 2026 se-Kalsel',
    'Evaluasi Kebijakan',
    'Tim KKHAM Kalsel',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    'Kanwil KemenHAM Kalsel mengawal kelengkapan data dukung indikator hak sipil, politik, ekonomi, sosial, dan budaya pada 13 Kabupaten/Kota di Kalimantan Selatan.',
    '<p>Banjarmasin — Tim Verifikator KKHAM Kanwil KemenHAM Kalsel menggelar rapat evaluasi kelengkapan data dukung bersama Bagian Hukum Setda dari 13 Kabupaten/Kota se-Kalimantan Selatan.</p><p>Penilaian KKHAM mencakup indikator pemenuhan hak atas kesehatan, pendidikan, hak perempuan dan anak, hak atas kependudukan, serta hak atas pekerjaan yang layak. Kanwil KemenHAM Kalsel berkomitmen mendampingi pemerintah daerah agar seluruh kabupaten/kota di Banua meraih predikat Peduli HAM secara paripurna.</p>',
    NOW() - INTERVAL '20 days'
)
ON CONFLICT DO NOTHING;

-- C. Galeri Kegiatan Dokumentasi
INSERT INTO public.galeri_kegiatan (judul, kategori, lokasi, tanggal, image_url, deskripsi)
VALUES
(
    'Rapat Koordinasi Penguatan P2HAM se-Kalimantan Selatan',
    'Rapat Koordinasi',
    'Kota Banjarmasin',
    '28 September 2026',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    'Sinergi bersama seluruh pemangku kepentingan dalam mewujudkan pelayanan publik yang inklusif dan ramah HAM.'
),
(
    'Pelayanan Komunikasi Masyarakat (Pos Yankomas) Berkeliling',
    'Layanan Publik',
    'Kabupaten Banjar',
    '22 September 2026',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    'Jemput bola konsultasi dan penanganan pengaduan dugaan pelanggaran HAM di wilayah pedesaan.'
),
(
    'Sosialisasi Desa Sadar HAM di Kabupaten Barito Kuala',
    'Edukasi HAM',
    'Marabahan',
    '15 September 2026',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    'Peningkatan literasi HAM bagi aparatur desa dan pemuda dalam mencegah diskriminasi.'
),
(
    'Verifikasi Lapangan Indikator Penilaian Kabupaten Peduli HAM (KKHAM)',
    'Monitoring & Evaluasi',
    'Kota Banjarbaru',
    '10 September 2026',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    'Peninjauan sarana prasarana ramah disabilitas di unit pelaksana teknis daerah.'
)
ON CONFLICT DO NOTHING;

-- D. Contoh Data Awal Pengaduan HAM (Pos Yankomas)
INSERT INTO public.pengaduan (nomor_tiket, nama_lengkap, nik, telepon, email, kabupaten_kota, alamat, terlapor, lokasi_kejadian, kategori_masalah, tanggal_kejadian, kronologi, status, catatan_petugas)
VALUES
(
    'HAM-KS-2026-8812',
    'Ahmad Fauzi',
    '6371012304900001',
    '081255678901',
    'fauzi.ahmad@example.com',
    'Kota Banjarmasin',
    'Jl. Sutoyo S No. 15, Banjarmasin Barat',
    'Instansi Pelayanan Publik Wilayah',
    'Banjarmasin Tengah',
    'Diskriminasi Pelayanan Publik (P2HAM)',
    '2026-09-10',
    'Pemohon mengeluhkan tidak tersedianya aksesibilitas ramah kursi roda dan jalur pemandu bagi penyandang disabilitas saat mengurus administrasi.',
    'Dalam Penelaahan',
    'Berkas telah diterima tim penelaah Pos Yankomas. Menunggu konfirmasi jadwal klarifikasi.'
),
(
    'HAM-KS-2026-7419',
    'Siti Rahmah',
    '6303025501880004',
    '085248901234',
    'siti.rahmah@example.com',
    'Kabupaten Banjar',
    'Jl. A. Yani Km 39, Martapura',
    'Pihak Perusahaan Swasta',
    'Kec. Martapura Timur',
    'Hak Atas Ketenagakerjaan',
    '2026-09-18',
    'Laporan terkait penahanan ijazah kerja dan jam kerja yang melebihi standar tanpa kompensasi lembur.',
    'Dalam Proses Mediasi',
    'Surat pemanggilan mediasi telah dikirimkan ke pihak pelapor dan terlapor.'
)
ON CONFLICT (nomor_tiket) DO NOTHING;

-- E. Contoh Data Awal Pesan Konsultasi & Kontak Masuk
INSERT INTO public.pesan_kontak (nama_lengkap, telepon, email, subjek, pesan, status)
VALUES
(
    'Budi Santoso',
    '081345678910',
    'budi.santoso@gmail.com',
    'Permohonan Narasumber Sosialisasi HAM di Kampus',
    'Yth. Kanwil KemenHAM Kalsel, kami dari BEM Fakultas Hukum bermaksud mengundang tim pemateri untuk seminar kesadaran HAM mahasiswa pada bulan depan.',
    'Belum Dibaca'
),
(
    'Nurul Hidayah',
    '085789123456',
    'nurul.h@gmail.com',
    'Konsultasi Pembentukan Pos Yankomas di Kecamatan',
    'Selamat pagi, bagaimana prosedur dan persyaratan teknis untuk pengajuan pembentukan Pos Yankomas pendamping di tingkat kecamatan?',
    'Sudah Dibalas'
)
ON CONFLICT DO NOTHING;
