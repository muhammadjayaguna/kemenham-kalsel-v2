'use client'

import React from 'react'
import { Megaphone } from 'lucide-react'

interface MarqueeBarProps {
  items?: string[]
}

const defaultAnnouncements = [
  '📢 Layanan Pengaduan HAM Online Kanwil KemenHAM Kalsel tersedia 24/7 — Gratis dan Rahasia',
  '🏛️ Zona Integritas Menuju Wilayah Bebas dari Korupsi (WBK) — Kanwil KemenHAM Kalsel',
  '📋 Pendaftaran Kabupaten/Kota Peduli HAM (KKHAM) Tahun 2026 telah dibuka',
  '🤝 Sosialisasi Desa Sadar HAM di 13 Kabupaten/Kota se-Kalimantan Selatan',
]

export default function MarqueeBar({ items = defaultAnnouncements }: MarqueeBarProps) {
  // Double the items to create seamless loop
  const allItems = [...items, ...items]

  return (
    <div className="marquee-bar" role="marquee" aria-label="Pengumuman terbaru">
      <div className="marquee-label">
        <Megaphone size={14} />
        <span>INFO</span>
      </div>
      <div className="marquee-track">
        <div className="marquee-content">
          {allItems.map((text, idx) => (
            <span key={idx} className="marquee-item">
              {text}
              <span className="marquee-separator">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
