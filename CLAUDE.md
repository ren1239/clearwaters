# Clear Waters Capital — Project Instructions

## What This Is
Asset management firm website for Clear Waters Capital LP. Long-term investment partnership focused on China & Hong Kong equities. The site is a content destination: original research, firm info, book recommendations, and a client portal link.

## Stack
- Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion
- MDX for research content (`/content/research/`)
- No CMS — content managed via `.mdx` files

## Design System — "Ink & Water"
| Token | Hex | Usage |
|-------|-----|-------|
| Ivory | `#f7f5f0` | Page backgrounds |
| Ink | `#1c1c1c` | Primary text, headings |
| Teal | `#2d8b8b` | Accent, BUY badge, active states |
| Gold | `#c8a96e` | LETTER badge, decorative rule |
| Muted border | `#e0ddd8` | Dividers |
| Subtle text | `#aaa` | Dates, metadata |

- **Display font**: Playfair Display or DM Serif Display (NOT Inter, Roboto, or system fonts)
- **Body/UI font**: DM Sans or Instrument Sans
- **Background photo**: `/public/outdate.jpg` — ocean/boat — used on homepage hero only

## Site Structure
```
/              Homepage (Minimal Gateway, dark overlay hero)
/research      Research hub (chronological feed, filterable)
/research/[slug]  Individual articles (MDX)
/books         Book recommendations
/about         Firm description
→ client.clearwaterscapital.com  (external client portal, unchanged)
```

## Research Article Format Rules
Every memo MUST have these sections in this exact order:
1. Investment Thesis
2. Business Overview
3. Financial Analysis
4. Valuation
5. Risks
6. Conclusion

**No `## Disclosure` section in the MDX body** — it renders automatically at the bottom of every article.

**Figure placement:** Always use named slots — never place images mid-paragraph:
- `<Figure slot="post-intro" />` — after thesis box
- `<Figure slot="post-section" />` — after a body section
- `<Figure slot="full-width" />` — full column width

## MDX Frontmatter Schema
Every research file MUST include all applicable fields:
```yaml
---
title: ""
slug: ""
date: "YYYY-MM-DD"
type: "memo" # memo | letter
category: "Deep Dive" # Deep Dive | Initiation | Update | Quarterly Letter
ticker: "$XXXX"         # omit for letters — see Ticker Format table below
rating: "BUY"           # BUY | HOLD | SELL — omit for letters
currency: "USD"         # USD | HKD | KRW | CNH | CNY | SGD | TWD — defaults to USD
exchange: ""            # optional: KRX | HKEX | NYSE | NASDAQ | OTC | SSE | SZSE
priceTarget: 0          # in the currency field above — omit for letters
priceAtPublication: 0   # in the currency field above — omit for letters
excerpt: ""             # 1–2 sentences shown in the research feed
summary: ""             # 1–2 sentence pull-quote shown at top of article body
pdfUrl: ""              # letters only
---
```

### Ticker Format by Exchange
| Exchange | Ticker format | Currency | Example |
|----------|--------------|----------|---------|
| NYSE / NASDAQ | `$TICKER` | USD | `$GOOGL` |
| OTC / ADR | `$TICKER` | USD | `$TCEHY`, `$SSNLF` |
| Hong Kong (HKEX) | `$XXXX.HK` | HKD | `$700.HK`, `$9988.HK` |
| Korea (KRX) | `$XXXXXX.KS` | KRW | `$005930.KS` |
| Shanghai (SSE) | `$XXXXXX.SS` | CNY | `$600519.SS` |
| Shenzhen (SZSE) | `$XXXXXX.SZ` | CNY | `$000858.SZ` |
| Taiwan (TWSE) | `$XXXX.TW` | TWD | `$2330.TW` |

Yahoo Finance uses these suffixes and returns prices in the local currency. The live price badge formats with the correct symbol (₩ KRW, HK$ HKD, etc.). If the ticker can't be resolved, the badge falls back to "—" gracefully.

### Section Mapping (when converting existing research)
| Required section | Pull content from source |
|-----------------|--------------------------|
| **Investment Thesis** | Thesis paragraphs, "Why Now", "What the Market Is Missing", summary bullets |
| **Business Overview** | Business description, company drivers (e.g. "Driver 1/2/3"), segment overview |
| **Financial Analysis** | Financial tables, revenue/margin history, segment P&L |
| **Valuation** | Valuation methodology, P/E or DCF discussion, price target scenarios |
| **Risks** | Risk section (rename "Risk" → "Risks" if needed) |
| **Conclusion** | "What to Watch", catalyst timeline, closing conviction statement |

## Publishing Workflow — New Research
1. Write research with Claude in conversation
2. Claude produces finished `.mdx` with correct frontmatter + Figure tags
3. Drop in `/content/research/[slug].mdx` → git push → published
4. Live price is fetched at render time (teal badge, falls back to "—")

## Publishing Workflow — Converting Existing Research
When the user provides a path to an existing `.md` or `.mdx` research file:
1. **Read the file** to understand the content, company, and financial figures
2. **Identify the currency** — check what currency prices/targets are quoted in; do NOT convert figures, keep them in original currency and set the `currency` field accordingly
3. **Map sections to required order** — restructure under the 6 required headings (Investment Thesis → Business Overview → Financial Analysis → Valuation → Risks → Conclusion). Preserve all substance; only reorganise, trim, or lightly rephrase for house style
4. **Write the frontmatter** — infer slug (`YYYY-MM-company`), date, category, ticker, rating, priceTarget, priceAtPublication, currency, exchange from the source document
5. **Place Figure tags** — if the source references charts or images, insert `<Figure />` placeholders with appropriate slots and ask the user to confirm image filenames
6. **Output the finished `.mdx`** — save to `/content/research/[slug].mdx`
7. **Do not fabricate data** — if the source omits a required frontmatter field, ask the user rather than guessing
8. **Replace multi-row financial tables with charts** — any estimates or financial data table with 3+ rows should be rendered as a Python matplotlib chart (using the clearwaters Ink & Water palette) and inserted as a `<Figure />`. Add the chart generation code to `scripts/generate_[company]_charts.py`. Simple lookup tables (≤3 rows, e.g. scenario tables) may stay as markdown

## What NOT to Do
- Do not use Inter, Roboto, Arial, or system-ui for display/heading fonts
- Do not reorder research article sections
- Do not place Figure components mid-paragraph
- Do not add `/toolbox` back — it's been removed
- Do not link to `clarity.clearwaterscapital.com` — it's shutting down
- Do not build a CMS or auth layer in this phase
- Do not start `/tools` section yet (Monte Carlo simulation is a future phase)

## Design Spec
Full design document: `docs/superpowers/specs/2026-03-10-clearwaters-redesign-design.md`
