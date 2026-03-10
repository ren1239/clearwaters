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
              className="inline-block text-sm font-semibold tracking-[0.08em] uppercase py-3 px-6 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
