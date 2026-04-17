# Learn DeFi — 10 Saatlik Ship Roadmap

Bugün shipliyoruz. 10 saat hedef, realistik olarak v1.0 launch-ready.

## Öncelik ilkeleri
1. **Her faz demo-able olmalı** — erken durursak bile ortada bir şey kalır.
2. **Content > feature bloat.** 6 modül tam > 10 modül yarım.
3. **Base App in-app browser**'da mobile-first test et, desktop süslemeyi sona bırak.
4. **Deploy'ı erken yap.** Vercel preview URL 1. saatte hazır olmalı ki iteratif push edebilelim.

---

## Faz 0 · Kurulum (0:00 → 0:45)

- [ ] `npx create-next-app@latest learn-defi --typescript --tailwind --app --no-src-dir`
- [ ] Dependency'ler:
  ```
  npm i wagmi viem @tanstack/react-query @base-org/account
  npm i zustand framer-motion lucide-react recharts
  npm i -D @types/node
  ```
- [ ] Font: `next/font/google` ile Inter Tight + Roboto Mono + Doto
- [ ] `globals.css`'e Base brand renk token'ları (CSS variables)
- [ ] `tailwind.config.ts` design-system doc'undaki gibi extend et
- [ ] `lib/wagmi/config.ts` — Base chain + baseAccount + injected
- [ ] `app/providers.tsx` — WagmiProvider + QueryClientProvider
- [ ] `app/layout.tsx` — font yükle, metadata, providers sar
- [ ] Vercel'e ilk deploy → preview URL al
- [ ] Git repo oluştur, ilk commit

**Checkpoint:** boş Next.js, Base chain'e bağlı wagmi, Vercel'de canlı.

---

## Faz 1 · Brand ve UI temel (0:45 → 2:00)

- [ ] `components/brand/BaseSquare.tsx` — SVG blue square, radius %22
- [ ] `components/ui/Button.tsx` — primary/secondary/ghost/success/danger variant
- [ ] `components/ui/Card.tsx` — Base-rounded card
- [ ] `components/ui/Progress.tsx` — XP bar
- [ ] `components/ui/NumberTicker.tsx` — framer-motion animated number
- [ ] `components/ui/Chip.tsx`
- [ ] `components/ui/ConnectButton.tsx` — Base Account connect + disconnect
- [ ] Home page iskeleti: header (XP bar + streak + wallet), module grid placeholder
- [ ] Dark mode toggle (system default)

**Checkpoint:** boş home page ama Base brand UI hissi, wallet bağla çalışıyor.

---

## Faz 2 · State ve progress sistemi (2:00 → 2:45)

- [ ] `stores/useProgress.ts` — Zustand + persist
- [ ] `stores/useLocale.ts` — TR/EN toggle
- [ ] `lib/formulas/*.ts` — tüm formülleri önceden yaz (impermanent loss, health factor, APR→APY, delta-neutral skeleton)
- [ ] XP/level helper fonksiyonları
- [ ] Streak touch logic (gün başı detection)
- [ ] Badge earn flow

**Checkpoint:** console'dan `useProgress.getState().addXp(100)` → UI bar güncelleniyor, localStorage'a yazıyor.

---

## Faz 3 · Content yapısı + Modül 1 (2:45 → 4:00)

- [ ] `content/tr/modules.json` — 6 modül meta
- [ ] `content/tr/lessons/defi-basics.json` — 5 lesson tam içerik
- [ ] `content/tr/quizzes/defi-basics.json` — 5 soru
- [ ] `lib/content.ts` — dinamik loader
- [ ] `app/module/[slug]/page.tsx` — modül ana (lesson listesi + progress)
- [ ] `app/module/[slug]/lesson/[id]/page.tsx` — LessonCarousel, swipe, complete
- [ ] `app/module/[slug]/quiz/page.tsx` — Quiz component
- [ ] `components/learning/LessonCarousel.tsx`
- [ ] `components/learning/Quiz.tsx`
- [ ] `components/learning/XPReward.tsx` — burst animasyon
- [ ] Modül 1 tool: `components/tools/GasComparator.tsx`

**Checkpoint:** Modül 1 baştan sona çalışıyor — lesson okuma, quiz çözme, tool kullanma, XP kazanma.

---

## Faz 4 · Kalan 5 modül (4:00 → 7:00)

Paralel çalışma pattern'i: her modül ~35 dk.

