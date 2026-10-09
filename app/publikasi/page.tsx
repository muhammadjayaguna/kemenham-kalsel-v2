'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import GalleryModal, { GalleryItem } from '@/components/GalleryModal'
import { supabase, DEFAULT_INITIAL_NEWS } from '@/lib/supabase'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  Download,
  FileCheck,
  FileDown,
  FileText,
  Image as ImageIcon,
  MapPin,
  Newspaper,
  Search,
  Tag,
  ZoomIn,
} from 'lucide-react'

const documentList = [
  {
    id: 'doc-1',
    title: 'Buku Saku Panduan Pelayanan Publik Berbasis HAM (P2HAM) 2026',
    type: 'PDF',
    size: '3.4 MB',
    downloads: '1.240 Unduhan',
    desc: 'Pedoman teknis penyediaan sarana prasarana ramah disabilitas, lansia, dan kelompok rentan di kantor instansi pemerintah.',
  },
  {
    id: 'doc-2',
    title: 'Laporan Kinerja Tahunan Kanwil Kementerian HAM Provinsi Kalimantan Selatan',
    type: 'PDF',
    size: '5.8 MB',
    downloads: '890 Unduhan',
    desc: 'Laporan akuntabilitas kinerja instansi pemerintah (LAKIP) dan capaian program aksi HAM di wilayah Kalsel.',
  },
  {
    id: 'doc-3',
    title: 'Modul Materi Edukasi & Pengenalan HAM untuk Pelajar dan Generasi Muda',
    type: 'PDF',
    size: '2.1 MB',
    downloads: '2.150 Unduhan',
    desc: 'Bahan bacaan ringkas dan interaktif mengenai hak-hak asasi dasar, kewajiban warga negara, dan nilai toleransi.',
  },
  {
    id: 'doc-4',
    title: 'Formulir Standar Pengaduan Dugaan Pelanggaran HAM (Pos Yankomas)',
    type: 'DOCX / PDF',
    size: '540 KB',
    downloads: '3.410 Unduhan',
    desc: 'Format resmi berkas permohonan komunikasi masyarakat untuk penyampaian pengaduan secara luring.',
  },
]

