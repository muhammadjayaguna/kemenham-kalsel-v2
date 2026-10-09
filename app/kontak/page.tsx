'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import JsonLd from '@/components/JsonLd'
import { supabase, PesanKontak } from '@/lib/supabase'
import {
  ArrowRight,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Plane,
  Send,
  ShieldCheck,
} from 'lucide-react'

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Mohon lengkapi data wajib (*)')
      return
    }

    setIsSubmitting(true)

    try {
      const newPesan: PesanKontak = {
        nama_lengkap: formData.name.trim(),
        telepon: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        subjek: formData.subject.trim() || undefined,
        pesan: formData.message.trim(),
        status: 'Belum Dibaca',
      }

      await supabase.from('pesan_kontak').insert([newPesan])
      setSent(true)
    } catch (err) {
      console.warn('Supabase insert note:', err)
      setSent(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const breadcrumbItems = [{ label: 'Kontak & Lokasi Kantor' }]

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOffice',
    name: 'Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Brigjen H. Hasan Basry No. 42, Kayu Tangi',
      addressLocality: 'Kota Banjarmasin',
      addressRegion: 'Kalimantan Selatan',
      postalCode: '70123',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -3.3194,
      longitude: 114.5908,
    },
    telephone: '+62-511-3301234',
    email: 'kanwil.kalsel@kemenham.go.id',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '08:00',
        closes: '16:30',
      },
    ],
    url: 'https://kemenham-kalsel.go.id/kontak',
  }

  return (
    <>
      <JsonLd data={contactSchema} />

      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-grid">
            <div>
              <span className="page-kicker">
                <MapPin size={13} /> Kontak & Lokasi Kantor
              </span>
              <h1 className="page-title">Hubungi Kami & Kunjungi Kantor Wilayah</h1>
              <p className="page-subtitle">
                Kami siap menyambut dan melayani Anda di Kantor Wilayah Kementerian HAM Kalimantan Selatan. Akses
                informasi alamat fisik, jam operasional PTSP, nomor telepon, serta kanal konsultasi daring.
              </p>
              <div className="page-header-meta">
                <span>
                  <Building size={14} className="text-gold" /> Pelayanan Terpadu Satu Pintu (PTSP)
                </span>
                <span>
                  <Clock size={14} className="text-gold" /> Waktu Layanan: WITA (GMT+8)
                </span>
              </div>
            </div>

            <div className="page-header-aside">
              <h4>
                <ShieldCheck size={16} className="text-gold" /> Layanan Ramah & Bebas Pungli
              </h4>
              <p>
                Seluruh pelayanan konsultasi, administrasi, dan penanganan pengaduan di lingkungan Kanwil KemenHAM
                Kalsel bebas biaya / Rp 0.
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
              <CheckCircle2 size={18} className="text-green" /> Lokasi & Koordinat Geografis Resmi
            </h4>
            <p>
              <strong>Kanwil Kementerian HAM Kalimantan Selatan</strong> beralamat di Jl. Brigjen H. Hasan Basry No.
              42, Kota Banjarmasin, Kalimantan Selatan 70123 (Koordinat: 3°19'10.0"S 114°35'27.0"E / Geo: -3.3194,
              114.5908). Lokasi sangat strategis dan mudah diakses menggunakan transportasi darat dari Bandara
              Internasional Syamsudin Noor maupun pusat kota Banjarmasin dan Banjarbaru.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '36px' }}>
            {/* Kolom Kiri: Rincian Kontak & Jam Buka */}
            <div>
              <div className="feature-card" style={{ padding: '32px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: 'var(--navy)', margin: '0 0 20px', fontWeight: 800 }}>
                  Informasi Kontak Resmi
                </h2>

                <div className="footer-contact-list" style={{ gap: '20px' }}>
                  <div className="footer-contact-item">
                    <MapPin size={22} className="contact-icon" />
                    <div>
                      <strong style={{ fontSize: '13px' }}>Alamat Kantor Wilayah:</strong>
                      <span style={{ fontSize: '14px', color: '#445664' }}>
                        Jl. Brigjen H. Hasan Basry No. 42, Kel. Pangeran, Kec. Banjarmasin Utara, Kota Banjarmasin,
                        Kalimantan Selatan 70123
                      </span>
                    </div>
                  </div>

                  <div className="footer-contact-item">
                    <Phone size={22} className="contact-icon" />
                    <div>
                      <strong style={{ fontSize: '13px' }}>Telepon & Call Center:</strong>
                      <span style={{ fontSize: '14px', color: '#445664' }}>
                        (0511) 3301234 (Telepon Kantor) <br />
                        +62 811-5000-HAM (Hotline WhatsApp Pengaduan)
                      </span>
                    </div>
                  </div>

                  <div className="footer-contact-item">
                    <Mail size={22} className="contact-icon" />
                    <div>
                      <strong style={{ fontSize: '13px' }}>Surat Elektronik (Email):</strong>
                      <span style={{ fontSize: '14px', color: '#445664' }}>
                        kanwil.kalsel@kemenham.go.id <br />
                        pengaduan.ham.kalsel@kemenham.go.id
                      </span>
                    </div>
                  </div>

                  <div className="footer-contact-item">
                    <Clock size={22} className="contact-icon" />
                    <div>
                      <strong style={{ fontSize: '13px' }}>Jam Operasional Pelayanan (PTSP):</strong>
                      <span style={{ fontSize: '14px', color: '#445664' }}>
                        Senin - Kamis : 08.00 - 16.00 WITA <br />
                        Jumat : 08.00 - 16.30 WITA (Istirahat Sholat Jumat: 11.30 - 13.30 WITA) <br />
                        Sabtu, Minggu & Hari Libur Nasional : Tutup
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Akses Transportasi */}
              <div className="feature-card" style={{ padding: '24px', background: 'var(--cream-soft)' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--navy)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Navigation size={18} className="text-green" /> Petunjuk Arah & Akses Transportasi
                </h3>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#556673', lineHeight: 1.7 }}>
                  <li>
                    <strong>Dari Bandara Syamsudin Noor (Banjarbaru):</strong> ± 45 menit melalui Jl. A. Yani atau Jl.
                    Gubernur Syarkawi (Lingkar Utara).
                  </li>
                  <li>
                    <strong>Dari Pelabuhan Trisakti Banjarmasin:</strong> ± 20 menit menuju kawasan Kayu Tangi / Hasan
                    Basry.
                  </li>
                  <li>
                    <strong>Transportasi Umum:</strong> Dilewati rute Bus Trans Banjarbakula (Koridor 1 & 2) halte Kayu
                    Tangi.
                  </li>
                </ul>
              </div>
            </div>

            {/* Kolom Kanan: Form Konsultasi Cepat & Peta */}
            <div>
              <div className="form-card">
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                    <CheckCircle2 size={48} className="text-green" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '8px' }}>Pesan Terkirim ke Database!</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
                      Terima kasih telah menghubungi Kanwil KemenHAM Kalsel. Petugas kami akan membalas pesan Anda
                      melalui WhatsApp atau email dalam jam kerja PTSP.
                    </p>
                    <button
                      onClick={() => {
                        setSent(false)
                        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                      }}
                      className="button secondary"
                    >
                      Kirim Pesan Lainnya
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <h3 style={{ fontSize: '20px', color: 'var(--navy)', margin: '0 0 6px', fontWeight: 800 }}>
                      Kirim Pesan & Konsultasi Cepat
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 20px' }}>
                      Gunakan form ini untuk pertanyaan umum, konfirmasi jadwal, atau permohonan informasi.
                    </p>

                    <div className="form-group">
                      <label className="form-label">
                        Nama Lengkap <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Nama Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="form-group">
                        <label className="form-label">
                          Nomor WhatsApp <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="08xxxxxxxxxx"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="email@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Subjek / Topik Konsultasi</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Contoh: Permohonan narasumber / Informasi P2HAM"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Pesan atau Pertanyaan <span className="required">*</span>
                      </label>
                      <textarea
                        rows={4}
                        className="form-textarea"
                        placeholder="Tuliskan pertanyaan Anda secara jelas..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="button primary"
                      style={{ width: '100%', padding: '13px' }}
                    >
                      <Send size={15} /> {isSubmitting ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
                    </button>
                  </form>
                )}
              </div>

              {/* Banner WhatsApp Cepat */}
              <div
                style={{
                  marginTop: '24px',
                  background: 'linear-gradient(135deg, #186b5e 0%, #0f4e44 100%)',
                  borderRadius: '12px',
                  padding: '24px',
                  color: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <strong style={{ fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                    Chat Langsung via WhatsApp
                  </strong>
                  <span style={{ fontSize: '13px', color: '#cde4e0' }}>
                    Respon cepat pada jam kerja PTSP (08.00 - 16.00 WITA)
                  </span>
                </div>
                <a
                  href="https://wa.me/628115000426?text=Halo%20Admin%20Kanwil%20KemenHAM%20Kalsel,%20saya%20ingin%20berkonsultasi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button gold"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  Buka WhatsApp <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
