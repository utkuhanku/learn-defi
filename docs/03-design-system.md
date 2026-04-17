# Learn DeFi — Design System (Base Brand Compliant)

Bu doküman Base'in resmi brand guideline'ına (base.org/brand) **birebir** sadık kalır. Her değer kaynaktan doğrulandı.

## 1. Temel felsefe (Base brand guideline'dan özet)

> "Grayscale ve negatif alan Base Blue'yu hiyerarşide geçmeli. Her elementin bağırdığı yerde hiçbiri duyulmaz. Renk ritim demektir, gökkuşağı değil: monokromla başla, bir aksan spotlight'la."

Buna göre **Learn DeFi UI'ı %80+ grayscale + negatif alan, %15 Base Blue vurgu, %5 secondary burst**. Secondary renkleri sadece quiz sonuç ekranları, XP burst, badge kazanma gibi **kritik anlarda** kullanırız.

## 2. Renk token'ları (kesin değerler)

### 2.1 Core palette
| Token | Hex | RGB | Kullanım |
|---|---|---|---|
| `--base-blue` | `#0000ff` | 0 0 255 | Tek primary aksan. CTA, active state, Base Square |
| `--gray-0` | `#ffffff` | 255 255 255 | Background light mode |
| `--gray-10` | `#eef0f3` | 238 240 243 | Surface, card bg |
| `--gray-15` | `#dee1e7` | 222 225 231 | Border, divider |
| `--gray-30` | `#b1b7c3` | 177 183 195 | Muted text, disabled |
| `--gray-50` | `#717886` | 113 120 134 | Secondary text |
| `--gray-60` | `#5b616e` | 91 97 110 | Body text on light |
| `--gray-80` | `#32353d` | 50 53 61 | Heading on light, surface on dark |
| `--gray-100` | `#0a0b0d` | 10 11 13 | Text primary, background dark |

### 2.2 Secondary palette (spotlight only)
| Token | Hex | Kullanım bağlamı |
|---|---|---|
| `--cerulean` | `#3c8aff` | Info state, link hover |
| `--tan` | `#b8a581` | Muted accent (pair with 1 vibrant) |
| `--yellow` | `#ffd12f` | XP burst, streak |
| `--green` | `#66c800` | Quiz correct, success |
| `--lime` | `#b6f569` | Badge glow |
| `--red` | `#fc401f` | Quiz wrong, liquidation warning |
| `--pink` | `#fea8cd` | Decorative only |

### 2.3 Kuralları (misuse önleme)
- **Gradient yok.** Tek yer: Doto display motion ve "novelty" moment (modül final burst).
- **Secondary color asla lead etmez.** Her zaman core paletten sonra.
- Aynı ekranda **3'ten fazla vibrant renk yok** — her zaman 1 muted + max 3 vibrant.
- Base Blue **over-use edilmez** — ekran başına 1 primary CTA + 1 tab indicator kuralı.

## 3. Typography

### 3.1 Font stack
```css
--font-sans: 'Inter Tight', 'Base Sans', system-ui, sans-serif;
--font-mono: 'Roboto Mono', 'Base Mono', ui-monospace, monospace;
--font-display: 'Doto', 'Roboto Mono', monospace;  /* sadece display, all caps */
```

