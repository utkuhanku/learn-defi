# Learn DeFi — Pivot Memo (07)

**Tarih:** 13 Nisan 2026
**Durum:** Faz 1 teknik olarak bitti, mimari kararları güncelliyoruz
**Bağlam:** İlk planlama dokümanları (01–06) eksik araştırmaya dayanıyordu. Base'in resmi `featured-guidelines/`, `core-concepts/`, `builderkits/minikit/` sekmeleri derinlemesine okunmadı. Bu memo eksikleri kapatır ve mimariyi Base App'e gerçekten uygun hâle getirir.

---

## Bölüm 1 · Kaçırılan 8 bulgu

### B1 — MiniKit hâlâ canonical path
İlk okumamda "9 Nisan sonrası Farcaster SDK yok" notunu "SDK deprecated" olarak yorumladım. Yanlış. Doğrusu: **MiniKit + Farcaster SDK ikisi de destekleniyor**, 9 Nisan sonrası sadece "SDK kullanmayan saf web app'ler de çalışabilir" denmiş. Base'in resmi template'leri `farcaster-sdk/` altında, `base/demos` repo'sunda. Canonical yol MiniKit'tir.

### B2 — Manifest zorunludur
`core-concepts/manifest` sayfası 17 field'lı tam spec'i veriyor. Discovery, kategori, search, embed, account association — hepsi manifest'e bağlı. Faz 1'de manifest yok, eklenmeli. `app/.well-known/farcaster.json/route.ts` olarak.

### B3 — Bottom navigation zorunlu (Featured kriteri)
> "App has a bottom navigation bar or side menu to easily access core flow."

Featured olmak istiyorsak (istiyoruz, Base Rewards için kritik) bottom nav şart. Page-to-page routing yetmiyor, persistent tab bar gerekli.

### B4 — 44px touch target katı kural
Featured checklist: *"App has minimum 44px touch targets."* Şu anki `ConnectButton` `px-5 py-3` ≈ 44–46px sınırda. Tüm interactive element'ler audit edilmeli. Tailwind `min-h-11` (44px) utility'siyle enforce edilecek.

### B5 — Load time 3 saniye, action 1 saniye
Featured kriteri. Localhost'ta 574ms render süresi iyi gösterge ama production'da Vercel edge + font preload + image optimization şart.

### B6 — "No 0x addresses" — avatar + username zorunlu
Featured checklist: *"Display user's avatar and username (no 0x addresses)."* Şu an truncated `0x1234...5678` gösteriyoruz — bu kuralı ihlal ediyor. MiniKit `context.user.displayName` + `context.user.pfpUrl` ile çözüm hazır geliyor. Bu tek başına MiniKit'e geçmek için yeterli sebep.

### B7 — Screenshot boyutu: 1284×2778 portrait
Base manifest spec'i: *"Visual previews. Max 3; portrait 1284×2778px recommended."* Faz 6'daki asset hazırlama adımı bu boyuta göre ayarlanacak.

### B8 — Onboarding flow zorunlu
Featured kriteri: *"Explain the purpose of the app and how to get started, with clear onboarding instructions either on the home page or as a pop-up window."*

Şu anki home doğrudan modül grid veriyor, onboarding yok. Çözüm: **home page'in ilk scroll'da hero + "what is learn defi" explainer + "how it works" 3-step block olacak**. Ayrı splash değil, inline.

### Ek bulgu — safeAreaInsets context'ten geliyor
MiniKit `context.client.safeAreaInsets` ile iOS notch / Android cutout / Base App header offset'ini veriyor. Bunu root layout'a uygulayacağız — Base App'te header'ın altında kalma riski sıfırlanır.

---

## Bölüm 2 · Mimari kararları

### K1 — MiniKit'e geçiş (senior Coinbase dev görüşü)

**Seçim:** `@coinbase/onchainkit/minikit`'in `MiniKitProvider`'ı. Mevcut `lib/wagmi/config.ts` ATILMIYOR — MiniKit internally wagmi'yi sarıyor, bizim config'imiz fallback olarak durur.

