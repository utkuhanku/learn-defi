# Learn DeFi — Planlama Dokümanları

Base App için oyunlaştırılmış DeFi öğretici mini app. Code'a geçmeden önce hazırlanan planlama seti.

## Okuma sırası

1. [`01-prd.md`](./01-prd.md) — ürün vizyonu, özellikler, başarı metrikleri
2. [`02-architecture.md`](./02-architecture.md) — tech stack, klasör yapısı, state
3. [`03-design-system.md`](./03-design-system.md) — Base brand compliant tokens, bileşenler
4. [`04-content-modules.md`](./04-content-modules.md) — 6 modülün lesson + quiz + tool detayı
5. [`05-roadmap.md`](./05-roadmap.md) — 10 saatlik ship plan
6. [`06-base-integration.md`](./06-base-integration.md) — wagmi, SIWE, base.dev kayıt

## Karar özet

- **Platform:** Base App (9 Nisan 2026 sonrası standart web app modeli)
- **Stack:** Next.js 15 + wagmi v2 + viem + `@base-org/account` + Tailwind v4 + Zustand
- **Dil:** TR birincil, EN v1.1
- **İçerik:** 6 modül × (5 lesson + 1 quiz + 1 interactive tool)
- **Oyunlaştırma:** XP, level (6 kademe), streak, badge (lokal v1, onchain v2)
- **Design:** Base brand'e %100 uyum — yeni mavi kare logo, Inter Tight (Base Sans fallback), monokrom-öncelikli + Base Blue aksan
- **Kimlik:** Sign In with Base (SIWE) — v1'de opsiyonel, v1.1'de zorunlu
- **Deploy:** Vercel → base.dev kayıt → Base App post

## Farcaster SDK yok

Base App artık Farcaster manifest'ine bakmıyor. `signIn`, `openUrl`, `ready`, `composeCast` gibi SDK metodlarını kullanmıyoruz. Detay: `06-base-integration.md` bölüm 3.

## Engelleyici / beklemede

- **ADNYF calculator port:** `defi_strategy_calculator.html` dosyası henüz sohbete yüklenmedi. Utkus dosyayı sohbete dropladığında Modül 6 tool'unu birebir port ederim. O zamana kadar generic delta-nötr placeholder koyacağız.

## Sıradaki adım

Dokümanları onayladığında kod tarafına geçiyoruz — roadmap Faz 0'dan başlayarak.
