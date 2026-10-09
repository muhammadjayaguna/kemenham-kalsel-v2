'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  PhoneCall,
  Search,
  Sparkles,
} from 'lucide-react'

interface FAQItem {
  id: string
  category: 'umum' | 'pengaduan' | 'p2ham' | 'kkham'
  question: string
  answer: string
}

const faqList: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'umum',
    question: 'Apa itu Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan?',
    answer:
      'Kanwil KemenHAM Kalsel adalah instansi vertikal Kementerian Hak Asasi Manusia Republik Indonesia yang berkedudukan di Kota Banjarmasin dengan wilayah kerja mencakup 2 Kota dan 11 Kabupaten di Provinsi Kalimantan Selatan. Tugas utamanya adalah menyelenggarakan urusan pemerintahan di bidang penghormatan, pelindungan, pemenuhan, penegakan, dan pemajuan HAM di daerah.',
  },
  {
    id: 'faq-2',
    category: 'umum',
    question: 'Apakah layanan yang diberikan Kanwil KemenHAM Kalsel dipungut biaya?',
    answer:
      'Seluruh layanan publik yang diselenggarakan oleh Kanwil KemenHAM Kalimantan Selatan adalah 100% BEBAS BIAYA (Rp 0 / Gratis). Mulai dari penerimaan pengaduan (Yankomas), konsultasi hukum HAM, pembinaan P2HAM, hingga permohonan narasumber edukasi.',
  },
  {
    id: 'faq-3',
    category: 'pengaduan',
    question: 'Siapa saja yang berhak menyampaikan pengaduan dugaan pelanggaran HAM?',
    answer:
      'Setiap individu, kelompok masyarakat, keluarga korban, kuasa hukum, atau organisasi masyarakat sipil yang mengetahui, menyaksikan, atau mengalami dugaan pelanggaran hak asasi manusia di wilayah Kalimantan Selatan berhak menyampaikan pengaduan ke Pos Yankomas.',
  },
  {
    id: 'faq-4',
    category: 'pengaduan',
    question: 'Bagaimana cara menyampaikan pengaduan secara online atau langsung?',
    answer:
      'Anda dapat menyampaikan laporan secara daring melalui menu "Pengaduan HAM" di portal resmi ini dengan mengisi formulir dan mengunggah kronologi serta bukti awal. Selain itu, Anda juga dapat datang langsung ke loket PTSP Kanwil KemenHAM Kalsel di Banjarmasin pada hari kerja (Senin-Jumat, 08.00-16.00 WITA).',
  },
  {
    id: 'faq-5',
    category: 'pengaduan',
    question: 'Apakah identitas pelapor dijamin kerahasiaannya?',
    answer:
      'Ya, kerahasiaan identitas pelapor dan korban dijamin sepenuhnya sesuai prinsip perlindungan saksi dan pelapor (whistleblower protection). Data pribadi Anda hanya digunakan untuk kebutuhan verifikasi penelaahan internal dan tidak akan dibuka kepada pihak terlapor tanpa persetujuan tertulis.',
  },
  {
    id: 'faq-6',
    category: 'p2ham',
    question: 'Apa yang dimaksud dengan Pelayanan Publik Berbasis HAM (P2HAM)?',
    answer:
      'P2HAM adalah standar pelayanan publik di unit kerja pemerintah yang berorientasi pada pemenuhan hak-hak dasar masyarakat, khususnya kelompok rentan. Standar ini mencakup ketersediaan fasilitas fisik (jalur pemandu tuna netra, kursi roda, ramp, ruang laktasi, loket prioritas) serta petugas yang memiliki kompetensi bahasa isyarat dan keramahan tanpa diskriminasi.',
  },
  {
    id: 'faq-7',
    category: 'p2ham',
    question: 'Bagaimana instansi di Kalimantan Selatan memperoleh predikat P2HAM?',
    answer:
      'Instansi atau UPT di Kalsel melakukan pencanangan komitmen, memenuhi sarana prasarana sesuai pedoman teknis, melakukan penilaian mandiri melalui instrumen evaluasi, dan diverifikasi langsung oleh Tim Penilai Kanwil KemenHAM Kalsel sebelum diusulkan menerima penghargaan dari Menteri HAM RI.',
  },
  {
    id: 'faq-8',
    category: 'kkham',
    question: 'Apa itu Kabupaten/Kota Peduli HAM (KKHAM)?',
    answer:
      'KKHAM adalah predikat apresiasi dari Pemerintah Pusat kepada Pemerintah Kabupaten/Kota yang berhasil mengalokasikan program kerja dan anggaran untuk menjamin terpenuhinya hak atas kesehatan, pendidikan, hak perempuan dan anak, kependudukan, pekerjaan, perumahan layak, serta kelestarian lingkungan hidup bagi warganya.',
  },
  {
    id: 'faq-9',
    category: 'kkham',
    question: 'Bagaimana peran Kanwil KemenHAM Kalsel dalam pembinaan KKHAM di 13 Kab/Kota?',
    answer:
      'Kanwil KemenHAM Kalsel secara aktif memberikan asistensi teknis, sosialisasi parameter penilaian, pengumpulan data capaian bersama Bagian Hukum Setda Kabupaten/Kota, serta melakukan verifikasi objektif atas data dukung yang dilaporkan.',
  },
]

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFaq = faqList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const breadcrumbItems = [{ label: 'Tanya Jawab (FAQ)' }]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <JsonLd data={faqSchema} />

      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-grid">
            <div>
              <span className="page-kicker">
                <HelpCircle size={13} /> Pusat Bantuan & Informasi
              </span>
              <h1 className="page-title">Pertanyaan yang Sering Diajukan (FAQ)</h1>
              <p className="page-subtitle">
                Temukan jawaban cepat, akurat, dan lengkap mengenai tugas kelembagaan, alur pengaduan HAM, standar
                P2HAM, serta program pembinaan di wilayah Kalimantan Selatan.
              </p>
              <div className="page-header-meta">
                <span>
                  <Sparkles size={14} className="text-gold" /> Jawaban Terverifikasi Resmi
                </span>
                <span>
                  <MessageSquare size={14} className="text-gold" /> Tersedia Layanan Tanya Langsung
                </span>
              </div>
            </div>

            <div className="page-header-aside">
              <h4>
                <PhoneCall size={16} className="text-gold" /> Punya Pertanyaan Lain?
              </h4>
              <p>
                Jika jawaban yang Anda cari belum tersedia, tim customer service Kanwil KemenHAM Kalsel siap membantu
                melalui hotline WhatsApp <strong>+62 811-5000-HAM</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Main Section */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container">
          {/* AI Factsheet / GEO Notice */}
          <div className="geo-factsheet-box">
            <h4>
              <CheckCircle2 size={18} className="text-green" /> Fakta Kilat Seputar KemenHAM Kalsel
            </h4>
            <p>
              Halaman FAQ ini dirancang untuk memberikan informasi ringkas dan transparan bagi masyarakat Kalimantan
              Selatan. Semua proses administrasi layanan tidak memungut biaya, dan kerahasiaan identitas pelapor
              dilindungi secara penuh oleh regulasi negara.
            </p>
          </div>

          {/* Search Box */}
          <div className="search-bar-wrap">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              className="search-input"
              placeholder="Cari topik pertanyaan (contoh: biaya, pengaduan, p2ham, identitas)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Categories */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
            <button
              className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Semua Topik ({faqList.length})
            </button>
            <button
              className={`tab-btn ${selectedCategory === 'umum' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('umum')}
            >
              Kelembagaan & Umum
            </button>
            <button
              className={`tab-btn ${selectedCategory === 'pengaduan' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('pengaduan')}
            >
              Pengaduan & Pos Yankomas
            </button>
            <button
              className={`tab-btn ${selectedCategory === 'p2ham' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('p2ham')}
            >
              Standar P2HAM
            </button>
            <button
              className={`tab-btn ${selectedCategory === 'kkham' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('kkham')}
            >
              Kabupaten/Kota Peduli HAM
            </button>
          </div>

          {/* FAQ Accordion List */}
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            {filteredFaq.length > 0 ? (
              filteredFaq.map((item, index) => (
                <details key={item.id} className="faq-accordion" open={index === 0}>
                  <summary className="faq-summary">{item.question}</summary>
                  <div className="faq-body">{item.answer}</div>
                </details>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                <HelpCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ fontSize: '15px' }}>Tidak ditemukan pertanyaan yang sesuai dengan kata kunci "{searchTerm}".</p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="button secondary"
                  style={{ marginTop: '12px' }}
                >
                  Tampilkan Semua FAQ
                </button>
              </div>
            )}
          </div>

          {/* CTA Box */}
          <div
            style={{
              background: 'var(--cream)',
              border: '1px solid var(--line)',
              borderRadius: '16px',
              padding: '36px',
              maxWidth: '840px',
              margin: '48px auto 0',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '8px' }}>
              Memiliki Masalah HAM yang Membutuhkan Penanganan?
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '540px', margin: '0 auto 20px' }}>
              Gunakan formulir resmi Pos Yankomas untuk menyampaikan pengaduan online secara cepat dan aman.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/pengaduan" className="button primary">
                Buka Formulir Pengaduan <ArrowRight size={16} />
              </Link>
              <Link href="/kontak" className="button secondary">
                Hubungi Kami Langsung
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