**Gerekçe:**
1. **Resmi canonical path.** Base'in kendi demos'u bunu kullanıyor.
2. **Context API.** `context.user.{displayName, pfpUrl, fid, username}` — B6'yı tek satırda çözer.
3. **Viral hook.** `context.location` ile cast_embed geldiğinde davet akışı yazılabilir. Saf wagmi'de bu imkansız.
4. **Builder code entegrasyonu.** Transaction component'leri builder code'u otomatik enjekte ediyor → Base Rewards eligibility.
5. **Safe area otomatik.** `context.client.safeAreaInsets` hazır geliyor, manuel env() yazmaya gerek yok.
6. **Native action wrapper'ları.** `useOpenUrl`, `useClose`, `useAddFrame`, `usePrimaryButton`, `useComposeCast`, `useNotification` — hepsi Base App dışında da fallback'lerle çalışıyor.

**Risk mitigation:**
- Bundle size: OnchainKit full import ~150KB gzip; sadece `/minikit`, `/identity`, `/transaction` subpath'lerini import ederek minimize ederiz
- Version drift: `@coinbase/onchainkit` versiyonunu pin'le, quarterly audit
- Template referansı: `github.com/base/demos/tree/master/mini-apps/templates/farcaster-sdk/mini-app-full-demo` canonical referans

### K2 — 4-sekmeli bottom navigation

```
┌──────────────────────────────────────┐
│  header (compact, sticky)            │
│  ┌──┐ learn defi      [avatar+xp]   │
├──────────────────────────────────────┤
│                                      │
│          content area                │
│          (scroll)                    │
│                                      │
├──────────────────────────────────────┤
│  [home] [learn] [tools] [profile]   │  ← bottom nav
└──────────────────────────────────────┘
```

**Sekmeler:**
| Sekme | Route | İçerik |
|---|---|---|
| **home** | `/` | Hero + onboarding explainer + modül grid + streak/XP özet |
| **learn** | `/learn` | Aktif modül / son ders / "continue where you left off" |
| **tools** | `/tools` | 6 calculator'a direkt erişim (unique value prop) |
| **profile** | `/profile` | Avatar + username, level, XP history, badges, streak ring |

**Neden bu kombinasyon:**
- **home** onboarding + discovery'yi birleştiriyor → B8 çözüldü
- **learn** "continue" mantığı retention'a direkt hizmet ediyor
- **tools** bizim differentiator'ımız, bottom nav'a çıkması → "bu app'in eşsiz olduğu şey" mesajı
- **profile** gamification ve Featured kriterinin "user avatar + username" kuralı burada yaşıyor (B6)

**Bileşen:** `components/ui/BottomNav.tsx` — client component, current path'e göre active state, icon + label (lucide), min-h-16 (~64px), safe-area-inset-bottom padding.

### K3 — Mobile-first, desktop ikincil

Desktop ekranda 3-sütunlu güzel görünüyor ama **birincil hedef 375–430px viewport**. Tüm layout kararları önce iPhone 14 Pro (393×852) için alınacak, desktop `md:` breakpoint'te genişleyecek. Max content width 480px mobile → 720px desktop. **Home page bir "sayfa" değil, bir "mobile app ekranı" gibi tasarlanacak.**

### K4 — Onboarding: inline, pop-up değil

Kullanıcı app'i ilk açtığında:
1. **Hero** ("defi, demystified" — Doto)
2. **3-step explainer** ("learn by playing · real calculators · built on base")
3. **Modül grid** (şu an da var)
4. **CTA strip** ("start with defi basics →" — tek Base Blue button)

Pop-up yok, splash yok — scroll'la akıyor. Daha az kesinti, 3-saniye load target için daha az JS.

### K5 — Header yeniden düzen

Şu anki header: lockup sol + connect button sağ.
Yeni header (mobile): lockup sol + avatar chip sağ (XP sayacı ile birlikte). Connect button kaldırılıyor — MiniKit auto-authenticate ediyor, Base App içinde zaten bağlı.

**Base App dışında (browser):** avatar chip yerine "connect" fallback. MiniKit bunu zaten yapıyor — `context.user` yoksa `ConnectWallet` component'ine düşüyoruz.

### K6 — Manifest yapısı

`app/.well-known/farcaster.json/route.ts` oluşturacağız. Env variables:

