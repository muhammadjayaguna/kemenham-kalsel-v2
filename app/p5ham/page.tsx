import { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  FileText,
  Gavel,
  Globe,
  HandHeart,
  Leaf,
  Scale,
  Shield,
  Sparkles,
  TreePine,
  Users2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: '5 Pilar P5HAM | Kanwil KemenHAM Kalimantan Selatan',
  description:
    'Memahami 5 Pilar Utama P5HAM: Penghormatan, Pelindungan, Pemenuhan, Penegakan, dan Pemajuan HAM dalam konteks pembangunan berkeadilan di Provinsi Kalimantan Selatan.',
  alternates: {
    canonical: '/p5ham',
  },
  openGraph: {
    title: 'P5HAM: 5 Pilar Hak Asasi Manusia Kalimantan Selatan',
    description:
      'Kerangka nilai dan aksi nyata Penghormatan, Pelindungan, Pemenuhan, Penegakan, dan Pemajuan HAM di Kalimantan Selatan.',
    url: 'https://kemenham-kalsel.go.id/p5ham',
  },
}

const pillarsDetail = [
  {
    num: '01',
    title: 'Penghormatan (Respect)',
    subtitle: 'Menghormati Integritas & Kebebasan Warga',
    desc: 'Kewajiban aparatur negara untuk tidak melakukan tindakan yang mencampuri, mengurangi, atau melanggar hak-hak asasi warga negara tanpa dasar hukum yang sah dan adil.',
    examples: [
      'Menjamin kebebasan berpendapat dan berekspresi yang bertanggung jawab.',
      'Menghormati keragaman adat istiadat dan tradisi masyarakat Banjar serta Dayak.',
      'Menghindari tindakan sewenang-wenang dalam penegakan ketertiban umum.',
    ],
  },
  {
    num: '02',
    title: 'Pelindungan (Protect)',
    subtitle: 'Melindungi dari Pelanggaran Pihak Ketiga',
    desc: 'Kewajiban aktif pemerintah untuk mencegah terjadinya pelanggaran HAM oleh pihak ketiga (korporasi, kelompok, atau individu) terhadap masyarakat rentan.',
    examples: [
      'Perlindungan hak pekerja pada sektor pertambangan dan perkebunan di Kalsel.',
      'Pencegahan kekerasan terhadap perempuan dan anak di lingkungan keluarga & publik.',
      'Perlindungan ruang hidup dan wilayah kelola adat dari eksploitasi ilegal.',
    ],
  },
  {
    num: '03',
    title: 'Pemenuhan (Fulfill)',
    subtitle: 'Memastikan Hak Dasar Terwujud',
    desc: 'Kewajiban negara mengambil langkah konkret melalui alokasi anggaran, regulasi daerah, dan program nyata agar setiap warga memperoleh hak dasarnya secara merata.',
    examples: [
      'Pemenuhan hak atas fasilitas kesehatan dan pendidikan inklusif di 13 Kab/Kota.',
      'Akses air bersih dan sanitasi layak bagi warga kawasan pesisir dan bantaran sungai.',
      'Penyediaan sarana publik yang ramah disabilitas dan lansia (P2HAM).',
    ],
  },
  {
    num: '04',
    title: 'Penegakan (Enforce)',
    subtitle: 'Kepastian Hukum & Keadilan Tanpa Pandang Bulu',
    desc: 'Penyelenggaraan mekanisme penelaahan pengaduan, investigasi independen, mediasi, dan penindakan hukum terhadap setiap peristiwa dugaan pelanggaran HAM.',
    examples: [
      'Penelaahan laporan dan rekomendasi penyelesaian lewat pos Yankomas KemenHAM Kalsel.',
      'Fasilitasi mediasi sengketa hak antara warga dengan pihak korporasi / instansi.',
      'Kerja sama dengan aparat penegak hukum dan Ombudsman RI Perwakilan Kalsel.',
    ],
  },
  {
    num: '05',
    title: 'Pemajuan (Promote)',
    subtitle: 'Membangun Budaya & Literasi HAM yang Berkelanjutan',
    desc: 'Penyebarluasan nilai-nilai HAM melalui edukasi publik, riset ilmiah, pembinaan Desa/Kelurahan Sadar HAM, serta integrasi nilai kemanusiaan dalam kehidupan sehari-hari.',
    examples: [
      'Sosialisasi HAM ke sekolah-sekolah, pesantren, dan perguruan tinggi di Banua.',
      'Penilaian dan pembinaan Kabupaten/Kota Peduli HAM (KKHAM) se-Kalsel.',
      'Dialog lintas pemangku kepentingan untuk harmonisasi perda berwawasan HAM.',
    ],
  },
]

