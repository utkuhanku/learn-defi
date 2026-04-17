# Learn DeFi — Ürün Gereksinim Dokümanı (PRD)

## 1. Özet

**Learn DeFi**, Base App içinde (ve bağımsız web'de) çalışan, DeFi'yi **sıfırdan ileri seviyeye** öğreten **oyunlaştırılmış** bir mini-uygulamadır. Kuru döküman sunumunun aksine, her kavram **interaktif bir araçla** (hesap makinesi, simülatör, canlı zincir verisi) pekiştirilir. Görsel dil 100% Base-native: yeni mavi kare logo, Base Sans / Inter Tight, grayscale-öncelikli paletle Base Blue'nun tek-accent olarak kullanıldığı minimal estetik.

## 2. Neden şimdi, neden Base

- **Dağıtım:** Base App 9 Nisan 2026 sonrasında mini app'leri standart web app olarak serve ediyor; `base.dev`'e kayıtla Coinbase Wallet kullanıcı tabanına erişim. Builder codes ile arama + keşif.
- **Pazar boşluğu:** Mevcut DeFi öğreticilerinin çoğu ya kuru makale (Investopedia) ya da içerik reklamı (project blog). Interaktif + oyunlaştırılmış + Base-native hibrit yok.
- **Utkus'un havuzu:** ADNYF çalışması (delta-nötr, funding rate, Pendle PT/YT, Aave) doğrudan "Advanced" modülüne hesap makinesi olarak döner — mevcut IP.
- **Builder code rewards:** Base Rewards programına eligible olursa ek gelir kanalı.

## 3. Hedef kitle

| Persona | İhtiyaç | Learn DeFi katkısı |
|---|---|---|
| **Kripto yeni başlayan TR kullanıcı** | "Wallet, gas, stablecoin ne?" | Modül 1–2, Türkçe dil desteği |
| **Orta seviye — farmer wannabe** | "APR vs APY, IL, slippage" | Modül 3–5 + IL ve APR→APY calculator'lar |
| **İleri — delta-nötr araştıran** | "Funding rate, PT/YT, health factor" | Modül 6 + ADNYF calculator |
| **Base-native builder** | Portfolio showcase | Wallet bağla → XP → onchain badge |

## 4. Çekirdek özellikler (v1 — launch day)

### 4.1 Learning Modules (6 adet)
1. **DeFi 101** — wallet, gas, L1/L2, Base nedir
2. **Stablecoinler** — USDC, peg mekaniği, depeg riskleri
3. **Lending & Borrowing** — Aave, LTV, health factor, likidasyon
4. **DEX & Swap'lar** — AMM, slippage, impermanent loss
5. **Yield Farming** — APR vs APY, compounding, risk-return
6. **Advanced** — delta-nötr, funding rate, Pendle PT/YT, leverage stratejileri

Her modül içinde:
- 4–6 adet **swipeable lesson card**
- Modül sonunda **quiz** (3–5 soru, XP ödülü)
- **Interactive tool** (aşağı bkz.)
- İsteğe bağlı **onchain action** (ör. Basescan üzerinde bir tx'i incele, USDC bakiyeni kontrol et)

### 4.2 Interactive tools
| Araç | Modül | Veri kaynağı |
|---|---|---|
| Gas Cost Comparator (L1 vs Base) | 1 | viem `getGasPrice` canlı |
| Stablecoin Peg Tracker | 2 | DeFiLlama API veya Chainlink |
| Health Factor / Liquidation Calculator | 3 | statik formül |
| Impermanent Loss Simulator | 4 | statik formül + slider |
| APR → APY Compounding Calculator | 5 | statik formül |
| **DeFi Strategy Calculator** (ADNYF tabanlı) | 6 | Utkus'un mevcut HTML dosyasından port |

### 4.3 Oyunlaştırma
- **XP sistemi:** her lesson +10, quiz tam puan +50, tool kullanım +15, onchain action +100
- **Seviye:** XP eşikleriyle Novice → Explorer → Trader → Strategist → Onchain Native
- **Daily streak:** ardışık gün sayacı, streak break penalty yok (dostane), 7 / 30 / 100 gün milestone
- **Badges:** modül tamamlama, ilk swap, ilk lending tx gibi milestone'lar. v1'de lokal; v2'de onchain soulbound (ERC-5192).
- **Leaderboard:** cüzdan adresine göre top 100, haftalık + all-time. v1'de lokal; v2'de backend.

### 4.4 Wallet & kimlik
- `@base-org/account` üzerinden **Sign in with Base** (Base Account connector)
- SIWE ile authentication (opsiyonel — progress'i sadece lokal tutmak da yeterli olabilir v1 için)
- `useAccount` ile kullanıcı kimliği = cüzdan adresi
- Cüzdan bağlı değilse tüm modüller guest mode'da çalışır, sadece onchain action ve leaderboard gated

### 4.5 Dil
- v1: **TR + EN** toggle (default TR, çünkü birincil pazar TR)
- Content `/content/{tr,en}/modules/*.json` içinde tutulur

## 5. v1 dışı (v2+ için not)
- Onchain soulbound badge mint'i (ERC-5192)
- Base.dev notifications API entegrasyonu (daily reminder)
- Arkadaşlarla karşılaştırma / sosyal feed
- Gerçek DeFi protokollerine tek-tıkla swap/deposit (OnchainKit Transaction UI)
- AI tutor ("sor istediğini" — Claude API entegrasyonu)
- NFT sertifika (modül bitirince mint)

## 6. Başarı metrikleri

| Metrik | 1 hafta hedefi | 1 ay hedefi |
|---|---|---|
| Cüzdan bağlama | 250 | 2,000 |
| Modül tamamlama (≥1) | 100 | 800 |
| 7-gün retention | %25 | %35 |
| Quiz çözümü | 500 | 5,000 |
| Base.dev rewards eligibility | kayıt | aktif |

## 7. Brand ve ton

- **Dil:** samimi, kod-native, lowercase başlıklar, uzun açıklamalardan kaçın
- **Ton:** "öğretmen değil, aynı havuzdaki kanka"
- **İkonografi:** Base Square estetiğiyle aynı radius ve oran — her card bir "block"
- **Hareket:** küçük, hızlı, amaçlı; Base Motion guideline'ına uygun
