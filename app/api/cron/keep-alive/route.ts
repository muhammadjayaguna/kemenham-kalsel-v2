import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    // 1. Verifikasi Vercel Cron Secret (jika dikonfigurasi di Environment Variables)
    const authHeader = request.headers.get('authorization')
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid CRON_SECRET token' },
        { status: 401 }
      )
    }

    // 2. Lakukan query ringan ke database Supabase untuk mempertahankan status aktif
    // Coba tabel pengumuman_marquee terlebih dahulu
    let targetTable = 'pengumuman_marquee'
    let { data, error, count } = await supabase
      .from('pengumuman_marquee')
      .select('id', { count: 'exact' })
      .limit(1)

    // Jika tabel pertama gagal, coba tabel berita_publikasi sebagai cadangan
    if (error) {
      targetTable = 'berita_publikasi'
      const fallbackResult = await supabase
        .from('berita_publikasi')
        .select('id', { count: 'exact' })
        .limit(1)
      data = fallbackResult.data
      error = fallbackResult.error
      count = fallbackResult.count
    }

    const durationMs = Date.now() - startTime

    if (error) {
      console.error('[Cron Keep-Alive] Supabase Query Error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Gagal melakukan query ke Supabase',
          error: error.message,
          targetTable,
          durationMs,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase keep-alive ping berhasil! Database aktif dan terjaga.',
      targetTable,
      rowsCount: count ?? 0,
      durationMs,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error('[Cron Keep-Alive] Unexpected Exception:', err)
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Internal Server Error',
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

