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
