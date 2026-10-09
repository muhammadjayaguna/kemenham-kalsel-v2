-- ==============================================================================
-- MASTER DATABASE SCHEMA & SEED DATA KANWIL KEMENHAM KALIMANTAN SELATAN
-- Gunakan skrip ini langsung di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/igzcaatgzpjywpoxgxob/sql/new
-- ==============================================================================

-- 1. BERSIHKAN TABEL LAMA (RESET STRUKTUR & DATA DUMMY)
DROP TABLE IF EXISTS public.pengaduan CASCADE;
DROP TABLE IF EXISTS public.pesan_kontak CASCADE;
DROP TABLE IF EXISTS public.berita_publikasi CASCADE;
DROP TABLE IF EXISTS public.galeri_kegiatan CASCADE;

-- 2. TABEL PENGADUAN HAM (Pos Yankomas)
CREATE TABLE public.pengaduan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_tiket VARCHAR(50) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    nik VARCHAR(20),
    telepon VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    kabupaten_kota VARCHAR(100) NOT NULL,
    alamat TEXT,
    terlapor VARCHAR(255),
    lokasi_kejadian VARCHAR(255),
    kategori_masalah VARCHAR(150) NOT NULL,
    tanggal_kejadian DATE,
    kronologi TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Dalam Penelaahan' NOT NULL,
    catatan_petugas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_pengaduan_tiket ON public.pengaduan (nomor_tiket);
CREATE INDEX idx_pengaduan_status ON public.pengaduan (status);
CREATE INDEX idx_pengaduan_kabupaten ON public.pengaduan (kabupaten_kota);


