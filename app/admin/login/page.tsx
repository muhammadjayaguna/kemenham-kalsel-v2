'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldAlert,
} from 'lucide-react'

const logoSrc =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Kementerian_Hak_Asasi_Manusia_Republik_Indonesia_%282024%29_%28cropped%29-GIvJ19tibTKAvlhbhMO87XGKCaSlO7.png'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Check if session already exists
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const localAdminSession = typeof window !== 'undefined' ? localStorage.getItem('kemenham_admin_session') : null
      if (data.session || localAdminSession) {
        router.push('/admin')
      }
    }
    checkSession()
  }, [router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    try {
      // 1. Coba login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      })

      if (data?.session) {
        localStorage.setItem('kemenham_admin_session', JSON.stringify({ email: cleanEmail, loggedInAt: new Date().toISOString() }))
        setSuccessMessage('Login berhasil! Mengalihkan ke Dashboard Admin...')
        setTimeout(() => router.push('/admin'), 600)
        return
      }

      // 2. Fallback autentikasi kredensial admin resmi
      if (cleanEmail === 'admin@kemenhamkalsel.com' && cleanPassword === '12345678') {
        localStorage.setItem('kemenham_admin_session', JSON.stringify({ email: cleanEmail, loggedInAt: new Date().toISOString() }))
        setSuccessMessage('Login Administrator Berhasil! Mengalihkan...')
        setTimeout(() => router.push('/admin'), 600)
        return
      }

      if (error) {
        throw error
      }
    } catch (err: any) {
      if (cleanEmail === 'admin@kemenhamkalsel.com' && cleanPassword === '12345678') {
        localStorage.setItem('kemenham_admin_session', JSON.stringify({ email: cleanEmail, loggedInAt: new Date().toISOString() }))
        setSuccessMessage('Login Administrator Berhasil! Mengalihkan...')
        setTimeout(() => router.push('/admin'), 600)
      } else {
        setErrorMessage('Email atau kata sandi salah. Gunakan email: admin@kemenhamkalsel.com')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f3f6f5 0%, #e6efec 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(14, 34, 56, 0.12)',
          border: '1px solid var(--line)',
          overflow: 'hidden',
        }}
      >
        {/* Header Kartu Login */}
        <div
          style={{
            background: 'var(--navy)',
            padding: '32px 28px',
            textAlign: 'center',
            color: '#ffffff',
            borderBottom: '4px solid var(--gold)',
          }}
        >
          <img
            src={logoSrc}
            alt="Logo Kementerian HAM RI"
            width={44}
            height={52}
            style={{ margin: '0 auto 12px', display: 'block' }}
          />
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              fontWeight: 800,
              display: 'block',
              marginBottom: '4px',
            }}
          >
            Portal Internal Kantor Wilayah
          </span>
          <h1 style={{ fontSize: '20px', margin: '0 0 4px', fontWeight: 800, color: '#ffffff' }}>
            Login Administrator
          </h1>
          <span style={{ fontSize: '12px', color: '#b2c8d2' }}>
            Kanwil Kementerian HAM Kalimantan Selatan
          </span>
        </div>

        {/* Isi Form Login */}
        <div style={{ padding: '32px 28px' }}>
          {errorMessage && (
            <div
              style={{
                background: 'var(--red-soft)',
                border: '1px solid #f5c6cb',
                color: 'var(--red-accent)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              style={{
                background: 'var(--blue-light)',
                border: '1px solid #b8dfd7',
                color: 'var(--blue-dark)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleAuth}>
            <div className="form-group">
              <label className="form-label">Email Administrator</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="admin@kemenhamkalsel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted)',
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Kata Sandi (Password)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button primary"
              style={{ width: '100%', padding: '13px', marginTop: '16px' }}
            >
              {isLoading ? (
                'Memverifikasi Akun...'
              ) : (
                <>
                  Masuk ke Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
            <Link href="/" style={{ fontSize: '13px', color: 'var(--muted)' }}>
              ← Kembali ke Portal Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
