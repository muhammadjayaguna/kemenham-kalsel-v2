import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://igzcaatgzpjywpoxgxob.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnemNhYXRnenBqeXdwb3hneG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTc5NDgsImV4cCI6MjEwNTQ3Mzk0OH0.eWW-lK7v6a_-gLp_Y1p6qO9Q6G5Z2vX_5rW'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Pengaduan {
  id?: string
  nomor_tiket: string
  nama_lengkap: string
  nik?: string
  telepon: string
  email?: string
  kabupaten_kota: string
  alamat?: string
  terlapor?: string
  lokasi_kejadian?: string
  kategori_masalah: string
  tanggal_kejadian?: string
  kronologi: string
  status: 'Dalam Penelaahan' | 'Permintaan Klarifikasi' | 'Dalam Proses Mediasi' | 'Selesai' | 'Ditolak'
  catatan_petugas?: string
  created_at?: string
  updated_at?: string
}

export interface PesanKontak {
  id?: string
  nama_lengkap: string
  telepon: string
  email?: string
  subjek?: string
  pesan: string
  status?: 'Belum Dibaca' | 'Sudah Ditanggapi' | 'Selesai'
  created_at?: string
}

export interface BeritaPublikasi {
  id?: string
  judul: string
  kategori: string
  penulis?: string
  image_url?: string
  ringkasan: string
  konten?: string
  published_at?: string
  created_at?: string
}

export interface GaleriKegiatan {
  id?: string
  judul: string
  kategori: string
  lokasi: string
  tanggal: string
  image_url: string
  deskripsi?: string
  created_at?: string
}

export interface PengumumanMarquee {
  id?: string
  teks: string
  urutan?: number
  is_active?: boolean
  created_at?: string
}

export const DEFAULT_MARQUEE_ITEMS: string[] = [
  '📢 Layanan Pengaduan HAM Online Kanwil KemenHAM Kalsel tersedia 24/7 — Gratis dan Rahasia',
  '🏛️ Zona Integritas Menuju Wilayah Bebas dari Korupsi (WBK) — Kanwil KemenHAM Kalsel',
  '📋 Pendaftaran Kabupaten/Kota Peduli HAM (KKHAM) Tahun 2026 telah dibuka',
  '🤝 Sosialisasi Desa Sadar HAM di 13 Kabupaten/Kota se-Kalimantan Selatan',
]

