"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type FilterType = "all" | "memo" | "letter";

interface Props {
  tickers: string[];
  activeType: FilterType;
  activeTicker: string | null;
  onTypeChange: (type: FilterType) => void;
  onTickerChange: (ticker: string | null) => void;
}

export function ResearchFilters({
  tickers,
  activeType,
  activeTicker,
  onTypeChange,
  onTickerChange,
}: Props) {
  const [showCompany, setShowCompany] = useState(false);

  const pillBase =
    "text-xs font-semibold py-[5px] px-3.5 rounded-sm cursor-pointer transition-colors select-none";

  return (
    <div className="mb-8">
      {/* Row 1: type pills + Filter button */}
      <div className="flex gap-2 items-center flex-wrap">
        {(["all", "memo", "letter"] as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={pillBase}
            style={
              activeType === type
                ? { background: "var(--ink)", color: "var(--ivory)" }
                : { border: "1px solid var(--muted)", color: "var(--subtle)" }
            }
          >
            {type === "all" ? "All" : type === "memo" ? "Memos" : "Letters"}
          </button>
        ))}

        {tickers.length > 0 && (
          <button
            onClick={() => setShowCompany((v) => !v)}
            className={`${pillBase} ml-auto flex items-center gap-1.5`}
            style={
              showCompany || activeTicker != null
                ? { background: "var(--ink)", color: "var(--ivory)" }
                : { border: "1px solid var(--muted)", color: "var(--subtle)" }
            }
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Filter
          </button>
        )}
      </div>

      {/* Row 2: company chips (collapsible) */}
      <AnimatePresence>
        {showCompany && tickers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className="flex gap-2 flex-wrap pt-3"
              style={{ borderTop: "1px solid var(--muted)" }}
            >
              {tickers.map((ticker) => (
                <button
                  key={ticker}
                  onClick={() =>
                    onTickerChange(activeTicker === ticker ? null : ticker)
                  }
                  className="text-xs font-semibold py-[3px] px-3 rounded-full cursor-pointer transition-colors"
                  style={
                    activeTicker === ticker
                      ? { border: "1px solid var(--teal)", color: "var(--teal)", background: "rgba(45,139,139,0.08)" }
                      : { border: "1px solid var(--muted)", color: "var(--subtle)" }
                  }
                >
                  {ticker}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
