# Learn DeFi — İçerik Modülleri

6 modül, toplam ~30 lesson, 6 quiz, 6 interactive tool. Tüm içerik TR birincil, EN çeviri v1 launch sonrası.

---

## Modül 1 · DeFi 101 · "bankaya değil, koda"

**Slug:** `defi-basics`
**Icon renk:** base-blue
**Hedef:** crypto-kurious ama hiç başlamamış kullanıcıyı temel kavramlara oturtmak
**Tahmini süre:** 8 dk

### Lessons (5)
1. **DeFi nedir?** — merkezi vs merkeziyetsiz finans, smart contract
2. **Cüzdan nedir?** — self-custody, seed phrase güvenliği, EOA vs smart wallet
3. **Gas nedir?** — neden ödüyorsun, L1 vs L2 fark
4. **Base nedir?** — Coinbase L2, Ethereum uyumlu, ucuz + hızlı
5. **İlk tx'in neye benzer?** — onchain transaction anatomy

### Quiz (5 soru örnek)
1. Hangisi DeFi'nin özelliği **değildir**? → "7/24 çalışma müdürü"
2. Base nedir? → "Coinbase tarafından inkübe edilen Ethereum L2"
3. Gas fee neden var? → "validator'lar tx'i işlemek için"
4. Seed phrase nerede saklanmamalı? → "cloud notlar"
5. Smart wallet EOA'ya göre avantajı? → "sosyal recovery, batched tx"

### Interactive tool: **Gas Cost Comparator**
- Input: tx tipi (transfer / swap / mint)
- Output: L1 Ethereum fee vs Base fee — canlı gas price
- Data: `viem` `publicClient.getGasPrice()` her 30s refetch
- UX: side-by-side bar chart, "Base'de %X tasarruf" headline

### Onchain action (opsiyonel XP)
- Cüzdan bağla → Base'deki ETH bakiyeni göster → +50 XP

---

## Modül 2 · Stablecoinler · "bir dolar neden bir dolar?"

**Slug:** `stablecoins`
**Icon renk:** green (success / stability)
**Süre:** 10 dk

### Lessons (5)
1. **Stablecoin nedir?** — dolara bağlı token, neden önemli
2. **USDC, USDT, DAI farkı** — fiat-backed, crypto-backed, algorithmic
3. **Peg nasıl çalışır?** — rezerv, redemption, arbitraj
4. **Depeg — ne zaman endişelen?** — UST, USDC Mart 2023 flash depeg
5. **Base'de stablecoin** — USDC native, transfer ücreti ~$0.001

### Quiz (5)
1. USDC hangi mekanizmayla peg'ini korur? → "Circle rezervleri + redemption"
2. Algoritmik stablecoin riski nedir? → "reflexivity / death spiral"
3. Base'de en çok kullanılan stablecoin? → "USDC (native)"
4. DAI hangi türe girer? → "crypto-backed, overcollateralized"
5. 1 USDC = 0.98$ olduğunda ne olur? → "arbitrageur 1$'a redeem edip kârla satar"

### Interactive tool: **Stablecoin Peg Tracker**
- Input: USDC / USDT / DAI seçim
- Output: 24h / 7d / 30d peg deviation grafiği
- Data: DeFiLlama stablecoins API (`https://stablecoins.llama.fi/stablecoin/{id}`)
- UX: Line chart (recharts), peg from $1 line vurgulu, depeg eşiği ±%0.5

---

## Modül 3 · Lending & Borrowing · "paranı çalıştır, kefil ol"

**Slug:** `lending`
**Icon renk:** cerulean
**Süre:** 12 dk

### Lessons (5)
1. **Aave basics** — supply / borrow, interest rate
2. **Overcollateralization** — neden %100'den fazla teminat
3. **Health factor** — 1.0'dan aşağı = likidasyon
4. **LTV & liquidation threshold** — fark nedir
5. **Variable vs stable rate** — ne zaman hangisini seç

### Quiz (5)
1. Health factor 0.9 olursa ne olur? → "pozisyon likide edilebilir"
2. LTV %75, sen %60'ta borç aldıysan güvende misin? → "evet ama volatility buffer'ın yok"
3. Supply APY neden Borrow APY'den düşük? → "protokol spread'i + utilization"
4. Likidasyon penalty'i ne işe yarar? → "likidatöre ödül"
5. ETH'yi collateral koyup USDC borç aldın. ETH düşerse? → "health factor düşer"

### Interactive tool: **Health Factor / Liquidation Calculator**
- Input: collateral asset + miktar, borç asset + miktar, LTV, LT, fiyatlar
- Output: current HF, likidasyona düşen fiyat, "safety margin" bar
- Formül: `HF = (collateral_usd × LT) / borrow_usd`
- UX: slider'larla canlı güncellenen HF gauge (green > 1.5, yellow 1.2–1.5, red < 1.2)

---

## Modül 4 · DEX & Swap'lar · "iki token, bir havuz"

**Slug:** `dex-swaps`
**Icon renk:** cerulean + yellow accent
**Süre:** 12 dk

### Lessons (5)
1. **AMM nedir?** — x*y=k, Uniswap model
2. **Liquidity provider** — ne sunarsın, ne alırsın
3. **Slippage & price impact** — küçük vs büyük havuz
4. **Impermanent loss — asıl korku** — ne zaman gerçek olur
5. **Base'de DEX'ler** — Aerodrome, Uniswap, BaseSwap

