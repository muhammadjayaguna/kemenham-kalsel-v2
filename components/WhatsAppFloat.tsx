'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, X, Send } from 'lucide-react'

const WHATSAPP_NUMBER = '6281150000426'
const DEFAULT_MESSAGE = 'Halo SIPeHAM, saya ingin bertanya mengenai layanan Kanwil Kemenkumham Kalsel.'

export default function WhatsAppFloat() {
  const pathname = usePathname()
  const [isTooltipVisible, setIsTooltipVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Jangan tampilkan maskot dan balon text saat di dashboard admin
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <div 
      className="fixed z-50 select-none pointer-events-none"
      style={{ bottom: '12px', right: '18px' }}
    >
      <div className="relative flex flex-col items-end">
        {/* Balon Kata / Speech Bubble */}
        <div 
          className={`transition-all duration-300 ease-out origin-bottom-right mb-4
            ${isTooltipVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95 pointer-events-none'}`}
          style={{ pointerEvents: isTooltipVisible ? 'auto' : 'none', zIndex: 51 }}
        >
          <div className="relative bg-white rounded-2xl shadow-[0_12px_36px_rgba(18,60,105,0.18),0_4px_12px_rgba(0,0,0,0.06)] border border-slate-100 p-4 w-[265px]">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

            {/* Close button */}
            <button
              onClick={() => setIsTooltipVisible(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors"
              aria-label="Tutup pesan"
            >
              <X size={13} />
            </button>
            
            {/* Header / Avatar info */}
            <div className="flex items-center gap-2.5 mb-2.5 mt-0.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm">
                <MessageCircle size={15} fill="currentColor" />
              </div>
              <div className="pr-4">
                <h4 className="text-[14px] font-bold text-slate-800 leading-tight">
                  Halo, Saya SIPeHAM! 👋
                </h4>
                <p className="text-[11.5px] font-medium text-slate-500">Asisten Virtual Kemenkumham</p>
              </div>
            </div>
            
            {/* Message Bubble Body */}
            <div className="bg-slate-50/80 rounded-xl p-2.5 mb-3 border border-slate-100/80">
              <p className="text-[12.5px] text-slate-600 leading-relaxed">
                Ada yang bisa saya bantu terkait layanan <span className="font-semibold text-slate-800">Yankomas</span> atau <span className="font-semibold text-slate-800">P2HAM</span>?
              </p>
            </div>
            
            {/* Action CTA Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#25D366] to-[#1ebd5a] hover:from-[#20bd5a] hover:to-[#17a34e] text-white py-2 px-3.5 rounded-xl text-[13px] font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Mulai Chat WA <Send size={13} />
            </a>

            {/* Ekor Balon Teks (Speech Bubble Tail) yang menunjuk ke maskot */}
            <div 
              className="absolute -bottom-2 right-14 w-4 h-4 bg-white border-r border-b border-slate-100 transform rotate-45 shadow-[2px_2px_4px_rgba(0,0,0,0.03)]"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Maskot Karakter */}
        <div 
          className="relative flex justify-end"
          style={{ width: '130px', height: '142px' }}
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
              transform: isHovered ? 'scale(1.06)' : 'scale(1)', 
              transformOrigin: 'bottom center' 
            }}
            onClick={(e) => {
              if (!isTooltipVisible) {
                e.preventDefault()
                setIsTooltipVisible(true)
              }
            }}
            title="Klik untuk membuka chat WhatsApp SIPeHAM"
          >
            <picture>
              <source srcSet="/bergerak.webp" type="image/webp" />
              <img
                src="/bergerak.gif"
                alt="Maskot SIPeHAM Kemenkumham"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_10px_16px_rgba(18,60,105,0.22)]"
              />
            </picture>
          </a>
        </div>
      </div>
    </div>
  )
}

