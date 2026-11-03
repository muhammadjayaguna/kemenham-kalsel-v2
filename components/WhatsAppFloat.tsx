'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, X, Send } from 'lucide-react'

const WHATSAPP_NUMBER = '6281150000426'
const DEFAULT_MESSAGE = 'Halo SIPeHAM, saya ingin bertanya mengenai layanan Kanwil Kemenkumham Kalsel.'

export default function WhatsAppFloat() {
  const pathname = usePathname()
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Buka otomatis hanya di desktop (lebar layar >= 768px) setelah 2 detik
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      const timer = setTimeout(() => setIsTooltipVisible(true), 1800)
      return () => clearTimeout(timer)
    }
  }, [])

  // Jangan tampilkan maskot dan balon text saat di dashboard admin
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <div 
      className="fixed z-50 select-none pointer-events-none bottom-2 right-2 sm:bottom-4 sm:right-5"
    >
      <div className="relative flex flex-col items-end">
        {/* Balon Kata / Speech Bubble */}
        <div 
          className={`transition-all duration-300 ease-out origin-bottom-right mb-1.5 sm:mb-3
            ${isTooltipVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95 pointer-events-none'}`}
          style={{ pointerEvents: isTooltipVisible ? 'auto' : 'none', zIndex: 51 }}
        >
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_24px_rgba(18,60,105,0.15)] border border-slate-100 p-2.5 sm:p-4 w-[210px] sm:w-[260px]">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

            {/* Close button */}
            <button
              onClick={() => setIsTooltipVisible(false)}
              className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors"
              aria-label="Tutup pesan"
            >
              <X size={12} />
            </button>
            
            {/* Header / Avatar info */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 mt-0.5">
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm">
                <MessageCircle size={11} fill="currentColor" />
              </div>
              <div className="pr-3">
                <h4 className="text-[11.5px] sm:text-[13px] font-bold text-slate-800 leading-tight">
                  SIPeHAM Online 👋
                </h4>
                <p className="text-[9.5px] sm:text-[11px] font-medium text-slate-500">Asisten KemenHAM</p>
              </div>
            </div>
            
            {/* Message Bubble Body */}
            <div className="bg-slate-50/90 rounded-lg p-1.5 sm:p-2 mb-2 border border-slate-100/80">
              <p className="text-[10px] sm:text-[12px] text-slate-600 leading-relaxed">
                Butuh bantuan <span className="font-semibold text-slate-800">Yankomas</span> atau <span className="font-semibold text-slate-800">P2HAM</span>?
              </p>
            </div>
            
            {/* Action CTA Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-[#25D366] to-[#1ebd5a] hover:from-[#20bd5a] hover:to-[#17a34e] text-white py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg text-[10.5px] sm:text-[12px] font-bold transition-all shadow-sm"
            >
              Chat WhatsApp <Send size={11} />
            </a>

            {/* Ekor Balon Teks (Speech Bubble Tail) yang menunjuk ke maskot */}
            <div 
              className="absolute -bottom-1.5 right-6 sm:right-10 w-3 h-3 bg-white border-r border-b border-slate-100 transform rotate-45 shadow-[2px_2px_4px_rgba(0,0,0,0.03)]"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Maskot Karakter: Ringkas dan Mini di Layar HP */}
        <div 
          className="relative flex justify-end w-[56px] h-[64px] sm:w-[110px] sm:h-[122px]"
        >
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full cursor-pointer transition-transform duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
              pointerEvents: 'auto', 
              transform: isHovered ? 'scale(1.08)' : 'scale(1)', 
              transformOrigin: 'bottom center' 
            }}
            onClick={(e) => {
              // Jika di mobile, klik pertama membuka WhatsApp langsung jika tooltip tertutup
              // Atau klik tombol untuk buka chat
            }}
            title="Klik untuk membuka chat WhatsApp SIPeHAM"
          >
            <picture>
              <source srcSet="/bergerak.webp" type="image/webp" />
              <img
                src="/bergerak.gif"
                alt="Maskot SIPeHAM Kemenkumham"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_6px_12px_rgba(18,60,105,0.2)]"
              />
            </picture>
          </a>
        </div>
      </div>
    </div>
  )
}

