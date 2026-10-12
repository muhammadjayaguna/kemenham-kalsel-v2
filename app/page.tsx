'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import GalleryModal, { GalleryItem } from '@/components/GalleryModal'
import CountUp from '@/components/CountUp'
import ScrollReveal from '@/components/ScrollReveal'
import { supabase, BeritaPublikasi, GaleriKegiatan, DEFAULT_INITIAL_NEWS } from '@/lib/supabase'
import {
  ExternalLink,
  Globe,
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileCheck2,
  FileText,
  HeartHandshake,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  MapPin,
  Newspaper,
  PhoneCall,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  ZoomIn,
} from 'lucide-react'

const quickAccessMenu = [
  {
    icon: Building2,
    tag: 'Kelembagaan',
    title: 'Profil & Visi Misi',
    desc: 'Struktur organisasi, tugas pokok dan fungsi, landasan hukum, serta 13 wilayah kerja di Kalsel.',
    href: '/profil',
  },
  {
    icon: Layers,
    tag: 'Layanan Publik',
    title: 'Katalog Layanan HAM',
    desc: 'Pelayanan Komunikasi Masyarakat (Yankomas), P2HAM, Desa Sadar HAM, dan edukasi publik (Gratis/Rp 0).',
    href: '/layanan',
  },
  {
    icon: Scale,
    tag: 'Kerangka Nilai',
    title: '5 Pilar P5HAM',
    desc: 'Penghormatan, Pelindungan, Pemenuhan, Penegakan, dan Pemajuan HAM dalam konteks isu lokal Banua.',
    href: '/p5ham',
  },
  {
    icon: ShieldAlert,
    tag: 'Pos Yankomas',
    title: 'Pengaduan HAM Online',
    desc: 'Formulir pengaduan interaktif dengan nomor registrasi tiket dan jaminan kerahasiaan pelapor.',
    href: '/pengaduan',
  },
  {
    icon: FileText,
    tag: 'Informasi Publik',
    title: 'Publikasi & Dokumen',
    desc: 'Siaran pers resmi, agenda kegiatan daerah di Kalimantan Selatan, dan unduhan dokumen regulasi.',
    href: '/publikasi',
  },
  {
    icon: HelpCircle,
    tag: 'Pusat Bantuan',
    title: 'Tanya Jawab (FAQ)',
    desc: 'Jawaban cepat dan terverifikasi mengenai alur pengaduan, kriteria P2HAM, dan standar layanan.',
    href: '/faq',
  },
]

const kemenhamApps = [
  {
    name: 'SIMASHAM',
    fullName: 'Sistem Informasi & Komunikasi Masyarakat HAM',
    desc: 'Layanan penerimaan, penelaahan, dan penanganan komunikasi dugaan pelanggaran HAM secara online 24/7.',
    url: 'https://simasham.kemenham.go.id/',
    badge: 'Aduan & Komunikasi',
    color: '#123c69',
  },
  {
    name: 'PRISMA HAM',
    fullName: 'Penilaian Risiko HAM bagi Pelaku Usaha',
    desc: 'Platform analisis mandiri (self-assessment) dan uji tuntas kepatuhan HAM bagi perusahaan & korporasi di Kalsel.',
    url: 'https://prisma.kemenham.go.id/',
    badge: 'Korporasi & Bisnis',
    color: '#b48316',
  },
  {
    name: 'SIPATUHAM',
    fullName: 'Sistem Informasi Pelayanan & Kepatuhan HAM',
    desc: 'Portal verifikasi dan penilaian standar Pelayanan Publik Berbasis HAM (P2HAM) untuk instansi pemerintah.',
    url: 'https://sipatuham.kemenham.go.id/',
    badge: 'Monitoring P2HAM',
    color: '#0284c7',
  },
  {
    name: 'SAPAHAM',
    fullName: 'Sarana Edukasi, Pengaduan & Aspirasi HAM',
    desc: 'Pusat edukasi digital, materi sosialisasi nilai HAM, serta kanal penampung aspirasi masyarakat luas.',
    url: 'https://sapaham.kemenham.go.id/',
    badge: 'Edukasi & Aspirasi',
    color: '#059669',
  },
]

