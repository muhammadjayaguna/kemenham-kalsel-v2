'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react'

const logoSrc =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Kementerian_Hak_Asasi_Manusia_Republik_Indonesia_%282024%29_%28cropped%29-GIvJ19tibTKAvlhbhMO87XGKCaSlO7.png'

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil', href: '/profil' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'P5HAM', href: '/p5ham' },
  { label: 'Publikasi', href: '/publikasi' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kontak', href: '/kontak' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>

      {/* Top Banner */}
      <div className="topline">
        <div className="container top-inner">
          <div className="top-brand-info">
            <span className="gov-badge">REPUBLIK INDONESIA</span>
            <span>Portal Resmi Kantor Wilayah Kementerian Hak Asasi Manusia</span>
          </div>
          <div className="top-actions">
            <span className="top-location">
              <MapPin size={14} className="text-gold" /> Wilayah Kerja Kalimantan Selatan
            </span>
            <span className="top-divider">•</span>
            <Link href="/pengaduan" className="top-hotline">
              <Phone size={13} /> Layanan Pengaduan 24/7
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <div className="container nav-wrap">
          <Link href="/" className="brand" aria-label="Kanwil KemenHAM Kalimantan Selatan - Beranda">
            <img
              src={logoSrc}
              alt="Logo Kementerian Hak Asasi Manusia Republik Indonesia"
              width={40}
              height={48}
              loading="eager"
            />
            <span>
              <strong>Kanwil KemenHAM</strong>
              <small>Kalimantan Selatan</small>
            </span>
          </Link>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav
            className={`main-nav ${menuOpen ? 'open' : ''}`}
            aria-label="Navigasi Utama Portal"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}

            <Link href="/pengaduan" className="nav-cta">
              <ShieldCheck size={16} />
              <span>Pengaduan HAM</span>
              <ArrowRight size={14} />
            </Link>
          </nav>
        </div>
      </header>
    </>
  )
}
