# Foundation Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Ink & Water design system to the entire site — homepage, nav, footer, about, and books — and remove dead links to Clarity/Toolbox.

**Architecture:** CSS variables define the palette in `globals.css`. Fonts (Playfair Display + DM Sans) loaded via `next/font/google` in `layout.tsx`. All page components updated to use the new system. No new pages created — only existing ones restyled.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, `next/font/google`

**Design reference:** `docs/superpowers/specs/2026-03-10-clearwaters-redesign-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/globals.css` | Modify | Ink & Water CSS vars, grain texture mixin, background treatment |
| `src/app/layout.tsx` | Modify | Add Playfair Display + DM Sans fonts, wire CSS vars |
| `src/app/page.tsx` | Modify | Minimal Gateway homepage with dark overlay hero |
| `src/components/Nav.tsx` | Modify | Remove Toolbox/Analysis, add Research link |
| `src/components/Footer.tsx` | Modify | Ink & Water restyle |
| `src/app/about/page.tsx` | Modify | Ink & Water restyle |
| `src/app/books/page.tsx` | Modify | Ink & Water restyle |
| `src/components/BookCard.tsx` | Modify | Ink & Water restyle |
| `src/app/toolbox/page.tsx` | Delete | Page removed — replaced by future /tools |

---

## Chunk 1: Design System (CSS + Fonts)

### Task 1: Update globals.css with Ink & Water palette

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace the CSS variable block**

Open `src/app/globals.css`. Replace the `:root` block and `@theme inline` block entirely:

```css
@import "tailwindcss";

/* ─── Ink & Water Design Tokens ───────────────────── */
:root {
  --ivory:   #f7f5f0;
  --ink:     #1c1c1c;
  --teal:    #2d8b8b;
  --gold:    #c8a96e;
  --muted:   #e0ddd8;
  --subtle:  #aaaaaa;

  --background: var(--ivory);
  --foreground: var(--ink);
}

@theme inline {
  --color-background:  var(--background);
  --color-foreground:  var(--foreground);
  --color-ivory:       var(--ivory);
  --color-ink:         var(--ink);
  --color-teal:        var(--teal);
  --color-gold:        var(--gold);
  --color-muted:       var(--muted);
  --color-subtle:      var(--subtle);
  --font-display:      var(--font-playfair);
  --font-sans:         var(--font-dm-sans);
  --font-mono:         var(--font-geist-mono);
}
```

- [ ] **Step 2: Replace the body and background styles**

Replace everything below `@theme inline { ... }` with:

```css
body {
  background-color: var(--ivory);
  color: var(--ink);
  font-family: var(--font-dm-sans), system-ui, sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Homepage hero only — applied via .hero-bg class */
.hero-bg {
  position: relative;
  min-height: 100vh;
}

.hero-bg::before {
  content: "";
  position: fixed;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(10, 22, 40, 0.88) 0%, rgba(26, 45, 74, 0.85) 100%),
    url("/outdate.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  pointer-events: none;
}

/* Grain texture overlay — add class "grain" to any element */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 5%;
}

@media (prefers-reduced-motion: no-preference) {
  * {
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
  }
}
```

- [ ] **Step 3: Verify no syntax errors**

Run: `npm run lint`
Expected: No errors (or only pre-existing errors, not new ones)

---

### Task 2: Add Playfair Display + DM Sans fonts

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Import new fonts**

Replace the font imports at the top of `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

- [ ] **Step 2: Update body className**

Change the `<body>` className in the return:

```tsx
<body className={`${playfair.variable} ${dmSans.variable} ${geistMono.variable} antialiased`}>
  {children}
</body>
```

- [ ] **Step 3: Verify fonts load**

Run: `npm run dev`
Open http://localhost:3000/about — body text should render in DM Sans (clean sans-serif), not Geist.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: add Ink & Water design system and Playfair/DM Sans fonts"
```

---

## Chunk 2: Homepage Redesign

### Task 3: Rewrite homepage as Minimal Gateway

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace page.tsx entirely**

