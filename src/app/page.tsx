"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <div className="font-sans min-h-screen">
      <header className="container py-8 border-b border-black/[.08] dark:border-white/[.08]">
        <Nav />
      </header>
      <main className="container min-h-[calc(100vh-160px)] flex items-center justify-end py-16 ">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full lg:w-2/3 xl:w-1/2 flex flex-col items-end text-right gap-2 md:gap-10 pt-48  md:pt-16"
        >
          <motion.h1 variants={item} className="text-4xl font-bold leading-8">
            Think. <br />
            Concentrate.
            <br />
            Compound.
          </motion.h1>
          <motion.p
            variants={item}
            className="text-md md:text-xl font-light italic max-w-xl opacity-80"
          >
            “Take a simple idea and take it seriously.”
            <br />
            -Charlie Munger
          </motion.p>

          <motion.div
            variants={container}
            className="flex gap-4 flex-col sm:flex-row justify-end w-full"
          >
            <motion.a
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-transparent bg-foreground text-background px-6 h-12 flex items-center justify-center font-medium text-base w-full sm:w-auto"
              href="#contact"
            >
              Contact Us
            </motion.a>
            <motion.a
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-full border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] px-6 h-12 flex items-center justify-center font-medium text-base w-full sm:w-auto"
              href="#about"
            >
              <Link
                href="https://clarity-fintech.vercel.app/"
                className="text-primary hover:underline"
              >
                Research{" "}
              </Link>{" "}
            </motion.a>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
