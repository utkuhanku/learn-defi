# Learn DeFi — Teknik Mimari

## 1. Stack özeti

Base'in 9 Nisan 2026 sonrası yeni modeline göre **saf Next.js + wagmi + viem** — Farcaster SDK yok, MiniKit yok.

| Katman | Seçim | Gerekçe |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Vercel deploy 1-click, SSR/ISR, metadata API, base.dev'in önerdiği default |
| Dil | TypeScript (strict) | Utkus'un standart |
| Styling | **Tailwind CSS v4** | Base brand token'larını CSS var olarak export kolay |
| Bileşen | Custom (no shadcn) | Base-native feel; shadcn çok "generic startup" |
| Motion | **framer-motion** | Card swipe, number counter, progress |
| State | **Zustand** + `persist` middleware | Utkus'un familiar pattern'i, boyut küçük |
| Wallet | **wagmi v2 + viem** | Base docs resmi standart |
| Connector | **`@base-org/account`** (Base Account) + `injected` | Base App içinde native çalışır |
| Auth | **SIWE** (`viem/siwe`) — opsiyonel v1 | Progress wallet'a bağlanacaksa |
| Data fetch | **@tanstack/react-query** | wagmi peer dep |
| Content | JSON dosyaları (`/content/tr/*.json`, `/content/en/*.json`) | CMS'e gerek yok, versiyonla git |
| Icons | `lucide-react` | Base brand'in tercih ettiği geometric stil |
| Charts | `recharts` | IL simulator, APY compounding görselleştirme |
| Deploy | **Vercel** | Base docs resmi öneri |
| Domain | Vercel subdomain v1, custom domain v2 (ör. `learndefi.app`) |

## 2. Klasör yapısı

```
learn-defi/
├── app/
│   ├── layout.tsx                  # Root layout, font yüklemesi, providers
│   ├── page.tsx                    # Home: modül grid + XP header + streak
│   ├── globals.css                 # Tailwind + Base brand tokens
│   ├── providers.tsx               # WagmiProvider + QueryClientProvider
│   ├── module/
│   │   └── [slug]/
│   │       ├── page.tsx            # Modül ana sayfa, lesson listesi
│   │       ├── lesson/[id]/page.tsx
│   │       ├── quiz/page.tsx
│   │       └── tool/page.tsx
│   ├── profile/page.tsx            # Cüzdan, XP, badges, streak
│   ├── leaderboard/page.tsx        # v1 lokal, v2 global
│   ├── api/
│   │   └── siwe/
│   │       ├── nonce/route.ts      # SIWE nonce üret
│   │       └── verify/route.ts     # SIWE doğrula (opsiyonel v1)
│   └── .well-known/                # base.dev metadata için (gerekirse)
│
├── components/
│   ├── brand/
│   │   ├── BaseSquare.tsx          # Logo (blue square)
│   │   ├── BaseLockup.tsx          # "base" lockup
│   │   └── ChainBadge.tsx          # "on base" chip
│   ├── ui/
│   │   ├── Card.tsx                # Rounded-square Base cards
│   │   ├── Button.tsx              # Primary (blue) / secondary (outline) / ghost
│   │   ├── Progress.tsx            # XP bar
│   │   ├── Chip.tsx
│   │   ├── NumberTicker.tsx        # Animated number
│   │   └── ConnectButton.tsx       # Base Account connect
│   ├── learning/
│   │   ├── ModuleCard.tsx          # Home grid item
│   │   ├── LessonCarousel.tsx      # Swipeable cards
│   │   ├── Quiz.tsx
│   │   └── XPReward.tsx            # Burst animasyonu
│   ├── tools/
│   │   ├── GasComparator.tsx
│   │   ├── PegTracker.tsx
│   │   ├── HealthFactorCalc.tsx
│   │   ├── ILSimulator.tsx
│   │   ├── AprApyCalc.tsx
│   │   └── StrategyCalc.tsx        # ADNYF port
│   └── gamification/
│       ├── StreakRing.tsx
│       ├── BadgeGrid.tsx
│       └── LevelBar.tsx
│
├── lib/
│   ├── wagmi/config.ts             # wagmi config (Base chain + connectors)
│   ├── siwe/
│   │   ├── client.ts
│   │   └── verify.ts
│   ├── content.ts                  # Content loader (TR/EN)
│   ├── formulas/
│   │   ├── impermanentLoss.ts
│   │   ├── healthFactor.ts
│   │   ├── aprToApy.ts
│   │   └── deltaNeutral.ts         # ADNYF formülleri
│   └── constants/
│       ├── base.ts                 # Base chain constants
│       └── tokens.ts               # USDC/ETH adresleri
│
├── stores/
│   ├── useProgress.ts              # XP, completed lessons, streak
│   ├── useLocale.ts                # TR/EN toggle
│   └── useTheme.ts                 # light/dark
│
├── content/
│   ├── tr/
│   │   ├── modules.json            # modül meta (title, icon, order)
│   │   ├── lessons/
│   │   │   ├── defi-101.json
│   │   │   ├── stablecoins.json
│   │   │   └── ... (6 adet)
│   │   └── quizzes/
│   │       └── ... (6 adet)
│   └── en/
│       └── (aynı yapı)
│
├── public/
│   ├── icon.png                    # 1024x1024 blue square (Base brand)
│   ├── splash.png                  # base.dev hero (1200x630)
│   ├── screenshot-1.png ... 3.png
│   └── og.png
│
├── minikit.config.ts               # (opsiyonel — base.dev migration öncesi default)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 3. State mimarisi

### 3.1 Client state (Zustand)
```ts
// stores/useProgress.ts
type ProgressState = {
  xp: number
  level: number
  completedLessons: Record<string, number>  // lessonId -> timestamp
  completedQuizzes: Record<string, { score: number; ts: number }>
  earnedBadges: string[]
  streak: { current: number; longest: number; lastDayISO: string }
  toolsUsed: string[]
  addXp: (amount: number, source: string) => void
  completeLesson: (id: string) => void
  submitQuiz: (id: string, score: number) => void
  earnBadge: (id: string) => void
  touchStreak: () => void
}
```
- `persist` middleware ile **localStorage**'a yazılır
- Cüzdan bağlı ise key = `learndefi:${address}`; değilse `learndefi:guest`
- Cüzdan değiştiğinde yeni namespace'e geçer (eski progress kaybolmaz)

### 3.2 Server state (react-query)
- Gas price, stablecoin fiyatları, Aave rate'leri — react-query hook'larıyla 30–60s stale time
- Cüzdan bakiyesi — wagmi `useBalance` (built-in cache)

### 3.3 Chain state
- wagmi hook'ları: `useAccount`, `useConnect`, `useDisconnect`, `useBalance`, `useSignMessage`
- `config.ts`:
```ts
import { createConfig, http, createStorage, cookieStorage } from 'wagmi'
import { base } from 'wagmi/chains'
import { baseAccount, injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    baseAccount({ appName: 'Learn DeFi' }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: { [base.id]: http() },
})
```

## 4. Data flow — lesson tamamlama örneği

```
User tap "Complete" →
  useProgress.completeLesson(id)
    → addXp(+10)
    → touchStreak()
    → eğer modül son ders ise earnBadge(moduleId)
  → UI: XPReward burst animasyonu
  → Zustand persist → localStorage
  → (v2) backend sync via /api/progress POST
