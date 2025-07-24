"use client";

import { motion } from "framer-motion";

export default function About() {
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
          About ClearWaters
        </motion.h1>

        <motion.div
          className="prose prose-lg dark:prose-invert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>
            ClearWaters Capital is a modern investment firm focused on
            delivering sustainable growth through innovative financial
            solutions.
          </p>
          <p>
            Founded in 2020, we combine traditional investment wisdom with
            cutting-edge technology to create value for our clients.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
