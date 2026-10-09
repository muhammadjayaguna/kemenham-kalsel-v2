'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  supabase,
  Pengaduan,
  PesanKontak,
  BeritaPublikasi,
  GaleriKegiatan,
  DEFAULT_INITIAL_NEWS,
} from '@/lib/supabase'
import RichTextEditor from '@/components/RichTextEditor'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Image as ImageIcon,
  ShieldAlert,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Eye,
  Trash2,
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  User,
  Globe,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Share2,
  Calendar,
  MapPin,
  Layers,
  Send,
  Save,
  Upload,
  Camera,
  AlertCircle,
  BarChart3,
  Newspaper,
  BookOpen,
  HelpCircle,
  Check,
  Smartphone,
  Monitor,
} from 'lucide-react'

const generateSlug = (text: string) => {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const applyKemenhamP5hamWatermark = (
  imageSrc: string,
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right'
): Promise<string> => {
  return new Promise((resolve) => {
    if (!imageSrc) return resolve(imageSrc)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageSrc

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(imageSrc)

        const w = img.naturalWidth || 1000
        const h = img.naturalHeight || 600
        canvas.width = w
        canvas.height = h

        // 1. Draw base image
        ctx.drawImage(img, 0, 0, w, h)

        // 2. Load Logo KemenHAM
        const logo = new Image()
        logo.crossOrigin = 'anonymous'
        logo.src =
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Kementerian_Hak_Asasi_Manusia_Republik_Indonesia_%282024%29_%28cropped%29-GIvJ19tibTKAvlhbhMO87XGKCaSlO7.png'

        const drawWatermarkOverlay = () => {
          const logoWidth = Math.max(44, Math.round(w * 0.085))
          const logoHeight =
            logo.naturalHeight && logo.naturalWidth
              ? Math.round(logoWidth * (logo.naturalHeight / logo.naturalWidth))
              : Math.round(logoWidth * 1.2)

          const margin = Math.max(14, Math.round(w * 0.02))
          const badgeTextWidth = Math.max(170, Math.round(w * 0.22))
          const badgeWidth = logoWidth + badgeTextWidth
          const badgeHeight = Math.max(logoHeight + 14, 54)

          let x = w - badgeWidth - margin
          let y = margin

          if (position === 'top-left') {
            x = margin
            y = margin
          } else if (position === 'bottom-right') {
            x = w - badgeWidth - margin
            y = h - badgeHeight - margin
          } else if (position === 'bottom-left') {
            x = margin
            y = h - badgeHeight - margin
          }

          // Glassmorphism Backdrop Pill
          ctx.save()
          ctx.fillStyle = 'rgba(18, 60, 105, 0.92)' // Deep Navy
          ctx.shadowColor = 'rgba(0,0,0,0.5)'
          ctx.shadowBlur = 10

          const rx = x
          const ry = y
          const rw = badgeWidth
          const rh = badgeHeight
          const radius = 10

          ctx.beginPath()
          ctx.moveTo(rx + radius, ry)
          ctx.lineTo(rx + rw - radius, ry)
          ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius)
          ctx.lineTo(rx + rw, ry + rh - radius)
          ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh)
          ctx.lineTo(rx + radius, ry + rh)
          ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius)
          ctx.lineTo(rx, ry + radius)
          ctx.quadraticCurveTo(rx, ry, rx + radius, ry)
          ctx.closePath()
          ctx.fill()

          // Golden Border Line
          ctx.strokeStyle = '#d4af37'
          ctx.lineWidth = Math.max(1.5, Math.round(w * 0.002))
          ctx.stroke()
          ctx.restore()

          // Draw Logo KemenHAM
          const logoX = x + 10
          const logoY = y + Math.round((badgeHeight - logoHeight) / 2)
          if (logo.complete && logo.naturalWidth > 0) {
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)
          }

          // Draw Text
          const textX = logoX + logoWidth + 10
          ctx.fillStyle = '#d4af37' // Royal Gold
          const fontSizeHead = Math.max(11, Math.round(w * 0.015))
          ctx.font = `bold ${fontSizeHead}px sans-serif`
          ctx.fillText('KANWIL KEMENHAM KALSEL', textX, y + Math.round(badgeHeight * 0.42))

          ctx.fillStyle = '#ffffff'
          const fontSizeSub = Math.max(9, Math.round(w * 0.012))
          ctx.font = `bold ${fontSizeSub}px sans-serif`
          ctx.fillText('P5HAM • KEMENTERIAN HAM RI', textX, y + Math.round(badgeHeight * 0.74))

          resolve(canvas.toDataURL('image/jpeg', 0.90))
        }

        if (logo.complete && logo.naturalWidth > 0) {
          drawWatermarkOverlay()
        } else {
          logo.onload = drawWatermarkOverlay
          logo.onerror = drawWatermarkOverlay
        }
      } catch (e) {
        resolve(imageSrc)
      }
    }

    img.onerror = () => {
      resolve(imageSrc)
    }
  })
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Navigation State
  // 'dashboard' | 'posts_all' | 'posts_new' | 'gallery_all' | 'gallery_new' | 'pengaduan' | 'pesan' | 'settings'
  const [currentView, setCurrentView] = useState<string>('posts_new')
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<{ [key: string]: boolean }>({
    posts: true,
    gallery: false,
  })

  // Data States (Connected to Supabase)
  const [complaints, setComplaints] = useState<Pengaduan[]>([])
  const [messages, setMessages] = useState<PesanKontak[]>([])
  const [news, setNews] = useState<BeritaPublikasi[]>([])
  const [galleries, setGalleries] = useState<GaleriKegiatan[]>([])

  // Editor State for "Tambah / Edit Pos Berita"
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null)
  const [postTitle, setPostTitle] = useState('')
  const [postCategory, setPostCategory] = useState('Siaran Pers')
  const [postAuthor, setPostAuthor] = useState('Humas Kanwil Kalsel')
  const [postImageUrl, setPostImageUrl] = useState('')
  const [postSummary, setPostSummary] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postTags, setPostTags] = useState('HAM, Kalsel, Pelayanan Publik')
  const [isPublishingPost, setIsPublishingPost] = useState(false)
  const [publishSuccessMsg, setPublishSuccessMsg] = useState('')

  // AI News Generator State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiPromptModalOpen, setAiPromptModalOpen] = useState(false)
  const [customAiTopic, setCustomAiTopic] = useState('')

  // Watermark State
  const [enableWatermark, setEnableWatermark] = useState(true)
  const [watermarkPos, setWatermarkPos] = useState<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('top-right')
  const [isWatermarking, setIsWatermarking] = useState(false)

  // AI News Article Generator Handler using Gemini
  const handleGenerateNewsWithAI = async (topicOverride?: string) => {
    const topicToUse = topicOverride || customAiTopic || postTitle || postContent || 'Pelaksanaan Layanan Pengaduan HAM dan Pengawasan P2HAM Kanwil KemenHAM Kalsel'
    if (!topicToUse.trim()) {
      alert('Mohon masukkan judul atau topik warta berita terlebih dahulu!')
      return
    }

    setIsGeneratingAI(true)
    try {
      const systemInstruction = `Anda adalah Redaktur Jurnalistik Senior Humas Kantor Wilayah Kementerian Hak Asasi Manusia (Kanwil KemenHAM) Kalimantan Selatan.
Tugas Anda: Membuat artikel berita resmi pemerintahan yang sangat profesional, lugas, akurat, dan kaya informasi berbasis topik/judul dari pengguna.

Pedoman Penulisan Berita Resmi:
1. Pimpinan tertinggi Kanwil KemenHAM Kalsel adalah Kepala Kantor Wilayah (Kakanwil) Karyadi, S.H., M.H.
2. Lingkup tugas: P5HAM (Penghormatan, Pelindungan, Pemenuhan, Penegakan, Pemajuan HAM), Pelayanan Publik Berbasis HAM (P2HAM), Pos Yankomas, Kabupaten/Kota Peduli HAM (KKHAM), Desa Sadar HAM, dan Harmonisasi Perda di 13 Kab/Kota se-Kalsel.
3. Struktur Artikel:
   - Paragraf Utama (Lead 5W+1H) di Kota Banjarmasin / Banjarbaru, Kalimantan Selatan.
   - Paragraf Pembahasan Substantif dengan kutipan pernyataan resmi Kakanwil Karyadi, S.H., M.H.
   - Paragraf Harapan, Komitmen Penegakan HAM, Zona Integritas (WBK/WBBM), dan Penutup.

FORMAT RESPON: Kembalikan dalam format JSON murni persis berikut (tanpa blok markdown diluar json):
{
  "judul": "Judul Berita Jurnalistik Resmi yang Menarik",
  "ringkasan": "Lead ringkasan 1-2 kalimat untuk meta description (maksimal 160 karakter)",
  "konten": "<p>Banjarmasin — Kanwil KemenHAM Kalsel...</p><h3>Fokus Penguatan Layanan HAM</h3><p>Isi berita...</p><blockquote>\"Pernyataan resmi Kakanwil Karyadi, S.H., M.H. mengenai komitmen P5HAM di Kalsel...\"</blockquote><p>Penutup berita...</p>"
}`

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Topik / Judul Berita: ${topicToUse}\nKategori: ${postCategory}\nPenulis: ${postAuthor}`,
          systemInstruction,
        }),
      })

      const data = await response.json()
      if (data.text) {
        try {
          const cleanJson = data.text.replace(/```json/g, '').replace(/```/g, '').trim()
          const parsed = JSON.parse(cleanJson)
          if (parsed.judul) setPostTitle(parsed.judul)
          if (parsed.ringkasan) setPostSummary(parsed.ringkasan)
          if (parsed.konten) setPostContent(parsed.konten)
        } catch {
          setPostContent(data.text)
          if (!postSummary) {
            setPostSummary(data.text.replace(/<[^>]*>/g, '').slice(0, 160) + '...')
          }
        }
        setPublishSuccessMsg('✨ Artikel Warta Berita berhasil digenerate otomatis oleh Google Gemini AI!')
        setTimeout(() => setPublishSuccessMsg(''), 6000)
      } else if (data.error) {
        alert('Respon AI: ' + data.error)
      }
    } catch (err: any) {
      alert('Gagal me-generate artikel AI: ' + err.message)
    } finally {
      setIsGeneratingAI(false)
      setAiPromptModalOpen(false)
    }
  }

  // File Upload & Watermark Handler
  const handleNewsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsWatermarking(true)
    const reader = new FileReader()
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string
      if (enableWatermark) {
        const watermarked = await applyKemenhamP5hamWatermark(rawDataUrl, watermarkPos)
        setPostImageUrl(watermarked)
      } else {
        setPostImageUrl(rawDataUrl)
      }
      setIsWatermarking(false)
    }
    reader.readAsDataURL(file)
  }

  const handleApplyWatermark = async (srcOverride?: string) => {
    const targetSrc = srcOverride || postImageUrl
    if (!targetSrc) {
      alert('Mohon upload foto atau pilih gambar terlebih dahulu!')
      return
    }
    setIsWatermarking(true)
    const watermarked = await applyKemenhamP5hamWatermark(targetSrc, watermarkPos)
    setPostImageUrl(watermarked)
    setIsWatermarking(false)
  }

  // Gallery Form State
  const [galleryTitle, setGalleryTitle] = useState('')
  const [galleryCategory, setGalleryCategory] = useState('Pengawasan P2HAM')
  const [galleryLocation, setGalleryLocation] = useState('Kota Banjarmasin, Kalimantan Selatan')
  const [galleryDate, setGalleryDate] = useState(
    new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  )
  const [galleryImageUrl, setGalleryImageUrl] = useState('')
  const [galleryDesc, setGalleryDesc] = useState('')
  const [isPublishingGallery, setIsPublishingGallery] = useState(false)

  // Pengaduan View States
  const [searchTicket, setSearchTicket] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedComplaint, setSelectedComplaint] = useState<Pengaduan | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [officerNotes, setOfficerNotes] = useState<string>('')
  const [isUpdatingComplaint, setIsUpdatingComplaint] = useState(false)

  // Check Authentication & Load Initial Data
  useEffect(() => {
    const initAuthAndData = async () => {
      setIsLoading(true)
      const { data } = await supabase.auth.getSession()
      const localSession =
        typeof window !== 'undefined' ? localStorage.getItem('kemenham_admin_session') : null

      if (data.session) {
        setCurrentUser(data.session.user)
      } else if (localSession) {
        try {
          setCurrentUser(JSON.parse(localSession))
        } catch {
          setCurrentUser({ email: 'admin@kemenhamkalsel.com' })
        }
      } else {
        router.push('/admin/login')
        return
      }

      await fetchAllData()
      setIsLoading(false)
    }

    initAuthAndData()
  }, [router])

  const fetchAllData = async () => {
    try {
      // 1. Fetch Pengaduan from Supabase
      const { data: cData, error: cErr } = await supabase
        .from('pengaduan')
        .select('*')
        .order('created_at', { ascending: false })

      if (!cErr && cData) {
        setComplaints(cData)
      }

      // 2. Fetch Messages from Supabase
      const { data: mData, error: mErr } = await supabase
        .from('pesan_kontak')
        .select('*')
        .order('created_at', { ascending: false })

      if (!mErr && mData) {
        setMessages(mData)
      }

      // 3. Fetch News from Supabase & Local Cache
      const { data: nData } = await supabase
        .from('berita_publikasi')
        .select('*')
        .order('published_at', { ascending: false })

      let mergedNews = nData && nData.length > 0 ? nData : []
      try {
        const cachedLocal = localStorage.getItem('kemenham_local_news')
        if (cachedLocal) {
          const parsed = JSON.parse(cachedLocal)
          if (parsed && parsed.length > 0) {
            mergedNews = [...parsed, ...mergedNews.filter((n: any) => !parsed.some((p: any) => p.id === n.id))]
          }
        }
      } catch (e) {
        console.log('Error reading local news cache:', e)
      }

      if (mergedNews.length === 0) {
        mergedNews = DEFAULT_INITIAL_NEWS
        try {
          localStorage.setItem('kemenham_local_news', JSON.stringify(DEFAULT_INITIAL_NEWS))
        } catch (e) {}
      }

      setNews(mergedNews)

      // 4. Fetch Galleries from Supabase
      const { data: gData, error: gErr } = await supabase
        .from('galeri_kegiatan')
        .select('*')
        .order('created_at', { ascending: false })

      if (!gErr && gData) {
        setGalleries(gData)
      }
    } catch (error) {
      console.log('Error fetching Supabase data:', error)
    }
  }

  // Handle Save / Publish News Post
  const handleSavePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!postTitle.trim()) {
      alert('Mohon masukkan Judul Berita!')
      return
    }

    setIsPublishingPost(true)
    setPublishSuccessMsg('')

    try {
      let finalImg = postImageUrl.trim()
      if (!finalImg) {
        finalImg = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'
      }

      // Watermark photo if enabled and not watermarked yet
      if (enableWatermark && !finalImg.startsWith('data:image')) {
        try {
          finalImg = await applyKemenhamP5hamWatermark(finalImg, watermarkPos)
        } catch (e) {
          console.log('Watermark applying info:', e)
        }
      }

      const summaryText =
        postSummary.trim() ||
        postContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) + '...'

      const newEntry = {
        judul: postTitle.trim(),
        kategori: postCategory,
        penulis: postAuthor.trim() || 'Humas Kanwil Kalsel',
        image_url: finalImg,
        ringkasan: summaryText,
        konten: postContent.trim() || `<p>${summaryText}</p>`,
        published_at: new Date().toISOString(),
      }

      let savedEntry: BeritaPublikasi = { ...newEntry, id: editingNewsId || `news-${Date.now()}` }

      if (editingNewsId) {
        // Edit existing post
        const { error } = await supabase
          .from('berita_publikasi')
          .update({
            judul: newEntry.judul,
            kategori: newEntry.kategori,
            penulis: newEntry.penulis,
            image_url: newEntry.image_url,
            ringkasan: newEntry.ringkasan,
            konten: newEntry.konten,
          })
          .eq('id', editingNewsId)

        if (error) {
          console.warn('Supabase update warning (cached locally):', error)
        }

        setNews((prev) =>
          prev.map((item) => (item.id === editingNewsId ? savedEntry : item))
        )
        setPublishSuccessMsg('Warta Berita berhasil diperbarui!')
      } else {
        // Insert new post into Supabase
        const { data, error } = await supabase.from('berita_publikasi').insert([newEntry]).select()

        if (!error && data && data.length > 0) {
          savedEntry = data[0]
        } else {
          console.warn('Supabase insert warning (cached locally):', error)
        }

        setNews((prev) => [savedEntry, ...prev])
        setPublishSuccessMsg('Warta Berita berhasil diterbitkan ke Portal Publik! (Dilengkapi Logo KemenHAM & Watermark P5HAM)')
      }

      // Persist locally so news is ALWAYS available
      try {
        const cachedLocal = localStorage.getItem('kemenham_local_news')
        const parsed = cachedLocal ? JSON.parse(cachedLocal) : []
        const updatedLocal = [savedEntry, ...parsed.filter((x: any) => x.id !== savedEntry.id)]
        localStorage.setItem('kemenham_local_news', JSON.stringify(updatedLocal))
      } catch (e) {
        console.log('Error caching to localStorage:', e)
      }

      setTimeout(() => {
        setPublishSuccessMsg('')
      }, 5000)
    } catch (err: any) {
      alert('Terjadi kesalahan saat menyimpan warta: ' + err.message)
    } finally {
      setIsPublishingPost(false)
    }
  }

  const handleEditNews = (item: BeritaPublikasi) => {
    setEditingNewsId(item.id || null)
    setPostTitle(item.judul)
    setPostCategory(item.kategori || 'Siaran Pers')
    setPostAuthor(item.penulis || 'Humas Kanwil Kalsel')
    setPostImageUrl(item.image_url || '')
    setPostSummary(item.ringkasan || '')
    setPostContent(item.konten || item.ringkasan || '')
    setCurrentView('posts_new')
  }

  const handleResetPostForm = () => {
    setEditingNewsId(null)
    setPostTitle('')
    setPostCategory('Siaran Pers')
    setPostAuthor('Humas Kanwil Kalsel')
    setPostImageUrl('')
    setPostSummary('')
    setPostContent('')
  }

  const handleDeleteNews = async (id?: string) => {
    if (!id || !confirm('Yakin ingin menghapus berita ini dari portal?')) return
    try {
      const { error } = await supabase.from('berita_publikasi').delete().eq('id', id)
      if (!error) {
        setNews(news.filter((n) => n.id !== id))
        alert('Berita berhasil dihapus!')
      } else {
        throw error
      }
    } catch (err: any) {
      alert('Gagal menghapus warta: ' + err.message)
    }
  }

  // Handle Save Gallery Item
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!galleryTitle.trim()) {
      alert('Mohon masukkan Judul Foto Dokumentasi!')
      return
    }

    setIsPublishingGallery(true)
    try {
      const defaultImg =
        galleryImageUrl.trim() ||
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'

      const newEntry = {
        judul: galleryTitle.trim(),
        kategori: galleryCategory,
        lokasi: galleryLocation.trim() || 'Kalimantan Selatan',
        tanggal: galleryDate.trim() || new Date().toLocaleDateString('id-ID'),
        image_url: defaultImg,
        deskripsi: galleryDesc.trim(),
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from('galeri_kegiatan').insert([newEntry]).select()

      if (!error && data && data.length > 0) {
        setGalleries([data[0], ...galleries])
        setGalleryTitle('')
        setGalleryImageUrl('')
        setGalleryDesc('')
        alert('Dokumentasi foto berhasil ditambahkan ke Galeri!')
        setCurrentView('gallery_all')
      } else {
        throw error
      }
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message)
    } finally {
      setIsPublishingGallery(false)
    }
  }

  const handleDeleteGallery = async (id?: string) => {
    if (!id || !confirm('Yakin ingin menghapus foto dokumentasi ini?')) return
    try {
      const { error } = await supabase.from('galeri_kegiatan').delete().eq('id', id)
      if (!error) {
        setGalleries(galleries.filter((g) => g.id !== id))
        alert('Foto berhasil dihapus!')
      } else {
        throw error
      }
    } catch (err: any) {
      alert('Gagal menghapus foto: ' + err.message)
    }
  }

  // Handle Update Pengaduan Status
  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return
    setIsUpdatingComplaint(true)

    try {
      const updated = {
        ...selectedComplaint,
        status: (newStatus || selectedComplaint.status) as any,
        catatan_petugas: officerNotes,
        updated_at: new Date().toISOString(),
      }

      if (selectedComplaint.id) {
        const { error } = await supabase
          .from('pengaduan')
          .update({
            status: updated.status,
            catatan_petugas: updated.catatan_petugas,
            updated_at: updated.updated_at,
          })
          .eq('id', selectedComplaint.id)

        if (error) throw error
      }

      setComplaints((prev) =>
        prev.map((c) => (c.nomor_tiket === selectedComplaint.nomor_tiket ? updated : c))
      )

      setSelectedComplaint(updated)
      alert(`Status Pengaduan ${updated.nomor_tiket} berhasil diubah menjadi: ${updated.status}`)
    } catch (err: any) {
      alert('Gagal memperbarui status: ' + err.message)
    } finally {
      setIsUpdatingComplaint(false)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('kemenham_admin_session')
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Generate URL slug from title
  const generateSlug = (text: string) => {
    return (
      text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        .slice(0, 50) || 'pos-baru'
    )
  }

  const filteredComplaints = complaints.filter((c) => {
    const matchTicket =
      c.nomor_tiket.toLowerCase().includes(searchTicket.toLowerCase()) ||
      c.nama_lengkap.toLowerCase().includes(searchTicket.toLowerCase()) ||
      c.kabupaten_kota.toLowerCase().includes(searchTicket.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchTicket && matchStatus
  })

  // Quick Preset Sample Images for One-Click Attachment
  const sampleFeaturedImages = [
    {
      title: 'Kantor Wilayah / Gedung Layanan',
      url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Rapat Koordinasi & Sinergi Lembaga',
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Bimtek & Sosialisasi Literasi HAM',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Pelayanan Publik & Ramah Disabilitas',
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f0f0f1' }}>
      {/* =========================================================================
          TOP WORDPRESS ADMIN BAR
          ========================================================================= */}
      <header
        style={{
          background: '#1d2327',
          color: '#f0f0f1',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontSize: '13px',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          borderBottom: '1px solid #2c3338',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
            className="md:hidden"
            style={{
              background: 'none',
              border: 'none',
              color: '#f0f0f1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
          >
            <Menu size={18} />
          </button>

          {/* WordPress / KemenHAM CMS Brand Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                background: 'var(--gold)',
                color: 'var(--navy)',
                fontWeight: 900,
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '3px',
                letterSpacing: '0.05em',
              }}
            >
              CMS
            </span>
            <strong style={{ color: '#ffffff', fontWeight: 600 }}>Kanwil KemenHAM Kalsel</strong>
          </div>

          {/* Quick link to live portal */}
          <Link
            href="/"
            target="_blank"
            style={{
              color: '#c3c4c7',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '12px',
              textDecoration: 'none',
              padding: '4px 8px',
              borderRadius: '3px',
              background: 'rgba(255,255,255,0.06)',
            }}
          >
            <Globe size={13} />
            <span className="hidden sm:inline">Kunjungi Website</span>
            <ExternalLink size={11} />
          </Link>

          {/* Quick + Baru Action */}
          <button
            onClick={() => {
              handleResetPostForm()
              setCurrentView('posts_new')
            }}
            style={{
              background: '#2271b1',
              color: '#ffffff',
              border: 'none',
              padding: '3px 10px',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <PlusCircle size={13} /> Pos Baru
          </button>

          {/* Quick AI Berita Generator Button */}
          <button
            onClick={() => {
              handleResetPostForm()
              setCurrentView('posts_new')
              setCustomAiTopic('')
              setAiPromptModalOpen(true)
            }}
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
              color: '#123c69',
              border: 'none',
              padding: '3px 10px',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(212,175,55,0.3)',
            }}
          >
            <Sparkles size={13} /> ✨ AI Berita
          </button>
        </div>

        {/* Right User Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#c3c4c7' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--blue)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 'bold',
                fontSize: '11px',
              }}
            >
              A
            </div>
            <span className="hidden md:inline">Halo, {currentUser?.email || 'admin@kemenhamkalsel.com'}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Keluar dari Admin"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#d63638',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              padding: '4px 8px',
            }}
          >
            <LogOut size={13} /> <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN CMS CONTAINER: SIDEBAR + CONTENT AREA
          ========================================================================= */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* =====================================================================
            LEFT WORDPRESS SIDEBAR
            ===================================================================== */}
        <aside
          style={{
            width: '230px',
            background: '#1d2327',
            color: '#c3c4c7',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid #2c3338',
            minHeight: 'calc(100vh - 46px)',
          }}
          className={`${sidebarOpenMobile ? 'fixed inset-y-0 left-0 z-50 pt-12' : 'hidden md:flex'}`}
        >
          <div>
            <div style={{ padding: '8px 0' }}>
              {/* Menu 1: Dashboard */}
              <button
                onClick={() => {
                  setCurrentView('dashboard')
                  setSidebarOpenMobile(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  color: currentView === 'dashboard' ? '#ffffff' : '#c3c4c7',
                  background: currentView === 'dashboard' ? '#2271b1' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: currentView === 'dashboard' ? 600 : 400,
                  cursor: 'pointer',
                  borderLeft: currentView === 'dashboard' ? '4px solid var(--gold)' : '4px solid transparent',
                }}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>

              {/* Menu 2: Pos / Berita */}
              <div>
                <button
                  onClick={() =>
                    setOpenSubmenu((prev) => ({ ...prev, posts: !prev.posts }))
                  }
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    color:
                      currentView.startsWith('posts') ? '#ffffff' : '#c3c4c7',
                    background:
                      currentView.startsWith('posts') ? '#2c3338' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderLeft: currentView.startsWith('posts')
                      ? '4px solid #2271b1'
                      : '4px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} />
                    <span>Warta Berita</span>
                  </div>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: openSubmenu.posts ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>

                {openSubmenu.posts && (
                  <div style={{ background: '#13181c', padding: '4px 0' }}>
                    <button
                      onClick={() => {
                        setCurrentView('posts_all')
                        setSidebarOpenMobile(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 16px 8px 42px',
                        color: currentView === 'posts_all' ? 'var(--gold)' : '#a7aaad',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: currentView === 'posts_all' ? 700 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Semua Warta</span>
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontSize: '10px',
                        }}
                      >
                        {news.length}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        handleResetPostForm()
                        setCurrentView('posts_new')
                        setSidebarOpenMobile(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 16px 8px 42px',
                        color: currentView === 'posts_new' ? 'var(--gold)' : '#a7aaad',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: currentView === 'posts_new' ? 700 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>✍️ Tambah Warta Baru</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Menu 3: Galeri Media */}
              <div>
                <button
                  onClick={() =>
                    setOpenSubmenu((prev) => ({ ...prev, gallery: !prev.gallery }))
                  }
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    color:
                      currentView.startsWith('gallery') ? '#ffffff' : '#c3c4c7',
                    background:
                      currentView.startsWith('gallery') ? '#2c3338' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderLeft: currentView.startsWith('gallery')
                      ? '4px solid #2271b1'
                      : '4px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ImageIcon size={16} />
                    <span>Galeri Media</span>
                  </div>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: openSubmenu.gallery ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>

                {openSubmenu.gallery && (
                  <div style={{ background: '#13181c', padding: '4px 0' }}>
                    <button
                      onClick={() => {
                        setCurrentView('gallery_all')
                        setSidebarOpenMobile(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 16px 8px 42px',
                        color: currentView === 'gallery_all' ? 'var(--gold)' : '#a7aaad',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: currentView === 'gallery_all' ? 700 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Semua Foto</span>
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontSize: '10px',
                        }}
                      >
                        {galleries.length}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('gallery_new')
                        setSidebarOpenMobile(false)
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 16px 8px 42px',
                        color: currentView === 'gallery_new' ? 'var(--gold)' : '#a7aaad',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: currentView === 'gallery_new' ? 700 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      <span>📸 Tambah Foto Baru</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Menu 4: Pengaduan Yankomas */}
              <button
                onClick={() => {
                  setCurrentView('pengaduan')
                  setSidebarOpenMobile(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  color: currentView === 'pengaduan' ? '#ffffff' : '#c3c4c7',
                  background: currentView === 'pengaduan' ? '#2271b1' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: currentView === 'pengaduan' ? 600 : 400,
                  cursor: 'pointer',
                  borderLeft: currentView === 'pengaduan' ? '4px solid var(--gold)' : '4px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldAlert size={16} />
                  <span>Pengaduan HAM</span>
                </div>
                <span
                  style={{
                    background: '#d63638',
                    color: '#ffffff',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {complaints.length}
                </span>
              </button>

              {/* Menu 5: Pesan Konsultasi */}
              <button
                onClick={() => {
                  setCurrentView('pesan')
                  setSidebarOpenMobile(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  color: currentView === 'pesan' ? '#ffffff' : '#c3c4c7',
                  background: currentView === 'pesan' ? '#2271b1' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: currentView === 'pesan' ? 600 : 400,
                  cursor: 'pointer',
                  borderLeft: currentView === 'pesan' ? '4px solid var(--gold)' : '4px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquare size={16} />
                  <span>Pesan Konsultasi</span>
                </div>
                <span
                  style={{
                    background: 'var(--blue)',
                    color: '#ffffff',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {messages.length}
                </span>
              </button>

              {/* Menu 6: Pengaturan & Supabase */}
              <button
                onClick={() => {
                  setCurrentView('settings')
                  setSidebarOpenMobile(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  color: currentView === 'settings' ? '#ffffff' : '#c3c4c7',
                  background: currentView === 'settings' ? '#2271b1' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: currentView === 'settings' ? 600 : 400,
                  cursor: 'pointer',
                  borderLeft: currentView === 'settings' ? '4px solid var(--gold)' : '4px solid transparent',
                }}
              >
                <Settings size={16} />
                <span>Pengaturan & SQL</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer Info */}
          <div style={{ padding: '16px', borderTop: '1px solid #2c3338', fontSize: '11px', color: '#8c8f94' }}>
            <div>Versi CMS: <strong>2.4.0-HAM</strong></div>
            <div style={{ color: 'var(--gold)', marginTop: '2px' }}>Database: Supabase Live</div>
          </div>
        </aside>

        {/* =====================================================================
            RIGHT MAIN WORKSPACE CONTENT
            ===================================================================== */}
        <main
          style={{
            flex: 1,
            padding: '24px 32px 60px',
            overflowY: 'auto',
            minHeight: 'calc(100vh - 46px)',
          }}
        >
          {/* ===================================================================
              VIEW 1: TAMBAH / EDIT POS BERITA (WORDPRESS GUTENBERG STYLE)
              =================================================================== */}
          {currentView === 'posts_new' && (
            <div>
              {/* Header Title & Top Actions Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: '22px',
                      fontWeight: 800,
                      color: '#1d2327',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {editingNewsId ? '✏️ Sunting Warta Berita' : '✍️ Tambah Warta Berita Baru'}
                  </h1>
                  <span style={{ fontSize: '13px', color: '#646970' }}>
                    Editor visual dengan AI Auto-Formatter & Pratinjau Google Snippet SEO.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomAiTopic(postTitle)
                      setAiPromptModalOpen(true)
                    }}
                    disabled={isGeneratingAI}
                    style={{
                      background: 'linear-gradient(135deg, #123c69 0%, #1e4b85 100%)',
                      color: '#d4af37',
                      border: '1px solid #d4af37',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(18,60,105,0.25)',
                    }}
                  >
                    <Sparkles size={16} className={isGeneratingAI ? 'animate-spin' : ''} />
                    {isGeneratingAI ? 'Gemini AI Menulis Berita...' : '✨ Generate Berita AI Gemini'}
                  </button>

                  <button
                    onClick={() => setCurrentView('posts_all')}
                    className="wp-tool-btn"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    Lihat Semua Warta
                  </button>

                  <button
                    onClick={() => handleSavePost()}
                    disabled={isPublishingPost}
                    style={{
                      background: '#2271b1',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Send size={14} />
                    {isPublishingPost ? 'Menerbitkan...' : editingNewsId ? 'Perbarui Warta' : 'Terbitkan Sekarang'}
                  </button>
                </div>
              </div>

              {/* PROMINENT AI NEWS GENERATOR BANNER CARD */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0f2c4d 0%, #123c69 50%, #1b4d82 100%)',
                  borderRadius: '10px',
                  padding: '20px 24px',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(18,60,105,0.2)',
                  border: '1px solid #d4af37',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
                  marginBottom: '20px',
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.2)', border: '1px solid #d4af37', color: '#fef3c7', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    <Sparkles size={13} color="#d4af37" /> Asisten Penulis Berita AI Google Gemini
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                    Generasi Berita Otomatis Dari Judul / Topik
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                    Ketik judul atau topik berita di kotak bawah, lalu klik tombol emas ini. AI Gemini akan menyusun artikel berita pemerintahan resmi secara otomatis lengkap dengan kutipan Kakanwil Karyadi, S.H., M.H.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!postTitle.trim()) {
                      setCustomAiTopic('')
                      setAiPromptModalOpen(true)
                    } else {
                      handleGenerateNewsWithAI(postTitle)
                    }
                  }}
                  disabled={isGeneratingAI}
                  style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #f59e0b 100%)',
                    color: '#123c69',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 900,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(212,175,55,0.4)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Sparkles size={18} className={isGeneratingAI ? 'animate-spin' : ''} />
                  {isGeneratingAI ? 'Gemini AI Menulis Berita...' : '✨ GENERATE BERITA DENGAN AI'}
                </button>
              </div>

              {/* Success Notification Alert */}
              {publishSuccessMsg && (
                <div
                  style={{
                    background: '#edfaef',
                    borderLeft: '4px solid #46b450',
                    padding: '12px 18px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    color: '#1e4620',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#46b450" />
                    <strong>{publishSuccessMsg}</strong>
                  </div>
                  <Link
                    href="/publikasi"
                    target="_blank"
                    style={{ color: '#2271b1', fontSize: '13px', textDecoration: 'underline' }}
                  >
                    Lihat di Portal Publik ↗
                  </Link>
                </div>
              )}

              {/* Main Grid: Left Editor & Right Meta Sidebar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) 320px',
                  gap: '24px',
                  alignItems: 'start',
                }}
                className="posts-layout-grid"
              >
                {/* LEFT: TITLE INPUT + PERMALINK + RICH TEXT EDITOR + SEO SERP BOX */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Title Box */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #c3c4c7',
                      borderRadius: '6px',
                      padding: '16px 20px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#646970', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Judul Utama / Topik Warta Berita
                      </span>
                      <button
                        type="button"
                        onClick={() => handleGenerateNewsWithAI()}
                        disabled={isGeneratingAI}
                        style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #f59e0b',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Sparkles size={12} className={isGeneratingAI ? 'animate-spin' : ''} />
                        {isGeneratingAI ? 'AI Menulis...' : '✨ Tulis Artikel Otomatis dari Judul'}
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Tambahkan judul warta berita di sini..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      style={{
                        width: '100%',
                        fontSize: '24px',
                        fontWeight: 700,
                        border: 'none',
                        outline: 'none',
                        color: '#1d2327',
                        fontFamily: 'inherit',
                      }}
                    />

                    {/* Permalink Slug Preview */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px solid #f0f0f1',
                        fontSize: '12px',
                        color: '#646970',
                      }}
                    >
                      <strong>Permalink:</strong>
                      <span style={{ color: '#2271b1' }}>
                        https://kalsel.kemenham.go.id/publikasi/
                        <span style={{ background: '#fff8e5', padding: '1px 4px', borderRadius: '3px' }}>
                          {generateSlug(postTitle)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Rich Text Editor with Visual Toolbar & AI Auto-Formatter */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #c3c4c7',
                      borderRadius: '6px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 700, color: '#1d2327' }}>
                        Isi Konten Artikel Lengkap
                      </label>
                      <span style={{ fontSize: '11px', color: '#646970' }}>
                        Gunakan tombol ✨ AI Format untuk merapikan teks ChatGPT/Claude instan
                      </span>
                    </div>

                    <RichTextEditor
                      value={postContent}
                      onChange={(newHtml) => setPostContent(newHtml)}
                      onAIPaste={(aiData) => {
                        if (aiData.title && !postTitle) {
                          setPostTitle(aiData.title)
                        }
                        if (aiData.summary) {
                          setPostSummary(aiData.summary)
                        }
                        setPostContent(aiData.content)
                      }}
                      placeholder="Tuliskan berita, atau klik tombol '✨ Format Teks AI' di toolbar atas untuk copy-paste artikel hasil prompt AI..."
                    />
                  </div>

                  {/* Ringkasan / Excerpt Box */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #c3c4c7',
                      borderRadius: '6px',
                      padding: '16px 20px',
                    }}
                  >
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#1d2327', display: 'block', marginBottom: '6px' }}>
                      Kutipan Ringkasan (Lead Paragraph / Snippet)
                    </label>
                    <textarea
                      rows={3}
                      value={postSummary}
                      onChange={(e) => setPostSummary(e.target.value)}
                      placeholder="Tulis ringkasan singkat 1-2 kalimat yang menarik untuk ditampilkan pada kartu warta dan meta description..."
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #8c8f94',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#646970', marginTop: '4px', display: 'block' }}>
                      Ringkasan ini akan otomatis digunakan Google sebagai Meta Deskripsi jika tidak ditentukan secara khusus.
                    </span>
                  </div>

                  {/* Google SERP SEO Preview Box */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #c3c4c7',
                      borderRadius: '6px',
                      padding: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Globe size={18} color="var(--blue)" />
                      <strong style={{ fontSize: '15px', color: '#1d2327' }}>
                        Pratinjau Hasil Pencarian Google (Google SERP Snippet)
                      </strong>
                    </div>

                    <div className="google-serp-preview">
                      <div className="serp-url-row">
                        <span className="serp-favicon">H</span>
                        <div>
                          <div className="serp-site-name">Kanwil KemenHAM Kalsel</div>
                          <div className="serp-url">
                            https://kalsel.kemenham.go.id › publikasi › {generateSlug(postTitle)}
                          </div>
                        </div>
                      </div>
                      <div className="serp-title">
                        {postTitle || 'Judul Warta Berita Kanwil KemenHAM Kalimantan Selatan'}
                      </div>
                      <div className="serp-desc">
                        {postSummary ||
                          'Kantor Wilayah Kementerian Hak Asasi Manusia Kalimantan Selatan menyelenggarakan pemajuan, penegakan standar pelayanan P2HAM, dan konsultasi hukum...'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: WORDPRESS META SIDEBAR (PUBLISH, CATEGORY, FEATURED IMAGE) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Meta Box 1: Terbitkan (Publish Box) */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #c3c4c7',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: '#f6f7f7',
                        padding: '10px 14px',
                        borderBottom: '1px solid #c3c4c7',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: '#1d2327',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Terbitkan</span>
                      <span
                        style={{
                          fontSize: '11px',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontWeight: 600,
                        }}
                      >
                        Publik
                      </span>
                    </div>

                    <div style={{ padding: '14px', fontSize: '12px', color: '#50575e', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Status:</span>
                        <strong style={{ color: '#1d2327' }}>Dipublikasikan Segera</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Visibilitas:</span>
                        <strong style={{ color: '#1d2327' }}>Publik (Semua Warga)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Tanggal:</span>
                        <strong style={{ color: '#1d2327' }}>
                          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </strong>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#f6f7f7',
                        padding: '10px 14px',
                        borderTop: '1px solid #c3c4c7',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {editingNewsId ? (
                        <button
                          onClick={() => handleResetPostForm()}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#d63638',
                            fontSize: '12px',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Batal Sunting
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#646970' }}>Siap Ditayangkan</span>
                      )}

                      <button
                        onClick={() => handleSavePost()}
                        disabled={isPublishingPost}
                        style={{
                          background: '#2271b1',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 16px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        {isPublishingPost ? 'Menyimpan...' : editingNewsId ? 'Perbarui' : 'Terbitkan'}
                      </button>
                    </div>
                  </div>

                  {/* Meta Box 2: Kategori Warta */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #c3c4c7',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: '#f6f7f7',
                        padding: '10px 14px',
                        borderBottom: '1px solid #c3c4c7',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: '#1d2327',
                      }}
                    >
                      Kategori Warta
                    </div>

                    <div style={{ padding: '14px' }}>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #8c8f94',
                          borderRadius: '4px',
                          fontSize: '13px',
                          background: '#fff',
                        }}
                      >
                        <option value="Siaran Pers">Siaran Pers Resmi</option>
                        <option value="Berita Daerah">Berita Daerah (13 Kab/Kota)</option>
                        <option value="Pengawasan P2HAM">Pengawasan P2HAM</option>
                        <option value="Edukasi & Sosialisasi">Edukasi & Sosialisasi HAM</option>
                        <option value="Harmonisasi Hukum">Harmonisasi Regulasi Daerah</option>
                        <option value="Agenda Kerja">Agenda Kerja Kanwil</option>
                      </select>
                    </div>
                  </div>

                  {/* Meta Box 3: Gambar Unggulan (Featured Image) & Watermark KemenHAM + P5HAM */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #c3c4c7',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: '#f6f7f7',
                        padding: '10px 14px',
                        borderBottom: '1px solid #c3c4c7',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: '#1d2327',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Gambar Unggulan (Featured Image)</span>
                      <span
                        style={{
                          fontSize: '10px',
                          background: 'var(--gold-light)',
                          color: 'var(--navy)',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontWeight: 700,
                        }}
                      >
                        Logo + P5HAM
                      </span>
                    </div>

                    <div style={{ padding: '14px' }}>
                      {/* Image Preview */}
                      <div
                        style={{
                          height: '160px',
                          background: '#f0f0f1',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          marginBottom: '12px',
                          border: '1px dashed #8c8f94',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        {isWatermarking ? (
                          <div style={{ textAlign: 'center', color: 'var(--blue)', fontSize: '13px', fontWeight: 600 }}>
                            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 6px' }} />
                            <span>Menempelkan Logo KemenHAM & P5HAM...</span>
                          </div>
                        ) : postImageUrl ? (
                          <img
                            src={postImageUrl}
                            alt="Featured Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ textAlign: 'center', color: '#8c8f94', fontSize: '12px' }}>
                            <ImageIcon size={28} style={{ margin: '0 auto 4px' }} />
                            <span>Belum ada gambar yang dipilih</span>
                          </div>
                        )}
                      </div>

                      {/* File Upload Button */}
                      <div style={{ marginBottom: '12px' }}>
                        <label
                          htmlFor="admin-news-file-input"
                          style={{
                            width: '100%',
                            background: '#123c69',
                            color: '#ffffff',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 6px rgba(18,60,105,0.2)',
                          }}
                        >
                          <Upload size={14} /> Upload Foto dari HP / Komputer
                        </label>
                        <input
                          id="admin-news-file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleNewsFileUpload}
                          style={{ display: 'none' }}
                        />
                      </div>

                      {/* Watermark Control Section */}
                      <div
                        style={{
                          background: '#fffdf5',
                          border: '1px solid #f0e6c2',
                          borderRadius: '5px',
                          padding: '10px 12px',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <input
                            type="checkbox"
                            id="chk-watermark"
                            checked={enableWatermark}
                            onChange={(e) => setEnableWatermark(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                          />
                          <label htmlFor="chk-watermark" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', cursor: 'pointer' }}>
                            Watermark Logo KemenHAM + P5HAM
                          </label>
                        </div>

                        {enableWatermark && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#646970' }}>
                              <span>Posisi Stamp:</span>
                              <select
                                value={watermarkPos}
                                onChange={(e: any) => setWatermarkPos(e.target.value)}
                                style={{ fontSize: '11px', padding: '2px 4px', borderRadius: '3px', border: '1px solid #c3c4c7' }}
                              >
                                <option value="top-right">Kanan Atas (Default)</option>
                                <option value="top-left">Kiri Atas</option>
                                <option value="bottom-right">Kanan Bawah</option>
                                <option value="bottom-left">Kiri Bawah</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleApplyWatermark()}
                              style={{
                                background: 'var(--gold)',
                                color: 'var(--navy)',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '3px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                marginTop: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                              }}
                            >
                              <Sparkles size={12} /> Tempel Watermark Sekarang
                            </button>
                          </div>
                        )}
                      </div>

                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#1d2327', display: 'block', marginBottom: '4px' }}>
                        Atau Gunakan URL Gambar External:
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... atau link foto"
                        value={postImageUrl}
                        onChange={(e) => setPostImageUrl(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          border: '1px solid #8c8f94',
                          borderRadius: '4px',
                          fontSize: '12px',
                          marginBottom: '10px',
                        }}
                      />

                      {/* Quick Sample Presets */}
                      <div style={{ marginTop: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#646970', display: 'block', marginBottom: '4px' }}>
                          Pilihan Cepat Foto Resmi:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {sampleFeaturedImages.map((sample, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={async () => {
                                if (enableWatermark) {
                                  handleApplyWatermark(sample.url)
                                } else {
                                  setPostImageUrl(sample.url)
                                }
                              }}
                              style={{
                                background: postImageUrl === sample.url ? '#e7f5ea' : '#f6f7f7',
                                border: postImageUrl === sample.url ? '1px solid #46b450' : '1px solid #dcdcde',
                                padding: '4px 8px',
                                borderRadius: '3px',
                                fontSize: '11px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                color: '#1d2327',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>{sample.title}</span>
                              {postImageUrl === sample.url && <Check size={12} color="#46b450" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Meta Box 4: Penulis & Tag */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #c3c4c7',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: '#f6f7f7',
                        padding: '10px 14px',
                        borderBottom: '1px solid #c3c4c7',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: '#1d2327',
                      }}
                    >
                      Penulis & Tag
                    </div>

                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#1d2327', display: 'block', marginBottom: '4px' }}>
                          Nama Penulis / Divisi:
                        </label>
                        <input
                          type="text"
                          value={postAuthor}
                          onChange={(e) => setPostAuthor(e.target.value)}
                          placeholder="Humas Kanwil Kalsel"
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            border: '1px solid #8c8f94',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#1d2327', display: 'block', marginBottom: '4px' }}>
                          Tagar / Kata Kunci (Pisahkan koma):
                        </label>
                        <input
                          type="text"
                          value={postTags}
                          onChange={(e) => setPostTags(e.target.value)}
                          placeholder="HAM, Kalsel, P2HAM, Pelayanan"
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            border: '1px solid #8c8f94',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW 2: SEMUA POS WARTA BERITA (WORDPRESS POSTS TABLE)
              =================================================================== */}
          {currentView === 'posts_all' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1d2327', margin: 0 }}>
                    Semua Warta Berita & Siaran Pers ({news.length})
                  </h1>
                  <span style={{ fontSize: '13px', color: '#646970' }}>
                    Kelola seluruh warta yang tayang di portal resmi Kanwil KemenHAM Kalsel.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      handleResetPostForm()
                      setCurrentView('posts_new')
                      setCustomAiTopic('')
                      setAiPromptModalOpen(true)
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #123c69 0%, #1e4b85 100%)',
                      color: '#d4af37',
                      border: '1px solid #d4af37',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(18,60,105,0.25)',
                    }}
                  >
                    <Sparkles size={15} /> ✨ Generate Berita AI Gemini
                  </button>

                  <button
                    onClick={() => {
                      handleResetPostForm()
                      setCurrentView('posts_new')
                    }}
                    style={{
                      background: '#2271b1',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <PlusCircle size={14} /> Tambah Pos Baru
                  </button>
                </div>
              </div>

              {/* Table Box */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #c3c4c7',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f6f7f7', borderBottom: '1px solid #c3c4c7', color: '#1d2327' }}>
                      <th style={{ padding: '12px 16px', width: '50px' }}>Foto</th>
                      <th style={{ padding: '12px 16px' }}>Judul Warta</th>
                      <th style={{ padding: '12px 16px' }}>Penulis</th>
                      <th style={{ padding: '12px 16px' }}>Kategori</th>
                      <th style={{ padding: '12px 16px' }}>Tanggal Publikasi</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.length > 0 ? (
                      news.map((item) => (
                        <tr key={item.id || item.judul} style={{ borderBottom: '1px solid #f0f0f1' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <img
                              src={item.image_url}
                              alt={item.judul}
                              style={{
                                width: '44px',
                                height: '36px',
                                borderRadius: '4px',
                                objectFit: 'cover',
                                display: 'block',
                              }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px', maxWidth: '380px' }}>
                            <strong style={{ color: '#1d2327', fontSize: '14px', display: 'block' }}>
                              {item.judul}
                            </strong>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '11px' }}>
                              <button
                                onClick={() => handleEditNews(item)}
                                style={{ color: '#2271b1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                Sunting
                              </button>
                              <span style={{ color: '#8c8f94' }}>|</span>
                              <button
                                onClick={() => handleDeleteNews(item.id)}
                                style={{ color: '#d63638', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              >
                                Hapus (Trash)
                              </button>
                              <span style={{ color: '#8c8f94' }}>|</span>
                              <Link
                                href={`/publikasi/${item.id || 'berita'}`}
                                target="_blank"
                                style={{ color: 'var(--blue)', textDecoration: 'none' }}
                              >
                                Lihat ↗
                              </Link>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#50575e' }}>{item.penulis}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className="gov-badge" style={{ fontSize: '10px' }}>
                              {item.kategori}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#50575e', fontSize: '12px' }}>
                            {new Date(item.published_at || Date.now()).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleEditNews(item)}
                              className="wp-tool-btn"
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                            >
                              Sunting
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#646970' }}>
                          Belum ada warta berita. Klik tombol <strong>+ Tambah Pos Baru</strong> di atas untuk membuat artikel pertama Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW 3: GALERI MEDIA (SEMUA FOTO)
              =================================================================== */}
          {currentView === 'gallery_all' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1d2327', margin: 0 }}>
                    Perpustakaan Galeri Media Kegiatan ({galleries.length})
                  </h1>
                  <span style={{ fontSize: '13px', color: '#646970' }}>
                    Dokumentasi foto kegiatan lapangan, koordinasi KKHAM, dan sosialisasi publik.
                  </span>
                </div>

                <button
                  onClick={() => setCurrentView('gallery_new')}
                  style={{
                    background: '#2271b1',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <PlusCircle size={14} /> Tambah Foto Baru
                </button>
              </div>

              {galleries.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {galleries.map((item) => (
                    <div
                      key={item.id || item.judul}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #c3c4c7',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ height: '150px', position: 'relative', background: '#0e2238' }}>
                        <img
                          src={item.image_url}
                          alt={item.judul}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          title="Hapus Foto"
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(214, 54, 56, 0.9)',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            cursor: 'pointer',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <span className="gov-badge" style={{ fontSize: '9px', marginBottom: '6px' }}>
                            {item.kategori}
                          </span>
                          <strong style={{ fontSize: '13px', display: 'block', color: '#1d2327', lineHeight: 1.3 }}>
                            {item.judul}
                          </strong>
                        </div>

                        <div style={{ marginTop: '10px', fontSize: '11px', color: '#646970' }}>
                          📍 {item.lokasi} • 📅 {item.tanggal}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #c3c4c7',
                    borderRadius: '6px',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#646970',
                  }}
                >
                  Belum ada foto dokumentasi di galeri. Klik <strong>+ Tambah Foto Baru</strong> untuk menambahkan dokumentasi kegiatan.
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              VIEW 4: TAMBAH FOTO GALERI BARU
              =================================================================== */}
          {currentView === 'gallery_new' && (
            <div style={{ maxWidth: '720px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1d2327', margin: '0 0 6px' }}>
                📸 Tambah Foto Dokumentasi Kegiatan
              </h1>
              <p style={{ fontSize: '13px', color: '#646970', margin: '0 0 20px' }}>
                Foto akan otomatis ditampilkan pada Galeri Dokumentasi publik dan Lightbox Viewer.
              </p>

              <form
                onSubmit={handleSaveGallery}
                style={{
                  background: '#ffffff',
                  border: '1px solid #c3c4c7',
                  borderRadius: '6px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1d2327', display: 'block', marginBottom: '6px' }}>
                    Judul Dokumentasi Kegiatan <span style={{ color: '#d63638' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    placeholder="Contoh: Audit Fasilitas Ramah Disabilitas di Banjarmasin"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#1d2327', display: 'block', marginBottom: '6px' }}>
                      Kategori Dokumentasi
                    </label>
                    <select
                      value={galleryCategory}
                      onChange={(e) => setGalleryCategory(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', background: '#fff' }}
                    >
                      <option value="Pengawasan P2HAM">Pengawasan P2HAM</option>
                      <option value="Koordinasi Daerah">Koordinasi Daerah</option>
                      <option value="Edukasi Publik">Edukasi Publik</option>
                      <option value="Layanan Yankomas">Layanan Yankomas</option>
                      <option value="Harmonisasi Regulasi">Harmonisasi Regulasi</option>
                      <option value="Peninjauan Lapangan">Peninjauan Lapangan</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#1d2327', display: 'block', marginBottom: '6px' }}>
                      Tanggal Pelaksanaan
                    </label>
                    <input
                      type="text"
                      value={galleryDate}
                      onChange={(e) => setGalleryDate(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1d2327', display: 'block', marginBottom: '6px' }}>
                    Lokasi Kegiatan
                  </label>
                  <input
                    type="text"
                    value={galleryLocation}
                    onChange={(e) => setGalleryLocation(e.target.value)}
                    placeholder="Kota Banjarmasin, Kalimantan Selatan"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1d2327', display: 'block', marginBottom: '6px' }}>
                    URL Foto Dokumentasi (High Resolution JPG/PNG) <span style={{ color: '#d63638' }}>*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={galleryImageUrl}
                    onChange={(e) => setGalleryImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau tautan penyimpanan foto"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1d2327', display: 'block', marginBottom: '6px' }}>
                    Keterangan / Deskripsi Foto
                  </label>
                  <textarea
                    rows={3}
                    value={galleryDesc}
                    onChange={(e) => setGalleryDesc(e.target.value)}
                    placeholder="Tuliskan ringkasan aktivitas kegiatan yang berlangsung..."
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="submit"
                    disabled={isPublishingGallery}
                    style={{
                      background: '#2271b1',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isPublishingGallery ? 'Menyimpan...' : 'Simpan Foto ke Galeri'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('gallery_all')}
                    className="wp-tool-btn"
                    style={{ padding: '10px 16px' }}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================================================================
              VIEW 5: MANAJEMEN PENGADUAN POS YANKOMAS
              =================================================================== */}
          {currentView === 'pengaduan' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1d2327', margin: 0 }}>
                  Manajemen & Telaah Pengaduan HAM (Pos Yankomas) ({complaints.length})
                </h1>
                <span style={{ fontSize: '13px', color: '#646970' }}>
                  Pantau, telaah dokumen permohonan, dan perbarui status tindak lanjut secara real-time.
                </span>
              </div>

              {/* Filter Controls */}
              <div
                style={{
                  background: '#ffffff',
                  padding: '14px 18px',
                  borderRadius: '6px',
                  border: '1px solid #c3c4c7',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                  <Search size={16} color="#646970" />
                  <input
                    type="text"
                    placeholder="Cari nomor tiket, nama pelapor, atau kabupaten..."
                    value={searchTicket}
                    onChange={(e) => setSearchTicket(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', border: '1px solid #8c8f94', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '7px 10px', border: '1px solid #8c8f94', borderRadius: '4px', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="all">Semua Status</option>
                    <option value="Dalam Penelaahan">Dalam Penelaahan</option>
                    <option value="Permintaan Klarifikasi">Permintaan Klarifikasi</option>
                    <option value="Dalam Proses Mediasi">Dalam Proses Mediasi</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>

                  <button onClick={fetchAllData} className="wp-tool-btn" style={{ padding: '7px 12px' }}>
                    <RefreshCw size={13} /> Refresh
                  </button>
                </div>
              </div>

              {/* Table */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #c3c4c7',
                  borderRadius: '6px',
                  overflowX: 'auto',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f6f7f7', borderBottom: '1px solid #c3c4c7', color: '#1d2327' }}>
                      <th style={{ padding: '12px 16px' }}>Nomor Tiket</th>
                      <th style={{ padding: '12px 16px' }}>Pelapor</th>
                      <th style={{ padding: '12px 16px' }}>Kab/Kota</th>
                      <th style={{ padding: '12px 16px' }}>Kategori Masalah</th>
                      <th style={{ padding: '12px 16px' }}>Status Terkini</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.length > 0 ? (
                      filteredComplaints.map((item) => (
                        <tr key={item.nomor_tiket} style={{ borderBottom: '1px solid #f0f0f1' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <strong style={{ color: 'var(--navy)' }}>{item.nomor_tiket}</strong>
                            <span style={{ display: 'block', fontSize: '11px', color: '#646970' }}>
                              {new Date(item.created_at || Date.now()).toLocaleDateString('id-ID')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <strong>{item.nama_lengkap}</strong>
                            <span style={{ display: 'block', fontSize: '12px', color: '#646970' }}>
                              {item.telepon}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>{item.kabupaten_kota}</td>
                          <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                            <span style={{ fontWeight: 600 }}>{item.kategori_masalah}</span>
                            <small style={{ color: '#646970', display: 'block' }}>Terlapor: {item.terlapor || '-'}</small>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '3px 9px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 700,
                                background:
                                  item.status === 'Selesai'
                                    ? 'var(--blue-light)'
                                    : item.status === 'Dalam Penelaahan'
                                    ? 'var(--gold-light)'
                                    : item.status === 'Ditolak'
                                    ? 'var(--red-soft)'
                                    : '#e0f2fe',
                                color:
                                  item.status === 'Selesai'
                                    ? 'var(--blue-dark)'
                                    : item.status === 'Dalam Penelaahan'
                                    ? 'var(--gold-dark)'
                                    : item.status === 'Ditolak'
                                    ? 'var(--red-accent)'
                                    : '#0369a1',
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <button
                              onClick={() => {
                                setSelectedComplaint(item)
                                setNewStatus(item.status)
                                setOfficerNotes(item.catatan_petugas || '')
                              }}
                              className="wp-tool-btn"
                              style={{ padding: '5px 10px', fontSize: '12px', background: '#2271b1', color: '#fff', border: 'none' }}
                            >
                              Telaah Kasus
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#646970' }}>
                          Tidak ada pengaduan yang cocok dengan kriteria pencarian / belum ada pengaduan masuk.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW 6: PESAN KONSULTASI MASUK
              =================================================================== */}
          {currentView === 'pesan' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1d2327', margin: 0 }}>
                  Kotak Masuk Konsultasi & Layanan Informasi ({messages.length})
                </h1>
                <span style={{ fontSize: '13px', color: '#646970' }}>
                  Pesan yang dikirimkan warga melalui formulir kontak dan permohonan informasi HAM.
                </span>
              </div>

              {messages.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {messages.map((m) => (
                    <div
                      key={m.id || m.telepon}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #c3c4c7',
                        borderRadius: '6px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span className="gov-badge" style={{ fontSize: '10px' }}>
                            {m.subjek || 'Konsultasi HAM'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#646970' }}>
                            {new Date(m.created_at || Date.now()).toLocaleDateString('id-ID')}
                          </span>
                        </div>

                        <strong style={{ fontSize: '15px', color: '#1d2327', display: 'block' }}>
                          {m.nama_lengkap}
                        </strong>
                        <div style={{ fontSize: '12px', color: '#646970', margin: '2px 0 10px' }}>
                          📞 {m.telepon} {m.email && `• ✉️ ${m.email}`}
                        </div>

                        <p
                          style={{
                            background: '#f6f7f7',
                            padding: '10px 12px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            color: '#2c3338',
                            margin: 0,
                            lineHeight: 1.5,
                          }}
                        >
                          "{m.pesan}"
                        </p>
                      </div>

                      <div style={{ marginTop: '16px' }}>
                        <a
                          href={`https://wa.me/${m.telepon.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(
                            m.nama_lengkap
                          )},%20kami%20dari%20Kanwil%20KemenHAM%20Kalsel%20menindaklanjuti%20pesan%20Anda.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'var(--blue)',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            textDecoration: 'none',
                          }}
                        >
                          Balas via WhatsApp ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #c3c4c7',
                    borderRadius: '6px',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#646970',
                  }}
                >
                  Belum ada pesan konsultasi masuk dari masyarakat.
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              VIEW 7: DASHBOARD SUMMARY KPI
              =================================================================== */}
          {currentView === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1d2327', margin: 0 }}>
                  Ringkasan Eksekutif & Statistik Operasional
                </h1>
                <span style={{ fontSize: '13px', color: '#646970' }}>
                  Pantau statistik pengaduan, penayangan warta berita, dan interaksi publik.
                </span>
              </div>

              {/* KPI Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '28px',
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #c3c4c7',
                    borderLeft: '4px solid var(--blue)',
                    padding: '18px',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#646970', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Pengaduan HAM
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>
                      {complaints.length}
                    </span>
                    <ShieldAlert size={26} color="var(--blue)" />
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #c3c4c7',
                    borderLeft: '4px solid var(--gold)',
                    padding: '18px',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#646970', textTransform: 'uppercase', fontWeight: 700 }}>
                    Dalam Penelaahan
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--gold-dark)' }}>
                      {complaints.filter((c) => c.status === 'Dalam Penelaahan').length}
                    </span>
                    <Clock size={26} color="var(--gold)" />
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #c3c4c7',
                    borderLeft: '4px solid #2271b1',
                    padding: '18px',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#646970', textTransform: 'uppercase', fontWeight: 700 }}>
                    Warta & Siaran Pers
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#2271b1' }}>
                      {news.length}
                    </span>
                    <FileText size={26} color="#2271b1" />
                  </div>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #c3c4c7',
                    borderLeft: '4px solid #8e44ad',
                    padding: '18px',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#646970', textTransform: 'uppercase', fontWeight: 700 }}>
                    Foto Galeri Kegiatan
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#8e44ad' }}>
                      {galleries.length}
                    </span>
                    <Camera size={26} color="#8e44ad" />
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #c3c4c7',
                  borderRadius: '6px',
                  padding: '24px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1d2327', margin: '0 0 16px' }}>
                  Aksi Cepat Administrator
                </h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      handleResetPostForm()
                      setCurrentView('posts_new')
                    }}
                    style={{
                      background: '#2271b1',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <PlusCircle size={15} /> Buat Warta Baru
                  </button>

                  <button
                    onClick={() => setCurrentView('gallery_new')}
                    style={{
                      background: 'var(--blue)',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Camera size={15} /> Upload Foto Galeri
                  </button>

                  <button
                    onClick={() => setCurrentView('pengaduan')}
                    className="wp-tool-btn"
                    style={{ padding: '10px 18px', fontSize: '13px' }}
                  >
                    Telaah Pengaduan HAM
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              VIEW 8: PENGATURAN & SUPABASE SQL
              =================================================================== */}
          {currentView === 'settings' && (
            <div style={{ maxWidth: '840px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1d2327', margin: '0 0 6px' }}>
                ⚙️ Status Konfigurasi Backend & Database Supabase
              </h1>
              <p style={{ fontSize: '13px', color: '#646970', margin: '0 0 20px' }}>
                Informasi endpoint Supabase dan kredensial administrasi Kantor Wilayah Kementerian HAM Kalsel.
              </p>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #c3c4c7',
                  borderRadius: '6px',
                  padding: '24px',
                  marginBottom: '20px',
                }}
              >
                <div className="info-table-box" style={{ marginBottom: '20px' }}>
                  <div className="info-table-row">
                    <div className="info-table-label">Status Koneksi Supabase</div>
                    <div className="info-table-value" style={{ color: 'var(--blue)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Online & Terhubung
                    </div>
                  </div>
                  <div className="info-table-row">
                    <div className="info-table-label">Project URL</div>
                    <div className="info-table-value">https://igzcaatgzpjywpoxgxob.supabase.co</div>
                  </div>
                  <div className="info-table-row">
                    <div className="info-table-label">Akun Administrator</div>
                    <div className="info-table-value">admin@kemenhamkalsel.com</div>
                  </div>
                  <div className="info-table-row">
                    <div className="info-table-label">Tabel Aktif</div>
                    <div className="info-table-value">
                      `pengaduan`, `pesan_kontak`, `berita_publikasi`, `galeri_kegiatan`
                    </div>
                  </div>
                </div>

                <a
                  href="https://supabase.com/dashboard/project/igzcaatgzpjywpoxgxob/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#2271b1',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                  }}
                >
                  Buka Supabase SQL Console <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODAL TELAAH PENGADUAN
          ========================================================================= */}
      {selectedComplaint && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #c3c4c7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#1d2327',
                color: '#ffffff',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <div>
                <span className="gov-badge" style={{ marginBottom: '4px' }}>
                  TELAAHAN POS YANKOMAS
                </span>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#ffffff' }}>
                  Detail Tiket: {selectedComplaint.nomor_tiket}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div className="info-table-box" style={{ marginBottom: '20px' }}>
                <div className="info-table-row">
                  <div className="info-table-label">Nama Pelapor</div>
                  <div className="info-table-value">{selectedComplaint.nama_lengkap}</div>
                </div>
                <div className="info-table-row">
                  <div className="info-table-label">Kontak & NIK</div>
                  <div className="info-table-value">
                    {selectedComplaint.telepon} • NIK: {selectedComplaint.nik || '-'}
                  </div>
                </div>
                <div className="info-table-row">
                  <div className="info-table-label">Wilayah Domisili</div>
                  <div className="info-table-value">{selectedComplaint.kabupaten_kota}</div>
                </div>
                <div className="info-table-row">
                  <div className="info-table-label">Pihak Terlapor</div>
                  <div className="info-table-value">{selectedComplaint.terlapor || 'Tidak disebutkan'}</div>
                </div>
                <div className="info-table-row">
                  <div className="info-table-label">Kategori Masalah</div>
                  <div className="info-table-value" style={{ color: 'var(--blue-dark)', fontWeight: 700 }}>
                    {selectedComplaint.kategori_masalah}
                  </div>
                </div>
                <div className="info-table-row">
                  <div className="info-table-label">Kronologi Kejadian</div>
                  <div className="info-table-value" style={{ lineHeight: 1.6, fontSize: '13px' }}>
                    {selectedComplaint.kronologi}
                  </div>
                </div>
              </div>

              {/* Form Update Status Petugas */}
              <div style={{ background: '#f6f7f7', border: '1px solid #c3c4c7', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#1d2327' }}>
                  Perbarui Status & Catatan Tindak Lanjut:
                </h4>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Ubah Status Pengaduan:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #8c8f94', borderRadius: '4px', background: '#fff' }}
                  >
                    <option value="Dalam Penelaahan">Dalam Penelaahan (Verifikasi berkas & telaahan)</option>
                    <option value="Permintaan Klarifikasi">Permintaan Klarifikasi (Surat ke instansi)</option>
                    <option value="Dalam Proses Mediasi">Dalam Proses Mediasi (Fasilitasi hak)</option>
                    <option value="Selesai">Selesai (Rekomendasi diterbitkan)</option>
                    <option value="Ditolak">Ditolak (Tidak memenuhi unsur)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Catatan Resmi Petugas Penelaah:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan catatan progres atau tindak lanjut..."
                    value={officerNotes}
                    onChange={(e) => setOfficerNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #8c8f94', borderRadius: '4px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="wp-tool-btn"
                    style={{ padding: '7px 14px' }}
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    disabled={isUpdatingComplaint}
                    onClick={handleUpdateStatus}
                    style={{
                      background: '#2271b1',
                      color: '#ffffff',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    {isUpdatingComplaint ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL AI GENERATOR BERITA OTOMATIS (GOOGLE GEMINI AI)
          ========================================================================= */}
      {aiPromptModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '620px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              border: '2px solid var(--gold)',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #123c69 0%, #1e4b85 100%)',
                color: '#ffffff',
                padding: '16px 20px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#d4af37" />
                <h3 style={{ margin: 0, fontSize: '16px', color: '#ffffff', fontWeight: 700 }}>
                  Generator Berita Otomatis AI Gemini
                </h3>
              </div>
              <button
                onClick={() => setAiPromptModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#50575e', margin: '0 0 14px', lineHeight: '1.5' }}>
                Masukkan judul atau deskripsi ide singkat berita yang ingin Anda tulis. AI Gemini akan menyusun <strong>Judul Resmi, Lead Ringkasan, dan Konten Artikel Berita Pemerintahan Lengkap (5W+1H)</strong> secara otomatis!
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1d2327', display: 'block', marginBottom: '6px' }}>
                  Ide / Judul / Garis Besar Berita:
                </label>
                <textarea
                  rows={4}
                  value={customAiTopic}
                  onChange={(e) => setCustomAiTopic(e.target.value)}
                  placeholder="Contoh: Kakanwil Karyadi pimpin rapat koordinasi pemenuhan P2HAM dan pembentukan Desa Sadar HAM di Kabupaten Barito Kuala..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #8c8f94',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#646970', display: 'block', marginBottom: '6px' }}>
                  Pilihan Cepat Topik Berita Resmi Kanwil Kalsel:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    'Kakanwil Karyadi Pimpin Rapat Koordinasi Pemenuhan P2HAM di Banjarbaru',
                    'Pendampingan & Pembentukan Desa Sadar HAM di Kabupaten Barito Kuala',
                    'Harmonisasi Peraturan Daerah Ramah HAM Bersama Pemprov & DPRD Kalsel',
                    'Penanganan Cepat Aduan Masyarakat via Pos Yankomas KemenHAM Kalsel',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomAiTopic(preset)}
                      style={{
                        background: customAiTopic === preset ? '#eef2ff' : '#f6f7f7',
                        border: customAiTopic === preset ? '1px solid #6366f1' : '1px solid #dcdcde',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: '#1d2327',
                        fontWeight: customAiTopic === preset ? 600 : 400,
                      }}
                    >
                      ✨ {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #eee', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setAiPromptModalOpen(false)}
                  className="wp-tool-btn"
                  style={{ padding: '8px 16px' }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isGeneratingAI}
                  onClick={() => handleGenerateNewsWithAI(customAiTopic)}
                  style={{
                    background: 'linear-gradient(135deg, #123c69 0%, #1e4b85 100%)',
                    color: '#d4af37',
                    border: '1px solid #d4af37',
                    padding: '8px 20px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(18,60,105,0.25)',
                  }}
                >
                  <Sparkles size={16} className={isGeneratingAI ? 'animate-spin' : ''} />
                  {isGeneratingAI ? 'Gemini AI Menyusun Berita...' : '🚀 Generate Berita Lengkap'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
