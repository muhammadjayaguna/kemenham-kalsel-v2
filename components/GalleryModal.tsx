'use client'

import React, { useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin, X, ZoomIn } from 'lucide-react'

export interface GalleryItem {
  id: string
  title: string
  location: string
  date: string
  category: string
  imageUrl: string
  description?: string
}

interface GalleryModalProps {
  isOpen: boolean
  items: GalleryItem[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function GalleryModal({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onNext, onPrev])

  if (!isOpen || !items[currentIndex]) return null

  const current = items[currentIndex]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 24, 38, 0.92)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '900px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(14, 34, 56, 0.75)',
            border: 'none',
            color: '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            transition: 'background 0.2s',
          }}
          aria-label="Tutup preview"
        >
          <X size={18} />
        </button>

        {/* Gambar Preview */}
        <div
          style={{
            position: 'relative',
            background: '#0e2238',
            height: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={current.imageUrl}
            alt={current.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Tombol Navigasi Kiri */}
          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(14, 34, 56, 0.8)',
                color: '#ffffff',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Tombol Navigasi Kanan */}
          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(14, 34, 56, 0.8)',
                color: '#ffffff',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
              aria-label="Foto selanjutnya"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* Caption & Metadata */}
        <div style={{ padding: '24px 28px', background: '#ffffff' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <span
              style={{
                background: 'var(--blue-light)',
                color: 'var(--blue-dark)',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {current.category}
            </span>

            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Foto {currentIndex + 1} dari {items.length}
            </span>
          </div>

          <h3
            style={{
              fontSize: '18px',
              color: 'var(--navy)',
              margin: '0 0 8px',
              fontWeight: 800,
            }}
          >
            {current.title}
          </h3>

          {current.description && (
            <p
              style={{
                fontSize: '13px',
                color: '#556877',
                lineHeight: 1.6,
                margin: '0 0 14px',
              }}
            >
              {current.description}
            </p>
          )}

          <div
            style={{
              borderTop: '1px solid var(--line)',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: 'var(--muted)',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} className="text-green" /> {current.location}
            </span>
            <span>📅 {current.date}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
