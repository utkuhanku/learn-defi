export async function GET() {
  const url = process.env.NEXT_PUBLIC_URL ?? 'https://learn-defi.vercel.app'
  const iconUrl = `${url}${process.env.NEXT_PUBLIC_APP_ICON ?? '/icon.png'}`
  const splashImageUrl = `${url}${process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE ?? '/splash.png'}`

  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER ?? '',
      payload: process.env.FARCASTER_PAYLOAD ?? '',
      signature: process.env.FARCASTER_SIGNATURE ?? '',
    },
    frame: {
      version: '1',
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? 'Learn DeFi',
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE ?? 'start onchain, the right way',
      description:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
        'Learn DeFi by playing. Six interactive modules with real calculators.',
      iconUrl,
      splashImageUrl,
      splashBackgroundColor:
        process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR ?? '#0000FF',
      homeUrl: url,
      webhookUrl: `${url}/api/webhook`,
      primaryCategory:
        process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY ?? 'education',
      tags: (process.env.NEXT_PUBLIC_APP_TAGS ?? 'defi,learn,calculator,beginner,base').split(','),
      heroImageUrl: `${url}${process.env.NEXT_PUBLIC_APP_HERO_IMAGE ?? '/og.png'}`,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE ?? 'defi, demystified',
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE ?? 'Learn DeFi',
      ogDescription:
        process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION ??
        'Learn DeFi by playing — Base-native mini app',
      ogImageUrl: `${url}${process.env.NEXT_PUBLIC_APP_OG_IMAGE ?? '/og.png'}`,
    },
  }

  return Response.json(manifest)
}
