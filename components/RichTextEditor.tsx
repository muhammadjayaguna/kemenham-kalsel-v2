'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Code,
  Eye,
  Edit3,
  RotateCcw,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Copy,
  Info,
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (htmlContent: string) => void
  onAIPaste?: (data: { title?: string; summary?: string; content: string }) => void
  placeholder?: string
}

export default function RichTextEditor({
  value,
  onChange,
  onAIPaste,
  placeholder = 'Tuliskan isi artikel lengkap di sini...',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorMode, setEditorMode] = useState<'visual' | 'code' | 'preview'>('visual')
  const [htmlCode, setHtmlCode] = useState(value || '')
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [aiRawText, setAiRawText] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState('1 menit')

  // Sync value to editor on mount and mode changes
  useEffect(() => {
    if (editorRef.current && editorMode === 'visual') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || ''
      }
    }
    setHtmlCode(value || '')
    calculateWordCount(value || '')
  }, [value, editorMode])

  const calculateWordCount = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const words = plainText ? plainText.split(' ').length : 0
    setWordCount(words)
    const minutes = Math.max(1, Math.ceil(words / 180))
    setReadingTime(`${minutes} menit`)
  }

  const handleVisualInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      setHtmlCode(content)
      onChange(content)
      calculateWordCount(content)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setHtmlCode(newCode)
    onChange(newCode)
    calculateWordCount(newCode)
  }

  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (editorMode !== 'visual') {
      setEditorMode('visual')
    }
    setTimeout(() => {
      document.execCommand(command, false, value)
      handleVisualInput()
      editorRef.current?.focus()
    }, 50)
  }

  const insertHtmlAtCursor = (html: string) => {
    if (editorMode !== 'visual') {
      setEditorMode('visual')
    }
    setTimeout(() => {
      editorRef.current?.focus()
      const sel = window.getSelection()
      if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0)
        range.deleteContents()
        const el = document.createElement('div')
        el.innerHTML = html
        const frag = document.createDocumentFragment()
        let node
        let lastNode
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node)
        }
        range.insertNode(frag)
        if (lastNode) {
          range.setStartAfter(lastNode)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      } else {
        if (editorRef.current) {
          editorRef.current.innerHTML += html
        }
      }
      handleVisualInput()
    }, 50)
  }

  // Insert Custom Elements
  const handleInsertLink = () => {
    const url = prompt('Masukkan URL tautan (contoh: https://kemenham.go.id):')
    if (url) {
      execCmd('createLink', url)
    }
  }

  const handleInsertImage = () => {
    const url = prompt('Masukkan URL Gambar/Foto (JPG/PNG):')
    if (url) {
      const caption = prompt('Masukkan Keterangan Gambar (Caption opsional):') || ''
      const imageHtml = `
        <figure class="article-image-box" style="margin: 20px 0; text-align: center;">
          <img src="${url}" alt="${caption}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" />
          ${caption ? `<figcaption style="font-size: 12px; color: #647486; margin-top: 6px; font-style: italic;">📷 ${caption}</figcaption>` : ''}
        </figure>
      `
      insertHtmlAtCursor(imageHtml)
    }
  }

  const handleInsertTable = () => {
    const tableHtml = `
      <div class="table-responsive" style="margin: 24px 0; overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2eaed; font-size: 14px;">
          <thead>
            <tr style="background: #0e2238; color: #ffffff;">
              <th style="padding: 10px 14px; border: 1px solid #e2eaed; text-align: left;">Indikator / Program</th>
              <th style="padding: 10px 14px; border: 1px solid #e2eaed; text-align: left;">Lokasi Wilayah Kalsel</th>
              <th style="padding: 10px 14px; border: 1px solid #e2eaed; text-align: left;">Status Capaian</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2eaed;">
              <td style="padding: 10px 14px; border: 1px solid #e2eaed;">Standar Pelayanan Publik Ramah Disabilitas</td>
              <td style="padding: 10px 14px; border: 1px solid #e2eaed;">Kota Banjarmasin & Banjarbaru</td>
              <td style="padding: 10px 14px; border: 1px solid #e2eaed; color: #186b5e; font-weight: bold;">Terpenuhi 100%</td>
            </tr>
            <tr style="background: #f8faf9;">
              <td style="padding: 10px 14px; border: 1px solid #e2eaed;">Pembinaan Desa / Kelurahan Sadar HAM</td>
              <td style="padding: 10px 14px; border: 1px solid #e2eaed;">Kabupaten Banjar & Barito Kuala</td>
              <td style="padding: 10px 14px; border: 1px solid #e2eaed; color: #186b5e; font-weight: bold;">Dalam Pembinaan</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
    insertHtmlAtCursor(tableHtml)
  }

  const handleInsertCallout = (type: 'info' | 'success' | 'warning') => {
    const bg = type === 'info' ? '#edf3f8' : type === 'success' ? '#e6f4f1' : '#fef5dd'
    const border = type === 'info' ? '#2980b9' : type === 'success' ? '#186b5e' : '#dfa836'
    const title = type === 'info' ? 'Catatan Penting:' : type === 'success' ? 'Informasi Resmi:' : 'Perhatian:'

    const calloutHtml = `
      <div class="article-callout" style="background: ${bg}; border-left: 4px solid ${border}; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
        <strong style="display: block; color: #0e2238; font-size: 14px; margin-bottom: 4px;">📌 ${title}</strong>
        <p style="margin: 0; font-size: 13px; color: #415260; line-height: 1.6;">Tuliskan poin informasi penting atau sorotan utama di sini...</p>
      </div>
    `
    insertHtmlAtCursor(calloutHtml)
  }

  // =========================================================================
  // AI Parser: Converts raw Markdown/AI copy-paste into structured HTML
  // =========================================================================
  const handleProcessAIPaste = () => {
    if (!aiRawText.trim()) return

    let parsedTitle = ''
    let parsedSummary = ''
    let lines = aiRawText.split('\n')
    let processedHtml = ''

    // Look for Title in the first few lines
    for (let i = 0; i < Math.min(4, lines.length); i++) {
      const line = lines[i].trim()
      if (line.startsWith('# ')) {
        parsedTitle = line.replace('# ', '').trim()
        lines.splice(i, 1)
        break
      } else if (line.toLowerCase().startsWith('judul:')) {
        parsedTitle = line.replace(/judul:/i, '').trim()
        lines.splice(i, 1)
        break
      }
    }

    // Markdown to HTML conversion engine
    let inList = false
    let inOrderedList = false

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim()

      if (!line) {
        if (inList) {
          processedHtml += '</ul>'
          inList = false
        }
        if (inOrderedList) {
          processedHtml += '</ol>'
          inOrderedList = false
        }
        continue
      }

      // Check Summary / Lead
      if (!parsedSummary && (line.toLowerCase().startsWith('ringkasan:') || line.toLowerCase().startsWith('lead:'))) {
        parsedSummary = line.replace(/ringkasan:|lead:/i, '').trim()
        continue
      }

      // Format bold, italic, underline inline
      line = line
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px;">$1</code>')

      // Headings
      if (line.startsWith('### ')) {
        if (inList) { processedHtml += '</ul>'; inList = false }
        if (inOrderedList) { processedHtml += '</ol>'; inOrderedList = false }
        processedHtml += `<h3 style="color: #0e2238; font-size: 20px; font-weight: 800; margin: 24px 0 10px;">${line.replace('### ', '')}</h3>`
      } else if (line.startsWith('## ')) {
        if (inList) { processedHtml += '</ul>'; inList = false }
        if (inOrderedList) { processedHtml += '</ol>'; inOrderedList = false }
        processedHtml += `<h2 style="color: #0e2238; font-size: 24px; font-weight: 800; margin: 28px 0 12px; border-bottom: 2px solid #edf3f1; padding-bottom: 6px;">${line.replace('## ', '')}</h2>`
      } else if (line.startsWith('# ')) {
        if (!parsedTitle) parsedTitle = line.replace('# ', '')
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        if (inList) { processedHtml += '</ul>'; inList = false }
        if (inOrderedList) { processedHtml += '</ol>'; inOrderedList = false }
        processedHtml += `<blockquote style="border-left: 4px solid #186b5e; padding: 12px 18px; background: #f7fbf9; margin: 18px 0; font-style: italic; color: #37474f;">"${line.replace('> ', '')}"</blockquote>`
      }
      // Bullet list
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        if (inOrderedList) { processedHtml += '</ol>'; inOrderedList = false }
        if (!inList) {
          processedHtml += '<ul style="margin: 14px 0; padding-left: 24px; color: #435465; line-height: 1.7;">'
          inList = true
        }
        processedHtml += `<li style="margin-bottom: 6px;">${line.replace(/^[-*]\s+/, '')}</li>`
      }
      // Numbered list
      else if (/^\d+\.\s+/.test(line)) {
        if (inList) { processedHtml += '</ul>'; inList = false }
        if (!inOrderedList) {
          processedHtml += '<ol style="margin: 14px 0; padding-left: 24px; color: #435465; line-height: 1.7;">'
          inOrderedList = true
        }
        processedHtml += `<li style="margin-bottom: 6px;">${line.replace(/^\d+\.\s+/, '')}</li>`
      }
      // Paragraph
      else {
        if (inList) { processedHtml += '</ul>'; inList = false }
        if (inOrderedList) { processedHtml += '</ol>'; inOrderedList = false }
        processedHtml += `<p style="margin: 0 0 16px; color: #435465; line-height: 1.8; font-size: 15px;">${line}</p>`
      }
    }

    if (inList) processedHtml += '</ul>'
    if (inOrderedList) processedHtml += '</ol>'

    // Update editor
    setHtmlCode(processedHtml)
    onChange(processedHtml)
    calculateWordCount(processedHtml)

    if (onAIPaste) {
      onAIPaste({
        title: parsedTitle || undefined,
        summary: parsedSummary || undefined,
        content: processedHtml,
      })
    }

    setIsAiModalOpen(false)
    setAiRawText('')
    setEditorMode('visual')
    alert('Teks dari AI berhasil diproses dan diformat otomatis!')
  }

  return (
    <div
      className={`wp-editor-wrapper ${isFullscreen ? 'wp-editor-fullscreen' : ''}`}
      style={{
        border: '1px solid #dce5e9',
        borderRadius: '10px',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 16px rgba(14, 34, 56, 0.04)',
        ...(isFullscreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              borderRadius: 0,
              height: '100vh',
            }
          : {}),
      }}
    >
      {/* Top Toolbar Bar */}
      <div
        className="wp-editor-toolbar-top"
        style={{
          background: '#f8faf9',
          borderBottom: '1px solid #e2eaed',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: '4px', background: '#e9eff1', padding: '3px', borderRadius: '6px' }}>
          <button
            type="button"
            onClick={() => setEditorMode('visual')}
            style={{
              border: 'none',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: editorMode === 'visual' ? '#ffffff' : 'transparent',
              color: editorMode === 'visual' ? 'var(--navy)' : 'var(--muted)',
              boxShadow: editorMode === 'visual' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <Edit3 size={13} /> Visual Editor
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('code')}
            style={{
              border: 'none',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: editorMode === 'code' ? '#ffffff' : 'transparent',
              color: editorMode === 'code' ? 'var(--navy)' : 'var(--muted)',
              boxShadow: editorMode === 'code' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <Code size={13} /> HTML Source
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('preview')}
            style={{
              border: 'none',
              padding: '5px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: editorMode === 'preview' ? '#ffffff' : 'transparent',
              color: editorMode === 'preview' ? 'var(--navy)' : 'var(--muted)',
              boxShadow: editorMode === 'preview' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <Eye size={13} /> Pratinjau
          </button>
        </div>

        {/* AI Auto-Format Button & Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #186b5e 0%, #0e2238 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(24, 107, 94, 0.25)',
            }}
          >
            <Sparkles size={14} className="text-gold" /> Format dari AI (Copy-Paste)
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              background: 'none',
              border: '1px solid #dce5e9',
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main Formatting Toolbar (Active in Visual Mode) */}
      {editorMode === 'visual' && (
        <div
          className="wp-editor-toolbar-main"
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #edf2f4',
            padding: '8px 12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            alignItems: 'center',
          }}
        >
          {/* Headings Selector */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                execCmd('formatBlock', e.target.value)
                e.target.value = ''
              }
            }}
            style={{
              padding: '5px 8px',
              borderRadius: '4px',
              border: '1px solid #dce5e9',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--navy)',
              marginRight: '6px',
            }}
          >
            <option value="">Gaya Teks (Paragraf / Heading)</option>
            <option value="p">Paragraf Biasa</option>
            <option value="h2">Heading 2 (Judul Bagian)</option>
            <option value="h3">Heading 3 (Sub-bagian)</option>
            <option value="h4">Heading 4 (Kecil)</option>
          </select>

          {/* Text Styles */}
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className="wp-tool-btn"
            title="Tebal (Ctrl+B)"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className="wp-tool-btn"
            title="Miring (Ctrl+I)"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className="wp-tool-btn"
            title="Garis Bawah (Ctrl+U)"
          >
            <Underline size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className="wp-tool-btn"
            title="Coret Teks"
          >
            <Strikethrough size={15} />
          </button>

          <span className="wp-tool-divider" />

          {/* Alignments */}
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            className="wp-tool-btn"
            title="Rata Kiri"
          >
            <AlignLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            className="wp-tool-btn"
            title="Rata Tengah"
          >
            <AlignCenter size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            className="wp-tool-btn"
            title="Rata Kanan"
          >
            <AlignRight size={15} />
          </button>

          <span className="wp-tool-divider" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className="wp-tool-btn"
            title="Daftar Poin (Bullet List)"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className="wp-tool-btn"
            title="Daftar Nomor (Numbered List)"
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', 'blockquote')}
            className="wp-tool-btn"
            title="Kutipan (Blockquote)"
          >
            <Quote size={15} />
          </button>

          <span className="wp-tool-divider" />

          {/* Insert Tools */}
          <button
            type="button"
            onClick={handleInsertLink}
            className="wp-tool-btn"
            title="Sisip Tautan Link"
          >
            <LinkIcon size={15} />
          </button>
          <button
            type="button"
            onClick={handleInsertImage}
            className="wp-tool-btn"
            title="Sisip Gambar / Foto"
          >
            <ImageIcon size={15} />
          </button>
          <button
            type="button"
            onClick={handleInsertTable}
            className="wp-tool-btn"
            title="Sisip Tabel Data"
          >
            <TableIcon size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertHorizontalRule')}
            className="wp-tool-btn"
            title="Garis Pembatas (Divider)"
          >
            <Minus size={15} />
          </button>
          <button
            type="button"
            onClick={() => handleInsertCallout('info')}
            className="wp-tool-btn"
            title="Kotak Info Sorotan"
          >
            <Info size={15} />
          </button>

          <span className="wp-tool-divider" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => execCmd('undo')}
            className="wp-tool-btn"
            title="Urungkan (Undo)"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            className="wp-tool-btn"
            title="Ulangi (Redo)"
          >
            <RotateCw size={14} />
          </button>
        </div>
      )}

      {/* Editor Body Area */}
      <div style={{ flex: 1, minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
        {editorMode === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            className="wp-editor-content prose"
            style={{
              flex: 1,
              padding: '24px 28px',
              outline: 'none',
              minHeight: '380px',
              lineHeight: 1.8,
              fontSize: '15px',
              color: '#1a2936',
              overflowY: 'auto',
            }}
            data-placeholder={placeholder}
          />
        )}

        {editorMode === 'code' && (
          <textarea
            value={htmlCode}
            onChange={handleCodeChange}
            placeholder="Edit kode HTML langsung di sini..."
            style={{
              flex: 1,
              width: '100%',
              minHeight: '380px',
              padding: '20px 24px',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: 1.6,
              background: '#0e2238',
              color: '#dbeafe',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        )}

        {editorMode === 'preview' && (
          <div
            style={{
              flex: 1,
              padding: '24px 28px',
              minHeight: '380px',
              overflowY: 'auto',
              background: '#ffffff',
            }}
          >
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: htmlCode || '<p style="color: #94a3b8;">Belum ada konten untuk ditampilkan.</p>' }}
            />
          </div>
        )}
      </div>

      {/* Footer Word Count & Info */}
      <div
        style={{
          background: '#f8faf9',
          borderTop: '1px solid #edf2f4',
          padding: '8px 16px',
          fontSize: '12px',
          color: 'var(--muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span>
          📝 Jumlah Kata: <strong>{wordCount}</strong> • Estimasi Waktu Baca: <strong>{readingTime}</strong>
        </span>
        <span style={{ fontSize: '11px', color: '#8898aa' }}>
          Mendukung format visual WYSIWYG, HTML, dan salin-tempel dari AI
        </span>
      </div>

      {/* MODAL POPUP: PASTE DARI AI */}
      {isAiModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(14, 34, 56, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsAiModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #0e2238 0%, #186b5e 100%)',
                color: '#ffffff',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} className="text-gold" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#ffffff', fontWeight: 800 }}>
                    AI Auto-Formatter (Salin-Tempel dari AI)
                  </h3>
                  <small style={{ color: '#d1e6e2', fontSize: '11px' }}>
                    Mendukung format dari ChatGPT, Claude, Gemini, dan Markdown
                  </small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#4a5b68', marginTop: 0, lineHeight: 1.6 }}>
                Tempelkan teks mentah dari AI di bawah ini. Sistem akan secara otomatis mendeteksi <strong>Judul</strong>,{' '}
                <strong>Heading</strong>, <strong>Poin-poin</strong>, <strong>Teks Tebal/Miring</strong>, dan menyusunnya menjadi artikel yang rapi.
              </p>

              <textarea
                rows={9}
                className="form-textarea"
                placeholder={`Contoh tempelan dari ChatGPT:\n\n# Judul Berita HAM Kalimantan Selatan\n\nRingkasan berita pembuka...\n\n## Poin Utama Kegiatan\n- Bimbingan teknis P2HAM di 13 Kab/Kota\n- Audit fasilitas ramah disabilitas\n\n> "Kutipan pernyataan resmi KemenHAM Kalsel"`}
                value={aiRawText}
                onChange={(e) => setAiRawText(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '13px' }}
              />

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="button secondary"
                  style={{ padding: '8px 18px', fontSize: '13px' }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleProcessAIPaste}
                  className="button primary"
                  style={{ padding: '8px 20px', fontSize: '13px', gap: '8px' }}
                >
                  <Sparkles size={15} /> Proses & Susun Otomatis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
