# Clear Waters Capital — Website Redesign & Research Hub
**Date:** 2026-03-10
**Status:** Approved

---

## Overview

Redesign of clearwaterscapital.com to bring research in-house and establish a distinctive editorial identity. The site's primary purpose shifts from a placeholder with external links to a proper content destination — a place where investors and prospects can read original research, understand the firm's thinking, and get in contact.

`clarity.clearwaterscapital.com` is shutting down. All research moves to `/research` on the main domain.

---

## Design System

### Palette — "Ink & Water"
| Token | Value | Usage |
|-------|-------|-------|
| Ivory | `#f7f5f0` | Page background, light surfaces |
| Ink | `#1c1c1c` | Primary text, headings, active states |
| Teal | `#2d8b8b` | Accent, BUY badge, active filters, links |
| Gold | `#c8a96e` | LETTER badge, decorative rule, quarterly letters |
| Muted | `#e0ddd8` | Borders, dividers |
| Subtle | `#aaa` | Secondary text, dates, metadata |

### Typography
- **Display / Headings**: Characterful serif (e.g. Playfair Display, DM Serif Display) — NOT Inter, Roboto, or system fonts
- **Body / UI**: Clean sans (e.g. DM Sans, Instrument Sans)
- **Existing**: Geist Sans already installed — evaluate whether to keep or replace
- **Principle**: Typography-forward, editorial weight, generous line-height on body copy

### Motion
- Page-load staggered fade-in (Framer Motion, already installed)
- Filter panel: smooth slide-down reveal
- Hover states: subtle lift on article rows
- No excessive animation — restraint matches the brand

### Signature Detail
- Grain texture overlay on the homepage hero (CSS `feTurbulence` SVG filter, ~6% opacity)
- Teal left-border accent on featured/active items

---

## Information Architecture

```
/ (Home)
/research (Research hub — new heart of site)
/research/[slug] (Individual article pages)
/books
/about
→ client.clearwaterscapital.com (external, unchanged)
```

**Removed:** `/toolbox` page (absorbed into future `/tools` section), `Analysis` nav link to Clarity

**Future (not this phase):** `/tools` section including Monte Carlo simulation

---

## Pages

### 1. Home `/`
**Purpose:** Welcome space. First impression of the firm. Directs visitors to research.

**Layout:** Minimal Gateway with full-bleed ocean photo background
- Full-viewport background: existing `/outdate.jpg` ocean/boat photo
- Dark overlay (~85% opacity): `linear-gradient` from `#0a1628` to `#1a2d4a`
- Grain texture overlay: SVG `feTurbulence` at ~6% opacity
- Content centered vertically and horizontally
- Firm name in teal, small caps, generous letter-spacing
- Tagline: "Think. / Concentrate. / Compound." — large, bold, ivory
- Gold horizontal rule (28px wide, 1px tall) below tagline
- Subtext: "In still waters, we find clarity." — muted ivory
- Two CTAs stacked: `READ OUR RESEARCH` (teal fill) · `CONTACT US` (ghost border)

**Nav:** Minimal — firm name left, links right. No border, floats over hero.

### 2. Research Hub `/research`
**Purpose:** Index of all published memos and quarterly letters. Chronological, filterable.

**Layout:** Chronological feed
- Page title: "Research" (large serif, 32px+)
- Filter row: `All · Memos · Letters` pills + `Filter` button right-aligned
- Filter button click reveals company ticker chips below (auto-generated from frontmatter, smooth slide-down)
- Active filter state: pill/button fills ink black
- Article rows: 2-column grid — `[80px date+type tag] [content]`
- `MEMO` tag: ink black fill
- `LETTER` tag: gold fill
- Each row: title, 1-line excerpt, metadata badges (ticker · rating · PT · live price)
- Live price badge: teal border, teal text
- PDF letters: gold "PDF DOWNLOAD" badge instead of price metadata
- Count footer: "— N pieces published —"

### 3. Research Article `/research/[slug]`
**Purpose:** Full individual research memo or quarterly letter.

**Layout:** Editorial single column, max-width ~680px, centered

**Fixed header block (every article):**
```
[Category tag] · [Sector]
[Title — large serif]
[Author] · [Date]
---
[Ticker badge] [Rating badge] [Price Target] [Price at Publication] [Live Price (fetched)]
---
[Investment thesis — italic pull quote box, gold left border]
```

**Body sections (always in this order for memos):**
1. Investment Thesis
2. Business Overview
3. Financial Analysis *(with Figure slots)*
4. Valuation
5. Risks
6. Conclusion
7. Disclosure *(standard footer block)*

**Figure placement rules:**
- `<Figure slot="post-intro" />` — after thesis box
- `<Figure slot="post-section" />` — after any body section
- `<Figure slot="full-width" />` — spans full column width
- Figures always follow a section heading, never mid-paragraph
- Caption below figure, muted text, system font

**Quarterly Letters:** Same header block (minus ticker/rating/price fields), body is free-form prose, PDF download button prominent at top.

### 4. Books `/books`
**Purpose:** Reading list. Unchanged in structure, restyled with Ink & Water palette.

### 5. About `/about`
**Purpose:** Firm description and investment philosophy. Unchanged in content, restyled.

---

## Content System

### Publishing Workflow
1. Write research with Claude in conversation
2. Claude produces finished `.mdx` file with correct frontmatter + `<Figure>` tags
3. Drop file in `/content/research/[slug].mdx`
4. Auto-publishes — no CMS, no deployment step beyond a git push

### MDX Frontmatter Schema (required fields)
```yaml
---
title: "Tencent: The Network That Compounds Quietly"
slug: "tencent-network-compounds"
date: "2026-03-10"
type: "memo" # memo | letter
category: "Deep Dive" # Deep Dive | Initiation | Update | Quarterly Letter
ticker: "$TCEHY" # omit for letters
rating: "BUY" # BUY | HOLD | SELL — omit for letters
priceTarget: 72 # USD — omit for letters
priceAtPublication: 51.20 # USD — omit for letters
excerpt: "Mini-programs monetisation, video accounts advertising ramp..."
pdfUrl: "" # for letters only
---
```

### Live Price
- Fetched at render time via a financial data API (e.g. Yahoo Finance unofficial, or a lightweight provider)
- Displayed in teal badge: `Now $53.40 ↑` with directional arrow vs publication price
- Falls back to "—" gracefully if fetch fails

### Format Rules (enforced by Claude)
- Section order is fixed — never reorder
- Figures always placed in named slots, never inline
- Frontmatter always complete before file is delivered
- Disclosure block is always the final section
- No section may be omitted except by explicit instruction

---

## Technical Notes

- **Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion (unchanged)
- **New dependencies:** `next-mdx-remote` or `@next/mdx` for MDX rendering; a financial data client for live prices
- **Nav update:** Remove Toolbox and Analysis links; add Research
- **`.gitignore`:** Add `.superpowers/`
- **Out of scope this phase:** Monte Carlo tools, `/tools` section, any CMS integration

---

## Out of Scope

- Monte Carlo simulation (future `/tools` phase)
- Authentication / gated research
- Email newsletter / subscriber capture
- CMS dashboard
