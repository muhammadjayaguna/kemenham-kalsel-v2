import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import {
  Building2,
  CheckCircle2,
  Compass,
  MapPin,
  Scale,
  Shield,
  Users2,
  ArrowRight,
  UserCheck,
  Briefcase,
  BookOpen,
  FileText,
  Award,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Profil, Pejabat & Visi Misi | Kanwil KemenHAM Kalimantan Selatan',
  description:
    'Profil resmi Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan: Kakanwil Karyadi, S.H., M.H., Struktur Pejabat, Visi Misi Asta Cita, Tugas & Fungsi berdasarkan Permenham No 1 Tahun 2024.',
  alternates: {
    canonical: '/profil',
  },
  openGraph: {
    title: 'Profil & Pejabat Kanwil KemenHAM Kalsel | Kementerian HAM RI',
    description:
      'Struktur organisasi, jajaran pejabat pimpinan, visi-misi Asta Cita, dan 4 pilar operasional Kanwil KemenHAM Kalimantan Selatan.',
    url: 'https://kemenham-kalsel.go.id/profil',
  },
}

const regenciesKalsel = [
  { name: 'Kota Banjarmasin', type: 'Kota', capital: 'Banjarmasin', pos: 'Pos Pelayanan HAM Terpadu' },
  { name: 'Kota Banjarbaru', type: 'Kota', capital: 'Banjarbaru', pos: 'Pusat Layanan Wilayah' },
  { name: 'Kabupaten Banjar', type: 'Kabupaten', capital: 'Martapura', pos: 'Fasilitasi Yankomas' },
  { name: 'Kabupaten Barito Kuala', type: 'Kabupaten', capital: 'Marabahan', pos: 'Desa Sadar HAM' },
  { name: 'Kabupaten Tanah Laut', type: 'Kabupaten', capital: 'Pelaihari', pos: 'Pos Pelayanan HAM' },
  { name: 'Kabupaten Tanah Bumbu', type: 'Kabupaten', capital: 'Batulicin', pos: 'Pengawasan Sektor Pesisir' },
  { name: 'Kabupaten Kotabaru', type: 'Kabupaten', capital: 'Kotabaru', pos: 'Fasilitasi Wilayah Kepulauan' },
  { name: 'Kabupaten Tapin', type: 'Kabupaten', capital: 'Rantau', pos: 'Edukasi & Pembinaan KKHAM' },
  { name: 'Kabupaten Hulu Sungai Selatan', type: 'Kabupaten', capital: 'Kandangan', pos: 'Pos Pelayanan HAM' },
  { name: 'Kabupaten Hulu Sungai Tengah', type: 'Kabupaten', capital: 'Barabai', pos: 'Advokasi Masyarakat Adat' },
  { name: 'Kabupaten Hulu Sungai Utara', type: 'Kabupaten', capital: 'Amuntai', pos: 'Desa Sadar HAM' },
  { name: 'Kabupaten Balangan', type: 'Kabupaten', capital: 'Paringin', pos: 'Fasilitasi Yankomas' },
  { name: 'Kabupaten Tabalong', type: 'Kabupaten', capital: 'Tanjung', pos: 'Pos Layanan Wilayah Utara' },
]

const pejabatKanwil = [
  {
    nama: 'Karyadi, S.H., M.H.',
    jabatan: 'Kepala Kantor Wilayah (Kakanwil)',
    peran:
      'Memimpin seluruh penyelenggaraan tugas, fungsi, dan arah kebijakan Kementerian Hak Asasi Manusia di Provinsi Kalimantan Selatan di bawah dan bertanggung jawab langsung kepada Menteri Hak Asasi Manusia RI.',
    isLeader: true,
  },
  {
    nama: 'Ferry Try Septian Tumampas',
    jabatan: 'Kepala Bagian Tata Usaha dan Umum',
    peran:
      'Mengelola seluruh isi dapur operasional kantor wilayah, mulai dari sistem administrasi, kesekretariatan, logistik, pengelolaan anggaran internal, hingga kepegawaian aparatur sipil negara di lingkungan Kanwil KemenHAM Kalsel.',
    isLeader: false,
  },
  {
    nama: 'Herman Susanto',
    jabatan: 'Kepala Bidang Instrumen dan Penguatan HAM',
    peran:
      'Bertanggung jawab langsung untuk menyusun, mengembangkan, menilai, dan mengevaluasi instrumen penegakan HAM di wilayah Kalsel. Memimpin program turun ke masyarakat seperti Desa/Kelurahan Sadar HAM & Penggerak HAM.',
    isLeader: false,
  },
  {
    nama: 'Syarifullah',
    jabatan: 'Kepala Bidang Pelayanan dan Kepatuhan HAM',
    peran:
      'Menangani mekanisme pelayanan publik berbasis HAM (P2HAM), melakukan verifikasi penilaian standar pelayanan di instansi lain, serta mengawal penegakan kepatuhan HAM pada lembaga atau komunitas lokal.',
    isLeader: false,
  },
]

