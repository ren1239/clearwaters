"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="font-sans min-h-screen">
      <header className="container py-8 border-b border-black/[.08] dark:border-white/[.08]">
        <Nav />
      </header>
      <main className="container min-h-[calc(100vh-240px)] flex items-center justify-end py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/3 xl:w-1/2 flex flex-col items-end text-right gap-10 pt-34 "
        >
          <motion.h1
            className="text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            About Us
          </motion.h1>

          <motion.div
            className="prose prose-lg dark:prose-invert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>
              ClearWaters Capital is a quiet investment partnership guided by
              clarity, self discipline, and simple ideas.
            </p>
            <br />
            <p>
              We impliment fundamental investment principles leveraged by
              in-house developed analysis tools. Our approach is patient,
              concentrated capital, like water.
            </p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