const localIssues = [
  {
    icon: Leaf,
    title: 'Hak atas Lingkungan Hidup Bersih & Berkelanjutan',
    desc: 'Pengawasan terhadap dampak aktivitas pertambangan batubara dan perkebunan terhadap kualitas air sungai, udara, dan kelestarian ekosistem Pegunungan Meratus.',
  },
  {
    icon: TreePine,
    title: 'Perlindungan Hak Masyarakat Adat Dayak Meratus',
    desc: 'Pengakuan dan perlindungan hak ulayat, tradisi kearifan lokal, serta akses pelayanan pendidikan dan kesehatan di kawasan pedalaman pegunungan.',
  },
  {
    icon: Users2,
    title: 'Hak Ketenagakerjaan & K3 Sektor Industri',
    desc: 'Memastikan upah layak, jaminan sosial ketenagakerjaan, serta standar keselamatan kerja terpenuhi bagi ribuan pekerja tambang, pelabuhan, dan sawit di Kalsel.',
  },
  {
    icon: HandHeart,
    title: 'Aksesibilitas & Perlindungan Kelompok Rentan',
    desc: 'Pemberdayaan dan perlindungan hak penyandang disabilitas, perempuan kepala keluarga, lansia, serta anak berhadapan dengan hukum.',
  },
]