export const DEFAULT_INITIAL_NEWS: BeritaPublikasi[] = [
  {
    id: 'news-init-1',
    judul: 'Kanwil KemenHAM Kalsel Gelar Rapat Koordinasi Layanan Pengaduan HAM se-Kalimantan Selatan',
    kategori: 'Siaran Pers',
    penulis: 'Humas Kanwil Kalsel',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    ringkasan: 'Kakanwil Karyadi, S.H., M.H. memimpin koordinasi percepatan penanganan aduan masyarakat dan penguatan pos Pelayanan Komunikasi Masyarakat (Yankomas) di 13 Kabupaten/Kota se-Kalsel.',
    konten: '<p>Banjarmasin — Kantor Wilayah Kementerian Hak Asasi Manusia (Kanwil KemenHAM) Kalimantan Selatan menyelenggarakan Rapat Koordinasi Teknis Penanganan Pengaduan HAM bersama instansi pemerintah daerah dan aparat penegak hukum se-Kalimantan Selatan.</p><p>Acara dibuka secara resmi oleh Kepala Kantor Wilayah KemenHAM Kalsel, Karyadi, S.H., M.H., yang menegaskan pentingnya respons cepat dan akuntabel dalam menindaklanjuti setiap aduan dugaan pelanggaran HAM yang disampaikan oleh masyarakat.</p><blockquote>"Kanwil KemenHAM Kalsel berkomitmen penuh memperkuat perlindungan dan penegakan HAM melalui pengoptimalan Pos Yankomas di seluruh wilayah Kalimantan Selatan," tegas Kakanwil Karyadi, S.H., M.H.</blockquote><p>Melalui rakor ini, diharapkan penanganan aduan HAM di 13 Kabupaten/Kota dapat berjalan secara terintegrasi dan lebih transparan.</p>',
    published_at: '2026-09-28T09:00:00.000Z',
  },
  {
    id: 'news-init-2',
    judul: 'Penguatan Pelayanan Publik Berbasis HAM (P2HAM) pada Seluruh Jajaran KemenHAM Kalsel',
    kategori: 'Pengawasan P2HAM',
    penulis: 'Tim P2HAM Kalsel',
    image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    ringkasan: 'Pelaksanaan asesmen dan verifikasi sarana prasarana ramah disabilitas, ruang laktasi, serta standar pelayanan inklusif di lingkungan Kanwil KemenHAM Kalsel.',
    konten: '<p>Banjarbaru — Kanwil KemenHAM Kalsel terus memperkuat komitmen pelaksanaan Pelayanan Publik Berbasis Hak Asasi Manusia (P2HAM) sesuai dengan Peraturan Menteri Hak Asasi Manusia Republik Indonesia.</p><p>Tim verifikasi P2HAM melakukan evaluasi menyeluruh terhadap ketersediaan aksesibilitas bagi penyandang disabilitas, kelompok rentan, serta fasilitas pendukung seperti sarana pemandu (guiding block), kursi roda, dan ruang pelayanan khusus.</p><p>Kakanwil Karyadi, S.H., M.H. menyampaikan bahwa P2HAM bukan sekadar pemenuhan standar administratif, melainkan wujud nyata penghormatan atas hak-hak setiap warga negara dalam memperoleh pelayanan publik yang setara dan bermartabat.</p>',
    published_at: '2026-09-25T14:30:00.000Z',
  },
  {
    id: 'news-init-3',
    judul: 'Harmonisasi Rancangan Peraturan Daerah Berperspektif HAM Bersama Pemerintah Daerah Kalsel',
    kategori: 'Harmonisasi Perda',
    penulis: 'Perancang Peraturan HAM',
    image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    ringkasan: 'Tim Perancang Kanwil KemenHAM Kalsel memfasilitasi analisa dan harmonisasi Raperda agar selaras dengan indikator P5HAM dan tidak diskriminatif.',
    konten: '<p>Banjarmasin — Kanwil KemenHAM Kalsel menggelar rapat harmonisasi produk hukum daerah bersama jajaran Pemerintah Provinsi Kalimantan Selatan dan DPRD Kabupaten/Kota.</p><p>Harmonisasi ini bertujuan untuk memastikan seluruh Rancangan Peraturan Daerah (Raperda) yang disusun mencerminkan nilai-nilai Penghormatan, Pelindungan, Pemenuhan, Penegakan, dan Pemajuan HAM (P5HAM).</p><p>Dengan adanya proses harmonisasi ini, peraturan daerah di Kalsel dipastikan berorientasi pada kesejahteraan rakyat dan bebas dari norma hukum yang diskriminatif.</p>',
    published_at: '2026-09-20T10:15:00.000Z',
  },
  {
    id: 'news-init-4',
    judul: 'Sosialisasi Pembentukan Desa Sadar HAM di Kabupaten Barito Kuala Menuju Wilayah Inklusif',
    kategori: 'Pemberdayaan HAM',
    penulis: 'Divisi Pelayanan Hukum & HAM',
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    ringkasan: 'Peningkatan kapasitas aparatur desa dan tokoh masyarakat dalam mengimplementasikan prinsip kesetaraan hak, pencegahan perkawinan anak, serta pemenuhan hak administrasi kependudukan.',
    konten: '<p>Marabahan — Kantor Wilayah Kementerian Hak Asasi Manusia Kalimantan Selatan menyelenggarakan bimbingan teknis dan sosialisasi Desa Sadar HAM di Kabupaten Barito Kuala.</p><p>Program ini bertujuan untuk membangun kesadaran hukum dan HAM dari tingkat akar rumput, sehingga setiap aparatur desa mampu menyelesaikan dinamika sosial warganya dengan mengedepankan mediasi berbasis kekeluargaan dan perlindungan hak-hak dasar kelompok rentan.</p><blockquote>"Desa Sadar HAM adalah fondasi kemajuan daerah. Ketika hak setiap warga desa dihormati dan dilindungi, keadilan sosial dapat terwujud secara nyata," ujar perwakilan Divisi Pelayanan Hukum dan HAM Kalsel.</blockquote><p>Kegiatan ini diikuti oleh para kepala desa, badan permusyawaratan desa, tokoh adat, serta kader perempuan se-Kabupaten Barito Kuala.</p>',
    published_at: '2026-09-15T08:30:00.000Z',
  },
  {
    id: 'news-init-5',
    judul: 'Akselerasi Verifikasi Penilaian Kabupaten/Kota Peduli HAM (KKHAM) Tahun 2026 se-Kalsel',
    kategori: 'Evaluasi Kebijakan',
    penulis: 'Tim KKHAM Kalsel',
    image_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    ringkasan: 'Kanwil KemenHAM Kalsel mengawal kelengkapan data dukung indikator hak sipil, politik, ekonomi, sosial, dan budaya pada 13 Kabupaten/Kota di Kalimantan Selatan.',
    konten: '<p>Banjarmasin — Tim Verifikator KKHAM Kanwil KemenHAM Kalsel menggelar rapat evaluasi kelengkapan data dukung bersama Bagian Hukum Setda dari 13 Kabupaten/Kota se-Kalimantan Selatan.</p><p>Penilaian KKHAM mencakup indikator pemenuhan hak atas kesehatan, pendidikan, hak perempuan dan anak, hak atas kependudukan, serta hak atas pekerjaan yang layak. Kanwil KemenHAM Kalsel berkomitmen mendampingi pemerintah daerah agar seluruh kabupaten/kota di Banua meraih predikat Peduli HAM secara paripurna.</p><p>Hasil verifikasi ini nantinya dilaporkan secara terpusat ke Kementerian Hak Asasi Manusia Republik Indonesia sebagai acuan penganugerahan penghargaan Hari HAM Sedunia.</p>',
    published_at: '2026-09-10T11:00:00.000Z',
  },
]