-- 3. TABEL PESAN KONSULTASI & KONTAK MASUK
CREATE TABLE public.pesan_kontak (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap VARCHAR(255) NOT NULL,
    telepon VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    subjek VARCHAR(255),
    pesan TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Belum Dibaca' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. TABEL WARTA BERITA & PUBLIKASI RESMI
CREATE TABLE public.berita_publikasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    penulis VARCHAR(150) DEFAULT 'Humas Kanwil Kalsel',
    image_url TEXT,
    ringkasan TEXT NOT NULL,
    konten TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 5. TABEL GALERI FOTO KEGIATAN
CREATE TABLE public.galeri_kegiatan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    lokasi VARCHAR(150) NOT NULL,
    tanggal VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 6. AKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.pengaduan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan_kontak ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.berita_publikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri_kegiatan ENABLE ROW LEVEL SECURITY;


-- 7. KEBIJAKAN KEAMANAN AKSES (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Izinkan insert pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Izinkan baca pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Izinkan update pengaduan" ON public.pengaduan;
DROP POLICY IF EXISTS "Izinkan delete pengaduan" ON public.pengaduan;
CREATE POLICY "Izinkan insert pengaduan" ON public.pengaduan FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan baca pengaduan" ON public.pengaduan FOR SELECT USING (true);
CREATE POLICY "Izinkan update pengaduan" ON public.pengaduan FOR UPDATE USING (true);
CREATE POLICY "Izinkan delete pengaduan" ON public.pengaduan FOR DELETE USING (true);

DROP POLICY IF EXISTS "Izinkan insert pesan_kontak" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Izinkan baca pesan_kontak" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Izinkan update pesan_kontak" ON public.pesan_kontak;
DROP POLICY IF EXISTS "Izinkan delete pesan_kontak" ON public.pesan_kontak;
CREATE POLICY "Izinkan insert pesan_kontak" ON public.pesan_kontak FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan baca pesan_kontak" ON public.pesan_kontak FOR SELECT USING (true);
CREATE POLICY "Izinkan update pesan_kontak" ON public.pesan_kontak FOR UPDATE USING (true);
CREATE POLICY "Izinkan delete pesan_kontak" ON public.pesan_kontak FOR DELETE USING (true);

DROP POLICY IF EXISTS "Izinkan baca publikasi" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Izinkan insert publikasi" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Izinkan update publikasi" ON public.berita_publikasi;
DROP POLICY IF EXISTS "Izinkan delete publikasi" ON public.berita_publikasi;
CREATE POLICY "Izinkan baca publikasi" ON public.berita_publikasi FOR SELECT USING (true);
CREATE POLICY "Izinkan insert publikasi" ON public.berita_publikasi FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan update publikasi" ON public.berita_publikasi FOR UPDATE USING (true);
CREATE POLICY "Izinkan delete publikasi" ON public.berita_publikasi FOR DELETE USING (true);

DROP POLICY IF EXISTS "Izinkan baca galeri" ON public.galeri_kegiatan;
DROP POLICY IF EXISTS "Izinkan insert galeri" ON public.galeri_kegiatan;
DROP POLICY IF EXISTS "Izinkan update galeri" ON public.galeri_kegiatan;
DROP POLICY IF EXISTS "Izinkan delete galeri" ON public.galeri_kegiatan;
CREATE POLICY "Izinkan baca galeri" ON public.galeri_kegiatan FOR SELECT USING (true);
CREATE POLICY "Izinkan insert galeri" ON public.galeri_kegiatan FOR INSERT WITH CHECK (true);
CREATE POLICY "Izinkan update galeri" ON public.galeri_kegiatan FOR UPDATE USING (true);
CREATE POLICY "Izinkan delete galeri" ON public.galeri_kegiatan FOR DELETE USING (true);


-- ==============================================================================
-- 8. DATA AWAL RESMI KANWIL KEMENHAM KALIMANTAN SELATAN
-- ==============================================================================

-- A. WARTA BERITA & SIARAN PERS RESMI
INSERT INTO public.berita_publikasi (id, judul, kategori, penulis, image_url, ringkasan, konten, published_at)
VALUES 
(
  'e1a10001-0000-0000-0000-000000000001',
  'Kanwil KemenHAM Kalsel Perkuat Pengawasan Standar Pelayanan Publik Berbasis HAM di 13 Kab/Kota',
  'Siaran Pers',
  'Humas Kanwil Kalsel',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  'Tim pengawas Kanwil KemenHAM Kalimantan Selatan melakukan audit berkala ke sejumlah unit pelayanan terpadu guna memastikan fasilitas aksesibilitas bagi penyandang disabilitas dan kelompok rentan telah terpenuhi sesuai standar P2HAM.',
  $konten$<h2>Standarisasi Pelayanan Publik Berbasis HAM di Kalimantan Selatan</h2><p>Kantor Wilayah Kementerian Hak Asasi Manusia Kalimantan Selatan terus mengintensifkan pendampingan dan peninjauan langsung standar Pelayanan Publik Berbasis HAM (P2HAM) di seluruh satuan kerja dan Unit Pelaksana Teknis di 13 Kabupaten/Kota se-Kalimantan Selatan.</p><div class="article-callout tip"><strong>Fokus Utama Pengawasan:</strong> Memastikan fasilitas disabilitas seperti guiding block, ramp kursi roda, loket prioritas lansia dan ibu menyusui, serta ruang laktasi tersedia dan beroperasi optimal tanpa diskriminasi.</div><h3>Akselerasi Pemenuhan Hak-Hak Dasar Masyarakat</h3><p>Kepala Kantor Wilayah menegaskan bahwa pemenuhan hak asasi manusia bukan sekadar formalitas administratif, melainkan kewajiban mutlak aparatur sipil negara dalam melayani seluruh lapisan masyarakat di Banua.</p><blockquote>"Pelayanan publik yang berkualitas adalah pelayanan yang tidak meninggalkan siapapun di belakang. Seluruh warga Kalimantan Selatan berhak mendapatkan perlakuan yang bermartabat dan setara saat mengakses fasilitas pemerintah."</blockquote><h3>Tiga Pilar Evaluasi P2HAM 2026</h3><ul><li><strong>Aksesibilitas Fisik:</strong> Ketersediaan jalur landai, toilet disabilitas, dan sarana mobilitas mandiri.</li><li><strong>Ketersediaan Petugas Khusus:</strong> Keberadaan petugas berkemampuan bahasa isyarat dan pendamping kelompok rentan.</li><li><strong>Mekanisme Pengaduan Cepat:</strong> Integrasi loket pengaduan fisik dengan Pos Pelayanan Komunikasi Masyarakat (Yankomas).</li></ul><div class="article-callout info"><strong>Informasi Layanan:</strong> Warga yang menemukan pelayanan instansi publik yang diskriminatif dapat menyampaikan permohonan komunikasi melalui menu <em>Pengaduan HAM</em> di portal ini.</div>$konten$,
  NOW() - INTERVAL '2 days'
),
(
  'e1a10001-0000-0000-0000-000000000002',
  'Rapat Koordinasi Bersama Pemda Kalsel: Akselerasi Penilaian Kabupaten/Kota Peduli HAM 2026',
  'Berita Daerah',
  'Divisi Pemajuan HAM',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
  'Mendorong seluruh kabupaten/kota di Kalimantan Selatan untuk mengunggah dokumen capaian pemenuhan hak dasar bidang kesehatan, pendidikan, dan hak perempuan-anak pada aplikasi pelaporan nasional.',
  $konten$<h2>Sinergi Lintas Sektoral Penilaian KKHAM 2026</h2><p>Rapat koordinasi bersama Biro Hukum Pemerintah Provinsi Kalimantan Selatan dan bagian hukum dari 13 Pemerintah Kabupaten/Kota membahas langkah strategis pemenuhan indikator Kabupaten/Kota Peduli HAM (KKHAM) tahun 2026.</p><h3>Indikator Penilaian Komprehensif</h3><p>Penilaian KKHAM mencakup pemenuhan hak atas kesehatan, hak atas pendidikan, hak perempuan dan anak, hak atas kependudukan, hak atas pekerjaan, serta hak atas perumahan yang layak dan lingkungan hidup yang berkelanjutan.</p><div class="article-callout warning"><strong>Target Kalsel 2026:</strong> Seluruh 13 Kabupaten/Kota se-Kalsel ditargetkan meraih predikat Peduli HAM secara paripurna melalui akselerasi pelaporan capaian berbasis data empiris.</div>$konten$,
  NOW() - INTERVAL '5 days'
),
(
  'e1a10001-0000-0000-0000-000000000003',
  'Diseminasi Nilai-Nilai HAM bagi Generasi Muda Banua: Membangun Budaya Inklusif dan Anti-Perundungan',
  'Edukasi & Sosialisasi',
  'Penyuluh Hukum HAM',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
  'Kegiatan sosialisasi pemahaman HAM digelar di Banjarmasin dengan melibatkan ratusan perwakilan pelajar dan mahasiswa perguruan tinggi se-Kalimantan Selatan.',
  $konten$<h2>Edukasi Literasi HAM di Kalangan Pelajar dan Mahasiswa</h2><p>Penyuluhan hukum HAM mengangkat tema pencegahan perundungan (anti-bullying), toleransi kebhinekaan, dan pemanfaatan media digital secara bijak dan beretika tanpa melanggar hak privasi orang lain.</p><div class="article-callout info"><strong>Program Goes to Campus:</strong> Kanwil KemenHAM Kalsel secara aktif mengadakan kuliah umum dan klinik hukum HAM gratis bagi civitas akademika di Kalimantan Selatan.</div>$konten$,
  NOW() - INTERVAL '12 days'
),
(
  'e1a10001-0000-0000-0000-000000000004',
  'Kajian Perspektif HAM dalam Pembentukan Rancangan Peraturan Daerah Kalimantan Selatan',
  'Harmonisasi Hukum',
  'Tim Perancang Perda',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  'Kanwil KemenHAM Kalsel bersama Bapemperda DPRD Kalsel menggelar rapat kerja telaahan perspektif HAM guna memastikan payung hukum daerah ramah terhadap kelompok marjinal.',
  $konten$<h2>Harmonisasi Produk Hukum Daerah Berperspektif Hak Asasi Manusia</h2><p>Kajian ini memastikan setiap regulasi daerah tidak memuat klausul diskriminatif, memberikan perlindungan bagi masyarakat adat, tenaga kerja lokal, dan penyandang disabilitas di seluruh Kalimantan Selatan.</p>$konten$,
  NOW() - INTERVAL '20 days'
);


-- B. DOKUMENTASI FOTO GALERI KEGIATAN KALSEL
INSERT INTO public.galeri_kegiatan (id, judul, kategori, lokasi, tanggal, image_url, deskripsi)
VALUES
(
  'f2b20002-0000-0000-0000-000000000001',
  'Bimbingan Teknis & Penilaian Lapangan Standar Pelayanan Publik Berbasis HAM (P2HAM)',
  'Pengawasan P2HAM',
  'Kota Banjarmasin, Kalimantan Selatan',
  '12 September 2026',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  $desk$Peninjauan langsung fasilitas jalur pemandu (guiding block), loket prioritas, dan ruang ramah kelompok rentan di instansi pelayanan publik.$desk$
),
(
  'f2b20002-0000-0000-0000-000000000002',
  'Rapat Koordinasi Pembinaan Kriteria Kabupaten/Kota Peduli HAM (KKHAM) Tingkat Provinsi',
  'Koordinasi Daerah',
  'Kantor Gubernur Kalsel, Banjarbaru',
  '05 September 2026',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
  $desk$Sinergi Kanwil KemenHAM Kalsel bersama Biro Hukum Pemerintah Provinsi dan Bagian Hukum 13 Kabupaten/Kota se-Kalsel.$desk$
),
(
  'f2b20002-0000-0000-0000-000000000003',
  'Sosialisasi & Edukasi Nilai-Nilai Hak Asasi Manusia bagi Pelajar dan Generasi Muda',
  'Edukasi Publik',
  'Kabupaten Banjar, Kalimantan Selatan',
  '26 Agustus 2026',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  $desk$Peningkatan literasi HAM, toleransi keberagaman, dan pencegahan perundungan di lingkungan sekolah dan pesantren.$desk$
),
(
  'f2b20002-0000-0000-0000-000000000004',
  'Penerimaan & Fasilitasi Pengaduan Masyarakat di Pos Pelayanan Yankomas',
  'Layanan Yankomas',
  'Loket PTSP Kanwil KemenHAM, Banjarmasin',
  '18 Agustus 2026',
  'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
  $desk$Petugas analis Pos Yankomas menerima komunikasi masyarakat dan memberikan konsultasi hukum HAM secara cuma-cuma.$desk$
),
(
  'f2b20002-0000-0000-0000-000000000005',
  'Harmonisasi Raperda Berperspektif HAM Bersama DPRD Provinsi Kalimantan Selatan',
  'Harmonisasi Regulasi',
  'Gedung DPRD Kalsel, Banjarmasin',
  '10 Agustus 2026',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  $desk$Kajian naskah akademik rancangan produk hukum daerah agar selaras dengan norma hak asasi manusia dan non-diskriminatif.$desk$
),
(
  'f2b20002-0000-0000-0000-000000000006',
  'Kunjungan Kerja & Pengawasan Pemenuhan Hak Pekerja Sektor Perkebunan dan Pesisir',
  'Peninjauan Lapangan',
  'Kabupaten Tanah Bumbu & Kotabaru',
  '02 Agustus 2026',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  $desk$Pemantauan implementasi keselamatan kerja, perlindungan jaminan sosial, dan hak lingkungan hidup sehat bagi tenaga kerja di daerah.$desk$
);


-- C. CONTOH DATA PENGADUAN HAM (Pos Yankomas)
INSERT INTO public.pengaduan (id, nomor_tiket, nama_lengkap, nik, telepon, email, kabupaten_kota, alamat, terlapor, lokasi_kejadian, kategori_masalah, tanggal_kejadian, kronologi, status, catatan_petugas, created_at)
VALUES
(
  'd3c30003-0000-0000-0000-000000000001',
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
  $kron$Pemohon mengeluhkan tidak tersedianya aksesibilitas ramah kursi roda dan jalur pemandu bagi penyandang disabilitas saat mengurus administrasi.$kron$,
  'Dalam Penelaahan',
  $cat$Berkas telah diterima tim telaahan. Menunggu konfirmasi jadwal audiensi klarifikasi.$cat$,
  NOW() - INTERVAL '3 days'
),
(
  'd3c30003-0000-0000-0000-000000000002',
  'HAM-KS-2026-7419',
  'Siti Rahmah',
  '6303025501880004',
  '085248901234',
  'siti.rahmah@example.com',
  'Kabupaten Banjar',
  'Kec. Martapura Timur, Kab. Banjar',
  'Perusahaan Perkebunan Swasta',
  'Kecamatan Simpang Empat',
  'Hak Ketenagakerjaan / Perselisihan Hubungan Kerja',
  '2026-09-02',
  $kron$Dugaan pemutusan hubungan kerja sepihak tanpa pemenuhan hak pesangon dan jaminan keselamatan kerja bagi pekerja harian lepas.$kron$,
  'Dalam Proses Mediasi',
  $cat$Surat permintaan klarifikasi tahap I telah dikirimkan ke pihak manajemen perusahaan terlapor.$cat$,
  NOW() - INTERVAL '7 days'
);


-- D. CONTOH PESAN KONSULTASI MASUK
INSERT INTO public.pesan_kontak (id, nama_lengkap, telepon, email, subjek, pesan, status, created_at)
VALUES
(
  'c4d40004-0000-0000-0000-000000000001',
  'Budi Santoso, M.H.',
  '081399887766',
  'budi.santoso@univ.ac.id',
  'Permohonan Narasumber Sosialisasi HAM',
  $msg$Kami dari Fakultas Hukum universitas di Banjarmasin bermaksud memohon kesediaan narasumber dari Kanwil KemenHAM Kalsel untuk kegiatan seminar Hak Asasi Manusia.$msg$,
  'Belum Dibaca',
  NOW() - INTERVAL '1 days'
),
(
  'c4d40004-0000-0000-0000-000000000002',
  'Hj. Noor Aisyah',
  '085277889900',
  'aisyah.noor@banjarmasinkota.go.id',
  'Konsultasi Penilaian KKHAM 2026',
  $msg$Mohon panduan teknis pengunggahan berkas capaian hak perempuan dan anak pada sistem pelaporan Kabupaten/Kota Peduli HAM.$msg$,
  'Belum Dibaca',
  NOW() - INTERVAL '4 days'
);


-- ==============================================================================
-- 9. BUAT AKUN ADMINISTRATOR SUPABASE: admin@kemenhamkalsel.com / 12345678
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $admin_account$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@kemenhamkalsel.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@kemenhamkalsel.com',
      crypt('12345678', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin Kanwil Kalsel","role":"admin"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  ELSE
    UPDATE auth.users 
    SET encrypted_password = crypt('12345678', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE email = 'admin@kemenhamkalsel.com';
  END IF;
END $admin_account$;
