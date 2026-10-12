'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import { supabase, BeritaPublikasi, DEFAULT_INITIAL_NEWS } from '@/lib/supabase'
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  Printer,
  ChevronRight,
  Eye,
  FileText,
  Tag,
  Shield,
  Send,
  Sparkles,
} from 'lucide-react'

// Helper function to format content (converts plain text newlines into paragraphs if needed)
function formatArticleHtml(content?: string, summary?: string): string {
  if (!content || !content.trim()) {
    return `<p>${summary || 'Isi artikel warta ini belum tersedia.'}</p>`
  }
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content
  }
  return content
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`)
    .join('')
}

export default function DetailPublikasiPage() {
  const params = useParams()
  const router = useRouter()
  const id = (params?.id as string) || ''

  const [article, setArticle] = useState<BeritaPublikasi | null>(null)
  const [relatedNews, setRelatedNews] = useState<BeritaPublikasi[]>([])
  const [copiedLink, setCopiedLink] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArticleData = async () => {
      setIsLoading(true)
      try {
        // 1. Gather all local cache & fallback articles
        let localArticles: BeritaPublikasi[] = []
        if (typeof window !== 'undefined') {
          try {
            const cached = localStorage.getItem('kemenham_local_news')
            if (cached) {
              const parsed = JSON.parse(cached)
              if (Array.isArray(parsed)) localArticles = parsed
            }
          } catch (e) {
            console.warn('Error reading local news cache:', e)
          }
        }

        const fallbackPool: BeritaPublikasi[] = [
          ...localArticles,
          ...DEFAULT_INITIAL_NEWS.filter(
            (d) => !localArticles.some((l) => l.id === d.id || l.judul === d.judul)
          ),
        ]

        let foundArticle: BeritaPublikasi | null = null

        // 2. If id looks like a valid UUID, attempt Supabase lookup
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        if (isUuid) {
          try {
            const { data, error } = await supabase
              .from('berita_publikasi')
              .select('*')
              .eq('id', id)
              .maybeSingle()

            if (!error && data) {
              foundArticle = data
            }
          } catch (err) {
            console.warn('Supabase fetch error for UUID:', err)
          }
        }

        // 3. Match against fallback pool by exact ID (e.g. news-init-1, news-init-2, news-...)
        if (!foundArticle && id) {
          foundArticle = fallbackPool.find((a) => a.id === id) || null
        }

        // 4. Match against numeric index / alias (e.g. news-init-1 -> 0, news-0 -> 0, 1 -> 0)
        if (!foundArticle && id) {
          const numMatch = id.match(/(?:news-init-|news-)?(\d+)/i)
          if (numMatch) {
            const num = parseInt(numMatch[1], 10)
            if (num > 0 && num <= fallbackPool.length) {
              foundArticle = fallbackPool[num - 1]
            } else if (num >= 0 && num < fallbackPool.length) {
              foundArticle = fallbackPool[num]
            }
          }
        }

        // 5. Match by URL-friendly slug or title match
        if (!foundArticle && id) {
          const cleanId = decodeURIComponent(id).toLowerCase().replace(/[^a-z0-9]/g, ' ').trim()
          if (cleanId.length > 2) {
            foundArticle =
              fallbackPool.find((a) => {
                const cleanJudul = a.judul.toLowerCase().replace(/[^a-z0-9]/g, ' ')
                return cleanJudul.includes(cleanId) || cleanId.includes(cleanJudul.slice(0, 30))
              }) || null
          }
        }

        // 6. Try fetching from Supabase latest list to match by title
        if (!foundArticle) {
          try {
            const { data: latestNews, error } = await supabase
              .from('berita_publikasi')
              .select('*')
              .order('published_at', { ascending: false })
              .limit(10)

            if (!error && latestNews && latestNews.length > 0) {
              const cleanId = decodeURIComponent(id).toLowerCase()
              const match = latestNews.find(
                (item) => item.judul.toLowerCase().includes(cleanId) || item.id === id
              )
              foundArticle = match || latestNews[0]
            }
          } catch (e) {
            console.warn('Supabase fallback fetch error:', e)
          }
        }

        // 7. Ultimate fallback: Use first item from fallback pool so user NEVER sees a blank page!
        if (!foundArticle && fallbackPool.length > 0) {
          foundArticle = fallbackPool[0]
        }

        setArticle(foundArticle)

        // 8. Resolve related news
        let related: BeritaPublikasi[] = []
        try {
          let query = supabase.from('berita_publikasi').select('*')
          if (foundArticle?.id && isUuid) {
            query = query.neq('id', foundArticle.id)
          }
          const { data: relatedData } = await query
            .order('published_at', { ascending: false })
            .limit(3)

          if (relatedData && relatedData.length > 0) {
            related = relatedData
          }
        } catch (e) {}

        // Complement related news from fallbackPool
        if (related.length < 3) {
          const additional = fallbackPool.filter(
            (item) =>
              item.id !== foundArticle?.id &&
              item.judul !== foundArticle?.judul &&
              !related.some((r) => r.judul === item.judul)
          )
          related = [...related, ...additional].slice(0, 3)
        }
        setRelatedNews(related)
      } catch (err) {
        console.error('Error fetching article:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticleData()
  }, [id])

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 3000)
    }
  }

  const handleShareWa = () => {
    if (typeof window !== 'undefined' && article) {
      const text = `${article.judul}\n\nBaca selengkapnya di portal resmi Kanwil KemenHAM Kalsel:\n${window.location.href}`
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
          <strong style={{ color: 'var(--navy)' }}>Memuat Warta Berita...</strong>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>📰</div>
          <h2 style={{ color: 'var(--navy)', marginBottom: '8px' }}>Warta Tidak Ditemukan</h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
            Artikel warta yang Anda cari tidak tersedia atau telah diperbarui. Silakan kunjungi pusat publikasi untuk warta terbaru lainnya.
          </p>
          <Link href="/publikasi" className="button primary" style={{ padding: '8px 18px' }}>
            ← Kembali ke Pusat Publikasi
          </Link>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Publikasi', href: '/publikasi' },
    { label: article.kategori || 'Warta Berita', href: '/publikasi' },
    { label: article.judul.slice(0, 40) + '...' },
  ]

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.judul,
    description: article.ringkasan,
    image: [
      article.image_url ||
        'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    ],
    datePublished: article.published_at || new Date().toISOString(),
    author: [
      {
        '@type': 'Organization',
        name: article.penulis || 'Humas Kanwil KemenHAM Kalimantan Selatan',
        url: 'https://kalsel.kemenham.go.id',
      },
    ],
    publisher: {
      '@type': 'GovernmentOrganization',
      name: 'Kantor Wilayah Kementerian Hak Asasi Manusia Kalimantan Selatan',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kalsel.kemenham.go.id/logo.png',
      },
    },
  }

  return (
    <>
      <JsonLd data={jsonLdData} />

      {/* Hero Header Section */}
      <section className="page-header" style={{ padding: '40px 0 30px' }}>
        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
              <span className="gov-badge" style={{ fontSize: '11px', padding: '4px 10px' }}>
                {article.kategori || 'Siaran Pers'}
              </span>
              <span style={{ color: '#d1e2e0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> 3 Menit Baca
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.3,
                marginBottom: '18px',
                letterSpacing: '-0.02em',
              }}
            >
              {article.judul}
            </h1>

            {/* Author & Meta Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                color: '#d1e2e0',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} className="text-gold" /> {article.penulis || 'Humas Kanwil Kalsel'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} className="text-gold" />{' '}
                  {new Date(article.published_at || Date.now()).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Share Bar */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleShareWa}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Share2 size={13} /> Bagikan WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  style={{
                    background: copiedLink ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                    color: copiedLink ? 'var(--navy)' : '#fff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: copiedLink ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {copiedLink ? '✓ Tautan Disalin!' : 'Salin Tautan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs Navigasi */}
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Main Content Article Body */}
      <section className="section" style={{ paddingTop: '10px', paddingBottom: '70px' }}>
        <div className="container">
          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              padding: 'clamp(20px, 4vw, 44px)',
              boxShadow: '0 10px 30px rgba(14, 34, 56, 0.04)',
            }}
          >
            {/* Featured Image */}
            {article.image_url && (
              <figure className="article-image-box" style={{ marginTop: 0, marginBottom: '28px' }}>
                <img src={article.image_url} alt={article.judul} />
                <figcaption>
                  Dokumentasi resmi Kantor Wilayah Kementerian Hak Asasi Manusia Kalimantan Selatan.
                </figcaption>
              </figure>
            )}

            {/* Lead Paragraph Summary */}
            {article.ringkasan && (
              <p
                style={{
                  fontSize: '18px',
                  lineHeight: 1.75,
                  fontWeight: 600,
                  color: 'var(--navy)',
                  marginBottom: '24px',
                  paddingBottom: '20px',
                  borderBottom: '2px solid var(--cream)',
                }}
              >
                {article.ringkasan}
              </p>
            )}

            {/* Main Rich Prose Article Content */}
            <div
              className="prose-article"
              dangerouslySetInnerHTML={{
                __html: formatArticleHtml(article.konten, article.ringkasan),
              }}
            />

            {/* Author Footer Card */}
            <div
              style={{
                marginTop: '40px',
                padding: '24px',
                background: 'var(--cream)',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--navy)',
                  color: 'var(--gold)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                HAM
              </div>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--navy)', display: 'block' }}>
                  {article.penulis || 'Humas Kanwil KemenHAM Kalimantan Selatan'}
                </strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  Dipublikasikan secara resmi untuk transparansi publik dan pemajuan nilai-nilai Hak Asasi Manusia di 13 Kabupaten/Kota se-Kalimantan Selatan.
                </p>
              </div>
            </div>

            {/* Navigation Back */}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                href="/publikasi"
                className="button secondary"
                style={{ padding: '8px 18px', fontSize: '13px', gap: '6px' }}
              >
                <ArrowLeft size={14} /> Kembali ke Pusat Publikasi
              </Link>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print()
                }}
                className="button secondary"
                style={{ padding: '8px 14px', fontSize: '13px', gap: '6px' }}
              >
                <Printer size={14} /> Cetak Warta
              </button>
            </div>
          </div>

          {/* Related News Section */}
          {relatedNews.length > 0 && (
            <div style={{ maxWidth: '860px', margin: '50px auto 0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)', marginBottom: '18px' }}>
                Warta Terkait Lainnya
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                {relatedNews.map((rel) => (
                  <Link
                    key={rel.id || rel.judul}
                    href={`/publikasi/${rel.id || 'berita'}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="feature-card"
                      style={{
                        padding: '18px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <span className="gov-badge" style={{ fontSize: '9px', marginBottom: '8px' }}>
                          {rel.kategori}
                        </span>
                        <strong
                          style={{
                            fontSize: '14px',
                            lineHeight: 1.4,
                            color: 'var(--navy)',
                            display: 'block',
                            marginBottom: '6px',
                          }}
                        >
                          {rel.judul}
                        </strong>
                        <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                          {rel.ringkasan?.slice(0, 95)}...
                        </p>
                      </div>

                      <div style={{ marginTop: '14px', fontSize: '11px', color: 'var(--blue)', fontWeight: 700 }}>
                        Baca Selengkapnya →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
