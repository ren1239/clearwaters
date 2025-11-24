"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <header className="  bg-black w-full">
        <div className="container mx-auto py-4 bg-black w-full">
          <Nav />
        </div>
      </header>

      <main className="container mx-auto px-4">
        <motion.section
          className="max-w-3xl mx-auto pt-24 pb-24 font-serif text-slate-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page title */}
          <motion.h1
            className="text-4xl md:text-5xl font-semibold text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            About
          </motion.h1>

          {/* Small underline / hierarchy cue */}
          <div className="w-12 h-[2px] bg-slate-700 mx-auto mt-4 mb-12" />

          {/* Intro */}
          <p className="text-lg leading-relaxed mb-6">
            Clear Waters Capital is a quiet, long-term investment partnership
            focused on structurally advantaged businesses in China and Hong
            Kong. We study geo politics, industry structure, psycology, and
            management behavior to understand how a business compounds over
            time.
          </p>

          <p className="text-lg leading-relaxed mb-10">
            We manage a concentrated portfolio and view the partnership as the
            primary vehicle for compounding our own capital alongside a small
            group of like-minded investors.
          </p>

          {/* Investment Philosophy */}
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Investment Philosophy
          </h2>

          <p className="text-lg leading-relaxed mb-4">
            We invest in a small number of businesses with durable economics,
            simple value propositions, and rational capital allocation. The
            portfolio typically holds 8–10 positions; we prefer depth of
            understanding over breadth of exposure.
          </p>

          <p className="text-lg leading-relaxed mb-4">
            Our orientation is long-cycle. We think in years rather than
            quarters and accept volatility as the cost of compounding, provided
            intrinsic value remains intact.
          </p>

          <p className="text-lg leading-relaxed">
            We aim to communicate clearly, in order to share our market
            commentary, and let the results of our performance speak for itself
            over time.
          </p>

          {/* Optional contact block, if you want it later */}
          {/* 
          <p className="text-lg leading-relaxed mt-10">
            If you are a prospective investor or would like to learn more about
            Clear Waters Capital, please contact us at{" "}
            <a
              href="mailto:info@clearwaterscapital.com"
              className="underline decoration-slate-500 underline-offset-4"
            >
              info@clearwaterscapital.com
            </a>.
          </p>
          */}
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
