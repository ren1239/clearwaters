"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface FigureProps {
  src: string;
  caption?: string;
  slot?: "post-intro" | "post-section" | "full-width";
}

export function Figure({ src, caption }: FigureProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <figure className="my-8 w-full">
        <div
          className="relative w-full overflow-hidden rounded-sm"
          style={{
            aspectRatio: "16/9",
            background: "transparent",
            cursor: "zoom-in",
          }}
          onClick={() => setOpen(true)}
          role="button"
          aria-label={caption ? `Expand: ${caption}` : "Expand image"}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen(true); }}
        >
          <Image
            src={src}
            alt={caption ?? ""}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 680px"
          />
        </div>
        {caption && (
          <figcaption
            className="mt-2 text-xs text-center"
            style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
          >
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
          style={{ background: "rgba(28,28,28,0.88)", backdropFilter: "blur(6px)" }}
          onClick={close}
        >
          {/* Stop propagation so clicking the image itself doesn't close */}
          <div
            className="relative w-full max-w-6xl"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={caption ?? ""}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "2px",
                display: "block",
              }}
            />
            {caption && (
              <p
                className="mt-3 text-xs text-center"
                style={{ color: "rgba(247,245,240,0.65)", fontFamily: "var(--font-dm-sans)" }}
              >
                {caption}
              </p>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold"
            style={{
              background: "rgba(247,245,240,0.12)",
              color: "rgba(247,245,240,0.8)",
              border: "1px solid rgba(247,245,240,0.2)",
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
