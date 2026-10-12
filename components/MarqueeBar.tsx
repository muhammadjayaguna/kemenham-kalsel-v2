'use client'

import React, { useState, useEffect } from 'react'
import { Megaphone } from 'lucide-react'
import { supabase, DEFAULT_MARQUEE_ITEMS, PengumumanMarquee } from '@/lib/supabase'

interface MarqueeBarProps {
  items?: string[]
}

export default function MarqueeBar({ items }: MarqueeBarProps) {
  const [announcements, setAnnouncements] = useState<string[]>(items || DEFAULT_MARQUEE_ITEMS)

  const loadAnnouncements = async () => {
    // 1. Coba baca dari localStorage sebagai cache instan
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('kemenham_marquee_items')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAnnouncements(parsed)
          }
        }
      } catch (err) {
        console.error('Error reading marquee cache:', err)
      }
    }

    // 2. Coba fetch dari Supabase jika tabel pengumuman_marquee sudah dibuat
    try {
      const { data, error } = await supabase
        .from('pengumuman_marquee')
        .select('teks, is_active, urutan')
        .eq('is_active', true)
        .order('urutan', { ascending: true })

      if (!error && data && data.length > 0) {
        const texts = data.map((item: any) => item.teks).filter(Boolean)
        if (texts.length > 0) {
          setAnnouncements(texts)
          if (typeof window !== 'undefined') {
            localStorage.setItem('kemenham_marquee_items', JSON.stringify(texts))
          }
        }
      }
    } catch (err) {
      // Graceful fallback to cached or default
    }
  }

  useEffect(() => {
    loadAnnouncements()

    const handleUpdated = () => {
      loadAnnouncements()
    }

    window.addEventListener('marquee-updated', handleUpdated)
    window.addEventListener('storage', handleUpdated)

    return () => {
      window.removeEventListener('marquee-updated', handleUpdated)
      window.removeEventListener('storage', handleUpdated)
    }
  }, [])

  // Gandakan array agar loop animasi CSS seamless dan tidak putus
  const allItems = announcements.length > 0 ? [...announcements, ...announcements] : []

  if (allItems.length === 0) return null

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