- [ ] Modül 2 · Stablecoinler + PegTracker (DeFiLlama API)
- [ ] Modül 3 · Lending + HealthFactorCalc
- [ ] Modül 4 · DEX + ILSimulator
- [ ] Modül 5 · Yield + AprApyCalc
- [ ] Modül 6 · Advanced + StrategyCalc (ADNYF port)

**Not:** Modül 6 tool — `defi_strategy_calculator.html` yoksa generic delta-neutral skeleton yap, Utkus dosyayı yüklediğinde iterate ederiz.

**Checkpoint:** 6/6 modül çalışıyor, tüm tool'lar interaktif.

---

## Faz 5 · Gamification polish (7:00 → 8:00)

- [ ] `app/profile/page.tsx` — wallet, level, XP history, badges grid
- [ ] `components/gamification/StreakRing.tsx`
- [ ] `components/gamification/BadgeGrid.tsx`
- [ ] `components/gamification/LevelBar.tsx`
- [ ] Home grid: completed module'ler işaretli, kilitli değil (free play)
- [ ] Level-up full-screen animation
- [ ] Share result ekranı ("Learn DeFi'de Level 3 oldum" — v1'de screenshot, v2'de deep link)

**Checkpoint:** profil sayfası eksiksiz, level-up feels good.

---

## Faz 6 · Base App uyum + deploy (8:00 → 9:00)

- [ ] Mobile viewport test (Chrome DevTools responsive)
- [ ] Safe area insets (iOS notch)
- [ ] `app/icon.png` 1024x1024 — pure Base blue square, white bg
- [ ] `app/apple-icon.png`, `favicon.ico`
- [ ] Metadata: `openGraph`, `twitter`, `description`
- [ ] `public/screenshot-1.png` ... `screenshot-3.png` — 3 ana ekran
- [ ] `public/og.png` 1200x630 — hero
- [ ] `robots.txt`, `sitemap.ts`
- [ ] Production deploy Vercel
- [ ] Base.dev'de proje oluştur:
  - name: Learn DeFi
  - tagline: "bankaya değil, koda"
  - description: "DeFi'yi oyunla öğren. 6 modül, interaktif hesap makineleri, Base-native."
  - category: Education / DeFi
  - primary URL: vercel deploy URL
  - icon, screenshots, OG upload
  - builder code (kayıt için)

**Checkpoint:** Base.dev listed, preview'da test edildi, canlı.

---

## Faz 7 · Son kontrol + launch (9:00 → 10:00)

- [ ] Tüm modülleri mobile'da baştan sona çöz — her bug'ı fix
- [ ] Performance: Lighthouse audit (mobile), LCP < 1.5s
- [ ] Base App in-app browser gerçek test
- [ ] Wallet bağlama, disconnect, re-bağlama edge case'leri
- [ ] Dark mode full review
- [ ] TR text proofread (typo, eksik çeviri)
- [ ] Twitter / X post için screenshot + caption hazırla
- [ ] Base App'te post publish — launch 🚀

---

## Risk ve fallback

| Risk | Plan B |
|---|---|
| ADNYF calculator port süreyi aşar | Modül 6 tool'u generic delta-nötr placeholder ile çıkar, v1.1'de iterate |
| DeFiLlama API rate limit | Server-side `revalidate: 60` + fallback static data |
| Base Account connector bug | `injected()` (MetaMask) fallback'i zaten config'te var |
| Font yükleme ağır | Doto'yu display-only (2–3 ekranda) kullan, gerisi Inter Tight |
| Base.dev kayıt gecikir | Vercel URL ile doğrudan paylaş, registrasyonu paralel sürdür |
| 10 saat yetmez | 5 modülle launch (advanced'i v1.1'e ertele) |

## Launch sonrası (v1.1 bu hafta)

- Advanced modül tool'unu ADNYF HTML'inden full port
- Base.dev kayıt complete + builder code
- EN çeviri
- Base.dev notifications API entegrasyonu (hazır olunca)
- Daily streak push notification

## v2 (önümüzdeki 2 hafta)

- Onchain soulbound badge (ERC-5192) — completion NFT
- Global leaderboard (Supabase)
- AI tutor (Claude API) — "sorunu sor" butonu
- OnchainKit Transaction UI — gerçek swap/deposit lessons
- Sosyal feed: arkadaşların modüllerini gör, challenge gönder
