import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between w-full">
      {/* Left side: Burger first on mobile */}
      <div className="flex items-center gap-4 w-full justify-between md:justify-start">
        {/* Mobile: Burger Menu */}
        {!isOpen && (
          <button className="md:hidden p-2" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        )}

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo/clear.png"
            alt="Clear Water Capital"
            width={240}
            height={140}
          />
        </Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link
          href="https://client.clearwaterscapital.com/"
          className="hover:underline"
        >
          Clients
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link
          href="https://clarity.clearwaterscapital.com/"
          className="hover:underline"
        >
          Analysis
        </Link>
        <Link href="/books" className="hover:underline">
          Books
        </Link>
      </div>

      {/* Mobile Slide-out Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-background z-50 pt-20 px-6 md:hidden"
          >
            {/* Close Button inside the panel */}
            <button
              className="absolute top-4 right-4 p-2"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>

            <div className="flex flex-col gap-6 text-xl mt-12">
              {["Home", "About", "Toolbox", "Books"].map((label) => (
                <Link
                  key={label}
                  href={`/${
                    label.toLowerCase() === "home" ? "" : label.toLowerCase()
                  }`}
                  onClick={() => setIsOpen(false)}
                  className="hover:underline py-2"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
