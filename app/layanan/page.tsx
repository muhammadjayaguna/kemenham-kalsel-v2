import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  FileSearch,
  Handshake,
  HeartHandshake,
  Landmark,
  Layers,
  PhoneCall,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Layanan Publik HAM | Kanwil KemenHAM Kalimantan Selatan',
  description:
    'Daftar lengkap layanan resmi Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan: Yankomas, P2HAM, Pembinaan Kabupaten/Kota Sadar HAM, Diseminasi HAM, dan Harmonisasi Perda. Seluruh layanan Bebas Biaya (Rp 0).',
  alternates: {
    canonical: '/layanan',
  },
  openGraph: {
    title: 'Layanan Publik Kanwil KemenHAM Kalsel | 100% Gratis',
    description:
      'Katalog layanan resmi pengaduan HAM, penilaian pelayanan publik berbasis HAM, dan pembinaan desa sadar HAM di Kalimantan Selatan.',
    url: 'https://kemenham-kalsel.go.id/layanan',
  },
}

const serviceCatalog = [
  {
    id: 'yankomas',
    icon: HeartHandshake,
    tag: 'Layanan Utama Masyarakat',
    title: 'Yankomas (Pelayanan Komunikasi Masyarakat)',
    desc: 'Layanan penerimaan, penelaahan, koordinasi, dan fasilitasi klarifikasi terhadap laporan/komunikasi masyarakat mengenai dugaan pelanggaran Hak Asasi Manusia di Kalimantan Selatan.',
    target: 'Masyarakat umum, perorangan, kelompok rentan, kuasa hukum, dan organisasi masyarakat sipil.',
    time: '3 - 14 Hari Kerja',
    cost: 'Rp 0 (Gratis)',
    steps: [
      'Penyampaian komunikasi tertulis atau form online disertai identitas dan kronologi.',
      'Verifikasi kelengkapan berkas dan penelaahan substansi dugaan pelanggaran HAM.',
      'Koordinasi dan permintaan klarifikasi kepada instansi/pihak terkait di Kalsel.',
      'Penyusunan telaahan, rekomendasi penyelesaian, atau mediasi hak asasi manusia.',
    ],
    actionText: 'Buat Pengaduan Sekarang',
    actionHref: '/pengaduan',
  },
  {
    id: 'p2ham',
    icon: ShieldCheck,
    tag: 'Penilaian & Standarisasi',
    title: 'P2HAM (Pelayanan Publik Berbasis HAM)',
    desc: 'Bimbingan teknis, evaluasi, dan penilaian bagi Unit Pelaksana Teknis (UPT) dan instansi pemerintah daerah di Kalsel guna memastikan tersedianya fasilitas dan perlakuan khusus bagi penyandang disabilitas, lansia, ibu hamil, dan anak.',
    target: 'Kantor Layanan Pemerintah, BUMN/BUMD, Dinas Daerah se-Kalsel.',
    time: 'Tahunan & Berkala',
    cost: 'Rp 0 (Gratis)',
    steps: [
      'Pencanangan dan komitmen unit kerja untuk pemenuhan kriteria P2HAM.',
      'Pemenuhan aksesibilitas fisik (jalur pemandu, ramp, loket prioritas, ruang laktasi).',
      'Pengisian instrumen mandiri dan pengunggahan data dukung.',
      'Verifikasi lapangan oleh Tim Pengawas Kanwil KemenHAM Kalsel.',
    ],
    actionText: 'Konsultasi Standar P2HAM',
    actionHref: '/kontak',
  },
  {
    id: 'desa-sadar-ham',
    icon: Users,
    tag: 'Penguatan Tingkat Daerah',
    title: 'Pembinaan Kabupaten/Kota & Desa Sadar HAM',
    desc: 'Pendampingan kepada 13 Pemerintah Kabupaten/Kota di Kalsel dalam pemenuhan indikator Kriteria Kabupaten/Kota Peduli HAM (KKHAM), mencakup hak atas kesehatan, pendidikan, pekerjaan, perumahan layak, dan lingkungan berkelanjutan.',
    target: 'Pemerintah Kabupaten/Kota, Kecamatan, dan Pemerintah Desa/Kelurahan se-Kalsel.',
    time: 'Program Berkelanjutan',
    cost: 'Rp 0 (Gratis)',
    steps: [
      'Sosialisasi indikator dan parameter penilaian KKHAM kepada bagian hukum daerah.',
      'Pengumpulan data capaian pemenuhan hak dasar masyarakat di kabupaten/kota.',
      'Validasi dan pembobotan nilai oleh Kanwil KemenHAM Kalsel bersama Biro Hukum Pemprov.',
      'Pengusulan predikat Kabupaten/Kota Peduli HAM ke tingkat Nasional.',
    ],
    actionText: 'Pelajari Kriteria KKHAM',
    actionHref: '/publikasi',
  },
  {
    id: 'diseminasi-ham',
    icon: Sparkles,
    tag: 'Edukasi & Literasi',
    title: 'Diseminasi, Edukasi & Penyuluhan Nilai HAM',
    desc: 'Penyelenggaraan sosialisasi, seminar, lokakarya, dan dialog interaktif mengenai nilai-nilai HAM, hak anak, pencegahan perundungan, dan toleransi keberagaman bagi pelajar, mahasiswa, aparat penegak hukum, dan komunitas adat di Kalsel.',
    target: 'Sekolah, Perguruan Tinggi, Organisasi Kepemudaan, Aparatur Sipil Negara, Komunitas Adat.',
    time: 'Sesuai Jadwal / Permohonan',
    cost: 'Rp 0 (Gratis)',
    steps: [
      'Pengajuan surat permohonan narasumber/penyuluhan HAM oleh pihak pemohon.',
      'Koordinasi tema, silabus materi, dan jadwal kegiatan edukasi.',
      'Pelaksanaan sesi edukasi interaktif dan pembagian buku saku HAM.',
      'Evaluasi pemahaman peserta dan pemberian materi lanjutan.',
    ],
    actionText: 'Ajukan Permohonan Narasumber',
    actionHref: '/kontak',
  },
  {
    id: 'harmonisasi-perda',
    icon: Scale,
    tag: 'Kebijakan Publik',
    title: 'Harmonisasi Regulasi Berperspektif HAM',
    desc: 'Kajian dan analisis terhadap Rancangan Peraturan Daerah (Raperda) Provinsi maupun Kabupaten/Kota di Kalimantan Selatan untuk memastikan tidak terdapat norma hukum yang diskriminatif dan bertentangan dengan HAM.',
    target: 'DPRD Provinsi/Kabupaten/Kota dan Biro/Bagian Hukum Pemerintah Daerah di Kalsel.',
    time: '7 - 14 Hari Kerja',
    cost: 'Rp 0 (Gratis)',
    steps: [
      'Penerimaan naskah akademik dan draf Raperda dari Pemda / DPRD.',
      'Analisis matriks keselarasan instrumen HAM nasional dan internasional.',
      'Rapat pembahasan tim perancang peraturan perundang-undangan.',
      'Penerbitan surat rekomendasi/telaahan perspektif HAM resmi.',
    ],
    actionText: 'Hubungi Tim Harmonisasi',
    actionHref: '/kontak',
  },
]

