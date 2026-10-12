'use client'

import React, { useState, useEffect } from 'react'

export default function MascotFloat() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Tampilkan maskot setelah scroll beberapa piksel
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setShowTooltip(false) // Sembunyikan tooltip jika kembali ke atas
      }
    }

    // Tampilkan tooltip secara berkala untuk menarik perhatian
    const tooltipInterval = setInterval(() => {
      if (window.scrollY > 300) {
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 5000)
      }
    }, 15000)

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
      clearInterval(tooltipInterval)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        pointerEvents: 'none', // Biarkan klik tembus kecuali pada elemen maskot itu sendiri
      }}
    >
      {/* Tooltip Dialog */}
      <div
        style={{
          background: '#ffffff',
          color: 'var(--navy)',
          padding: '12px 16px',
          borderRadius: '16px',
          borderBottomLeftRadius: '4px',
          boxShadow: '0 8px 24px rgba(18,60,105,0.15)',
          border: '2px solid var(--gold)',
          fontSize: '13px',
          fontWeight: 700,
          maxWidth: '200px',
          opacity: showTooltip ? 1 : 0,
          transform: showTooltip ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          pointerEvents: showTooltip ? 'auto' : 'none',
        }}
      >
        "Sahabat HAM, untuk Semua" <br />
        <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, display: 'block', marginTop: '4px' }}>
          Ada yang bisa saya bantu?
        </span>
      </div>

      {/* Maskot Image */}
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: '75px',
          height: '98px',
          position: 'relative',
          cursor: 'pointer',
          pointerEvents: 'auto',
          animation: 'bounce-slow 3s infinite ease-in-out',
          filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))',
        }}
        title="Maskot KemenHAM Kalsel"
      >
        {/* Pastikan gambar maskot.png sudah ada di folder public */}
        <img
          src="/bergerak.gif"
          alt="Maskot KemenHAM Kanwil Kalsel"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom',
          }}
          onError={(e) => {
            // Fallback sementara jika gambar belum diupload
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}} />
      </div>
    </div>
  )
}
