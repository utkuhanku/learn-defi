# Learn DeFi — Base Entegrasyonu

Base App'e 9 Nisan 2026 sonrası standart web app olarak deploy ediyoruz. Bu doc tam uyumluluk adımlarını içerir.

## 1. wagmi config (kopyala-yapıştır hazır)

```ts
// lib/wagmi/config.ts
import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { base } from 'wagmi/chains'
import { baseAccount, injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    baseAccount({
      appName: 'Learn DeFi',
      appLogoUrl: 'https://learndefi.vercel.app/icon.png',
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
```

```tsx
// app/providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/lib/wagmi/config'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

## 2. Sign-In with Base (opsiyonel v1)

V1 için progress lokalde tutulabilir, SIWE'yi v1.1'e erteleyebiliriz. Yine de hazır bulundurulacak:

```tsx
// components/auth/SignInWithBase.tsx
'use client'
import { useState } from 'react'
import { createSiweMessage, generateSiweNonce } from 'viem/siwe'
import { useAccount, usePublicClient, useSignMessage } from 'wagmi'
import { Button } from '@/components/ui/Button'

export function SignInWithBase() {
  const { address, chainId, isConnected } = useAccount()
  const [loading, setLoading] = useState(false)
  const { signMessageAsync } = useSignMessage()
  const publicClient = usePublicClient()

  async function handleSignIn() {
    if (!isConnected || !address || !chainId || !publicClient) return
    setLoading(true)
    try {
      const nonce = generateSiweNonce()
      const message = createSiweMessage({
        address,
        chainId,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: '1',
        statement: 'Sign in to Learn DeFi to save your progress.',
      })
      const signature = await signMessageAsync({ message })
      const valid = await publicClient.verifySiweMessage({ message, signature })
      if (!valid) throw new Error('SIWE verification failed')
      // store session
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSignIn} disabled={!isConnected || loading}>
      {loading ? 'signing...' : 'sign in with base'}
    </Button>
  )
}
```

## 3. Deprecated Farcaster SDK metodları — kullanma listesi

| ❌ kullanma | ✅ yerine |
|---|---|
| `sdk.actions.signIn` | wagmi `useSignMessage` + SIWE |
| `sdk.actions.openUrl(url)` | `window.open(url, '_blank')` |
| `sdk.actions.openMiniApp` | `window.open(url)` |
| `sdk.actions.viewToken(addr)` | link: `https://base.app/coin/base-mainnet/{addr}` |
| `sdk.actions.viewProfile(fid)` | link: `https://base.app/profile/{wallet}` |
| `sdk.actions.swapToken` | wagmi `useWriteContract` with swap router |
| `sdk.actions.composeCast` | — |
| `sdk.actions.ready` | — (app loads = ready) |
| `sdk.actions.addMiniApp` | — Base App auto-handles |
| User FID context | wagmi `useAccount().address` |

## 4. Deep links (Base App içinde)

```ts
// lib/deeplinks.ts
export const baseApp = {
  coin: (addr: `0x${string}`) => `https://base.app/coin/base-mainnet/${addr}`,
  profile: (wallet: `0x${string}`) => `https://base.app/profile/${wallet}`,
  tx: (hash: `0x${string}`) => `https://basescan.org/tx/${hash}`,
}
```

Onchain action'larda kullanacağız (örneğin "bir swap tx'i incele" → basescan deeplink).

## 5. Base.dev kayıt — adım adım

Launch günü yapılacak:

1. [base.dev](https://www.base.dev) → Sign in (Coinbase account)
2. **Create Project** → proje detaylarını doldur:
   - **Name:** `Learn DeFi`
   - **Tagline:** `bankaya değil, koda`
   - **Description:** `DeFi'yi oyunla öğren. 6 modül, interaktif hesap makineleri, Base-native. Gas hesabından delta-nötr stratejilere kadar tek app.`
   - **Category:** `Education` (ikincil: `DeFi`)
   - **Primary URL:** Vercel production URL (ör. `https://learn-defi.vercel.app`)
   - **Icon:** 1024x1024 Base blue square PNG
   - **Screenshots:** 3 adet (home, lesson, tool) — 1290x2796 portrait mobile
   - **OG Image:** 1200x630