export default function LayananPage() {
  const breadcrumbItems = [{ label: 'Layanan Publik HAM' }]

  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: 'Katalog Layanan Publik Kanwil Kementerian HAM Kalimantan Selatan',
    serviceType: 'Layanan Publik dan Pengaduan HAM',
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan',
      url: 'https://kemenham-kalsel.go.id',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kalimantan Selatan',
    },
    isRelatedTo: serviceCatalog.map((s) => ({
      '@type': 'GovernmentService',
      name: s.title,
      description: s.desc,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'IDR',
      },
    })),
  }

  return (
    <>
      <JsonLd data={servicesSchema} />

      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-grid">
            <div>
              <span className="page-kicker">
                <Layers size={13} /> Standar Pelayanan Publik
              </span>
              <h1 className="page-title">Katalog Layanan Publik Berbasis HAM</h1>
              <p className="page-subtitle">
                Akses kemudahan layanan komunikasi masyarakat, advokasi, bimbingan teknis P2HAM, dan edukasi HAM yang
                transparan, profesional, dan 100% bebas biaya di seluruh wilayah Kalimantan Selatan.
              </p>
              <div className="page-header-meta">
                <span>
                  <Coins size={14} className="text-gold" /> Biaya: Rp 0 (Semua Layanan Gratis)
                </span>
                <span>
                  <ShieldCheck size={14} className="text-gold" /> Zona Integritas & Akuntabel
                </span>
              </div>
            </div>

            <div className="page-header-aside">
              <h4>
                <HeartHandshake size={16} className="text-gold" /> Maklumat Pelayanan
              </h4>
              <p>
                "Kami berkomitmen memberikan pelayanan prima yang cepat, tepat, tanpa diskriminasi, dan menjunjung
                tinggi hak serta martabat setiap warga masyarakat Kalimantan Selatan."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Section 1: AI Fact Sheet (GEO Optimization) */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container">
          <div className="geo-factsheet-box">
            <h4>
              <CheckCircle2 size={18} className="text-green" /> Informasi Kunci Layanan HAM Kalsel
            </h4>
            <p>
              Kanwil KemenHAM Kalsel menyediakan 5 klaster layanan pokok untuk masyarakat dan instansi pemerintah di 13
              Kabupaten/Kota se-Kalimantan Selatan. Warga yang mengalami atau menyaksikan dugaan perlakuan tidak adil
              atau pelanggaran hak dasar dapat memanfaatkan kanal <strong>Yankomas</strong> secara luring di loket PTSP
              maupun daring melalui formulir pengaduan online.
            </p>
          </div>

          {/* Quick Filter Links */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '30px 0 40px' }}>
            {serviceCatalog.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="button secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                {s.title.split('(')[0]}
              </a>
            ))}
          </div>

          {/* Service Cards Detailed List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {serviceCatalog.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className="feature-card"
                  style={{
                    padding: '36px',
                    borderRadius: '16px',
                    borderLeft: '6px solid var(--blue)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                      <div className="feature-card-icon" style={{ margin: 0, width: '56px', height: '56px' }}>
                        <Icon size={30} />
                      </div>
                      <div>
                        <span className="feature-card-tag">{service.tag}</span>
                        <h2 style={{ fontSize: '22px', margin: '2px 0 0', color: 'var(--navy)' }}>
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span className="hero-badge">
                        <Clock size={13} className="text-green" /> Waktu: {service.time}
                      </span>
                      <span className="hero-badge" style={{ background: 'var(--gold-light)', borderColor: '#e4cf98' }}>
                        <Coins size={13} className="text-gold-dark" /> {service.cost}
                      </span>
                    </div>
                  </div>

                  <p style={{ margin: '20px 0 16px', fontSize: '15px', color: '#445766', lineHeight: 1.7 }}>
                    {service.desc}
                  </p>

                  <div style={{ background: 'var(--soft)', padding: '16px 20px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px' }}>
                    <strong style={{ color: 'var(--navy)' }}>Sasaran Pengguna Layanan:</strong> {service.target}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--navy)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Alur & Prosedur Pelaksanaan:
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      {service.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            background: '#ffffff',
                            border: '1px solid var(--line)',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                          }}
                        >
                          <span style={{ color: 'var(--blue)', fontWeight: 800, marginRight: '6px' }}>
                            0{sIdx + 1}.
                          </span>
                          <span style={{ color: '#4a5b68' }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '28px', borderTop: '1px solid var(--line)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href={service.actionHref} className="button primary">
                      {service.actionText} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Banner Konsultasi Bantuan */}
      <section className="section section-alt">
        <div className="container" style={{ textAlign: 'center', maxWidth: '720px' }}>
          <span className="section-kicker">Layanan Konsultasi Langsung</span>
          <h2 className="section-title">Belum Yakin Layanan Mana yang Anda Butuhkan?</h2>
          <p className="section-lead">
            Tim Petugas Terpadu Satu Pintu (PTSP) Kanwil KemenHAM Kalsel siap memandu dan memberikan penjelasan secara
            langsung melalui layanan konsultasi daring maupun luring.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/pengaduan" className="button primary">
              Sampaikan Pengaduan Online <ArrowRight size={16} />
            </Link>
            <Link href="/kontak" className="button secondary">
              Hubungi Petugas PTSP
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
