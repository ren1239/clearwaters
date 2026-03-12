# Research System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full research content system — MDX file loading, research hub page, individual article pages, live price badges, company filters, and Figure component — so research memos and quarterly letters can be published by dropping an `.mdx` file into `/content/research/`.

**Architecture:** `gray-matter` parses MDX frontmatter at build/request time. `next-mdx-remote` renders MDX content with custom components. `/research/page.tsx` is a **server component** that reads the filesystem and passes data as props to `<ResearchList>`, a **client component** that manages filter state. `/research/[slug]/page.tsx` is a server component that fetches the live price and renders the article. Filter state is fully client-side in `ResearchList`.

**Tech Stack:** Next.js 15 (App Router, Server Components), TypeScript, `next-mdx-remote@latest` (v5+), `gray-matter`, Tailwind CSS v4, Framer Motion

**Design reference:** `docs/superpowers/specs/2026-03-10-clearwaters-redesign-design.md`

**Prerequisite:** Plan 1 (Foundation Redesign) must be complete — this plan uses the CSS vars (`--teal`, `--gold`, `--ink`, `--ivory`, `--muted`, `--subtle`), fonts (`--font-playfair`, `--font-dm-sans`, `font-display` utility), Nav, and Footer defined there.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `content/research/` | Create dir | MDX article files live here |
| `content/research/2026-03-tencent.mdx` | Create | Example memo |
| `src/types/research.ts` | Create | Frontmatter TypeScript types |
| `src/lib/mdx.ts` | Create | Read + parse MDX files from content/research/ |
| `src/lib/prices.ts` | Create | Fetch live price for a ticker (server-only) |
| `src/components/research/ArticleMetaBadges.tsx` | Create | Ticker / rating / price target / live price row |
| `src/components/research/Figure.tsx` | Create | Image with slot-based placement |
| `src/components/research/Disclosure.tsx` | Create | Standard disclosure footer block |
| `src/components/research/ResearchFilters.tsx` | Create | Type pills + collapsible company chips |
| `src/components/research/ResearchList.tsx` | Create | Client component — filter state + article rows |
| `src/app/research/page.tsx` | Create | Server component — reads data, renders shell + ResearchList |
| `src/app/research/[slug]/page.tsx` | Create | Server component — renders individual article |
| `package.json` | Modify | Add next-mdx-remote@latest, gray-matter |

---

## Chunk 1: Dependencies + Types + Content Directory

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages (ensure next-mdx-remote v5+ for App Router /rsc export)**

```bash
npm install next-mdx-remote@latest gray-matter
```

- [ ] **Step 2: Verify version is v5+**

```bash
node -e "const p = require('./node_modules/next-mdx-remote/package.json'); console.log(p.version)"
```
Expected: `5.x.x` or higher

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add next-mdx-remote@latest and gray-matter"
```

---

### Task 2: Define TypeScript types

**Files:**
- Create: `src/types/research.ts`

- [ ] **Step 1: Create types file**

```ts
export type ResearchType = "memo" | "letter";

export type ResearchRating = "BUY" | "HOLD" | "SELL";

export type ResearchCategory =
  | "Deep Dive"
  | "Initiation"
  | "Update"
  | "Quarterly Letter";

export interface ResearchFrontmatter {
  title: string;
  slug: string;
  date: string;                // YYYY-MM-DD
  type: ResearchType;
  category: ResearchCategory;
  excerpt: string;
  summary?: string;            // 1–2 sentence italic pull-quote shown in article header
  // Memo-only fields (omit for letters)
  ticker?: string;             // e.g. "$TCEHY"
  rating?: ResearchRating;
  priceTarget?: number;        // USD
  priceAtPublication?: number; // USD
  // Letter-only fields
  pdfUrl?: string;
}

