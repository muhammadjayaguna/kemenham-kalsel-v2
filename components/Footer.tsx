import React from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldCheck,
  Building2,
  Clock,
  Globe,
  Lock,
} from 'lucide-react'

const logoSrc =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Kementerian_Hak_Asasi_Manusia_Republik_Indonesia_%282024%29_%28cropped%29-GIvJ19tibTKAvlhbhMO87XGKCaSlO7.png'

export default function Footer() {
  return (
    <footer className="footer" id="footer-section">
      <div className="container footer-grid">
        {/* Kolom 1: Profil & Identitas Institusi */}
        <div className="footer-brand-col">
          <Link href="/" className="brand footer-brand" aria-label="Kanwil KemenHAM Kalsel">
            <img
              src={logoSrc}
              alt="Logo Kementerian Hak Asasi Manusia RI"
              width={36}
              height={44}
            />
            <span>
              <strong>Kanwil KemenHAM</strong>
              <small>Kalimantan Selatan</small>
            </span>
          </Link>
          <p className="footer-desc">
            Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan adalah instansi
            vertikal yang bertugas menyelenggarakan urusan pemerintahan di bidang penghormatan,
            pelindungan, pemenuhan, penegakan, dan pemajuan Hak Asasi Manusia di wilayah Kalimantan Selatan.
          </p>
          <div className="footer-social-links" style={{ display: 'flex', gap: '10px', marginTop: '14px', marginBottom: '14px' }}>
            <a href="https://x.com/kemenhamkalsel" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Akun X (Twitter) Resmi">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://web.facebook.com/kemenhamkalsel" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Facebook Resmi">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/kemenhamkalsel/reels/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Instagram Resmi">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@kemenham.kalsel" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="TikTok Resmi">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.1v-3.6a6.37 6.37 0 0 0-1-.08C5.52 9.2 2 12.72 2 17.07 2 21.42 5.52 24 9.87 24s7.87-3.52 7.87-7.87V9.59a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.92-1.02z"/></svg>
            </a>
          </div>
          <div className="footer-meta-pill">
            <ShieldCheck size={16} className="text-gold" />
            <span>Zona Integritas & Bebas Biaya (Rp 0)</span>
          </div>
        </div>

        {/* Kolom 2: Navigasi Menu & Profil */}
        <div className="footer-nav-col">
          <h3>Profil & Pilar</h3>
          <ul className="footer-links">
            <li>
              <Link href="/profil">Profil & Visi Misi</Link>
            </li>
            <li>
              <Link href="/profil#struktur">Struktur Organisasi</Link>
            </li>
            <li>
              <Link href="/profil#wilayah-kerja">13 Wilayah Kerja Kalsel</Link>
            </li>
            <li>
              <Link href="/p5ham">Kerangka 5 Pilar P5HAM</Link>
            </li>
            <li>
              <Link href="/p5ham#isu-strategis">Isu Strategis HAM Kalsel</Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3: Layanan Publik & Aplikasi Terintegrasi */}
        <div className="footer-nav-col">
          <h3>Aplikasi & Sistem HAM</h3>
          <ul className="footer-links">
            <li>
              <a href="https://simasham.kemenham.go.id/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                SIMASHAM (Pengaduan) <ExternalLink size={12} className="text-gold" />
              </a>
            </li>
            <li>
              <a href="https://prisma.kemenham.go.id/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                PRISMA HAM (Korporasi) <ExternalLink size={12} className="text-gold" />
              </a>
            </li>
            <li>
              <a href="https://sipatuham.kemenham.go.id/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                SIPATUHAM (Kepatuhan) <ExternalLink size={12} className="text-gold" />
              </a>
            </li>
            <li>
              <a href="https://sapaham.kemenham.go.id/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                SAPAHAM (Edukasi & Aspirasi) <ExternalLink size={12} className="text-gold" />
              </a>
            </li>
            <li>
              <Link href="/pengaduan" className="text-gold font-bold">
                Pengaduan HAM Online →
              </Link>
            </li>
            <li>
              <Link href="/faq">Pusat Bantuan & FAQ</Link>
            </li>
          </ul>
        </div>

        {/* Kolom 4: Publikasi & Kontak Wilayah Kalsel */}
        <div className="footer-contact-col">
          <h3>Kontak & Kantor Wilayah</h3>
          <div className="footer-contact-list">
            <div className="footer-contact-item">
              <MapPin size={18} className="contact-icon" />
              <div>
                <strong>Alamat Kantor Wilayah:</strong>
                <span>Jl. Brigjen H. Hasan Basry No. 42, Kota Banjarmasin, Kalimantan Selatan 70123</span>
              </div>
            </div>

            <div className="footer-contact-item">
              <Phone size={18} className="contact-icon" />
              <div>
                <strong>Telepon / Layanan Pengaduan:</strong>
                <span>(0511) 3301234 / +62 811-5000-HAM</span>
              </div>
            </div>

            <div className="footer-contact-item">
              <Mail size={18} className="contact-icon" />
              <div>
                <strong>Email Resmi:</strong>
                <span>kanwil.kalsel@kemenham.go.id</span>
              </div>
            </div>

            <div className="footer-contact-item">
              <Clock size={18} className="contact-icon" />
              <div>
                <strong>Jam Pelayanan PTSP:</strong>
                <span>Senin - Jumat: 08.00 - 16.00 WITA</span>
              </div>
            </div>
          </div>

          <div className="footer-quick-action" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/kontak" className="button secondary-light">
              <span>Peta & Detail Kontak</span>
              <ArrowRight size={14} />
            </Link>
            <Link href="/admin/login" className="button secondary-light" style={{ padding: '8px 12px', fontSize: '11px', opacity: 0.85 }}>
              <Lock size={12} /> Portal Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Baris Bawah */}
      <div className="footer-bottom-wrap">
        <div className="container footer-bottom">
          <div className="footer-copyright">
            <span>
              © {new Date().getFullYear()} Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan.
            </span>
            <span className="footer-sub">Hak Cipta Dilindungi Undang-Undang Republik Indonesia.</span>
          </div>
          <div className="footer-legal-links">
            <Link href="/faq">FAQ</Link>
            <span>•</span>
            <Link href="/publikasi">Publikasi Resmi</Link>
            <span>•</span>
            <Link href="/admin/login">Login Admin</Link>
            <span>•</span>
            <span className="geo-tag-indicator">
              <Globe size={13} /> Wilayah ID-KS
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