const astaCitaMisi = [
  { no: '1', text: 'Memperkuat ideologi Pancasila, demokrasi, dan hak asasi manusia.' },
  { no: '2', text: 'Meningkatkan sistem pertahanan dan keamanan nasional serta mendorong kemandirian nasional melalui ketahanan pangan, energi, dan air, serta ekonomi kreatif, hijau, dan biru.' },
  { no: '3', text: 'Meningkatkan peluang kerja berkualitas, mendorong kewirausahaan, mengembangkan industri kreatif, dan melanjutkan pembangunan infrastruktur.' },
  { no: '4', text: 'Memperkuat pengembangan sumber daya manusia, ilmu pengetahuan, teknologi, pendidikan, kesehatan, prestasi olahraga, kesetaraan gender, dan pemberdayaan perempuan, pemuda, dan penyandang disabilitas.' },
  { no: '5', text: 'Melanjutkan hilirisasi dan industrialisasi untuk meningkatkan nilai tambah domestik.' },
  { no: '6', text: 'Mengembangkan dari tingkat desa dan akar rumput untuk mencapai keadilan ekonomi dan memberantas kemiskinan.' },
  { no: '7', text: 'Memperkuat reformasi politik, hukum, dan birokrasi, serta meningkatkan pencegahan dan pemberantasan korupsi dan narkotika.' },
  { no: '8', text: 'Memperkuat harmoni antara kehidupan, lingkungan, alam, dan budaya, serta meningkatkan toleransi antaragama untuk mencapai masyarakat yang adil dan sejahtera.' },
]