```tsx
"use client";

import { Nav } from "@/components/Nav";
import { motion } from "framer-motion";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  return (
    <div className="hero-bg grain min-h-screen flex flex-col">
      {/* Nav floats over hero */}
      <header className="relative z-10 container py-6">
        <Nav />
      </header>

      {/* Centered gateway */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center gap-5 px-6 max-w-sm"
        >
          <motion.p
            variants={item}
            className="text-xs font-semibold tracking-[0.22em] uppercase"
            style={{ color: "var(--teal)" }}
          >
            Clear Waters Capital
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight"
            style={{ color: "var(--ivory)" }}
          >
            Think.<br />
            Concentrate.<br />
            Compound.
          </motion.h1>

          {/* Gold rule */}
          <motion.div
            variants={item}
            className="h-px w-7"
            style={{ background: "var(--gold)" }}
          />

          <motion.p
            variants={item}
            className="text-sm leading-relaxed"
            style={{ color: "rgba(247,245,240,0.55)" }}
          >
            In still waters, we find clarity.
          </motion.p>

          <motion.div variants={container} className="flex flex-col gap-3 w-44 mt-2">
            <motion.div variants={item}>
              <Link
                href="/research"
                className="block w-full py-3 text-center text-xs font-bold tracking-[0.1em] uppercase rounded-sm transition-opacity hover:opacity-80"
                style={{ background: "var(--teal)", color: "#fff" }}
              >
                Read Our Research
              </Link>
            </motion.div>
            <motion.div variants={item}>
              <a
                href="mailto:info@clearwaterscapital.com"
                className="block w-full py-3 text-center text-xs tracking-[0.1em] uppercase rounded-sm border transition-colors hover:border-white/40"
                style={{
                  borderColor: "rgba(247,245,240,0.25)",
                  color: "rgba(247,245,240,0.7)",
                }}
              >
                Contact Us
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      {/* Minimal footer on hero */}
      <footer
        className="relative z-10 container py-4 text-center text-xs"
        style={{ color: "rgba(247,245,240,0.25)" }}
      >
        © {new Date().getFullYear()} Clear Waters Capital LP
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify homepage renders**

Run: `npm run dev`
Check http://localhost:3000 — should show full-viewport dark ocean photo with centered ivory text, teal firm name at top, gold rule, two CTAs.

- [ ] **Step 3: Check mobile layout**

Resize browser to 375px width — text should stack cleanly, CTAs should be full-width within the 44-wide container.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign homepage as Minimal Gateway with dark hero"
```

---

## Chunk 3: Nav + Footer + Remove Toolbox

### Task 4: Update Nav

**Files:**
- Modify: `src/components/Nav.tsx`

- [ ] **Step 1: Replace Nav links**

In the desktop nav `<div className="hidden md:flex gap-6">`, replace all `<Link>` elements:

```tsx
<div className="hidden md:flex gap-6 items-center">
  <Link href="/research" className="text-sm hover:opacity-70 transition-opacity">
    Research
  </Link>
  <Link href="/books" className="text-sm hover:opacity-70 transition-opacity">
    Books
  </Link>
  <Link href="/about" className="text-sm hover:opacity-70 transition-opacity">
    About
  </Link>
  <Link
    href="https://client.clearwaterscapital.com/"
    className="text-sm hover:opacity-70 transition-opacity"
    target="_blank"
    rel="noopener noreferrer"
  >
    Clients
  </Link>
</div>
```

- [ ] **Step 2: Update mobile slide-out nav links**

Replace the `.map()` array in the mobile menu:

```tsx
const navLinks = [
  { label: "Research", href: "/research" },
  { label: "Books",    href: "/books" },
  { label: "About",    href: "/about" },
  { label: "Clients",  href: "https://client.clearwaterscapital.com/", external: true },
];
```

And update the map:
```tsx
{navLinks.map(({ label, href, external }) => (
  <Link
    key={label}
    href={href}
    onClick={() => setIsOpen(false)}
    className="hover:opacity-70 transition-opacity py-2"
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
  >
    {label}
  </Link>
))}
```

- [ ] **Step 3: Verify nav on all pages**

Check http://localhost:3000 — nav shows: Research · Books · About · Clients
No Toolbox, no Analysis.

- [ ] **Step 4: Delete toolbox page (via git)**

```bash
git rm -r src/app/toolbox
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx
git commit -m "feat: update nav — add Research, remove Toolbox and Analysis links"
```

---

### Task 5: Restyle Footer

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace footer**

```tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-10 mt-16" style={{ borderTop: "1px solid var(--muted)" }}>
      <div className="container flex flex-col sm:flex-row justify-between gap-8">

        <div>
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--ink)" }}>
            Clear Waters Capital
          </p>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--subtle)" }}>
            In Still Waters<br />We Find Clarity
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-semibold mb-3" style={{ color: "var(--ink)" }}>Company</p>
            <ul className="space-y-2" style={{ color: "var(--subtle)" }}>
              <li><Link href="/about" className="hover:opacity-70 transition-opacity">About</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3" style={{ color: "var(--ink)" }}>Research</p>
            <ul className="space-y-2" style={{ color: "var(--subtle)" }}>
              <li><Link href="/research" className="hover:opacity-70 transition-opacity">Memos</Link></li>
              <li><Link href="/research?type=letters" className="hover:opacity-70 transition-opacity">Letters</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3" style={{ color: "var(--ink)" }}>Contact</p>
            <ul className="space-y-2" style={{ color: "var(--subtle)" }}>
              <li>
                <a href="mailto:info@clearwaterscapital.com" className="hover:opacity-70 transition-opacity">
                  Email
                </a>
              </li>
              <li>
                <Link
                  href="https://client.clearwaterscapital.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <div className="container mt-8 pt-6 text-xs" style={{ borderTop: "1px solid var(--muted)", color: "var(--subtle)" }}>
        © {new Date().getFullYear()} Clear Waters Capital LP. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify footer on /about**

http://localhost:3000/about — footer should render in ivory bg, ink text, subtle borders. No black background.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: restyle footer with Ink & Water palette"
```

---

## Chunk 4: About + Books Restyle

### Task 6: Restyle About page

