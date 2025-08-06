import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'prepAI - AI-Powered Voice Interviews',
    template: '%s | prepAI',
  },
  description: 'Conduct AI-driven, real-time voice interviews with dynamic question generation derived directly from candidate resumes.',
  keywords: [
    'AI interviews',
    'voice interviews',
    'recruitment',
    'hiring',
    'artificial intelligence',
    'resume analysis',
    'candidate screening',
  ],
  authors: [{ name: 'prepAI Team' }],
  creator: 'prepAI',
  publisher: 'prepAI',
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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon-192.png',
  },
  manifest: '/manifest.webmanifest',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'prepAI - AI-Powered Voice Interviews',
    description: 'Conduct AI-driven, real-time voice interviews with dynamic question generation',
    siteName: 'prepAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'prepAI - AI-Powered Voice Interviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'prepAI - AI-Powered Voice Interviews',
    description: 'Conduct AI-driven, real-time voice interviews with dynamic question generation',
    images: ['/og-image.png'],
    creator: '@prepai',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  )
}
