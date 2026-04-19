import { DEV_ADDRESS } from '@/lib/constants'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_URL ?? 'https://learn-defi.vercel.app'

  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER ?? '',
      payload: process.env.FARCASTER_PAYLOAD ?? '',
      signature: process.env.FARCASTER_SIGNATURE ?? '',
    },
    frame: {
      version: '1',
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? 'Learn DeFi',
      subtitle:
        process.env.NEXT_PUBLIC_APP_SUBTITLE ?? 'Master DeFi through play',
      description:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
        'Gamified DeFi education on Base. 5 modules, 25 lessons, interactive calculators.',
      screenshotUrls: [],
      iconUrl: `${url}${process.env.NEXT_PUBLIC_APP_ICON ?? '/icon.png'}`,
      splashImageUrl: `${url}${process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE ?? '/splash.png'}`,
      splashBackgroundColor:
        process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR ?? '#050505',
      homeUrl: url,
      webhookUrl: `${url}/api/webhook`,
      primaryCategory:
        process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY ?? 'education',
      tags: (
        process.env.NEXT_PUBLIC_APP_TAGS ??
        'defi,education,gamified,learn,base'
      ).split(','),
      heroImageUrl: `${url}${process.env.NEXT_PUBLIC_APP_HERO_IMAGE ?? '/hero.png'}`,
      tagline:
        process.env.NEXT_PUBLIC_APP_TAGLINE ?? 'Master DeFi through play',
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE ?? 'Learn DeFi',
      ogDescription:
        process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION ??
        'Gamified DeFi education on Base',
      ogImageUrl: `${url}${process.env.NEXT_PUBLIC_APP_OG_IMAGE ?? '/og.png'}`,
    },
    baseBuilder: {
      allowedAddresses: [DEV_ADDRESS],
    },
  }

  return Response.json(manifest)
}
