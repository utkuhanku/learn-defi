import type { Metadata } from 'next'
import { Inter_Tight, Roboto_Mono, Doto } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
})

const doto = Doto({
  variable: '--font-doto',
  subsets: ['latin'],
  display: 'swap',
})

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ?? 'https://learn-defi.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(ROOT_URL),
  title: {
    default: 'learn defi — start onchain, the right way',
    template: '%s · learn defi',
  },
  description:
    'Learn DeFi by playing. 6 interactive modules, live calculators, Base-native. No fluff.',
  openGraph: {
    title: 'learn defi',
    description:
      'Learn DeFi by playing — Base-native mini app',
    url: ROOT_URL,
    siteName: 'Learn DeFi',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'learn defi',
    description:
      'Learn DeFi by playing — Base-native mini app',
    images: ['/og.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  other: {
    'base:app_id': '69e3f6cf87970a2e83bef2f7',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${robotoMono.variable} ${doto.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
