"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { books } from "@/data/books";
import { motion } from "framer-motion";

export default function Books() {
  return (
    <div className="font-serif min-h-screen bg-white">
      <header className="bg-black">
        <div className="container py-8 border-b border-black/[.08] dark:border-white/[.08]">
          <Nav />
        </div>
      </header>

      <main className="container min-h-[calc(100vh-160px)] py-8">
        <motion.h1
          className="text-4xl md:text-5xl font-semibold text-center  text-slate-900 mx-auto pt-24 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Book Recomendations
        </motion.h1>
        {/* Small underline / hierarchy cue */}
        <div className="w-12 h-[2px] bg-slate-700 mx-auto mt-4 mb-12" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-6 pb-8">
          {books.map((book, index) => (
            <BookCard
              key={index}
              title={book.title}
              author={book.author}
              image={book.image}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
