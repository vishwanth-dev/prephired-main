import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/settings/',
          '/interviews/',
          '/candidates/',
          '/analytics/',
          '/_next/',
          '/embed/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/landing',
          '/pricing',
          '/features',
          '/about',
          '/contact',
          '/blog/',
          '/legal/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/settings/',
          '/interviews/',
          '/candidates/',
          '/analytics/',
          '/embed/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