**Files:**
- Modify: `src/app/about/page.tsx`

- [ ] **Step 1: Replace about page**

```tsx
"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)", color: "var(--ink)" }}>
      <header className="container py-6" style={{ borderBottom: "1px solid var(--muted)" }}>
        <Nav />
      </header>

      <main className="container py-20">
        <motion.section
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="font-display text-5xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            About
          </motion.h1>
          <div className="h-px w-10 mb-10" style={{ background: "var(--gold)" }} />

          <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--ink)" }}>
            Clear Waters Capital is a quiet, long-term investment partnership
            focused on structurally advantaged businesses in China and Hong
            Kong. We study geopolitics, industry structure, psychology, and
            management behaviour to understand how a business compounds over
            time.
          </p>

          <p className="text-lg leading-relaxed mb-12" style={{ color: "var(--ink)" }}>
            We manage a concentrated portfolio and view the partnership as the
            primary vehicle for compounding our own capital alongside a small
            group of like-minded investors.
          </p>

          <h2 className="font-display text-3xl font-bold mb-4">
            Investment Philosophy
          </h2>
          <div className="h-px w-6 mb-8" style={{ background: "var(--muted)" }} />

          <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--ink)" }}>
            We invest in a small number of businesses with durable economics,
            simple value propositions, and rational capital allocation. The
            portfolio typically holds 8–10 positions; we prefer depth of
            understanding over breadth of exposure.
          </p>

          <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--ink)" }}>
            Our orientation is long-cycle. We think in years rather than
            quarters and accept volatility as the cost of compounding, provided
            intrinsic value remains intact.
          </p>

          <p className="text-lg leading-relaxed mb-16" style={{ color: "var(--ink)" }}>
            We aim to communicate clearly — sharing our market commentary and
            letting the results of our performance speak for itself over time.
          </p>

          {/* Contact CTA */}
          <div className="pt-10" style={{ borderTop: "1px solid var(--muted)" }}>
            <p className="text-sm mb-4" style={{ color: "var(--subtle)" }}>
              Interested in learning more?
            </p>
            <a
              href="mailto:info@clearwaterscapital.com"
              className="inline-block text-sm font-semibold tracking-[0.08em] uppercase py-3 px-6 rounded-sm transition-opacity hover:opacity-80"
              style={{ background: "var(--ink)", color: "var(--ivory)" }}
            >
              Get in Touch
            </a>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify about page**

http://localhost:3000/about — ivory background, Playfair Display headings, gold rule, ink text. No black header.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: restyle About page with Ink & Water palette"
```

---

### Task 7: Restyle Books page and BookCard

**Files:**
- Modify: `src/app/books/page.tsx`
- Modify: `src/components/BookCard.tsx`

- [ ] **Step 1: Update BookCard**

```tsx
import Image from "next/image";

interface BookCardProps {
  title: string;
  author: string;
  image: string;
}

export function BookCard({ title, author, image }: BookCardProps) {
  return (
    <div
      className="group cursor-pointer"
      style={{ transition: "opacity 0.2s ease" }}
    >
      <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-sm" style={{ background: "var(--muted)" }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>
      <p className="text-sm font-semibold leading-snug mb-1 group-hover:opacity-70 transition-opacity" style={{ color: "var(--ink)" }}>
        {title}
      </p>
      <p className="text-xs" style={{ color: "var(--subtle)" }}>
        {author}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Update books page**

```tsx
"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { books } from "@/data/books";
import { motion } from "framer-motion";

export default function Books() {
  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)", color: "var(--ink)" }}>
      <header className="container py-6" style={{ borderBottom: "1px solid var(--muted)" }}>
        <Nav />
      </header>

      <main className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-5xl font-bold mb-4">
            Book Recommendations
          </h1>
          <div className="h-px w-10 mb-12" style={{ background: "var(--gold)" }} />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-12">
            {books.map((book, index) => (
              <BookCard
                key={index}
                title={book.title}
                author={book.author}
                image={book.image}
              />
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Verify books page**

http://localhost:3000/books — ivory background, Playfair Display heading, book grid with hover scale effect. No white/black glassmorphism card.

- [ ] **Step 4: Final lint check**

Run: `npm run lint`
Expected: No new errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/books/page.tsx src/components/BookCard.tsx
git commit -m "feat: restyle Books page and BookCard with Ink & Water palette"
```

---

## Completion Checklist

After all tasks above are done:

- [ ] http://localhost:3000 — dark hero, ocean photo, centered gateway, teal/ivory/gold palette
- [ ] http://localhost:3000/research — 404 (expected — built in Plan 2)
- [ ] http://localhost:3000/about — ivory bg, Playfair headings, gold rule, contact CTA
- [ ] http://localhost:3000/books — ivory bg, clean book grid, hover effects
- [ ] Nav shows: Research · Books · About · Clients (no Toolbox, no Analysis)
- [ ] Footer shows: ivory bg, proper links, no black background
- [ ] `npm run build` completes without errors

```bash
git add .
git commit -m "chore: foundation redesign complete — Ink & Water applied across all pages"
```