```
NEXT_PUBLIC_URL=https://learn-defi.vercel.app
NEXT_PUBLIC_ONCHAINKIT_API_KEY=<alınacak, base.dev/dashboard>
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Learn DeFi
NEXT_PUBLIC_APP_ICON=/icon.png
NEXT_PUBLIC_APP_SPLASH_IMAGE=/splash.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#0000FF
NEXT_PUBLIC_APP_SUBTITLE=start onchain, the right way
NEXT_PUBLIC_APP_DESCRIPTION=Learn DeFi by playing. Six interactive modules with real calculators.
NEXT_PUBLIC_APP_PRIMARY_CATEGORY=education
NEXT_PUBLIC_APP_TAGS=defi,learn,calculator,beginner,base
NEXT_PUBLIC_APP_HERO_IMAGE=/og.png
NEXT_PUBLIC_APP_TAGLINE=defi, demystified
NEXT_PUBLIC_APP_OG_TITLE=Learn DeFi
NEXT_PUBLIC_APP_OG_DESCRIPTION=Learn DeFi by playing — Base-native mini app
NEXT_PUBLIC_APP_OG_IMAGE=/og.png
FARCASTER_HEADER=<base.dev'den alınacak, Faz 6'da>
FARCASTER_PAYLOAD=<aynı>
FARCASTER_SIGNATURE=<aynı>
```

Faz 1.5'te `.env.local` placeholder'larla açılacak, Faz 6'da production değerlerle doldurulacak.

---

## Bölüm 3 · Faz 1'den artan temiz şeyler

Bu değişiklikler **yazdığımız kodun çoğunu atmıyor**:

| Dosya | Durum |
|---|---|
| `app/globals.css` | ✅ Tamamen geçerli — Base brand tokens değişmedi |
| `components/brand/BaseSquare.tsx` | ✅ Aynı |
| `lib/wagmi/config.ts` | ✅ Fallback olarak tutulacak (Base App dışı) |
| `app/layout.tsx` | ⚠️ Minimal değişiklik: `Providers` artık `MiniKitProvider` sarıyor |
| `app/providers.tsx` | 🔄 `WagmiProvider` → `MiniKitProvider`'a sarılır, wagmi hâlâ içeride |
| `components/ui/ConnectButton.tsx` | 🔄 OnchainKit `<ConnectWallet />`'a delegated, bizim sadece styling override'ı |
| `app/page.tsx` | 🔄 Layout yeniden düzenlenecek (hero + explainer + grid + CTA strip) |
| `next.config.ts` | ✅ `serverExternalPackages` trick hâlâ gerekli |

---

## Bölüm 4 · Yeni dosya ağacı (güncellenmiş)

```
learn-defi/
├── app/
│   ├── layout.tsx                   # MiniKitProvider sarma
│   ├── providers.tsx                # MiniKitProvider
│   ├── page.tsx                     # home (hero + explainer + grid)
│   ├── learn/page.tsx               # aktif modül / continue
│   ├── tools/page.tsx               # 6 calculator grid
│   ├── profile/page.tsx             # avatar + xp + badges
│   ├── module/[slug]/
│   │   ├── page.tsx
│   │   ├── lesson/[id]/page.tsx
│   │   ├── quiz/page.tsx
│   │   └── tool/page.tsx
│   ├── globals.css                  ✅ Faz 1'den
│   └── .well-known/
│       └── farcaster.json/route.ts  ← YENİ, manifest
│
├── components/
│   ├── brand/BaseSquare.tsx         ✅ Faz 1'den
│   ├── ui/
│   │   ├── BottomNav.tsx            ← YENİ, 4 tab
│   │   ├── AppShell.tsx             ← YENİ, header + content + bottom nav wrapper
│   │   ├── UserChip.tsx             ← YENİ, avatar + XP
│   │   ├── Button.tsx               ← Faz 2
│   │   ├── Card.tsx                 ← Faz 2
│   │   ├── Progress.tsx             ← Faz 2
│   │   ├── NumberTicker.tsx         ← Faz 2
│   │   └── ConnectButton.tsx        🔄 OnchainKit wrapper (fallback durumu için)
│   ├── learning/
│   │   ├── ModuleCard.tsx
│   │   ├── LessonCarousel.tsx
│   │   ├── Quiz.tsx
│   │   ├── OnboardingExplainer.tsx  ← YENİ, 3-step how it works
│   │   └── XPReward.tsx
│   ├── tools/                       (Faz 3+)
│   └── gamification/                (Faz 5)
│
├── lib/
│   ├── wagmi/config.ts              ✅ Fallback
│   ├── minikit/
│   │   ├── provider.tsx             ← YENİ, MiniKit provider config
│   │   └── hooks.ts                 ← YENİ, wrapper hooks (useAppContext vb.)
│   └── formulas/ ...                (Faz 3+)
│
└── ... (docs, public, etc.)
```

