"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ResearchFrontmatter } from "@/types/research";
import { formatPrice } from "@/lib/prices";

interface Props {
  posts: ResearchFrontmatter[];
  tickers: string[];
}

type FilterType = "all" | "memo" | "letter";

interface CompanyGroup {
  companyName: string;
  ticker: string;
  latestRating?: string;
  latestPriceTarget?: number;
  currency: string;
  exchange?: string;
  posts: ResearchFrontmatter[];
}

const ratingColor: Record<string, string> = {
  BUY: "var(--teal)",
  HOLD: "var(--gold)",
  SELL: "#c0392b",
};

const ratingBg: Record<string, string> = {
  BUY: "rgba(45,139,139,0.08)",
  HOLD: "rgba(200,169,110,0.08)",
  SELL: "rgba(192,57,43,0.08)",
};

function extractCompanyName(title: string): string {
  return title.split(":")[0].trim();
}

function getArticleSubtitle(title: string): string {
  const idx = title.indexOf(":");
  return idx > -1 ? title.slice(idx + 1).trim() : title;
}

export function ResearchList({ posts, tickers: _tickers }: Props) {
  const [activeType, setActiveType] = useState<FilterType>("all");

  const memos = useMemo(() => posts.filter((p) => p.type === "memo"), [posts]);
  const letters = useMemo(() => posts.filter((p) => p.type === "letter"), [posts]);

  const companyGroups = useMemo<CompanyGroup[]>(() => {
    const map = new Map<string, ResearchFrontmatter[]>();
    for (const post of memos) {
      const key = post.ticker ?? "__no_ticker__";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(post);
    }
    const groups: CompanyGroup[] = [];
    for (const [ticker, tickerPosts] of map) {
      const sorted = [...tickerPosts].sort((a, b) => b.date.localeCompare(a.date));
      const latest = sorted[0];
      groups.push({
        companyName: extractCompanyName(latest.title),
        ticker,
        latestRating: latest.rating,
        latestPriceTarget: latest.priceTarget,
        currency: latest.currency ?? "USD",
        exchange: latest.exchange,
        posts: sorted,
      });
    }
    return groups.sort((a, b) => b.posts[0].date.localeCompare(a.posts[0].date));
  }, [memos]);

  const showMemos = activeType === "all" || activeType === "memo";
  const showLetters = activeType === "all" || activeType === "letter";

  return (
    <div>
      {/* Filter strip */}
      <div className="flex gap-1 mb-14" style={{ fontFamily: "var(--font-dm-sans)" }}>
        {(["all", "memo", "letter"] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className="text-[10px] font-bold uppercase tracking-[0.16em] px-5 py-2 rounded-[2px] transition-all"
            style={
              activeType === t
                ? { background: "var(--ink)", color: "var(--ivory)" }
                : { border: "1px solid var(--muted)", color: "var(--subtle)", background: "transparent" }
            }
          >
            {t === "all" ? "All Coverage" : t === "memo" ? "Research" : "Letters"}
          </button>
        ))}
      </div>

      {/* Company register */}
      {showMemos &&
        companyGroups.map((group, gi) => {
          const col = group.latestRating ? ratingColor[group.latestRating] : "var(--muted)";
          const bg = group.latestRating ? ratingBg[group.latestRating] : "transparent";

          return (
            <motion.div
              key={group.ticker}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-5 mb-14"
            >
              {/* Rating stripe — left edge accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
                style={{ background: col }}
              />

              {/* Company header */}
              <div
                className="flex items-start justify-between gap-6 pb-3"
                style={{ borderBottom: `1px solid ${col}` }}
              >
                <div className="flex items-baseline gap-3 flex-wrap min-w-0">
                  <h2
                    className="font-display font-bold leading-none"
                    style={{ fontSize: "1.55rem", letterSpacing: "-0.025em", color: "var(--ink)" }}
                  >
                    {group.companyName}
                  </h2>
                  <span
                    className="text-[9px] font-bold tracking-[0.22em] uppercase px-2 py-[3px] rounded-[2px] flex-shrink-0"
                    style={{
                      background: "var(--ink)",
                      color: "var(--ivory)",
                      fontFamily: "var(--font-dm-sans)",
                    }}
                  >
                    {group.ticker?.replace("$", "")}
                  </span>
                  {group.exchange && (
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
                    >
                      {group.exchange}
                    </span>
                  )}
                </div>

                <div
                  className="flex items-center gap-3 flex-shrink-0 pt-[2px]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {group.latestRating && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-[5px] rounded-[2px]"
                      style={{ color: col, border: `1px solid ${col}`, background: bg }}
                    >
                      {group.latestRating}
                    </span>
                  )}
                  {group.latestPriceTarget != null && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--subtle)" }}
                    >
                      PT{" "}
                      <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                        {formatPrice(group.latestPriceTarget, group.currency)}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Article sub-rows */}
              <div>
                {group.posts.map((post, pi) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: gi * 0.07 + pi * 0.05 + 0.18, duration: 0.28 }}
                  >
                    <Link href={`/research/${post.slug}`} className="block group">
                      <div
                        className="grid items-center gap-x-5 py-3 px-3 -mx-3 rounded-[2px] hover:bg-[rgba(28,28,28,0.03)] transition-colors"
                        style={{
                          gridTemplateColumns: "52px 80px 1fr",
                          borderBottom: "1px solid var(--muted)",
                        }}
                      >
                        <span
                          className="text-[11px] tabular-nums leading-none"
                          style={{
                            color: "var(--subtle)",
                            fontFamily: "var(--font-dm-sans)",
                          }}
                        >
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "2-digit",
                          })}
                        </span>

                        <span
                          className="text-[10px] font-semibold uppercase tracking-widest leading-none"
                          style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
                        >
                          {post.category}
                        </span>

                        <span
                          className="text-sm leading-snug transition-colors group-hover:text-[var(--teal)]"
                          style={{
                            color: "var(--ink)",
                            fontFamily: "var(--font-dm-sans)",
                            fontWeight: 400,
                          }}
                        >
                          {getArticleSubtitle(post.title)}
                          <span
                            className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "var(--teal)" }}
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

      {/* Investor letters */}
      {showLetters && letters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: companyGroups.length * 0.07 + 0.1, duration: 0.45 }}
          className="relative pl-5 mb-14"
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
            style={{ background: "var(--gold)" }}
          />

          <div
            className="flex items-baseline gap-3 pb-3"
            style={{ borderBottom: "1px solid var(--gold)" }}
          >
            <h2
              className="font-display font-bold leading-none"
              style={{ fontSize: "1.55rem", letterSpacing: "-0.025em", color: "var(--ink)" }}
            >
              Investor Letters
            </h2>
            <span
              className="text-[9px] font-bold tracking-[0.22em] uppercase px-2 py-[3px] rounded-[2px]"
              style={{ background: "var(--gold)", color: "#fff", fontFamily: "var(--font-dm-sans)" }}
            >
              Quarterly
            </span>
          </div>

          <div>
            {letters.map((post, pi) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: companyGroups.length * 0.07 + pi * 0.05 + 0.18,
                  duration: 0.28,
                }}
              >
                <Link href={`/research/${post.slug}`} className="block group">
                  <div
                    className="grid items-center gap-x-5 py-3 px-3 -mx-3 rounded-[2px] hover:bg-[rgba(28,28,28,0.03)] transition-colors"
                    style={{
                      gridTemplateColumns: "52px 1fr auto",
                      borderBottom: "1px solid var(--muted)",
                    }}
                  >
                    <span
                      className="text-[11px] tabular-nums"
                      style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
                    >
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>
                    <span
                      className="text-sm leading-snug transition-colors group-hover:text-[var(--teal)]"
                      style={{ color: "var(--ink)", fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}
                    >
                      {post.title}
                      <span
                        className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--teal)" }}
                      >
                        →
                      </span>
                    </span>
                    {post.pdfUrl && (
                      <span
                        className="text-[10px] font-semibold px-2 py-1 rounded-[2px] flex-shrink-0"
                        style={{
                          border: "1px solid var(--gold)",
                          color: "var(--gold)",
                          fontFamily: "var(--font-dm-sans)",
                        }}
                      >
                        PDF ↓
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div
        className="pt-8 mt-8 text-center text-[10px] uppercase tracking-[0.18em]"
        style={{
          borderTop: "1px solid var(--muted)",
          color: "var(--subtle)",
          fontFamily: "var(--font-dm-sans)",
        }}
      >
        {companyGroups.length} {companyGroups.length === 1 ? "company" : "companies"} under coverage
        {memos.length > 0 && ` · ${memos.length} memos published`}
      </div>
    </div>
  );
}