```

## 5. Content pipeline

Content'i koda gömmek istemiyoruz — i18n ve editability için JSON:

```json
// content/tr/lessons/defi-101.json
{
  "id": "defi-101",
  "module": "defi-basics",
  "order": 1,
  "title": "DeFi nedir?",
  "cards": [
    {
      "type": "text",
      "heading": "decentralized finance",
      "body": "bankaya değil, koda güvenirsin...",
      "visual": "square-grid"
    },
    {
      "type": "comparison",
      "left": { "label": "Tradfi", "items": ["banka", "KYC", "9-5"] },
      "right": { "label": "DeFi", "items": ["smart contract", "cüzdan", "24/7"] }
    },
    {
      "type": "onchain",
      "action": "view-tx",
      "txHash": "0x...",
      "caption": "bir swap tx'i nasıl görünür"
    }
  ]
}
```

Content type'ları: `text | comparison | code | chart | onchain | interactive-embed`

## 6. Base App uyumluluk kontrol listesi

Base docs'un pre-flight checklist'ine göre:

- [x] wagmi + viem wallet connection
- [x] SIWE auth (v1 opsiyonel)
- [x] Base.dev'e kayıt (deploy sonrası)
- [x] App metadata: name, icon, tagline, description, screenshots, category, primary URL, builder code
- [x] Mobile in-app browser test
- [ ] Notifications API (Base.dev'de "coming soon" — v2'ye ertelendi)
- [x] No deprecated Farcaster SDK calls (`signIn`, `composeCast`, `ready`, `openUrl` vb. kullanılmıyor)

## 7. Performance bütçesi

- LCP < 1.5s
- Initial JS bundle < 180 KB (gzip)
- Content JSON lazy-load (modül bazlı dynamic import)
- Font: `next/font` ile Inter Tight + Roboto Mono self-host, preload
- Image: `next/image` + blur placeholder
- Route-level code split (App Router default)