export default function PublikasiPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'gallery' | 'docs'>('all')
  const [newsList, setNewsList] = useState<any[]>([])
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  // Fetch data dynamically from Supabase
  useEffect(() => {
    const fetchPublikasiData = async () => {
      try {
        const { data: nData } = await supabase
          .from('berita_publikasi')
          .select('*')
          .order('published_at', { ascending: false })

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
          }))
        }

        // Fallback to local storage or DEFAULT_INITIAL_NEWS
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
            }))
          } catch (e) {}
        }

        setNewsList(mappedNews)

        const { data: gData } = await supabase
          .from('galeri_kegiatan')
          .select('*')
          .order('created_at', { ascending: false })

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
        console.log('Using default static showcases')
      }
    }

    fetchPublikasiData()
  }, [])

  const openGallery = (index: number) => {
    setGalleryIndex(index)
    setIsGalleryOpen(true)
  }

  const breadcrumbItems = [{ label: 'Publikasi, Berita & Galeri' }]

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Publikasi, Berita, & Galeri Foto Resmi Kanwil KemenHAM Kalimantan Selatan',
    description:
      'Portal berita resmi, galeri foto dokumentasi kegiatan Banua, siaran pers, dan pusat unduhan dokumen regulasi Kanwil Kementerian HAM Kalimantan Selatan.',
    url: 'https://kemenham-kalsel.go.id/publikasi',
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
                <Newspaper size={13} /> Pusat Informasi & Dokumentasi
              </span>
              <h1 className="page-title">Publikasi, Berita & Galeri Dokumentasi</h1>
              <p className="page-subtitle">
                Akses warta berita resmi, dokumentasi foto kegiatan pelayanan di 13 Kabupaten/Kota, laporan
                akuntabilitas kinerja, serta repositori unduhan regulasi HAM Kalimantan Selatan.
              </p>
              <div className="page-header-meta">
                <span>
                  <FileCheck size={14} className="text-gold" /> Informasi Publik Terbuka & Terverifikasi
                </span>
                <span>
                  <Camera size={14} className="text-gold" /> Galeri Foto Dokumentasi Lengkap
                </span>
              </div>
            </div>

            <div className="page-header-aside">
              <h4>
                <BookOpen size={16} className="text-gold" /> Keterbukaan Informasi Publik
              </h4>
              <p>
                Seluruh materi publikasi, galeri foto, dan dokumen regulasi dapat diakses dan diunduh secara cuma-cuma
                untuk kebutuhan edukasi, riset, dan transparansi publik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs Navigasi */}
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Main Section */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container">
          {/* AI Factsheet / GEO Notice */}
          <div className="geo-factsheet-box">
            <h4>
              <CheckCircle2 size={18} className="text-green" /> Ruang Publikasi Resmi Kalsel
            </h4>
            <p>
              Halaman ini menyajikan warta resmi, dokumentasi foto pelaksanaan tugas, pengawasan P2HAM, pembinaan desa
              sadar HAM, dan agenda kolaborasi Kanwil Kementerian HAM Kalimantan Selatan bersama 13 pemerintah daerah di
              Kalimantan Selatan.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="tab-nav" style={{ marginTop: '30px' }}>
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Semua Publikasi
            </button>
            <button
              className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              Siaran Pers & Berita ({newsList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              Galeri Foto Dokumentasi ({galleryList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
              onClick={() => setActiveTab('docs')}
            >
              Unduhan Dokumen & Regulasi ({documentList.length})
            </button>
          </div>

          {/* Bagian 1: Berita & Siaran Pers */}
          {(activeTab === 'all' || activeTab === 'news') && (
            <div style={{ marginBottom: '56px' }}>
              <div className="section-header-flex">
                <div>
                  <span className="section-kicker">Warta Resmi</span>
                  <h2 className="section-title" style={{ fontSize: '26px' }}>
                    Siaran Pers & Berita Terkini
                  </h2>
                </div>
              </div>

              <div className="card-grid-2">
                {newsList.map((item) => (
                  <article key={item.id} className="feature-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span className="feature-card-tag">{item.category}</span>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>⏱️ {item.readTime}</span>
                      </div>
                      <Link href={`/publikasi/${item.id || 'berita'}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h3 style={{ fontSize: '18px', lineHeight: 1.4, marginBottom: '10px', color: 'var(--navy)' }}>
                          {item.title}
                        </h3>
                      </Link>
                      <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px', color: '#4a5c68' }}>
                        {item.summary}
                      </p>
                    </div>

                    <div>
                      <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--muted)' }}>
                        <span>
                          <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {item.date}
                        </span>
                        <Link href={`/publikasi/${item.id || 'berita'}`} style={{ color: 'var(--blue)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          Baca Selengkapnya <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Bagian 2: Galeri Foto Dokumentasi */}
          {(activeTab === 'all' || activeTab === 'gallery') && (
            <div style={{ marginBottom: '56px' }}>
              <div className="section-header-flex">
                <div>
                  <span className="section-kicker">
                    <Camera size={13} /> Dokumentasi Visual
                  </span>
                  <h2 className="section-title" style={{ fontSize: '26px' }}>
                    Galeri Foto Kegiatan di Kalimantan Selatan
                  </h2>
                </div>
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
          )}

          {/* Bagian 3: Pusat Unduhan Dokumen */}
          {(activeTab === 'all' || activeTab === 'docs') && (
            <div>
              <div className="section-header-flex">
                <div>
                  <span className="section-kicker">Repositori Resmi</span>
                  <h2 className="section-title" style={{ fontSize: '26px' }}>
                    Unduhan Dokumen & Regulasi HAM
                  </h2>
                </div>
              </div>

              <div className="card-grid-2">
                {documentList.map((doc) => (
                  <div key={doc.id} className="feature-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div className="feature-card-icon" style={{ margin: 0, width: '48px', height: '48px' }}>
                        <FileDown size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                          <span className="gov-badge">{doc.type}</span>
                          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{doc.size}</span>
                        </div>
                        <h3 style={{ fontSize: '16px', margin: '0 0 6px', color: 'var(--navy)' }}>
                          {doc.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 16px' }}>
                          {doc.desc}
                        </p>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{doc.downloads}</span>
                      <button
                        onClick={() => alert(`Mengunduh file: ${doc.title} (${doc.type})`)}
                        className="button secondary"
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        <Download size={13} /> Unduh Dokumen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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
