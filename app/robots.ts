import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'PerplexityBot', 'CCBot', 'Google-Extended'],
        allow: '/',
      },
    ],
    sitemap: 'https://kemenham-kalsel.go.id/sitemap.xml',
    host: 'https://kemenham-kalsel.go.id',
  }
}