export default function ProfilPage() {
  const breadcrumbItems = [{ label: 'Profil Lembaga' }]

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Profil Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan',
    description:
      'Halaman profil resmi Kanwil KemenHAM Kalsel yang memuat Visi Misi Asta Cita, Jajaran Pejabat (Kakanwil Karyadi, S.H., M.H.), Tugas Fungsi Permenham No 1/2024, dan 13 Kab/Kota.',
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'Kanwil KemenHAM Kalimantan Selatan',
    },
  }

  return (
    <>
      <JsonLd data={pageSchema} />

      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-grid">
            <div>
              <span className="page-kicker">
                <Building2 size={13} /> Profil Lembaga Resmi
              </span>
              <h1 className="page-title">
                Mengenal Kanwil KemenHAM Kalimantan Selatan
              </h1>
              <p className="page-subtitle">
                Garda terdepan Kementerian Hak Asasi Manusia Republik Indonesia di Kalimantan Selatan,
                berkomitmen mewujudkan keadilan, kesetaraan martabat, dan kepastian perlindungan HAM bagi seluruh warga.
              </p>
              <div className="page-header-meta">
                <span>
                  <MapPin size={14} className="text-gold" /> Wilayah Kerja: 13 Kab/Kota
                </span>
                <span>
                  <Scale size={14} className="text-gold" /> PermenHAM No. 1 Tahun 2024
                </span>
              </div>
            </div>

            <div className="page-header-aside">
              <h4>
                <Shield size={16} className="text-gold" /> Kedudukan Organisasi
              </h4>
              <p>
                Kanwil KemenHAM Kalsel bertindak sebagai perpanjangan tangan pemerintah pusat di tingkat provinsi untuk membumikan, mengawasi, dan menegakkan instrumen HAM berdasarkan kebijakan Menteri Hak Asasi Manusia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs Navigation */}
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Section 1: Ringkasan Entitas */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container">
          <div className="geo-factsheet-box">
            <h4>
              <CheckCircle2 size={18} className="text-green" /> Mandat Operasional & Landasan Hukum
            </h4>
            <p>
              Berdasarkan <strong>Peraturan Menteri Hak Asasi Manusia Nomor 1 Tahun 2024</strong>, Kantor Wilayah Kementerian HAM Kalsel berkedudukan di Kota Banjarmasin dengan wilayah kerja 13 Kabupaten/Kota. Instansi ini dipimpin oleh Kepala Kantor Wilayah <strong>Karyadi, S.H., M.H.</strong> dan didukung oleh jajaran Kepala Bagian & Kepala Bidang teknis operasional.
            </p>
          </div>

          {/* Visi & Misi Asta Cita */}
          <div className="card-grid-2" style={{ marginTop: '40px' }}>
            <div className="feature-card" style={{ borderTop: '4px solid var(--gold)' }}>
              <div>
                <span className="feature-card-tag">Arah Kebijakan</span>
                <div className="feature-card-icon" style={{ background: 'var(--navy-soft)', color: 'var(--navy)' }}>
                  <Compass size={28} />
                </div>
                <h3>Visi Institusi</h3>
                <blockquote style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', fontStyle: 'italic', margin: '12px 0 16px', paddingLeft: '14px', borderLeft: '3px solid var(--gold)' }}>
                  "Penerapan Kementerian Hak Asasi Manusia yang Kredibel untuk Kemanusiaan yang Adil dan Beradab"
                </blockquote>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>
                  Sesuai prinsip kedua Pancasila & Pasal 27 ayat (1) UUD 1945 ("Semua warga negara sama di hadapan hukum dan pemerintah"). Lembaga yang terpercaya dan akuntabel menjadi acuan dan tolok ukur utama dalam penegakan HAM tanpa diskriminasi.
                </p>
              </div>
            </div>

            <div className="feature-card" style={{ borderTop: '4px solid var(--navy)' }}>
              <div>
                <span className="feature-card-tag">Asta Cita (Delapan Aspirasi)</span>
                <div className="feature-card-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold-dark)' }}>
                  <Award size={28} />
                </div>
                <h3>Misi Asta Cita</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>
                  KemenHAM Kalsel menyelaraskan seluruh program kerja dengan 8 Aspirasi Pembangunan Nasional:
                </p>
                <div style={{ maxHeight: '220px', overflowY: 'auto', paddingRight: '6px' }}>
                  <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
                    {astaCitaMisi.map((m) => (
                      <li key={m.no} style={{ marginBottom: '8px', fontSize: '13px', display: 'flex', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--gold-dark)', minWidth: '18px' }}>{m.no}.</span>
                        <span style={{ color: 'var(--text-dark)' }}>{m.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Jajaran Pejabat & Struktur Organisasi */}
      <section className="section section-alt" id="struktur">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker">Struktur Organisasi</span>
              <h2 className="section-title">Pimpinan & Dapur Kerja Operasional</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Jajaran pejabat struktural yang mengawal pelaksanaan tugas dan fungsi KemenHAM di Provinsi Kalimantan Selatan:
              </p>
            </div>
          </div>

          <div className="card-grid-2" style={{ marginTop: '24px' }}>
            {pejabatKanwil.map((p, idx) => (
              <div
                key={idx}
                className="feature-card"
                style={{
                  border: p.isLeader ? '2px solid var(--gold)' : '1px solid var(--line)',
                  background: p.isLeader ? 'linear-gradient(135deg, #ffffff 0%, #fffdf5 100%)' : '#ffffff',
                }}
              >
                <div style={{ display: 'flex', gap: p.isLeader ? '18px' : '0', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {p.isLeader && (
                    <div style={{ position: 'relative', width: '110px', height: '135px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--gold)', flexShrink: 0, boxShadow: '0 8px 20px rgba(18,60,105,0.18)' }}>
                      <img
                        src="/kakanwil-karyadi.png"
                        alt="Karyadi, S.H., M.H. - Kepala Kantor Wilayah KemenHAM Kalsel"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(18,60,105,0.9), transparent)', padding: '2px 0', textAlign: 'center' }}>
                        <span style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase' }}>KANWIL</span>
                      </div>
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span className="feature-card-tag" style={{ background: p.isLeader ? 'var(--navy)' : 'var(--blue-soft)', color: p.isLeader ? 'var(--gold)' : 'var(--navy)' }}>
                        {p.isLeader ? 'Kepala Kantor Wilayah' : 'Pejabat Eselon III'}
                      </span>
                      <UserCheck size={24} style={{ color: p.isLeader ? 'var(--gold-dark)' : 'var(--blue)' }} />
                    </div>
                    <h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '4px' }}>{p.nama}</h3>
                    <h4 style={{ fontSize: '14px', color: 'var(--gold-dark)', fontWeight: '600', marginBottom: '12px' }}>
                      {p.jabatan}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
                      {p.peran}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: 4 Pilar Tugas Operasional Kalsel */}
      <section className="section" id="tupoksi">
        <div className="container">
          <span className="section-kicker">Rincian Operasional</span>
          <h2 className="section-title">4 Pilar Tugas Utama Kanwil di Kalsel</h2>
          <p className="section-lead" style={{ maxWidth: '780px' }}>
            Pelaksanaan fungsi substantif Kementerian HAM di Kalimantan Selatan dibagi ke dalam empat bidang fokus kerja:
          </p>

          <div className="card-grid-2" style={{ marginTop: '30px' }}>
            <div className="feature-card">
              <div className="feature-card-icon">
                <Users2 size={24} />
              </div>
              <h3>1. Penguatan dan Pelayanan HAM</h3>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.7' }}>
                <li><strong>P2HAM:</strong> Memastikan fasilitas publik ramah disabilitas, lansia, anak, & ibu menyusui.</li>
                <li><strong>Penanganan Aduan:</strong> Menerima dan memproses pengaduan dugaan pelanggaran HAM via Pos Yankomas.</li>
                <li><strong>Bantuan Hukum:</strong> Mengawasi fasilitas bantuan hukum gratis bagi masyarakat miskin via OBH terakreditasi.</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold-dark)' }}>
                <BookOpen size={24} />
              </div>
              <h3>2. Diseminasi, Edukasi & Instrumen HAM</h3>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.7' }}>
                <li><strong>KKP HAM:</strong> Penilaian & verifikasi kriteria Kabupaten/Kota Peduli HAM bagi Pemda se-Kalsel.</li>
                <li><strong>Desa Sadar HAM:</strong> Pendampingan komunitas akar rumput untuk pencegahan konflik sosial.</li>
                <li><strong>Penggerak HAM:</strong> Pembekalan kader HAM di sekolah, universitas, instansi, & korporasi.</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                <FileText size={24} />
              </div>
              <h3>3. Harmonisasi Regulasi & Produk Hukum Daerah</h3>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.7' }}>
                <li><strong>Fasilitasi Perancang:</strong> Mengawal penyusunan Perda/Perbup/Perwali agar tidak diskriminatif.</li>
                <li><strong>Analisis Kebijakan:</strong> Pengkajian dampak regulasi daerah terhadap pemenuhan hak kelompok rentan.</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-card-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                <Briefcase size={24} />
              </div>
              <h3>4. Manajemen Internal (Dapur Kerja)</h3>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.7' }}>
                <li><strong>Tata Usaha & Umum:</strong> Pengelolaan administrasi, kepegawaian ASN, logistik, & anggaran.</li>
                <li><strong>Kepatuhan & Pengawasan:</strong> Memastikan tata kelola internal yang transparan, akuntabel, & WBK.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 13 Wilayah Kerja Administratif se-Kalimantan Selatan */}
      <section className="section section-alt" id="wilayah-kerja">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker">Cakupan Geografis</span>
              <h2 className="section-title">13 Kabupaten & Kota Wilayah Kerja</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Kanwil KemenHAM Kalsel mengoordinasikan penguatan dan pelayanan HAM di seluruh penjuru Kalimantan Selatan:
              </p>
            </div>
            <Link href="/kontak" className="view-all-link">
              Informasi Lokasi & Kontak Kantor <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card-grid-3">
            {regenciesKalsel.map((item, idx) => (
              <div key={idx} className="feature-card">
                <div>
                  <span className="feature-card-tag">{item.type}</span>
                  <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{item.name}</h3>
                  <p style={{ fontSize: '13px', margin: '0 0 12px', color: 'var(--muted)' }}>
                    Pusat Pemerintahan: <strong>{item.capital}</strong>
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--blue)' }}>
                  <MapPin size={13} /> {item.pos}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Banner Ajakan Pengaduan */}
      <section className="section section-navy" style={{ padding: '60px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <span className="section-kicker light">Layanan Terbuka untuk Umum</span>
            <h2 className="section-title light" style={{ margin: '8px 0 12px' }}>
              Membutuhkan Bantuan atau Konsultasi HAM?
            </h2>
            <p style={{ color: '#c3d5de', margin: 0, fontSize: '15px', maxWidth: '600px' }}>
              Seluruh layanan komunikasi masyarakat dan konsultasi di Kanwil KemenHAM Kalsel tidak dipungut biaya apapun (Rp 0 / Gratis).
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/pengaduan" className="button gold">
              Formulir Pengaduan Online <ArrowRight size={16} />
            </Link>
            <Link href="/layanan" className="button secondary-light">
              Pelajari Semua Layanan
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