export interface ResearchPost {
  frontmatter: ResearchFrontmatter;
  content: string;             // raw MDX string (body only — no Disclosure section)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types/research.ts
git commit -m "feat: add ResearchFrontmatter TypeScript types"
```

---

### Task 3: Create content directory and example memo

**Files:**
- Create: `content/research/2026-03-tencent.mdx`

- [ ] **Step 1: Create the content directory**

```bash
mkdir -p content/research
```

- [ ] **Step 2: Create example MDX file**

Note: Do NOT include a `## Disclosure` section — the article page renders `<Disclosure />` automatically as the last element.

Create `content/research/2026-03-tencent.mdx`:

```mdx
---
title: "Tencent: The Network That Compounds Quietly"
slug: "2026-03-tencent"
date: "2026-03-10"
type: "memo"
category: "Deep Dive"
ticker: "$TCEHY"
rating: "BUY"
priceTarget: 72
priceAtPublication: 51.20
excerpt: "Mini-programs monetisation, video accounts advertising ramp, and continued capital return discipline point to a business still in early innings of its financial maturity."
summary: "Tencent's WeChat ecosystem creates structural switching costs that most Western investors underestimate. We see a business compounding quietly behind a wall of regulatory and geopolitical noise."
---

## Investment Thesis

We initiated a position in Tencent Holdings ($TCEHY) in Q4 2025 at an average cost of $48.60. The thesis rests on three pillars: accelerating mini-programs monetisation, the video accounts advertising ramp, and continued capital return discipline from a management team that has demonstrated exceptional long-cycle thinking.

<Figure slot="post-intro" src="/research/tencent-revenue-breakdown.png" caption="Tencent revenue by segment, FY2024" />

## Business Overview

Tencent operates the most deeply embedded digital ecosystem in China. WeChat's 1.3 billion monthly active users are not merely social — they are the entry point for payments, mini-programs, gaming, enterprise software, and increasingly, short-form video.

The switching costs embedded in WeChat are structural, not habitual. A user cannot leave WeChat without losing access to their contacts, their payment rails, their stored mini-programs, and increasingly, their workplace tools.

## Financial Analysis

Revenue grew 8% in FY2024 to RMB 659.9 billion. Importantly, the margin structure is improving: adjusted operating margin expanded from 29% to 33% as the high-margin advertising and fintech segments grew faster than the capital-intensive gaming segment.

<Figure slot="post-section" src="/research/tencent-margin-expansion.png" caption="Adjusted operating margin expansion, FY2021–FY2024" />

Free cash flow generation remains exceptional: RMB 193 billion in FY2024, up 68% year-over-year. Management has committed RMB 100 billion per annum to buybacks through at least 2026.

## Valuation

At $51.20, Tencent trades at approximately 13x forward free cash flow — a discount to its 5-year average of 22x and to comparable compounders globally. Our base case price target of $72 implies approximately 18x FY2026 FCF.

## Risks

**Regulatory risk:** Chinese tech regulation remains unpredictable. A new licensing freeze or revenue cap on gaming would impair the thesis materially.

**Geopolitical risk:** US-China tensions continue to weigh on investor appetite for Chinese ADRs. A delisting scenario, while unlikely, is not zero probability.

**Competition:** ByteDance's Douyin continues to take advertising share. If WeChat fails to monetise video accounts effectively, our revenue growth assumptions would be too optimistic.

## Conclusion

Tencent represents the clearest case we have found of a structurally advantaged business trading at a deep discount to intrinsic value. We are **BUY** rated with a 12–18 month price target of **$72**.
```

- [ ] **Step 3: Commit**

```bash
git add content/
git commit -m "feat: add content/research directory and example Tencent memo"
```

---

## Chunk 2: MDX Loader + Price Fetcher

### Task 4: Build MDX loader

**Files:**
- Create: `src/lib/mdx.ts`

- [ ] **Step 1: Create mdx.ts**

```ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ResearchFrontmatter, ResearchPost } from "@/types/research";

const CONTENT_DIR = path.join(process.cwd(), "content", "research");

/** Read and parse a single MDX file by slug */
export function getResearchPost(slug: string): ResearchPost {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as ResearchFrontmatter,
    content,
  };
}

/** Return all posts sorted newest-first */
export function getAllResearchPosts(): ResearchFrontmatter[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data } = matter(raw);
      return data as ResearchFrontmatter;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Return all unique tickers across all posts (for company filter) */
export function getAllTickers(): string[] {
  const posts = getAllResearchPosts();
  const tickers = posts
    .filter((p) => p.ticker)
    .map((p) => p.ticker as string);
  return [...new Set(tickers)];
}

/** Return all slugs (for generateStaticParams) */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
```

- [ ] **Step 2: Smoke test the loader**

```bash
node -e "
const matter = require('gray-matter');
const fs = require('fs');
const raw = fs.readFileSync('content/research/2026-03-tencent.mdx', 'utf8');
const { data } = matter(raw);
console.log(data.title, data.ticker, data.rating);
"
```
Expected: `Tencent: The Network That Compounds Quietly $TCEHY BUY`

- [ ] **Step 3: Commit**

```bash
git add src/lib/mdx.ts
git commit -m "feat: add MDX file loader (getResearchPost, getAllResearchPosts, getAllTickers)"
```

---

### Task 5: Build live price fetcher

**Files:**
- Create: `src/lib/prices.ts`

- [ ] **Step 1: Create prices.ts**

```ts
// Server-only: uses Next.js fetch cache options — do not import from client components.

export interface LivePrice {
  ticker: string;
  price: number | null;
  currency: string;
  direction: "up" | "down" | "flat" | null;
  priceAtPublication?: number;
}

/**
 * Fetch live price for a ticker via Yahoo Finance.
 * Falls back gracefully — price is null if fetch fails.
 * Called from Server Components only; revalidates every 5 minutes.
 */
export async function getLivePrice(
  ticker: string,
  priceAtPublication?: number
): Promise<LivePrice> {
  const symbol = ticker.replace("$", "");

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        next: { revalidate: 300 },
        headers: { "User-Agent": "Mozilla/5.0" },
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const price: number | null =
      json?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;

    if (!price) throw new Error("No price in response");

    let direction: LivePrice["direction"] = "flat";
    if (priceAtPublication != null) {
      if (price > priceAtPublication) direction = "up";
      else if (price < priceAtPublication) direction = "down";
    }

    return { ticker, price, currency: "USD", direction, priceAtPublication };
  } catch {
    return { ticker, price: null, currency: "USD", direction: null, priceAtPublication };
  }
}

/** Format price for display: $53.40. Accepts null or undefined. */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "—";
  return `$${price.toFixed(2)}`;
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/prices.ts
git commit -m "feat: add live price fetcher (server-only, 5-min revalidation, graceful fallback)"
```

---

## Chunk 3: Research Components

### Task 6: ArticleMetaBadges component

**Files:**
- Create: `src/components/research/ArticleMetaBadges.tsx`

- [ ] **Step 1: Create component**

```tsx
import type { ResearchFrontmatter } from "@/types/research";
import type { LivePrice } from "@/lib/prices";
import { formatPrice } from "@/lib/prices";

interface Props {
  frontmatter: ResearchFrontmatter;
  livePrice?: LivePrice;
}

const ratingColors: Record<string, string> = {
  BUY:  "var(--teal)",
  HOLD: "var(--gold)",
  SELL: "#b91c1c",
};

export function ArticleMetaBadges({ frontmatter, livePrice }: Props) {
  const { ticker, rating, priceTarget, priceAtPublication, pdfUrl, type } = frontmatter;

  if (type === "letter") {
    return (
      <div className="flex gap-2 flex-wrap items-center">
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold py-1 px-3 rounded-sm transition-opacity hover:opacity-80"
            style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
          >
            PDF Download ↓
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {ticker && (
        <span
          className="text-xs font-bold py-1 px-3 rounded-sm"
          style={{ background: "var(--ink)", color: "var(--ivory)" }}
        >
          {ticker}
        </span>
      )}
      {rating && (
        <span
          className="text-xs font-bold py-1 px-3 rounded-sm"
          style={{ background: ratingColors[rating] ?? "var(--subtle)", color: "#fff" }}
        >
          {rating}
        </span>
      )}
      {priceTarget != null && (
        <span
          className="text-xs py-1 px-3 rounded-sm"
          style={{ border: "1px solid var(--muted)", color: "var(--subtle)" }}
        >
          PT {formatPrice(priceTarget)}
        </span>
      )}
      {priceAtPublication != null && (
        <span
          className="text-xs py-1 px-3 rounded-sm"
          style={{ border: "1px solid var(--muted)", color: "var(--subtle)" }}
        >
          Pub {formatPrice(priceAtPublication)}
        </span>
      )}
      {livePrice && (
        <span
          className="text-xs font-semibold py-1 px-3 rounded-sm"
          style={{
            border: `1px solid ${livePrice.price != null ? "var(--teal)" : "var(--muted)"}`,
            color: livePrice.price != null ? "var(--teal)" : "var(--subtle)",
          }}
        >
          Now {formatPrice(livePrice.price)}
          {livePrice.direction === "up" && " ↑"}
          {livePrice.direction === "down" && " ↓"}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/research/ArticleMetaBadges.tsx
git commit -m "feat: add ArticleMetaBadges component"
```

---

### Task 7: Figure component

**Files:**
- Create: `src/components/research/Figure.tsx`

- [ ] **Step 1: Create component**

```tsx
import Image from "next/image";

interface FigureProps {
  src: string;
  caption?: string;
  slot?: "post-intro" | "post-section" | "full-width";
}

export function Figure({ src, caption, slot = "post-section" }: FigureProps) {
  return (
    <figure className="my-8 w-full">
      <div
        className="relative w-full overflow-hidden rounded-sm"
        style={{ aspectRatio: "16/9", background: "var(--muted)" }}
      >
        <Image
          src={src}
          alt={caption ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 680px"
        />
      </div>
      {caption && (
        <figcaption
          className="mt-2 text-xs text-center"
          style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

Note: `slot` prop is accepted for semantic clarity (matches the authoring convention) but all slots render identically — full-column-width. Future work can differentiate slot behaviour if needed.

- [ ] **Step 2: Commit**

```bash
git add src/components/research/Figure.tsx
git commit -m "feat: add Figure component with slot prop"
```

---

### Task 8: Disclosure component

**Files:**
- Create: `src/components/research/Disclosure.tsx`

- [ ] **Step 1: Create component**

```tsx
export function Disclosure() {
  return (
    <section
      className="mt-16 pt-8 text-xs leading-relaxed"
      style={{
        borderTop: "1px solid var(--muted)",
        color: "var(--subtle)",
        fontFamily: "var(--font-dm-sans)",
      }}
    >
      <p className="font-semibold mb-2" style={{ color: "var(--ink)" }}>
        Disclosure
      </p>
      <p>
        Clear Waters Capital LP may hold positions in securities mentioned in this memo.
        This document is for informational purposes only and does not constitute
        investment advice, a solicitation, or an offer to buy or sell any security.
        All opinions are those of Clear Waters Capital LP and are subject to change
        without notice. Past performance is not indicative of future results.
        Investing involves risk, including the possible loss of principal.
        This memo is intended solely for the person to whom it has been delivered
        and may not be reproduced or redistributed without written consent.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/research/Disclosure.tsx
git commit -m "feat: add Disclosure component"
```

---

### Task 9: ResearchFilters component

**Files:**
- Create: `src/components/research/ResearchFilters.tsx`

- [ ] **Step 1: Create component**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type FilterType = "all" | "memo" | "letter";

interface Props {
  tickers: string[];
  activeType: FilterType;
  activeTicker: string | null;
  onTypeChange: (type: FilterType) => void;
  onTickerChange: (ticker: string | null) => void;
}

export function ResearchFilters({
  tickers,
  activeType,
  activeTicker,
  onTypeChange,
  onTickerChange,
}: Props) {
  const [showCompany, setShowCompany] = useState(false);

  const pillBase =
    "text-xs font-semibold py-[5px] px-3.5 rounded-sm cursor-pointer transition-colors select-none";

  return (
    <div className="mb-8">
      {/* Row 1: type pills + Filter button */}
      <div className="flex gap-2 items-center flex-wrap">
        {(["all", "memo", "letter"] as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={pillBase}
            style={
              activeType === type
                ? { background: "var(--ink)", color: "var(--ivory)" }
                : { border: "1px solid var(--muted)", color: "var(--subtle)" }
            }
          >
            {type === "all" ? "All" : type === "memo" ? "Memos" : "Letters"}
          </button>
        ))}

        {tickers.length > 0 && (
          <button
            onClick={() => setShowCompany((v) => !v)}
            className={`${pillBase} ml-auto flex items-center gap-1.5`}
            style={
              showCompany || activeTicker != null
                ? { background: "var(--ink)", color: "var(--ivory)" }
                : { border: "1px solid var(--muted)", color: "var(--subtle)" }
            }
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Filter
          </button>
        )}
      </div>

      {/* Row 2: company chips (collapsible) */}
      <AnimatePresence>
        {showCompany && tickers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="flex gap-2 flex-wrap pt-3"
              style={{ borderTop: "1px solid var(--muted)" }}
            >
              {tickers.map((ticker) => (
                <button
                  key={ticker}
                  onClick={() =>
                    onTickerChange(activeTicker === ticker ? null : ticker)
                  }
                  className="text-xs font-semibold py-[3px] px-3 rounded-full cursor-pointer transition-colors"
                  style={
                    activeTicker === ticker
                      ? { border: "1px solid var(--teal)", color: "var(--teal)", background: "rgba(45,139,139,0.08)" }
                      : { border: "1px solid var(--muted)", color: "var(--subtle)" }
                  }
                >
                  {ticker}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/research/ResearchFilters.tsx
git commit -m "feat: add ResearchFilters (type pills + collapsible company filter)"
```

---

## Chunk 4: Research Pages

### Task 10: ResearchList client component

**Files:**
- Create: `src/components/research/ResearchList.tsx`

This is a **client component** — it owns all filter state. It receives pre-loaded posts and tickers as props from the server component `page.tsx`.

- [ ] **Step 1: Create ResearchList.tsx**

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ResearchFilters, type FilterType } from "@/components/research/ResearchFilters";
import { ArticleMetaBadges } from "@/components/research/ArticleMetaBadges";
import type { ResearchFrontmatter } from "@/types/research";

interface Props {
  posts: ResearchFrontmatter[];
  tickers: string[];
}

export function ResearchList({ posts, tickers }: Props) {
  const [activeType, setActiveType] = useState<FilterType>("all");
  const [activeTicker, setActiveTicker] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeType === "memo" && p.type !== "memo") return false;
      if (activeType === "letter" && p.type !== "letter") return false;
      if (activeTicker != null && p.ticker !== activeTicker) return false;
      return true;
    });
  }, [posts, activeType, activeTicker]);

  return (
    <>
      <ResearchFilters
        tickers={tickers}
        activeType={activeType}
        activeTicker={activeTicker}
        onTypeChange={setActiveType}
        onTickerChange={setActiveTicker}
      />

      <div>
        {filtered.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <Link href={`/research/${post.slug}`} className="block group">
              <div
                className="grid gap-5 py-5 hover:bg-[rgba(28,28,28,0.02)] transition-colors rounded-sm px-1 -mx-1"
                style={{
                  gridTemplateColumns: "80px 1fr",
                  borderTop: "1px solid var(--muted)",
                }}
              >
                {/* Left col: date + type tag */}
                <div>
                  <p
                    className="text-xs mb-2"
                    style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
                  >
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide"
                    style={
                      post.type === "letter"
                        ? { background: "var(--gold)", color: "#fff" }
                        : { background: "var(--ink)", color: "var(--ivory)" }
                    }
                  >
                    {post.type}
                  </span>
                </div>

                {/* Right col: content */}
                <div>
                  <h2
                    className="font-display text-base font-bold leading-snug mb-2 group-hover:opacity-70 transition-opacity"
                    style={{ color: "var(--ink)" }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed mb-3 line-clamp-2"
                    style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
                  >
                    {post.excerpt}
                  </p>
                  <ArticleMetaBadges frontmatter={post} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm" style={{ color: "var(--subtle)" }}>
            No research matching this filter.
          </p>
        )}

        <div
          className="py-5 text-center text-xs"
          style={{ borderTop: "1px solid var(--muted)", color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
        >
          — {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} published —
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/research/ResearchList.tsx
git commit -m "feat: add ResearchList client component with filter state"
```

---

### Task 11: Research hub server component

**Files:**
- Create: `src/app/research/page.tsx`

This is a **server component** (no `"use client"`). It reads the filesystem and passes data to `<ResearchList>`.

- [ ] **Step 1: Create page.tsx**

```tsx
import { getAllResearchPosts, getAllTickers } from "@/lib/mdx";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ResearchList } from "@/components/research/ResearchList";

export default function ResearchPage() {
  const posts = getAllResearchPosts();
  const tickers = getAllTickers();

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)", color: "var(--ink)" }}>
      <header className="container py-6" style={{ borderBottom: "1px solid var(--muted)" }}>
        <Nav />
      </header>

      <main className="container py-16">
        <h1
          className="font-display text-5xl font-bold mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Research
        </h1>
        <div className="h-px w-10 mb-10" style={{ background: "var(--gold)" }} />

        <ResearchList posts={posts} tickers={tickers} />
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify the page renders**

```bash
npm run dev
```

Open http://localhost:3000/research — Tencent memo should appear. Filters work: "Memos" keeps it, "Letters" hides it. Filter button reveals `$TCEHY` chip.

- [ ] **Step 3: Commit**

```bash
git add src/app/research/page.tsx
git commit -m "feat: add /research server component (reads MDX, passes to ResearchList)"
```

---

### Task 12: Individual article page

**Files:**
- Create: `src/app/research/[slug]/page.tsx`

- [ ] **Step 1: Create article page**

```tsx
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArticleMetaBadges } from "@/components/research/ArticleMetaBadges";
import { Figure } from "@/components/research/Figure";
import { Disclosure } from "@/components/research/Disclosure";
import { getResearchPost, getAllSlugs } from "@/lib/mdx";
import { getLivePrice } from "@/lib/prices";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ResearchPost } from "@/types/research";

const mdxComponents = {
  Figure,
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: ResearchPost;
  try {
    post = getResearchPost(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = post;

  const livePrice = frontmatter.ticker
    ? await getLivePrice(frontmatter.ticker, frontmatter.priceAtPublication)
    : undefined;

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)", color: "var(--ink)" }}>
      <header className="container py-6" style={{ borderBottom: "1px solid var(--muted)" }}>
        <Nav />
      </header>

      <main className="container py-16">
        <article className="max-w-[680px] mx-auto">

          {/* ── Fixed header block ── */}
          <header className="mb-10">
            <p
              className="text-xs font-semibold tracking-[0.12em] uppercase mb-3"
              style={{ color: "var(--teal)", fontFamily: "var(--font-dm-sans)" }}
            >
              {frontmatter.category}
            </p>
            <h1
              className="font-display text-4xl md:text-5xl font-bold leading-[1.1] mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              {frontmatter.title}
            </h1>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
            >
              Clear Waters Capital ·{" "}
              {new Date(frontmatter.date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="mb-6" style={{ borderTop: "2px solid var(--ink)" }} />

            <ArticleMetaBadges frontmatter={frontmatter} livePrice={livePrice} />

            {/* Thesis pull-quote (from `summary` frontmatter field) */}
            {frontmatter.summary && (
              <blockquote
                className="mt-8 py-4 px-5 italic text-base leading-relaxed"
                style={{
                  borderLeft: "3px solid var(--gold)",
                  background: "rgba(200,169,110,0.06)",
                  color: "#444",
                  fontFamily: "var(--font-playfair)",
                }}
              >
                {frontmatter.summary}
              </blockquote>
            )}

            <div className="mt-8 h-px w-10" style={{ background: "var(--gold)" }} />
          </header>

          {/* ── Article body ── */}
          <div className="article-body">
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          {/* ── Disclosure (always last) ── */}
          <Disclosure />
        </article>
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Add article body prose styles to globals.css**

Append to `src/app/globals.css`:

```css
/* ─── Article body typography ─────────────────────── */
.article-body h2 {
  font-family: var(--font-playfair);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ink);
  margin-top: 3rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.article-body p {
  font-family: var(--font-dm-sans);
  font-size: 1rem;
  line-height: 1.8;
  color: var(--ink);
  margin-bottom: 1.25rem;
}

.article-body strong {
  font-weight: 700;
  color: var(--ink);
}

.article-body ul,
.article-body ol {
  font-family: var(--font-dm-sans);
  font-size: 1rem;
  line-height: 1.8;
  color: var(--ink);
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.article-body blockquote {
  border-left: 3px solid var(--gold);
  padding: 0.75rem 1rem;
  margin: 1.5rem 0;
  background: rgba(200, 169, 110, 0.06);
  font-style: italic;
  color: #444;
}
```

- [ ] **Step 3: Verify article page renders**

```bash
npm run dev
```

Open http://localhost:3000/research/2026-03-tencent — verify:
- Header block: category tag, title, date, divider, badges row, summary pull-quote, gold rule
- Body: section headings in Playfair, body copy in DM Sans
- Figure placeholders render (grey box with caption — image files don't exist yet, that's fine)
- Disclosure section at the bottom
- NO second Disclosure in the body (the example MDX has no `## Disclosure` section)

- [ ] **Step 4: Verify 404 for unknown slug**

Open http://localhost:3000/research/nonexistent — should show Next.js 404.

- [ ] **Step 5: Run full build**

```bash
npm run build
```
Expected: Build succeeds. `generateStaticParams` generates one route (`/research/2026-03-tencent`).

- [ ] **Step 6: Commit**

```bash
git add src/app/research/ src/app/globals.css
git commit -m "feat: add /research/[slug] article page with MDX, live price, summary pull-quote"
```

---

## Completion Checklist

- [ ] http://localhost:3000/research — feed lists all MDX files; All/Memos/Letters filters work; Filter button reveals company chips
- [ ] http://localhost:3000/research/2026-03-tencent — full article: category tag, title, date, badges row (ticker · rating · PT · pub price · live price), summary pull-quote, body sections, Disclosure at bottom
- [ ] http://localhost:3000/research/nonexistent — 404
- [ ] `npm run build` succeeds with no TypeScript errors
- [ ] Drop a new `.mdx` into `content/research/`, restart dev — it appears in the feed

```bash
git add .
git commit -m "chore: research system complete — MDX hub, articles, live prices, filters"
```

---

## Publishing a New Article (Workflow Reference)

1. Write memo with Claude in conversation
2. Claude produces a complete `.mdx` file with:
   - All required frontmatter fields filled in
   - `summary` field (1–2 sentences for the pull-quote)
   - Body sections in fixed order: Investment Thesis → Business Overview → Financial Analysis → Valuation → Risks → Conclusion
   - `<Figure slot="..." src="..." caption="..." />` tags placed only after section headings
   - **No `## Disclosure` section** — rendered automatically by the page
3. Save file to `content/research/[slug].mdx`
4. Drop chart/PNG files to `public/research/[filename]`
5. `git add . && git push` → deployed
