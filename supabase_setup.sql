-- =========================================================================
-- KANWIL KEMENHAM KALSEL - SUPABASE DATABASE SETUP & PERMISSIONS
-- Copy-paste script ini ke Supabase Dashboard -> SQL Editor -> Run
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
-- IZIN ROW LEVEL SECURITY (RLS) - AGAR DAPAT DI-INSERT DARI DASHBOARD ADMIN
-- =========================================================================

-- Enable RLS
ALTER TABLE public.berita_publikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaduan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan_kontak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_kegiatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengumuman_marquee ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Public Select Berita" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Public Insert Berita" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Public Update Berita" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Public Delete Berita" ON public.berita_publikasi;

DROP POLICY IF EXISTS "Public Select Pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Public Insert Pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Public Update Pengaduan" ON public.pengaduan;

DROP POLICY IF EXISTS "Public Select Pesan" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Public Insert Pesan" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Public Update Pesan" ON public.pesan_kontak;

DROP POLICY IF EXISTS "Public Select Galeri" ON public.galeri_kegiatan;
DROP POLICY IF EXISTS "Public Insert Galeri" ON public.galeri_kegiatan;

DROP POLICY IF EXISTS "Public Select Marquee" ON public.pengumuman_marquee;
DROP POLICY IF EXISTS "Public Insert Marquee" ON public.pengumuman_marquee;
DROP POLICY IF EXISTS "Public Update Marquee" ON public.pengumuman_marquee;
DROP POLICY IF EXISTS "Public Delete Marquee" ON public.pengumuman_marquee;

-- Create Permissive Policies for Web & Admin App
CREATE POLICY "Public Select Berita" ON public.berita_publikasi FOR SELECT USING (true);
CREATE POLICY "Public Insert Berita" ON public.berita_publikasi FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Berita" ON public.berita_publikasi FOR UPDATE USING (true);
CREATE POLICY "Public Delete Berita" ON public.berita_publikasi FOR DELETE USING (true);

CREATE POLICY "Public Select Pengaduan" ON public.pengaduan FOR SELECT USING (true);
CREATE POLICY "Public Insert Pengaduan" ON public.pengaduan FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Pengaduan" ON public.pengaduan FOR UPDATE USING (true);

CREATE POLICY "Public Select Pesan" ON public.pesan_kontak FOR SELECT USING (true);
CREATE POLICY "Public Insert Pesan" ON public.pesan_kontak FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Pesan" ON public.pesan_kontak FOR UPDATE USING (true);

CREATE POLICY "Public Select Galeri" ON public.galeri_kegiatan FOR SELECT USING (true);
CREATE POLICY "Public Insert Galeri" ON public.galeri_kegiatan FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Select Marquee" ON public.pengumuman_marquee FOR SELECT USING (true);
CREATE POLICY "Public Insert Marquee" ON public.pengumuman_marquee FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Marquee" ON public.pengumuman_marquee FOR UPDATE USING (true);
CREATE POLICY "Public Delete Marquee" ON public.pengumuman_marquee FOR DELETE USING (true);

-- =========================================================================
-- INITIAL SEED DATA (DATA AWAL WARMA BERITA, GALERI & RUNNING TEXT)
-- =========================================================================

INSERT INTO public.pengumuman_marquee (teks, urutan, is_active)
VALUES 
    ('📢 Layanan Pengaduan HAM Online Kanwil KemenHAM Kalsel tersedia 24/7 — Gratis dan Rahasia', 1, true),
    ('🏛️ Zona Integritas Menuju Wilayah Bebas dari Korupsi (WBK) — Kanwil KemenHAM Kalsel', 2, true),
    ('📋 Pendaftaran Kabupaten/Kota Peduli HAM (KKHAM) Tahun 2026 telah dibuka', 3, true),
    ('🤝 Sosialisasi Desa Sadar HAM di 13 Kabupaten/Kota se-Kalimantan Selatan', 4, true)
ON CONFLICT DO NOTHING;

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
)
ON CONFLICT DO NOTHING;