const pillarsOverview = [
  { num: '01', name: 'Penghormatan', desc: 'Menghormati hak asasi setiap individu tanpa diskriminasi' },
  { num: '02', name: 'Pelindungan', desc: 'Melindungi masyarakat dan kelompok rentan dari pelanggaran HAM' },
  { num: '03', name: 'Pemenuhan', desc: 'Memenuhi hak dasar atas kesehatan, pendidikan, dan kesejahteraan' },
  { num: '04', name: 'Penegakan', desc: 'Menegakkan kepastian hukum dan mediasi pengaduan berkeadilan' },
  { num: '05', name: 'Pemajuan', desc: 'Membangun literasi, budaya sadar HAM, dan kebijakan inklusif' },
]

const regenciesQuickList = [
  'Kota Banjarmasin',
  'Kota Banjarbaru',
  'Kab. Banjar',
  'Kab. Barito Kuala',
  'Kab. Tanah Laut',
  'Kab. Tanah Bumbu',
  'Kab. Kotabaru',
  'Kab. Tapin',
  'Kab. Hulu Sungai Selatan',
  'Kab. Hulu Sungai Tengah',
  'Kab. Hulu Sungai Utara',
  'Kab. Balangan',
  'Kab. Tabalong',
]

export default function HomePage() {
  const [newsList, setNewsList] = useState<any[]>([])
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  // Fetch dynamic news and galleries from Supabase on mount
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const { data: nData } = await supabase
          .from('berita_publikasi')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(4)

        let mappedNews: any[] = []
        if (nData && nData.length > 0) {
          mappedNews = nData.map((item, idx) => ({
            id: item.id || `news-${idx}`,
            category: item.kategori || 'Siaran Pers',
            title: item.judul,
            date: new Date(item.published_at || item.created_at || Date.now()).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            author: item.penulis || 'Humas Kanwil Kalsel',
            readTime: '3 Menit',
            summary: item.ringkasan,
            imageUrl:
              item.image_url ||
              'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
          }))
        }

        if (mappedNews.length === 0 && typeof window !== 'undefined') {
          try {
            const cachedLocal = localStorage.getItem('kemenham_local_news')
            const newsSource = cachedLocal ? JSON.parse(cachedLocal) : DEFAULT_INITIAL_NEWS
            mappedNews = newsSource.map((item: any, idx: number) => ({
              id: item.id || `news-${idx}`,
              category: item.kategori || 'Siaran Pers',
              title: item.judul,
              date: new Date(item.published_at || item.created_at || Date.now()).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              author: item.penulis || 'Humas Kanwil Kalsel',
              readTime: '3 Menit',
              summary: item.ringkasan,
              imageUrl:
                item.image_url ||
                'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
            }))
          } catch (e) {}
        }

        setNewsList(mappedNews)

        const { data: gData } = await supabase
          .from('galeri_kegiatan')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6)

        if (gData && gData.length > 0) {
          const mappedG: GalleryItem[] = gData.map((g, idx) => ({
            id: g.id || `gal-${idx}`,
            title: g.judul,
            location: g.lokasi || 'Kalimantan Selatan',
            date: g.tanggal || '2026',
            category: g.kategori || 'Kegiatan',
            imageUrl:
              g.image_url ||
              'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            description: g.deskripsi,
          }))
          setGalleryList(mappedG)
        }
      } catch (e) {
        console.log('Error fetching Supabase data on HomePage:', e)
      }
    }

    fetchDynamicData()
  }, [])

  const openGallery = (index: number) => {
    setGalleryIndex(index)
    setIsGalleryOpen(true)
  }

  const featured = newsList[0] || null
  const sideNews = newsList.slice(1)

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Portal Resmi Kanwil KemenHAM Kalimantan Selatan',
    url: 'https://kemenham-kalsel.go.id',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kemenham-kalsel.go.id/faq?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <JsonLd data={websiteSchema} />

      {/* Hero Section */}
      <section className="hero" id="beranda">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> Kementerian Hak Asasi Manusia Republik Indonesia
            </div>
            <h1 className="hero-heading">
              Hak Asasi Manusia untuk <em>Indonesia</em> yang Bermartabat.
            </h1>
            <p className="hero-desc">
              Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan hadir sebagai garda terdepan
              dalam memperkuat penghormatan, pelindungan, pemenuhan, penegakan, dan pemajuan HAM bagi seluruh
              masyarakat di Bumi Lambung Mangkurat.
            </p>

            <div className="hero-actions">
              <Link href="/pengaduan" className="button primary">
                <ShieldAlert size={18} /> Sampaikan Pengaduan HAM <ArrowRight size={16} />
              </Link>
              <Link href="/layanan" className="button secondary">
                Jelajahi Katalog Layanan
              </Link>
            </div>

            <div className="hero-badge-row">
              <span className="hero-badge">
                <ShieldCheck size={14} className="text-green" /> Layanan Resmi Bebas Biaya (Rp 0)
              </span>
              <span className="hero-badge">
                <MapPin size={14} className="text-green" /> Wilayah Kerja 13 Kab/Kota
              </span>
            </div>
          </div>

          {/* Hero Featured Card - Kakanwil Portrait & Quick Stats */}
          <div className="hero-art-box">
            <div className="hero-card-featured" style={{ borderTop: '5px solid var(--gold)', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ position: 'relative', width: '96px', height: '110px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--gold)', flexShrink: 0, boxShadow: '0 8px 20px rgba(18,60,105,0.2)' }}>
                  <img
                    src="/kakanwil-karyadi.png"
                    alt="Karyadi, S.H., M.H. - Kepala Kantor Wilayah KemenHAM Kalsel"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(18,60,105,0.9), transparent)', padding: '2px 0', textAlign: 'center' }}>
                    <span style={{ fontSize: '9px', color: 'var(--gold)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>KANWIL</span>
                  </div>
                </div>

                <div>
                  <span className="feature-card-tag" style={{ background: 'var(--navy)', color: 'var(--gold)', fontSize: '10px', marginBottom: '6px', display: 'inline-block' }}>
                    Kepala Kantor Wilayah
                  </span>
                  <h3 style={{ fontSize: '17px', color: 'var(--navy)', margin: '4px 0 2px', fontWeight: '800', lineHeight: '1.3' }}>
                    Karyadi, S.H., M.H.
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: '1.4' }}>
                    Kanwil Kementerian Hak Asasi Manusia Kalimantan Selatan
                  </p>
                </div>
              </div>

              <div className="hero-card-stats" style={{ marginBottom: '16px' }}>
                <div className="stat-item">
                  <CountUp end={13} className="stat-num" />
                  <span className="stat-label">Kabupaten / Kota</span>
                </div>
                <div className="stat-item">
                  <CountUp end={100} suffix="%" className="stat-num" />
                  <span className="stat-label">Layanan Gratis (Rp 0)</span>
                </div>
                <div className="stat-item">
                  <CountUp end={5} className="stat-num" />
                  <span className="stat-label">Pilar Pokok P5HAM</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num">24/7</span>
                  <span className="stat-label">Kanal Pengaduan</span>
                </div>
              </div>

              <Link href="/pengaduan" className="button primary" style={{ width: '100%' }}>
                Pos Yankomas Online <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Fact Sheet (GEO Optimization) */}
      <section className="section" style={{ padding: '36px 0 20px' }}>
        <div className="container">
          <div className="geo-factsheet-box">
            <h4>
              <CheckCircle2 size={18} className="text-green" /> Ringkasan Informasi Resmi Kanwil KemenHAM Kalsel
            </h4>
            <p>
              <strong>Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan</strong> dipimpin oleh Kepala Kantor Wilayah <strong>Karyadi, S.H., M.H.</strong> Berdasar pada <strong>PermenHAM Nomor 1 Tahun 2024</strong>, instansi ini bertindak sebagai perpanjangan tangan pemerintah pusat di Kalsel dengan Visi: <em>"Penerapan Kementerian Hak Asasi Manusia yang Kredibel untuk Kemanusiaan yang Adil dan Beradab"</em>. Melayani pengaduan dugaan pelanggaran HAM (Yankomas), pembinaan P2HAM, verifikasi KKP HAM, Desa Sadar HAM, dan harmonisasi Perda di 13 Kabupaten/Kota.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Akses Cepat Rute Mandiri */}
      <ScrollReveal>
      <section className="section section-alt" id="modul-layanan">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker">Navigasi Utama Portal</span>
              <h2 className="section-title">Modul Informasi & Layanan Mandiri</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Setiap modul dirancang independen untuk memberikan informasi mendalam, transparan, dan terstruktur:
              </p>
            </div>
            <Link href="/layanan" className="view-all-link">
              Lihat Semua Layanan <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card-grid-3">
            {quickAccessMenu.map((menu, idx) => {
              const Icon = menu.icon
              return (
                <Link key={idx} href={menu.href} className="feature-card">
                  <div>
                    <span className="feature-card-tag">{menu.tag}</span>
                    <div className="feature-card-icon">
                      <Icon size={26} />
                    </div>
                    <h3>{menu.title}</h3>
                    <p>{menu.desc}</p>
                  </div>
                  <span className="feature-card-link">
                    Buka Halaman <ArrowRight size={14} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* SEKSI APLIKASI & SISTEM TERINTEGRASI KEMENHAM */}
      <ScrollReveal>
      <section className="section" id="aplikasi-terintegrasi" style={{ paddingTop: '10px' }}>
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker">
                <Globe size={13} /> Ekosistem Layanan Digital
              </span>
              <h2 className="section-title">Aplikasi & Sistem Terintegrasi KemenHAM RI</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Akses langsung ke portal aplikasi resmi Kementerian Hak Asasi Manusia Republik Indonesia:
              </p>
            </div>
          </div>

          <div className="card-grid-4" style={{ marginTop: '24px' }}>
            {kemenhamApps.map((app, idx) => (
              <a
                key={idx}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="feature-card"
                style={{
                  borderTop: `4px solid ${app.color}`,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="feature-card-tag" style={{ background: 'var(--navy-soft)', color: app.color, fontWeight: '700' }}>
                      {app.badge}
                    </span>
                    <ExternalLink size={16} style={{ color: app.color }} />
                  </div>
                  <h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '4px' }}>{app.name}</h3>
                  <h4 style={{ fontSize: '12px', color: 'var(--gold-dark)', fontWeight: '600', marginBottom: '10px', lineHeight: '1.4' }}>
                    {app.fullName}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', margin: 0 }}>
                    {app.desc}
                  </p>
                </div>
                <div style={{ marginTop: '16px', borderTop: '1px solid var(--line)', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: app.color }}>
                  Buka Portal {app.name} <ArrowRight size={13} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* SEKSI PORTAL BERITA & WARTA BANUA */}
      <ScrollReveal>
      <section className="section" id="portal-berita">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker">
                <Newspaper size={13} /> Warta & Publikasi Resmi
              </span>
              <h2 className="section-title">Portal Berita Kanwil KemenHAM Kalsel</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Informasi terkini mengenai pengawasan pelayanan publik, siaran pers, dan program aksi HAM di Kalimantan Selatan:
              </p>
            </div>
            <Link href="/publikasi" className="view-all-link">
              Lihat Semua Warta <ArrowRight size={16} />
            </Link>
          </div>

          {featured ? (
            <div className="news-portal-grid">
              {/* Headline Berita Utama */}
              <article className="news-featured-box">
                <div className="news-featured-img">
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <span className="gov-badge" style={{ marginBottom: '8px', display: 'inline-block' }}>
                      {featured.category}
                    </span>
                    <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 800, margin: '4px 0', lineHeight: 1.3 }}>
                      {featured.title}
                    </h3>
                  </div>
                </div>

                <div className="news-featured-body">
                  <p style={{ color: '#4a5c68', fontSize: '14px', lineHeight: 1.7, margin: '0 0 20px' }}>
                    {featured.summary}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '16px', fontSize: '12px', color: 'var(--muted)' }}>
                    <span>
                      <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} /> {featured.date} • ⏱️ {featured.readTime}
                    </span>
                    <Link href={`/publikasi/${featured.id || 'berita'}`} className="button primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                      Baca Selengkapnya <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>

              {/* List Berita Samping */}
              <div className="news-side-list">
                {sideNews.map((item) => (
                  <Link key={item.id} href={`/publikasi/${item.id || 'berita'}`} className="news-side-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="feature-card-tag" style={{ margin: 0, fontSize: '10px' }}>
                        {item.category}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.readTime}</span>
                    </div>
                    <h4 style={{ fontSize: '15px', color: 'var(--navy)', margin: '0 0 8px', fontWeight: 700, lineHeight: 1.4 }}>
                      {item.title}
                    </h4>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: '10px' }}>
                      <span>📅 {item.date}</span>
                      <span>✍️ {item.author}</span>
                    </div>
                  </Link>
                ))}

                <div style={{ background: 'var(--cream-soft)', border: '1px dashed var(--blue)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--navy)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Ingin Mengunduh Dokumen Regulasi?
                  </span>
                  <Link href="/publikasi" style={{ fontSize: '12px', color: 'var(--blue)', fontWeight: 700 }}>
                    Akses Pusat Unduhan PDF & Laporan Kinerja →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#ffffff', padding: '36px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--line)' }}>
              <p style={{ color: 'var(--muted)', margin: 0 }}>Memuat warta terbaru dari database...</p>
            </div>
          )}
        </div>
      </section>
      </ScrollReveal>

      {/* SEKSI GALERI FOTO DOKUMENTASI KEGIATAN */}
      <ScrollReveal>
      <section className="section section-alt" id="galeri-kegiatan">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker">
                <Camera size={13} /> Dokumentasi Visual
              </span>
              <h2 className="section-title">Galeri Foto Kegiatan & Pelayanan di Banua</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Rangkuman foto aktivitas pelaksanaan tugas, pengawasan P2HAM, audiensi daerah, dan penyuluhan HAM di 13 Kabupaten/Kota se-Kalimantan Selatan (Klik foto untuk memperbesar):
              </p>
            </div>
            <Link href="/publikasi" className="view-all-link">
              Arsip Galeri Lengkap <ArrowRight size={16} />
            </Link>
          </div>

          <div className="gallery-grid">
            {galleryList.map((item, idx) => (
              <div key={item.id} className="gallery-card" onClick={() => openGallery(idx)}>
                <div className="gallery-card-thumb">
                  <img src={item.imageUrl} alt={item.title} loading="lazy" />
                  <div className="gallery-zoom-overlay">
                    <span className="gallery-zoom-btn">
                      <ZoomIn size={14} /> Perbesar Foto
                    </span>
                  </div>
                </div>

                <div className="gallery-card-content">
                  <div>
                    <span className="feature-card-tag" style={{ fontSize: '10px', marginBottom: '4px' }}>
                      {item.category}
                    </span>
                    <h4>{item.title}</h4>
                  </div>

                  <div className="gallery-card-meta">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} className="text-green" /> {item.location.split(',')[0]}
                    </span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Section Pilar P5HAM */}
      <ScrollReveal>
      <section className="section section-navy" id="p5ham-ringkasan">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker light">Kerangka Nilai Utama</span>
              <h2 className="section-title light">5 Pilar P5HAM Kalimantan Selatan</h2>
              <p className="section-lead light" style={{ margin: 0 }}>
                Fondasi kokoh dalam mewujudkan tatanan kehidupan berbangsa yang adil, setara, dan berperikemanusiaan:
              </p>
            </div>
            <Link href="/p5ham" className="button gold" style={{ padding: '8px 18px', fontSize: '13px' }}>
              Pelajari P5HAM Selengkapnya <ArrowRight size={14} />
            </Link>
          </div>

          <div className="pillars-container">
            {pillarsOverview.map((pillar) => (
              <div key={pillar.num} className="pillar-card">
                <span className="pillar-number">{pillar.num}</span>
                <h3 className="pillar-title">{pillar.name}</h3>
                <p className="pillar-desc">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Section 13 Wilayah Kerja Administratif Kalsel */}
      <ScrollReveal>
      <section className="section" id="wilayah-kalsel">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-kicker">Cakupan Layanan</span>
              <h2 className="section-title">Wilayah Kerja 13 Kabupaten & Kota</h2>
              <p className="section-lead" style={{ margin: 0 }}>
                Pelayanan dan koordinasi pemajuan HAM menjangkau seluruh daerah di Kalimantan Selatan:
              </p>
            </div>
            <Link href="/profil#wilayah-kerja" className="view-all-link">
              Rincian Wilayah Kerja <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {regenciesQuickList.map((reg, idx) => (
              <span
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--navy)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <MapPin size={13} className="text-green" />
                {reg}
              </span>
            ))}
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Banner Call to Action Pengaduan */}
      <ScrollReveal>
      <section className="section section-cream">
        <div className="container">
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '48px',
              border: '1px solid var(--line)',
              boxShadow: '0 16px 40px rgba(14, 34, 56, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '30px',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <span className="section-kicker">Saluran Komunikasi Masyarakat</span>
              <h2 style={{ fontSize: '28px', color: 'var(--navy)', margin: '8px 0 12px', fontWeight: 800 }}>
                Memiliki Laporan Dugaan Pelanggaran HAM?
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0, lineHeight: 1.7 }}>
                Gunakan kanal pengaduan resmi Pos Yankomas Kanwil KemenHAM Kalimantan Selatan. Pengaduan diproses
                secara profesional, objektif, bebas biaya, dan identitas pelapor dilindungi penuh.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/pengaduan" className="button primary">
                <ShieldAlert size={16} /> Formulir Pengaduan Online
              </Link>
              <Link href="/faq" className="button secondary">
                Tanya Jawab Pengaduan
              </Link>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* Lightbox Modal Interaktif */}
      <GalleryModal
        isOpen={isGalleryOpen}
        items={galleryList}
        currentIndex={galleryIndex}
        onClose={() => setIsGalleryOpen(false)}
        onNext={() => setGalleryIndex((prev) => (prev + 1) % galleryList.length)}
        onPrev={() =>
          setGalleryIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length)
        }
      />
    </>
  )
}