---

## Bölüm 5 · Revised roadmap (10 saat planı güncellenmiş)

Faz 1 teknik olarak bitti (~45 dk harcandı). Faz 1.5 eklendi, geri kalan saatler yeniden bölüştürüldü.

| Faz | Süre | Kapsam |
|---|---|---|
| ~~Faz 0~~ | ~~45dk~~ | ✅ Kurulum |
| ~~Faz 1~~ | ~~60dk~~ | ✅ Brand foundation + wallet connection |
| **Faz 1.5** | **75dk** | **MiniKit migration + AppShell + bottom nav + onboarding + manifest skeleton** |
| Faz 2 | 60dk | State (Zustand) + UI primitives (Button, Card, Progress, NumberTicker) |
| Faz 3 | 75dk | Content yapısı + Modül 1 end-to-end (lesson carousel, quiz, gas tool) |
| Faz 4 | 180dk | Modül 2, 3, 4, 5 (her biri ~45dk) |
| Faz 5 | 75dk | Modül 6 (Advanced + Strategy Calc) — ADNYF port varsa, generic placeholder yoksa |
| Faz 6 | 75dk | Gamification polish (profile, badges, level-up anim, streak) |
| Faz 7 | 60dk | Base.dev kayıt, manifest finalize, metadata, screenshots, production deploy |
| Faz 8 | 45dk | Son kontrol, mobile test, launch 🚀 |

**Toplam:** ~14 saat dolu tempo. **10 saatlik hedef için alternatif:** Modül 6'yı v1.1'e bırak, Faz 5'i kısalt → 11 saat.

### Faz 1.5'in alt adımları (şimdi yapılacak):

1. **OnchainKit kur** — `npm install @coinbase/onchainkit`
2. **Providers refactor** — `providers.tsx`'e `MiniKitProvider` ekle, wagmi config içeride kalsın
3. **`setFrameReady()` bağla** — home page'de `useMiniKit` + `useEffect`
4. **AppShell component** — header + safe-area + content + bottom nav layout wrapper
5. **BottomNav component** — 4 tab, active state, lucide icons
6. **UserChip component** — `context.user.displayName` + `pfpUrl` veya fallback
7. **ConnectButton refactor** — OnchainKit `<ConnectWallet />` veya `<Identity>` ile değiştir
8. **Home page restructure** — hero + 3-step explainer + grid + CTA strip
9. **Manifest route** — `app/.well-known/farcaster.json/route.ts` (env placeholders)
10. **`.env.local`** — placeholder değerlerle
11. **Smoke test** — `npm run dev` + mobile viewport + connect flow

---

## Bölüm 6 · Açık sorular ve beklemede olanlar

1. **`NEXT_PUBLIC_ONCHAINKIT_API_KEY`** — Utkus'un [base.dev](https://base.dev) dashboard'undan API key alması gerek. V1.5'te env'de placeholder kalabilir, smoke test için şart değil ama Faz 6'dan önce alınmalı.
2. **Paymaster URL** — Faz 4+'ta gerçek transaction yapılacaksa gasless için lazım. Modül 6'da ADNYF calculator hesap yaparken chain call yapmıyor, yani v1'de Paymaster şart değil. V2'de "gerçek swap dene" lesson'ı eklenirse gerekli.
3. **ADNYF calculator kaynak kodu** — Utkus'un HTML dosyası hâlâ sohbete yüklenmedi. Faz 5'te lazım olacak.
4. **Base Rewards builder code** — Base.dev'de proje açıldığında auto-generated olacak. Faz 6'ya ertelendi.

---

## TL;DR Utkus için

1. ✅ Faz 1 teknik olarak bitti, yazdığımız kodun %85'i aynen kalıyor
2. 🔄 MiniKit'e geçiyoruz — senior Coinbase dev'in önereceği canonical yol, avatar/username/safe-area hediye geliyor
3. 🆕 Bottom nav geliyor (4 tab: home / learn / tools / profile), mobile-app hissi
4. 🆕 Home page hero + 3-step explainer + grid olarak yeniden düzenleniyor (Featured onboarding kriteri)
5. 🆕 Manifest route açılıyor (discovery + embed + kategori için)
6. ⏱️ +75dk Faz 1.5 ekleniyor, toplam plan hâlâ realistic (11–14h arası)
7. 🎯 Artık Featured eligibility'ye çok daha yakınız — Base Rewards'a giden yol açılıyor
