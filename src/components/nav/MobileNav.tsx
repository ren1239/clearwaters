"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {open && (
          <Dialog open={open} onOpenChange={setOpen}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            >
              <div className="fixed right-4 top-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30 }}
                className="fixed inset-y-0 right-0 z-50 w-3/4 bg-background p-6"
              >
                <nav className="mt-16 flex flex-col gap-6">
                  <a href="/" className="text-lg">
                    Home
                  </a>
                  <a href="/about" className="text-lg">
                    About
                  </a>
                  <a href="/toolbox" className="text-lg">
                    Toolbox
                  </a>
                </nav>
              </motion.div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
