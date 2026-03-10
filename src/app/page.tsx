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
