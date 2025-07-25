"use client";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BookCard } from "@/components/BookCard";
import { books } from "@/data/books";

export default function Books() {
  return (
    <div className="font-sans min-h-screen">
      <header className="container py-8 border-b border-black/[.08] dark:border-white/[.08]">
        <Nav />
      </header>

      <main className="container min-h-[calc(100vh-160px)] py-8">
        <h1 className="text-3xl font-bold mb-8">Book Recommendations</h1>

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
