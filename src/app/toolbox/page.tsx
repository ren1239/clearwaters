"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Toolbox() {
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
          className="w-full lg:w-2/3 xl:w-1/2 flex flex-col items-end text-right gap-10 pt-20"
        >
          <motion.h1
            className="text-4xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Toolbox
          </motion.h1>

          <motion.div
            className="prose prose-lg dark:prose-invert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="pb-4">
              Our financial tools and resources are available at:
            </p>

            <motion.a
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-transparent bg-foreground text-background px-6 h-12 flex items-center justify-center font-medium text-base w-full sm:w-auto"
              href="#about"
            >
              <Link
                href="https://clarity-fintech.vercel.app/"
                className="text-primary "
              >
                Clarity Research Platform
              </Link>{" "}
            </motion.a>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
