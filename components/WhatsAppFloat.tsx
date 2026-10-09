'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

const WHATSAPP_NUMBER = '6281150000426'
const DEFAULT_MESSAGE = 'Halo SIPeHAM, saya ingin bertanya mengenai layanan Kanwil Kemenkumham Kalsel.'

export default function WhatsAppFloat() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-hide tooltip after 10 seconds to not block content permanently,
  // but it can be toggled by hovering if we wanted. For now, let's keep it visible until closed.
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <div 
      className="fixed z-50"
      style={{ bottom: '0px', right: '0px', width: '220px', height: '220px', pointerEvents: 'none' }}
    >
      {/* Chat Bubble (Tooltip) */}
      <div 
        className={`absolute transition-all duration-500 ease-out origin-bottom-right
          ${isTooltipVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'}`}
        style={{ pointerEvents: 'auto', bottom: '100%', right: '30px', marginBottom: '10px', zIndex: 51 }}
      >
        <div className="bg-white rounded-2xl rounded-br-sm shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-5 w-[260px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-green-500"></div>
          
          <button
            onClick={() => setIsTooltipVisible(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-1 transition-colors"
            aria-label="Tutup pesan"
          >
            <X size={14} />
          </button>
          
          <div className="flex items-start gap-3 mb-3 mt-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
              <MessageCircle size={16} fill="currentColor" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-gray-800 leading-tight">Halo, Saya SIPeHAM! 👋</h4>
              <p className="text-[13px] text-gray-500 mt-0.5">Asisten Virtual Kemenkumham</p>
            </div>
          </div>
          
          <p className="text-[13.5px] text-gray-600 leading-relaxed mb-4">
            Ada yang bisa saya bantu terkait layanan Yankomas atau P2HAM?
          </p>
          
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-2.5 px-4 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Mulai Chat WA <Send size={14} />
          </a>
        </div>
      </div>

      {/* Mascot Image as the trigger */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block absolute w-full h-full transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ pointerEvents: 'auto', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transformOrigin: 'bottom right' }}
        onClick={(e) => {
          if (!isTooltipVisible) {
             e.preventDefault();
             setIsTooltipVisible(true);
          }
        }}
      >
        {/* We use an absolute image larger than the container to crop out transparent padding natively */}
        <img
          src="/Desain tanpa judul-Photoroom.png"
          alt="Maskot SIPeHAM Kemenkumham"
          className="absolute drop-shadow-[0_10px_15px_rgba(11,26,44,0.25)]"
          style={{ 
            width: '400px',
            maxWidth: 'none',
            bottom: '-25px', 
            right: '-25px',
            objectFit: 'contain'
          }}
        />
      </a>
    </div>
  )
}
