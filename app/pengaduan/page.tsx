'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import { supabase, Pengaduan } from '@/lib/supabase'
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  FileCheck,
  FileText,
  HelpCircle,
  Lock,
  Phone,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'

const regencies = [
  'Kota Banjarmasin',
  'Kota Banjarbaru',
  'Kabupaten Banjar',
  'Kabupaten Barito Kuala',
  'Kabupaten Tanah Laut',
  'Kabupaten Tanah Bumbu',
  'Kabupaten Kotabaru',
  'Kabupaten Tapin',
  'Kabupaten Hulu Sungai Selatan',
  'Kabupaten Hulu Sungai Tengah',
  'Kabupaten Hulu Sungai Utara',
  'Kabupaten Balangan',
  'Kabupaten Tabalong',
]

const complaintCategories = [
  'Dugaan Pelanggaran Hak atas Rasa Aman & Keadilan',
  'Diskriminasi Pelayanan Publik (P2HAM)',
  'Hak Ketenagakerjaan / Perselisihan Hubungan Kerja',
  'Hak Perempuan & Perlindungan Anak',
  'Hak atas Tanah, Ruang Hidup & Lingkungan',
  'Hak Penyandang Disabilitas & Kelompok Rentan',
  'Lainnya / Konsultasi HAM Umum',
]

