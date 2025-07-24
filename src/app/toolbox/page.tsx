"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Toolbox() {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
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
          <p>Our financial tools and resources are available at:</p>
          <Link
            href="https://clarity-fintech.vercel.app/"
            className="text-primary underline hover:no-underline"
          >
            Clarity Fintech Platform
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