### Quiz (5)
1. x*y=k formülü ne anlatır? → "constant product invariant"
2. Impermanent loss ne zaman **permanent** olur? → "liquidity'i çekince"
3. Slippage %5 ayarladın, havuz sığ. Ne olabilir? → "tx başarısız veya kötü fiyatla geçer"
4. Concentrated liquidity avantajı? → "aynı TVL ile daha çok fee"
5. LP olmak hangi risk? → "impermanent loss + smart contract"

### Interactive tool: **Impermanent Loss Simulator**
- Input: token A başlangıç fiyat, token B başlangıç fiyat, fiyat değişim % slider'ları
- Output: IL % değeri, "hold etseydin vs LP olsaydın" karşılaştırma
- Formül: `IL = 2*sqrt(price_ratio)/(1+price_ratio) - 1`
- UX: iki eğri üst üste (HODL vs LP value), slider çekildikçe canlı

---

## Modül 5 · Yield Farming · "apr mı apy mi?"

**Slug:** `yield`
**Icon renk:** lime + yellow
**Süre:** 10 dk

### Lessons (5)
1. **APR vs APY** — compounding farkı
2. **Farming mekaniği** — LP token + reward token
3. **Risk-return spektrumu** — %5 USDC lending → %200 memecoin farm
4. **Dilution & emission** — neden APY düşer
5. **Strateji seçimi** — delta-nötr, pair farming, single-sided

### Quiz (5)
1. APR %10, daily compounding APY kaç? → "~%10.52"
2. Yüksek APY gördün, şüphelen? → "token emission, dilution, rug"
3. Delta-nötr farming amacı? → "fiyat riskini sıfırla, sadece fee kazan"
4. Impermanent loss + farming reward kombinasyonu? → "net getiriyi her zaman hesapla"
5. Real yield vs emissions yield farkı? → "real = fee gelirinden, emission = inflasyon"

### Interactive tool: **APR → APY Compounding Calculator**
- Input: APR, compounding frequency (daily / weekly / monthly / continuous), süre
- Output: APY, nihai bakiye, compound grafiği
- Formül: `APY = (1 + APR/n)^n - 1`
- UX: input değişince line chart büyüyen curve, "X$ yatır → Y$ al" ticker

---

## Modül 6 · Advanced · "delta-nötr ve ötesi"

**Slug:** `advanced`
**Icon renk:** base-blue + deep (gray-80 card bg)
**Süre:** 18 dk

### Lessons (6 — biraz daha uzun)
1. **Leverage dinamiği** — 2x long demek ne
2. **Funding rate** — perpetual futures, long/short imbalance
3. **Delta-nötr stratejiler** — hedge + yield
4. **Pendle PT/YT** — yield tokenization
5. **Chainlink CCIP & cross-chain** — neden gerekli
6. **Strateji inşa et** — modüller birleşince

### Quiz (5 — daha zor)
1. Funding rate negatifse kim ödüyor? → "short, long'a"
2. Delta-nötr %6 APY ayıya düşerse? → "yield + hedge getirisi = genelde pozitif"
3. Pendle PT nedir? → "principal token — vade sonunda sabit değere döner"
4. Pendle YT? → "yield token — variable yield kaptırır, vade sonunda 0"
5. eMode Aave'de ne yapar? → "aynı asset kategorisinde yüksek LTV"

### Interactive tool: **DeFi Strategy Calculator** (ADNYF tabanlı)
- **Kaynak:** Utkus'un mevcut `defi_strategy_calculator.html` dosyası
- Port edilecek: React component olarak yeniden yazılır, Base design system'e uyarlanır
- Senaryolar: delta-nötr, bullish, bearish
- Bileşenler: Aave V3 collateral, Hyperliquid funding, Pendle PT/YT, CCIP
- Output: senaryo bazlı APY (delta-nötr %6.2, bullish +%24.5, bearish +%4 — mevcut çalışmadan)
- **Not:** HTML dosyası uploada eklenmediyse generic delta-neutral formülüyle placeholder koyarız, Utkus dosyayı sohbete yükler, port ederim.

---

## XP haritası

| Aktivite | XP |
|---|---|
| Lesson tamamla | +10 |
| Quiz geç (≥3/5) | +30 |
| Quiz tam puan (5/5) | +50 |
| Tool ilk kullanım | +15 |
| Tool 5+ kullanım | +25 ek |
| Daily streak (günlük ilk login) | +5 |
| 7-gün streak milestone | +100 |
| Cüzdan bağla | +50 |
| Modül tamamla (tüm lesson + quiz) | +150 |
| Tüm 6 modül tamamla | +500 (final badge) |

## Seviye eşikleri
| Level | XP | Başlık |
|---|---|---|
| 1 | 0 | Novice |
| 2 | 100 | Curious |
| 3 | 300 | Explorer |
| 4 | 700 | Trader |
| 5 | 1300 | Strategist |
| 6 | 2000 | Onchain Native |

## Badge listesi (v1 — lokal, v2 onchain)

- `first-wallet` — ilk cüzdan bağlama
- `defi-101` — Modül 1 tamam
- `stable-pilot` — Modül 2
- `lender` — Modül 3
- `swapper` — Modül 4
- `farmer` — Modül 5
- `strategist` — Modül 6
- `streak-7` — 7 gün streak
- `streak-30` — 30 gün streak
- `perfect-quiz` — bir quizde 5/5
- `all-modules` — 6/6 modül (final)