export default function P5hamPage() {
  const breadcrumbItems = [{ label: 'Pilar P5HAM' }]

  const p5hamSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Kerangka 5 Pilar P5HAM di Kalimantan Selatan',
    description:
      'Panduan lengkap Penghormatan, Pelindungan, Pemenuhan, Penegakan, dan Pemajuan HAM serta penerapannya dalam isu lokal Kalimantan Selatan.',
    author: {
      '@type': 'GovernmentOrganization',
      name: 'Kanwil KemenHAM Kalimantan Selatan',
    },
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'Kanwil KemenHAM Kalimantan Selatan',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Kementerian_Hak_Asasi_Manusia_Republik_Indonesia_%282024%29_%28cropped%29-GIvJ19tibTKAvlhbhMO87XGKCaSlO7.png',
      },
    },
  }

  return (
    <>
      <JsonLd data={p5hamSchema} />

      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-grid">
            <div>
              <span className="page-kicker">
                <Scale size={13} /> Kerangka Nilai Strategis
              </span>
              <h1 className="page-title">5 Pilar P5HAM untuk Banua Bermartabat</h1>
              <p className="page-subtitle">
                Penghormatan, Pelindungan, Pemenuhan, Penegakan, dan Pemajuan Hak Asasi Manusia sebagai kompas utama
                dalam menghadirkan keadilan sosial dan kesejahteraan masyarakat di Kalimantan Selatan.
              </p>
              <div className="page-header-meta">
                <span>
                  <BookOpen size={14} className="text-gold" /> Instrumen Hukum: UU No. 39/1999
                </span>
                <span>
                  <Globe size={14} className="text-gold" /> Standar Universal PBB
                </span>
              </div>
            </div>

            <div className="page-header-aside">
              <h4>
                <Sparkles size={16} className="text-gold" /> Esensi P5HAM
              </h4>
              <p>
                P5HAM bukan sekadar konsep teoritis, melainkan mandat konstitusional yang wajib diimplementasikan oleh
                seluruh penyelenggara negara di daerah demi menjamin harkat dan martabat kemanusiaan.
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
              <CheckCircle2 size={18} className="text-green" /> Lampiran Penjelas: Definisi Resmi P5HAM Kalsel
            </h4>
            <p>
              <strong>P5HAM</strong> merupakan akronim dari <em>Penghormatan, Pelindungan, Pemenuhan, Penegakan, dan Pemajuan Hak Asasi Manusia</em>. Kelima pilar ini merupakan representasi dari kewajiban absolut konstitusional Negara terhadap seluruh warga negaranya sebagaimana diatur dalam UUD 1945 & PermenHAM No. 1 Tahun 2024. Di Provinsi Kalimantan Selatan, Kanwil KemenHAM bertindak sebagai koordinator teknis dan fasilitator agar kelima pilar ini diimplementasikan di seluruh 13 Kabupaten/Kota.
            </p>
          </div>

          {/* 5 Pillars Detailed Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '40px' }}>
            {pillarsDetail.map((pillar, idx) => (
              <div
                key={idx}
                className="feature-card"
                style={{
                  padding: '32px',
                  borderRadius: '14px',
                  borderTop: idx === 0 || idx === 4 ? '5px solid var(--gold)' : '5px solid var(--blue)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: 'var(--blue)' }}>
                    {pillar.num}
                  </span>
                  <span className="hero-badge">{pillar.subtitle}</span>
                </div>

                <h3 style={{ fontSize: '24px', color: 'var(--navy)', margin: '0 0 10px' }}>
                  Pilar {pillar.title}
                </h3>
                <p style={{ fontSize: '15px', color: '#4d5e6b', lineHeight: 1.7, margin: '0 0 20px' }}>
                  {pillar.desc}
                </p>

                <div style={{ background: 'var(--cream-soft)', padding: '18px 22px', borderRadius: '10px', border: '1px solid #e7ebe8' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '10px' }}>
                    Contoh Penerapan Nyata di Kalimantan Selatan:
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#4a5b68', fontSize: '14px' }}>
                    {pillar.examples.map((ex, eIdx) => (
                      <li key={eIdx} style={{ marginBottom: '6px' }}>
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Isu Strategis HAM di Kalimantan Selatan */}
      <section className="section section-alt" id="isu-strategis">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker">Fokus Kontekstual Daerah</span>
              <h2 className="section-title">Isu-Isu Strategis HAM di Kalimantan Selatan</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Tantangan dan prioritas advokasi HAM yang menjadi perhatian khusus Kanwil KemenHAM Kalsel:
              </p>
            </div>
            <Link href="/layanan" className="view-all-link">
              Konsultasi Program HAM <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card-grid-2">
            {localIssues.map((issue, iIdx) => {
              const Icon = issue.icon
              return (
                <div key={iIdx} className="feature-card">
                  <div className="feature-card-icon" style={{ background: 'var(--soft)', color: 'var(--blue-dark)' }}>
                    <Icon size={26} />
                  </div>
                  <h3>{issue.title}</h3>
                  <p>{issue.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Call to Action */}
      <section className="section section-navy">
        <div className="container" style={{ textAlign: 'center', maxWidth: '740px' }}>
          <span className="section-kicker light">Partisipasi Publik</span>
          <h2 className="section-title light">Menemukan Pelanggaran atas Pilar P5HAM?</h2>
          <p style={{ color: '#c4d7e2', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
            Jangan ragu untuk menyampaikan laporan atau aduan Anda. Pos Yankomas Kanwil KemenHAM Kalsel siap menindaklanjuti
            setiap komunikasi masyarakat secara independen, rahasia, dan terpercaya.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/pengaduan" className="button gold">
              Kirim Pengaduan Sekarang <ArrowRight size={16} />
            </Link>
            <Link href="/faq" className="button secondary-light">
              Pelajari Alur & Syarat
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
