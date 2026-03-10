"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ResearchFilters, type FilterType } from "@/components/research/ResearchFilters";
import { ArticleMetaBadges } from "@/components/research/ArticleMetaBadges";
import type { ResearchFrontmatter } from "@/types/research";

interface Props {
  posts: ResearchFrontmatter[];
  tickers: string[];
}

export function ResearchList({ posts, tickers }: Props) {
  const [activeType, setActiveType] = useState<FilterType>("all");
  const [activeTicker, setActiveTicker] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeType === "memo" && p.type !== "memo") return false;
      if (activeType === "letter" && p.type !== "letter") return false;
      if (activeTicker != null && p.ticker !== activeTicker) return false;
      return true;
    });
  }, [posts, activeType, activeTicker]);

  return (
    <>
      <ResearchFilters
        tickers={tickers}
        activeType={activeType}
        activeTicker={activeTicker}
        onTypeChange={setActiveType}
        onTickerChange={setActiveTicker}
      />

      <div>
        {filtered.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <Link href={`/research/${post.slug}`} className="block group">
              <div
                className="grid gap-5 py-5 hover:bg-[rgba(28,28,28,0.02)] transition-colors rounded-sm px-1 -mx-1"
                style={{
                  gridTemplateColumns: "80px 1fr",
                  borderTop: "1px solid var(--muted)",
                }}
              >
                {/* Left col: date + type tag */}
                <div>
                  <p
                    className="text-xs mb-2"
                    style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
                  >
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide"
                    style={
                      post.type === "letter"
                        ? { background: "var(--gold)", color: "#fff" }
                        : { background: "var(--ink)", color: "var(--ivory)" }
                    }
                  >
                    {post.type}
                  </span>
                </div>

                {/* Right col: content */}
                <div>
                  <h2
                    className="font-display text-base font-bold leading-snug mb-2 group-hover:opacity-70 transition-opacity"
                    style={{ color: "var(--ink)" }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed mb-3 line-clamp-2"
                    style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
                  >
                    {post.excerpt}
                  </p>
                  <ArticleMetaBadges frontmatter={post} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm" style={{ color: "var(--subtle)" }}>
            No research matching this filter.
          </p>
        )}

        <div
          className="py-5 text-center text-xs"
          style={{ borderTop: "1px solid var(--muted)", color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
        >
          — {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} published —
        </div>
      </div>
    </>
  );
}
