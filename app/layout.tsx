import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import MarqueeBar from '@/components/MarqueeBar'
import MascotFloat from '@/components/MascotFloat'

const siteUrl = 'https://kemenham-kalsel.go.id'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kanwil KemenHAM Kalsel | Kantor Wilayah Kementerian Hak Asasi Manusia Kalimantan Selatan',
    template: '%s | Kanwil KemenHAM Kalimantan Selatan',
  },
  description:
    'Portal Resmi Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan. Menyediakan layanan komunikasi masyarakat (Yankomas), P2HAM, edukasi HAM, pilar P5HAM, dan kanal pengaduan HAM di 13 Kabupaten/Kota se-Kalsel.',
  applicationName: 'Portal Resmi Kanwil KemenHAM Kalimantan Selatan',
  authors: [{ name: 'Kanwil KemenHAM Kalimantan Selatan', url: siteUrl }],
  generator: 'Next.js',
  keywords: [
    'KemenHAM Kalsel',
    'Kementerian Hak Asasi Manusia',
    'Kanwil HAM Kalimantan Selatan',
    'Yankomas Kalsel',
    'P2HAM Kalsel',
    'P5HAM',
    'Pengaduan HAM Banjarmasin',
    'Hak Asasi Manusia Kalsel',
    'Desa Sadar HAM Kalsel',
    'Layanan HAM Kalimantan Selatan',
    'Kantor Wilayah HAM',
  ],
  creator: 'Kementerian Hak Asasi Manusia Republik Indonesia',
  publisher: 'Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kanwil KemenHAM Kalsel | Kementerian Hak Asasi Manusia Kalimantan Selatan',
    description:
      'Portal Informasi Resmi Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan. Pelayanan, Edukasi, Pengaduan, dan Penguatan HAM untuk Banua yang Berkeadilan.',
    url: siteUrl,
    siteName: 'Kanwil KemenHAM Kalimantan Selatan',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Kementerian_Hak_Asasi_Manusia_Republik_Indonesia_%282024%29_%28cropped%29-GIvJ19tibTKAvlhbhMO87XGKCaSlO7.png',
        width: 800,
        height: 600,
        alt: 'Logo Kementerian Hak Asasi Manusia Republik Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kanwil KemenHAM Kalsel | Portal Resmi',
    description:
      'Portal informasi dan layanan resmi Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan.',
    creator: '@kemenham_kalsel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  other: {
    'geo.region': 'ID-KS',
    'geo.placename': 'Banjarmasin, Kalimantan Selatan',
    'geo.position': '-3.3194;114.5908',
    'ICBM': '-3.3194, 114.5908',
    'DC.title': 'Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan',
    'DC.creator': 'Kementerian HAM RI',
    'DC.subject': 'Hak Asasi Manusia, Layanan Publik, Pengaduan HAM, P5HAM',
    'DC.language': 'id',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#10263d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'Kantor Wilayah Kementerian Hak Asasi Manusia Provinsi Kalimantan Selatan',
    alternateName: 'Kanwil KemenHAM Kalsel',
    url: siteUrl,
    logo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo_Kementerian_Hak_Asasi_Manusia_Republik_Indonesia_%282024%29_%28cropped%29-GIvJ19tibTKAvlhbhMO87XGKCaSlO7.png',
    parentOrganization: {
      '@type': 'GovernmentOrganization',
      name: 'Kementerian Hak Asasi Manusia Republik Indonesia',
      url: 'https://kemenham.go.id',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Kalimantan Selatan',
      containsPlace: [
        'Kota Banjarmasin',
        'Kota Banjarbaru',
        'Kabupaten Banjar',
        'Kabupaten Barito Kuala',
        'Kabupaten Tanah Laut',
        'Kabupaten Tanah Bumbu',
        'Kabupaten Kotabaru',
        'Kabupaten Tapin',
        'Kabupaten Hulu Sungai Selatan',
        'Kabupaten Hulu Sungai Tengah',
        'Kabupaten Hulu Sungai Utara',
        'Kabupaten Balangan',
        'Kabupaten Tabalong',
      ],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Brigjen H. Hasan Basry No. 42',
      addressLocality: 'Banjarmasin',
      addressRegion: 'Kalimantan Selatan',
      postalCode: '70123',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -3.3194,
      longitude: 114.5908,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+62-511-3301234',
        contactType: 'customer support',
        availableLanguage: ['Indonesian', 'Banjar'],
        areaServed: 'ID-KS',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+62-811-5000-HAM',
        contactType: 'complaints',
        contactOption: 'TollFree',
        availableLanguage: ['Indonesian'],
      },
    ],
  }

  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="antialiased font-sans">
        <Navbar />
        <MarqueeBar />
        <main id="main-content" className="site-main">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <MascotFloat />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