- **Inter Tight** = Base Sans'ın resmi fallback'i (Base brand guideline'dan)
- **Roboto Mono** = Base Mono fallback
- **Doto** = ikincil tipografi, Google Fonts'ta mevcut, variable weight + roundness, **sadece all caps** ve **kısa mesajlar**

Next.js'te `next/font/google` ile self-host.

### 3.2 Type scale
| Token | Size | Line height | Weight | Tracking | Kullanım |
|---|---|---|---|---|---|
| `display-xl` | 72px | 100% | 500 | -3% | Hero headline, ana CTA sayfası |
| `display-l` | 56px | 100% | 500 | -3% | Module header |
| `heading-xl` | 40px | 110% | 600 | -2% | Section title |
| `heading-l` | 28px | 120% | 600 | -2% | Card title |
| `heading-m` | 20px | 130% | 500 | -1% | Subsection |
| `body-l` | 18px | 150% | 400 | 0 | Lesson body |
| `body-m` | 16px | 150% | 400 | 0 | Default |
| `body-s` | 14px | 140% | 400 | 0 | Caption, label |
| `mono-m` | 14px | 140% | 400 | 0 | Address, hash, data |
| `doto-display` | 48px+ | 100% | variable | custom | Novelty only |

### 3.3 Text style kuralları
- **Tüm başlıklar lowercase** (Base brand: "approachable, modern, code native")
- Heading ve body genellikle `var(--gray-100)` light, `var(--gray-0)` dark
- Link = `var(--base-blue)` + underline on hover
- Address/hash = mono, `var(--gray-60)`

## 4. Spacing ve layout

Base brand'in Square radius felsefesini layout'a taşır.

### 4.1 Spacing scale (4px base)
```
0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
```

### 4.2 Radius
```
--radius-xs: 4px;    /* chip, small badge */
--radius-sm: 8px;    /* button, input */
--radius-md: 16px;   /* card */
--radius-lg: 24px;   /* module card, modal */
--radius-xl: 32px;   /* hero card */
```
Base Square radius oranı: **karenin %22'si**. 64px kare → ~14px radius. Bu kuralı card'larda taklit: 200px yükseklik card → ~44px radius olmuyor; bunun yerine 16–24px sabit kullanıyoruz çünkü "friendly ama soft değil".

### 4.3 Grid
- Mobile (Base App): 4 sütun, 16px gutter, 16px margin
- Desktop landing: 12 sütun, 24px gutter, max 1200px

## 5. Bileşen özellikleri

### 5.1 Base Square (logo)
- Saf mavi kare, `#0000ff`, radius = %22 (brand'e birebir)
- Minimum boyut: 16px (icon), 24px (inline), 48px (hero)
- **Asla** gradient, border, drop shadow, renk değişimi yok
- Sadece blue, white, black — 3 versiyon

### 5.2 Button
| Variant | Background | Text | Border | Kullanım |
|---|---|---|---|---|
| `primary` | `var(--base-blue)` | white | none | Main CTA (max 1 per screen) |
| `secondary` | transparent | `var(--gray-100)` | 1px `var(--gray-30)` | Alt aksiyon |
| `ghost` | transparent | `var(--gray-60)` | none | Tertiary, nav |
| `success` | `var(--green)` | white | none | Quiz correct confirm |
| `danger` | `var(--red)` | white | none | Destructive |

- Padding: 12px 20px (md), 16px 28px (lg)
- Radius: `--radius-sm` (8px)
- Font: Inter Tight 500, 16px, kerning 0
- Hover: +4% lightness, 120ms ease
- Active: scale(0.98)

### 5.3 Card
- Background: `var(--gray-0)` light, `var(--gray-80)` dark
- Border: 1px solid `var(--gray-15)` light, `var(--gray-80)` dark
- Radius: `--radius-md` (16px)
- Padding: 24px
- Shadow: **yok** default; hover'da çok hafif `0 4px 24px rgba(0,0,255,0.08)`

### 5.4 ModuleCard (home grid)
- Aspect ratio 1:1 (Square feelings)
- Üstte modül ikonu (32px blue square variant)
- Altta başlık + progress bar
- Completed state: sağ üstte lime-green check

### 5.5 XP Progress bar
- Track: `var(--gray-10)`
- Fill: `var(--base-blue)`
- Height: 8px, radius: 4px
- Level-up'ta flash animasyonu (yellow → blue)

### 5.6 Quiz states
- Idle: gray-10 bg
- Correct: border 2px green + lime glow
- Wrong: border 2px red + subtle shake

### 5.7 Streak ring
- Circular progress, gray-10 track, yellow fill
- Center: flame icon (🔥 değil, lucide `Flame`) + day count
- 7 gün + milestone'da lime halo animasyonu

## 6. Motion (Base motion guideline'ına uygun)

- **Kısa ve amaçlı.** 120–240ms.
- **Ease:** `cubic-bezier(0.4, 0, 0.2, 1)` (standart), `cubic-bezier(0.2, 0.9, 0.3, 1)` (playful)
- **XP burst:** 400ms, number counter + yellow particle, framer-motion
- **Lesson card swipe:** spring `{ stiffness: 300, damping: 30 }`
- **Level up:** 600ms, square pulse from blue to white, full-screen briefly
- **Loading:** Base Square subtle pulse, no spinners

## 7. Dark mode

- Background: `var(--gray-100)` → `#0a0b0d`
- Surface: `var(--gray-80)` → `#32353d`
- Text: `var(--gray-0)` → white
- Base Blue: aynı (screen native, her iki mod için AA pass)
- Auto switch `prefers-color-scheme` + manual toggle

## 8. Icon seti

- **Lucide React** (geometric, Base-friendly)
- Stroke 1.5px
- Size: 16 / 20 / 24 / 32
- Color: inherit from text
- Kritik semantik iconlar: `Wallet`, `Flame`, `Trophy`, `Zap`, `BookOpen`, `Calculator`, `TrendingUp`, `ShieldCheck`, `ArrowLeftRight`, `Lock`

## 9. Accessibility

- Tüm text Base brand WCAG AA Large standardına uymak zorunda
- `#0000FF` on white: contrast ratio 8.59 — AA pass ✓
- Focus ring: 2px `var(--base-blue)` outline, 2px offset
- Touch target min: 44x44px (mobile in-app browser)
- Reduced motion: `prefers-reduced-motion` → tüm spring/bounce kapatılır, sadece opacity fade

## 10. Tailwind config

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'base-blue': '#0000ff',
        gray: {
          0: '#ffffff',
          10: '#eef0f3',
          15: '#dee1e7',
          30: '#b1b7c3',
          50: '#717886',
          60: '#5b616e',
          80: '#32353d',
          100: '#0a0b0d',
        },
        cerulean: '#3c8aff',
        tan: '#b8a581',
        yellow: '#ffd12f',
        green: '#66c800',
        lime: '#b6f569',
        red: '#fc401f',
        pink: '#fea8cd',
      },
      fontFamily: {
        sans: ['var(--font-inter-tight)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-doto)', 'monospace'],
      },
      borderRadius: {
        xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px',
      },
    },
  },
}
```