3. **Builder Code** al (rewards için kritik)
4. **Account association** (eski Farcaster flow hâlâ opsiyonel — ama artık gerekli değil):
   - Base.dev → Preview → `Account association` tab → domain gir → verify → imzala
5. **Preview tab**'da her şeyi test et:
   - Embed ✓
   - Metadata ✓
   - Launch button ✓
6. Base App'te **post oluştur** → URL paylaş → yayına al

## 6. Metadata — Next.js tarafı

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

const ROOT_URL = process.env.NEXT_PUBLIC_URL ?? 'https://learn-defi.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(ROOT_URL),
  title: {
    default: 'learn defi — bankaya değil, koda',
    template: '%s · learn defi',
  },
  description: 'DeFi\'yi oyunla öğren. 6 modül, interaktif hesap makineleri, Base-native.',
  openGraph: {
    title: 'learn defi',
    description: 'DeFi\'yi oyunla öğren — Base-native mini app',
    url: ROOT_URL,
    siteName: 'Learn DeFi',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'learn defi',
    description: 'DeFi\'yi oyunla öğren — Base-native mini app',
    images: ['/og.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}
```

## 7. Opsiyonel — `.well-known/farcaster.json`

Base 9 Nisan 2026 sonrası zorunlu kılmadı ama eski Farcaster environment'larında hâlâ göz atılabilir. V1'de dahil etmek isteyenler için:

```ts
// app/.well-known/farcaster.json/route.ts
export const dynamic = 'force-static'

export async function GET() {
  return Response.json({
    accountAssociation: {
      header: process.env.FC_HEADER ?? '',
      payload: process.env.FC_PAYLOAD ?? '',
      signature: process.env.FC_SIGNATURE ?? '',
    },
    frame: {
      version: '1',
      name: 'Learn DeFi',
      iconUrl: `${process.env.NEXT_PUBLIC_URL}/icon.png`,
      homeUrl: process.env.NEXT_PUBLIC_URL,
      splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
      splashBackgroundColor: '#0000ff',
    },
  })
}
```

**Karar:** v1'de eklemiyoruz. Base docs "already registered apps do not need to update metadata" dedi, yeni mimari Base.dev üzerinden. Bizim de yeni kayıt olmamız nedeniyle gerek yok.

## 8. Gas & performans Base'e özel notlar

- Base mainnet RPC: default `http()` → Coinbase public RPC (free tier yeterli v1 için)
- v2'de dedicated provider: QuickNode, Alchemy, Base Sepolia test endpoint
- Base gas genelde < $0.01 — "her tx ucuz" mesajını tüm lesson'larda vurgu

## 9. Builder Code entegrasyonu (v1.1)

Base Rewards programına eligible olmak için contract interaction'larında builder code gömülmesi gerek. V1 doğrudan onchain tx yapmıyor, v1.1'de OnchainKit Transaction UI eklendiğinde:

```ts
import { encodeFunctionData } from 'viem'

const data = encodeFunctionData({ abi, functionName: 'swap', args: [...] })
// + appended builder code bytes (docs.base.org/base-chain/builder-codes)
```

## 10. Test checklist

- [ ] Cüzdan bağla → Base mainnet üzerinde görünüyor
- [ ] Disconnect → state temizleniyor
- [ ] Başka cüzdana geç → progress doğru namespace'e gidiyor
- [ ] SIWE imzala (etkinse) → doğrulama geçiyor
- [ ] Deeplink'ler Base App içinde açılıyor
- [ ] Dark mode'da Base Blue AA contrast ✓
- [ ] Mobile Safari (iOS Base App) → layout OK
- [ ] Keyboard overlay form'ları kapatmıyor
