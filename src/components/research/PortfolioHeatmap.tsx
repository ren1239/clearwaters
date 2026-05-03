import { TOP_HOLDINGS } from "@/lib/portfolioData";
import { COVERAGE } from "@/lib/coverageConfig";

// Build a ticker → rating map from coverage (normalise $ prefix)
const coverageByTicker = new Map(
  COVERAGE.map((c) => [c.ticker.replace("$", ""), c.rating])
);

const ratingColor: Record<string, string> = {
  BUY:  "var(--teal)",
  HOLD: "var(--gold)",
  SELL: "#c0392b",
};
const ratingBg: Record<string, string> = {
  BUY:  "rgba(45,139,139,0.07)",
  HOLD: "rgba(200,169,110,0.07)",
  SELL: "rgba(192,57,43,0.07)",
};

// Split into 3 rows: top-3, next-3, last-4
const ROWS = [
  TOP_HOLDINGS.slice(0, 3),
  TOP_HOLDINGS.slice(3, 6),
  TOP_HOLDINGS.slice(6, 10),
];

const total = TOP_HOLDINGS.reduce((s, h) => s + h.alloc, 0);

function rowHeight(row: typeof TOP_HOLDINGS): string {
  return `${(row.reduce((s, h) => s + h.alloc, 0) / total) * 100}%`;
}

export function PortfolioHeatmap() {
  return (
    <div
      className="pt-8 mt-8"
      style={{ borderTop: "1px solid var(--muted)" }}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between mb-5">
        <h2
          className="font-display font-bold leading-none"
          style={{ fontSize: "1.55rem", letterSpacing: "-0.025em", color: "var(--ink)" }}
        >
          Portfolio Exposure
        </h2>
        <span
          className="text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
        >
          Top 10 holdings · area = allocation
        </span>
      </div>

      {/* Treemap */}
      <div
        style={{
          height: 280,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {ROWS.map((row, ri) => (
          <div
            key={ri}
            style={{
              height: rowHeight(row),
              display: "flex",
              gap: 2,
              flex: "none",
            }}
          >
            {row.map((holding) => {
              const rating = coverageByTicker.get(holding.ticker);
              const col   = rating ? ratingColor[rating] : "var(--muted)";
              const bg    = rating ? ratingBg[rating]    : "rgba(28,28,28,0.04)";
              const isCovered = !!rating;

              return (
                <div
                  key={holding.ticker}
                  style={{
                    flex: holding.alloc,
                    background: bg,
                    borderTop: `2px solid ${col}`,
                    padding: "10px 11px 9px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    minWidth: 0,
                  }}
                >
                  {/* Top row: ticker + coverage badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--ink)",
                        lineHeight: 1,
                      }}
                    >
                      {holding.ticker}
                    </span>
                    {isCovered && (
                      <span
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: col,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        {rating}
                      </span>
                    )}
                  </div>

                  {/* Bottom row: company name + alloc */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 9,
                        color: "var(--subtle)",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {holding.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--ink)",
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {holding.alloc.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-5 mt-4"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        <div className="flex items-center gap-[6px]">
          <div
            style={{ width: 12, height: 2, background: "var(--teal)", borderRadius: 1 }}
          />
          <span className="text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ color: "var(--subtle)" }}>
            Coverage · BUY
          </span>
        </div>
        <div className="flex items-center gap-[6px]">
          <div
            style={{ width: 12, height: 2, background: "var(--gold)", borderRadius: 1 }}
          />
          <span className="text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ color: "var(--subtle)" }}>
            Coverage · HOLD
          </span>
        </div>
        <div className="flex items-center gap-[6px]">
          <div
            style={{ width: 12, height: 2, background: "var(--muted)", borderRadius: 1 }}
          />
          <span className="text-[9px] uppercase tracking-[0.16em] font-semibold" style={{ color: "var(--subtle)" }}>
            Not covered
          </span>
        </div>
      </div>
    </div>
  );
}