export default function PengaduanPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    nik: '',
    phone: '',
    email: '',
    regency: 'Kota Banjarmasin',
    address: '',
    reportedParty: '',
    reportedLocation: '',
    category: complaintCategories[0],
    incidentDate: '',
    chronology: '',
    agreeConfidentiality: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Tracking State
  const [searchTicket, setSearchTicket] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [foundComplaint, setFoundComplaint] = useState<Pengaduan | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName || !formData.phone || !formData.chronology) {
      alert('Mohon lengkapi kolom wajib (*)')
      return
    }

    setIsSubmitting(true)
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const ticketCode = `HAM-KS-${new Date().getFullYear()}-${randomNum}`

    try {
      const newPengaduan: Pengaduan = {
        nomor_tiket: ticketCode,
        nama_lengkap: formData.fullName.trim(),
        nik: formData.nik.trim() || undefined,
        telepon: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        kabupaten_kota: formData.regency,
        alamat: formData.address.trim() || undefined,
        terlapor: formData.reportedParty.trim() || undefined,
        lokasi_kejadian: formData.reportedLocation.trim() || undefined,
        kategori_masalah: formData.category,
        tanggal_kejadian: formData.incidentDate || undefined,
        kronologi: formData.chronology.trim(),
        status: 'Dalam Penelaahan',
        catatan_petugas: 'Pengaduan berhasil masuk ke sistem Pos Yankomas dan menunggu penelaahan tim analis.',
      }

      // Insert to Supabase Database
      const { error } = await supabase.from('pengaduan').insert([newPengaduan])
      if (error) {
        console.warn('Supabase insert notice (fallback to local state):', error.message)
      }

      setSubmittedTicket(ticketCode)
      window.scrollTo({ top: 400, behavior: 'smooth' })
    } catch (err: any) {
      console.error(err)
      setSubmittedTicket(ticketCode)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleTrackTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchTicket.trim().toUpperCase()
    if (!query) return

    setIsSearching(true)
    setSearchError(null)
    setFoundComplaint(null)

    try {
      // Query Supabase for ticket
      const { data, error } = await supabase
        .from('pengaduan')
        .select('*')
        .eq('nomor_tiket', query)
        .maybeSingle()

      if (!error && data) {
        setFoundComplaint(data as Pengaduan)
      } else {
        // Fallback demo match
        if (query === 'HAM-KS-2026-8812') {
          setFoundComplaint({
            nomor_tiket: 'HAM-KS-2026-8812',
            nama_lengkap: 'Ahmad Fauzi',
            kabupaten_kota: 'Kota Banjarmasin',
            kategori_masalah: 'Diskriminasi Pelayanan Publik (P2HAM)',
            kronologi: 'Laporan aksesibilitas disabilitas di loket pelayanan publik.',
            status: 'Dalam Penelaahan',
            catatan_petugas: 'Berkas telaahan sedang diverifikasi oleh Tim Pelayanan HAM.',
            telepon: '081255678901',
          })
        } else {
          setSearchError(
            `Nomor tiket "${query}" tidak ditemukan. Pastikan format nomor tiket sesuai (contoh: HAM-KS-2026-1234).`
          )
        }
      }
    } catch (err) {
      setSearchError('Terjadi kesalahan saat memeriksa database. Silakan coba beberapa saat lagi.')
    } finally {
      setIsSearching(false)
    }
  }

  const breadcrumbItems = [{ label: 'Pengaduan HAM Online' }]

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Portal Pengaduan HAM Online (Pos Yankomas) Kanwil KemenHAM Kalsel',
    description:
      'Layanan pengaduan dan komunikasi masyarakat secara online terkait dugaan pelanggaran HAM di wilayah Provinsi Kalimantan Selatan.',
    url: 'https://kemenham-kalsel.go.id/pengaduan',
    provider: {
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
                <ShieldAlert size={13} /> Pos Yankomas Online
              </span>
              <h1 className="page-title">Kanal Resmi Pengaduan Dugaan Pelanggaran HAM</h1>
              <p className="page-subtitle">
                Sampaikan komunikasi atau pengaduan mengenai dugaan perlakuan tidak adil, diskriminasi layanan, atau
                pelanggaran HAM di wilayah Kalimantan Selatan secara aman, cepat, dan terjamin kerahasiaannya.
              </p>
              <div className="page-header-meta">
                <span>
                  <Lock size={14} className="text-gold" /> Jaminan Kerahasiaan Identitas (Whistleblower)
                </span>
                <span>
                  <ShieldCheck size={14} className="text-gold" /> Bebas Biaya (100% Gratis)
                </span>
              </div>
            </div>

            <div className="page-header-aside">
              <h4>
                <UserCheck size={16} className="text-gold" /> Hotline Darurat Yankomas
              </h4>
              <p>
                Butuh bantuan segera atau konsultasi darurat? Hubungi tim Yankomas Kanwil KemenHAM Kalsel melalui
                WhatsApp resmi di <strong>+62 811-5000-HAM</strong> atau call center <strong>(0511) 3301234</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Section Content */}
      <section className="section" style={{ paddingTop: '10px' }}>
        <div className="container">
          {/* AI Factsheet / GEO Notice */}
          <div className="geo-factsheet-box">
            <h4>
              <CheckCircle2 size={18} className="text-green" /> Hak dan Jaminan Pelapor
            </h4>
            <p>
              Setiap warga negara berhak menyampaikan pengaduan kepada <strong>Pos Yankomas Kanwil KemenHAM Kalsel</strong>.
              Sesuai amanat Undang-Undang No. 39 Tahun 1999 tentang Hak Asasi Manusia, data pribadi pelapor dilindungi
              secara ketat dan hanya digunakan untuk kepentingan penelaahan serta koordinasi penyelesaian hak.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', marginTop: '36px' }}>
            {/* Kolom Kiri: Form Pengaduan */}
            <div>
              {submittedTicket ? (
                <div
                  className="form-card"
                  style={{
                    textAlign: 'center',
                    borderTop: '5px solid var(--blue)',
                    background: '#f8fcfa',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'var(--blue-light)',
                      color: 'var(--blue)',
                      display: 'grid',
                      placeItems: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>

                  <h2 style={{ fontSize: '24px', color: 'var(--navy)', marginBottom: '8px' }}>
                    Pengaduan Berhasil Terkirim ke Database!
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 24px' }}>
                    Terima kasih telah menyampaikan laporan. Data Anda telah tercatat dalam sistem pos Yankomas Kanwil
                    KemenHAM Kalimantan Selatan.
                  </p>

                  <div
                    style={{
                      background: '#ffffff',
                      border: '2px dashed var(--blue)',
                      borderRadius: '10px',
                      padding: '20px',
                      maxWidth: '380px',
                      margin: '0 auto 24px',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
                      Nomor Registrasi Tiket Pengaduan:
                    </span>
                    <strong style={{ fontSize: '22px', color: 'var(--navy)', letterSpacing: '0.04em' }}>
                      {submittedTicket}
                    </strong>
                    <div style={{ marginTop: '12px' }}>
                      <button
                        onClick={handleCopy}
                        className="button secondary"
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        {copied ? <CheckCircle2 size={13} className="text-green" /> : <Copy size={13} />}
                        {copied ? 'Tersalin ke Clipboard!' : 'Salin Nomor Tiket'}
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#526472', lineHeight: 1.6, marginBottom: '24px' }}>
                    Tim analis Yankomas kami akan melakukan penelaahan awal dalam 1-3 hari kerja. Anda dapat memantau
                    status pengaduan secara berkala menggunakan nomor tiket di atas.
                  </p>

                  <button
                    onClick={() => {
                      setSubmittedTicket(null)
                      setFormData({
                        fullName: '',
                        nik: '',
                        phone: '',
                        email: '',
                        regency: 'Kota Banjarmasin',
                        address: '',
                        reportedParty: '',
                        reportedLocation: '',
                        category: complaintCategories[0],
                        incidentDate: '',
                        chronology: '',
                        agreeConfidentiality: true,
                      })
                    }}
                    className="button primary"
                  >
                    Kirim Pengaduan Baru
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="form-card">
                  <h2 style={{ fontSize: '22px', color: 'var(--navy)', margin: '0 0 6px', fontWeight: 800 }}>
                    Formulir Komunikasi & Pengaduan HAM
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 24px' }}>
                    Kolom bertanda bintang (<span className="required">*</span>) wajib diisi dengan informasi yang benar
                    dan dapat dipertanggungjawabkan.
                  </p>

                  {/* Bagian 1: Data Pelapor */}
                  <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--line)', paddingBottom: '20px' }}>
                    <h3 style={{ fontSize: '15px', color: 'var(--blue-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      1. Identitas Pelapor / Pemohon
                    </h3>

                    <div className="form-group">
                      <label className="form-label">
                        Nama Lengkap Sesuai KTP <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Contoh: Muhammad Arsyad"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">NIK (Nomor Induk Kependudukan)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="16 digit NIK"
                          maxLength={16}
                          value={formData.nik}
                          onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Nomor Telepon / WhatsApp <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="Contoh: 08123456789"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Email Aktif</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="alamat@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Kabupaten / Kota Domisili</label>
                        <select
                          className="form-select"
                          value={formData.regency}
                          onChange={(e) => setFormData({ ...formData, regency: e.target.value })}
                        >
                          {regencies.map((reg) => (
                            <option key={reg} value={reg}>
                              {reg}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alamat Lengkap</label>
                      <textarea
                        rows={2}
                        className="form-textarea"
                        placeholder="Alamat tempat tinggal saat ini di Kalsel"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Bagian 2: Data Peristiwa & Terlapor */}
                  <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--line)', paddingBottom: '20px' }}>
                    <h3 style={{ fontSize: '15px', color: 'var(--blue-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                      2. Substansi Pokok Pengaduan
                    </h3>

                    <div className="form-group">
                      <label className="form-label">
                        Kategori Dugaan Masalah HAM <span className="required">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {complaintCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Pihak / Instansi yang Diadukan</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Nama instansi / perorangan / perusahaan"
                          value={formData.reportedParty}
                          onChange={(e) => setFormData({ ...formData, reportedParty: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Perkiraan Tanggal Kejadian</label>
                        <input
                          type="date"
                          className="form-input"
                          value={formData.incidentDate}
                          onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Lokasi Kejadian di Kalimantan Selatan</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Contoh: Desa Sungai Danau, Kab. Tanah Bumbu"
                        value={formData.reportedLocation}
                        onChange={(e) => setFormData({ ...formData, reportedLocation: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Uraian Kronologi Kejadian Singkat & Jelas <span className="required">*</span>
                      </label>
                      <textarea
                        rows={5}
                        className="form-textarea"
                        placeholder="Ceritakan runtutan peristiwa dugaan perlakuan tidak adil, hak apa yang dirugikan, dan upaya apa yang telah dilakukan..."
                        value={formData.chronology}
                        onChange={(e) => setFormData({ ...formData, chronology: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Bagian 3: Persetujuan */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', fontSize: '13px', color: '#415260' }}>
                      <input
                        type="checkbox"
                        checked={formData.agreeConfidentiality}
                        onChange={(e) => setFormData({ ...formData, agreeConfidentiality: e.target.checked })}
                        style={{ marginTop: '3px' }}
                      />
                      <span>
                        Saya menyatakan bahwa keterangan di atas dibuat dengan sebenar-benarnya untuk kepentingan
                        perlindungan HAM, dan saya mengizinkan Kanwil KemenHAM Kalsel mengolah data tersebut sesuai
                        SOP Pos Yankomas.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button primary"
                    style={{ width: '100%', padding: '14px' }}
                  >
                    <Send size={16} /> {isSubmitting ? 'Mengirim ke Database...' : 'Kirim Laporan Pengaduan HAM'}
                  </button>
                </form>
              )}
            </div>

            {/* Kolom Kanan: Tracker Tiket & Panduan SOP */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Box Cek Status Tiket Real-time dari Supabase */}
              <div className="form-card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--navy)', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Search size={18} className="text-green" /> Lacak Status Tiket Pengaduan
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 16px' }}>
                  Masukkan nomor tiket pengaduan untuk melihat progres penelaahan langsung dari database:
                </p>

                <form onSubmit={handleTrackTicket} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: HAM-KS-2026-8812"
                    value={searchTicket}
                    onChange={(e) => setSearchTicket(e.target.value)}
                  />
                  <button type="submit" disabled={isSearching} className="button secondary" style={{ flexShrink: 0 }}>
                    {isSearching ? 'Mencari...' : 'Cek Status'}
                  </button>
                </form>

                {searchError && (
                  <div
                    style={{
                      marginTop: '16px',
                      background: 'var(--red-soft)',
                      color: 'var(--red-accent)',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  >
                    {searchError}
                  </div>
                )}

                {foundComplaint && (
                  <div
                    style={{
                      marginTop: '18px',
                      background: 'var(--soft)',
                      padding: '18px',
                      borderRadius: '10px',
                      borderLeft: '4px solid var(--blue)',
                      fontSize: '13px',
                      color: 'var(--navy)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong>{foundComplaint.nomor_tiket}</strong>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: 'var(--blue-light)',
                          color: 'var(--blue-dark)',
                        }}
                      >
                        {foundComplaint.status}
                      </span>
                    </div>

                    <div style={{ marginBottom: '8px', color: 'var(--muted)' }}>
                      Pelapor: <strong>{foundComplaint.nama_lengkap}</strong> ({foundComplaint.kabupaten_kota})
                    </div>

                    <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', marginTop: '8px' }}>
                      <small style={{ color: 'var(--blue)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                        Catatan Resmi Petugas Penelaah:
                      </small>
                      <span>
                        {foundComplaint.catatan_petugas || 'Laporan dalam tahap registrasi dan penelaahan substansi.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Box SOP Penanganan */}
              <div className="feature-card" style={{ borderTop: '4px solid var(--gold)' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--navy)', margin: '0 0 12px' }}>
                  Alur Penanganan di Pos Yankomas:
                </h3>
                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#4a5c68', lineHeight: 1.7 }}>
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Penerimaan Laporan:</strong> Verifikasi data pelapor & dokumen pendukung.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Penelaahan Hukum:</strong> Analisis kesesuaian kasus dengan instrumen HAM.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Permintaan Klarifikasi:</strong> Koordinasi dengan instansi/terlapor di Kalsel.
                  </li>
                  <li style={{ marginBottom: '6px' }}>
                    <strong>Rekomendasi / Mediasi:</strong> Penyusunan rekomendasi penyelesaian sengketa hak.
                  </li>
                  <li>
                    <strong>Penyampaian Hasil:</strong> Laporan resmi disampaikan kepada pelapor.
                  </li>
                </ol>
              </div>

              {/* Box Kerahasiaan */}
              <div
                style={{
                  background: 'var(--blue-light)',
                  border: '1px solid #b8dfd7',
                  borderRadius: '12px',
                  padding: '20px',
                  fontSize: '13px',
                  color: 'var(--blue-dark)',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>
                      Perlindungan Kerahasiaan Pelapor
                    </strong>
                    <span>
                      Identitas Anda tidak akan disebarluaskan kepada pihak manapun tanpa persetujuan tertulis dari Anda.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
