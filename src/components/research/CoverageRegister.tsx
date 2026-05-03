"use client";

import { COVERAGE } from "@/lib/coverageConfig";
import type { LivePrice } from "@/lib/prices";

interface Props {
  livePrices?: Record<string, LivePrice>;
}

const ratingColor: Record<string, string> = {
  BUY: "var(--teal)",
  HOLD: "var(--gold)",
  SELL: "#c0392b",
};
const ratingBg: Record<string, string> = {
  BUY: "rgba(45,139,139,0.09)",
  HOLD: "rgba(200,169,110,0.09)",
  SELL: "rgba(192,57,43,0.09)",
};

const currencyPrefix: Record<string, string> = {
  USD: "$",
  HKD: "HK$",
  KRW: "₩",
  CNY: "¥",
  CNH: "¥",
  SGD: "S$",
  TWD: "NT$",
};

function fmtShort(val: number, currency: string): string {
  const prefix = currencyPrefix[currency] ?? currency + "\u00a0";
  if (val >= 100_000) return `${prefix}${(val / 1000).toFixed(0)}k`;
  if (val >= 10_000) return `${prefix}${(val / 1000).toFixed(1)}k`;
  if (val >= 1_000) return `${prefix}${(val / 1000).toFixed(2)}k`;
  if (val >= 100) return `${prefix}${Math.round(val)}`;
  return `${prefix}${val % 1 === 0 ? val : val.toFixed(1)}`;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// 6-column ledger matching ResearchList column pattern
const COLS = "84px 172px 1fr 62px 58px 96px";

const maxWeight = Math.max(...COVERAGE.map((c) => c.weight));

export function CoverageRegister({ livePrices = {} }: Props) {
  return (
    <div
      className="pt-8 mt-8"
      style={{ borderTop: "1px solid var(--muted)" }}
    >
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-5">
        <h2
          className="font-display font-bold leading-none"
          style={{ fontSize: "1.55rem", letterSpacing: "-0.025em", color: "var(--ink)" }}
        >
          Coverage Register
        </h2>
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
        >
          Bear — current — PT range
        </span>
      </div>

      {/* Column headers */}
      <div
        className="grid gap-x-3 px-3 -mx-3 py-[6px]"
        style={{
          gridTemplateColumns: COLS,
          borderBottom: "1px solid var(--muted)",
        }}
      >
        {(["Ticker", "Company", "Thesis range", "To PT", "Rating", "Exposure"] as const).map(
          (label, i) => (
            <span
              key={i}
              className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${i >= 3 ? "text-right" : ""}`}
              style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
            >
              {label}
            </span>
          )
        )}
      </div>

      {/* Rows */}
      {COVERAGE.map((entry) => {
        const col = ratingColor[entry.rating];
        const bg = ratingBg[entry.rating];
        const rc = entry.rating.toLowerCase();

        const lp = livePrices[entry.ticker];
        const curPrice = lp?.price ?? null;

        // Rail geometry: bear → bull with padding
        const railMin = entry.bear * 0.96;
        const railMax = entry.bull * 1.02;
        const span = railMax - railMin;

        const ptPct = clamp(((entry.pt - railMin) / span) * 100, 0, 100);
        const curPct =
          curPrice !== null
            ? clamp(((curPrice - railMin) / span) * 100, 0, 100)
            : null;

        // Upside to PT from live price (fall back to pub price)
        const refPrice = curPrice ?? lp?.priceAtPublication ?? null;
        const upsideNum =
          refPrice !== null ? ((entry.pt - refPrice) / refPrice) * 100 : null;
        const upsideStr =
          upsideNum !== null
            ? `${upsideNum >= 0 ? "+" : ""}${upsideNum.toFixed(1)}%`
            : "—";
        const upsideColor =
          upsideNum === null
            ? "var(--subtle)"
            : upsideNum > 5
            ? "var(--teal)"
            : upsideNum < -5
            ? "#c0392b"
            : "var(--subtle)";

        const expFill = (entry.weight / maxWeight) * 100;

        // Keep current-price label from clipping at edges
        const lblLeft = curPct !== null ? clamp(curPct, 8, 92) : 50;

        return (
          <div
            key={entry.ticker}
            className="relative"
            style={{ borderBottom: "1px solid var(--muted)" }}
          >
            {/* Rating stripe */}
            <div
              className="absolute left-0 rounded-full"
              style={{ top: 10, bottom: 10, width: 3, background: col }}
            />

            <div
              className="grid gap-x-3 items-center px-3 -mx-3"
              style={{ gridTemplateColumns: COLS, padding: "13px 12px" }}
            >
              {/* Ticker */}
              <div>
                <span
                  className="block text-[11px] font-bold uppercase tracking-[0.08em]"
                  style={{ color: "var(--ink)", fontFamily: "var(--font-dm-sans)" }}
                >
                  {entry.ticker.replace("$", "")}
                </span>
                <span
                  className="block text-[9px] uppercase tracking-[0.14em] mt-[3px]"
                  style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
                >
                  {entry.exchange}
                </span>
              </div>

              {/* Company name */}
              <span
                className="text-[13px] truncate"
                style={{ color: "var(--ink)", fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}
              >
                {entry.name}
              </span>

              {/* Price rail */}
              <div className="relative" style={{ height: 46 }}>
                {/* Track */}
                <div
                  className="absolute"
                  style={{
                    left: 0,
                    right: 0,
                    top: 18,
                    height: 1,
                    background: "var(--muted)",
                  }}
                />

                {/* Bear end tick */}
                <div
                  className="absolute"
                  style={{ left: 0, top: 14, width: 1, height: 9, background: "var(--muted)" }}
                />

                {/* Bull end tick */}
                <div
                  className="absolute"
                  style={{ right: 0, top: 14, width: 1, height: 9, background: "var(--muted)" }}
                />

                {/* PT tick */}
                <div
                  className="absolute"
                  style={{
                    left: `${ptPct}%`,
                    top: 13,
                    width: 1,
                    height: 11,
                    background: col,
                    opacity: 0.6,
                  }}
                />

                {/* Current price dot */}
                {curPct !== null && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      left: `${curPct}%`,
                      top: 18,
                      width: 7,
                      height: 7,
                      background: col,
                      transform: "translate(-50%, -50%)",
                      boxShadow: `0 0 0 2.5px var(--ivory), 0 0 0 4px ${col}40`,
                    }}
                  />
                )}

                {/* Current price label — floats above dot */}
                {curPct !== null && curPrice !== null && (
                  <div
                    className="absolute"
                    style={{
                      left: `${lblLeft}%`,
                      top: 1,
                      transform: "translateX(-50%)",
                      fontSize: 9,
                      fontWeight: 600,
                      color: col,
                      whiteSpace: "nowrap",
                      fontFamily: "var(--font-dm-sans)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmtShort(curPrice, entry.currency)}
                  </div>
                )}

                {/* Floor labels: bear | PT | bull */}
                <div className="absolute" style={{ left: 0, right: 0, top: 25 }}>
                  <span
                    className="absolute"
                    style={{
                      left: 0,
                      fontSize: 9,
                      color: "var(--subtle)",
                      fontFamily: "var(--font-dm-sans)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmtShort(entry.bear, entry.currency)}
                  </span>
                  <span
                    className="absolute"
                    style={{
                      left: `${ptPct}%`,
                      transform: "translateX(-50%)",
                      fontSize: 9,
                      fontWeight: 500,
                      color: "var(--ink)",
                      fontFamily: "var(--font-dm-sans)",
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                    }}
                  >
                    PT {fmtShort(entry.pt, entry.currency)}
                  </span>
                  <span
                    className="absolute"
                    style={{
                      right: 0,
                      fontSize: 9,
                      color: "var(--subtle)",
                      fontFamily: "var(--font-dm-sans)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {fmtShort(entry.bull, entry.currency)}
                  </span>
                </div>
              </div>

              {/* Upside to PT */}
              <span
                className="text-[12px] font-semibold tabular-nums text-right"
                style={{ color: upsideColor, fontFamily: "var(--font-dm-sans)" }}
              >
                {upsideStr}
              </span>

              {/* Rating badge */}
              <div className="flex justify-end">
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.16em] px-[7px] py-[4px] rounded-[2px]`}
                  style={{
                    color: col,
                    border: `1px solid ${col}`,
                    background: bg,
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {entry.rating}
                </span>
              </div>

              {/* Exposure bar */}
              <div className="flex items-center justify-end gap-[6px]">
                <span
                  className="text-[10px] tabular-nums"
                  style={{
                    color: "var(--subtle)",
                    fontFamily: "var(--font-dm-sans)",
                    minWidth: 24,
                    textAlign: "right",
                  }}
                >
                  {entry.weight}%
                </span>
                <div
                  className="flex-shrink-0 rounded-[2px] overflow-hidden"
                  style={{ width: 42, height: 2, background: "var(--muted)" }}
                >
                  <div
                    className="h-full rounded-[2px]"
                    style={{
                      width: `${expFill}%`,
                      background: "var(--subtle)",
                      opacity: 0.45,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
