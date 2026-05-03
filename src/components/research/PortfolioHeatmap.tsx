import { TOP_HOLDINGS } from "@/lib/portfolioData";

// ─── Squarified treemap algorithm ────────────────────────────────────────────

const LW = 1000; // logical coordinate width
const LH = 280;  // logical coordinate height

interface TileRect { x: number; y: number; w: number; h: number }
interface TileData  { ticker: string; name: string; alloc: number; rect: TileRect }

function worstRatio(
  items: typeof TOP_HOLDINGS,
  rowSum: number,
  total: number,
  w: number,
  h: number,
  isWide: boolean,
): number {
  const thickness = (isWide ? w : h) * (rowSum / total);
  const length    = isWide ? h : w;
  let worst = 0;
  for (const item of items) {
    const cellLen = length * (item.alloc / rowSum);
    const r = thickness > cellLen ? thickness / cellLen : cellLen / thickness;
    if (r > worst) worst = r;
  }
  return worst;
}

function squarifyLayout(
  items: typeof TOP_HOLDINGS,
  rect: TileRect,
  result: TileData[],
): void {
  if (items.length === 0) return;
  if (items.length === 1) { result.push({ ...items[0], rect }); return; }

  const total  = items.reduce((s, i) => s + i.alloc, 0);
  const { x, y, w, h } = rect;
  const isWide = w >= h;

  // Greedy: keep adding items to the row while aspect ratio improves
  let bestN     = 1;
  let rowSum    = items[0].alloc;
  let bestWorst = worstRatio([items[0]], rowSum, total, w, h, isWide);

  for (let n = 2; n <= items.length; n++) {
    rowSum += items[n - 1].alloc;
    const worst = worstRatio(items.slice(0, n), rowSum, total, w, h, isWide);
    if (worst > bestWorst) { rowSum -= items[n - 1].alloc; break; }
    bestWorst = worst;
    bestN = n;
  }

  const row = items.slice(0, bestN);
  rowSum = row.reduce((s, i) => s + i.alloc, 0);
  const rowFrac = rowSum / total;

  if (isWide) {
    const colW = w * rowFrac;
    let curY = y;
    for (const item of row) {
      const tileH = h * (item.alloc / rowSum);
      result.push({ ...item, rect: { x, y: curY, w: colW, h: tileH } });
      curY += tileH;
    }
    squarifyLayout(items.slice(bestN), { x: x + colW, y, w: w - colW, h }, result);
  } else {
    const rowH = h * rowFrac;
    let curX = x;
    for (const item of row) {
      const tileW = w * (item.alloc / rowSum);
      result.push({ ...item, rect: { x: curX, y, w: tileW, h: rowH } });
      curX += tileW;
    }
    squarifyLayout(items.slice(bestN), { x, y: y + rowH, w, h: h - rowH }, result);
  }
}

// Precompute at module level — static data, computed once
const sorted = [...TOP_HOLDINGS].sort((a, b) => b.alloc - a.alloc);
const TILES: TileData[] = [];
squarifyLayout(sorted, { x: 0, y: 0, w: LW, h: LH }, TILES);

// ─── Color scale (pale teal → deep teal) ─────────────────────────────────────

const MIN_ALLOC = sorted[sorted.length - 1].alloc;
const MAX_ALLOC = sorted[0].alloc;

// light: rgb(200,228,228)  dark: rgb(28,88,88)
function tileColor(alloc: number): string {
  const t = (alloc - MIN_ALLOC) / (MAX_ALLOC - MIN_ALLOC);
  const r = Math.round(200 + t * (28  - 200));
  const g = Math.round(228 + t * (88  - 228));
  const b = Math.round(228 + t * (88  - 228));
  return `rgb(${r},${g},${b})`;
}

function textColor(alloc: number): string {
  const t = (alloc - MIN_ALLOC) / (MAX_ALLOC - MIN_ALLOC);
  return t > 0.42 ? "#F8F5EF" : "#1d5c5c";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PortfolioHeatmap() {
  const legendStops = [0, 5, 10, 15, 20];
  const lightColor  = tileColor(MIN_ALLOC);
  const darkColor   = tileColor(MAX_ALLOC);

  return (
    <div className="pt-8 mt-8" style={{ borderTop: "1px solid var(--muted)" }}>

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
          Top 10 holdings · area = allocation %
        </span>
      </div>

      {/* Treemap */}
      <div style={{ position: "relative", width: "100%", paddingBottom: `${(LH / LW) * 100}%` }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {TILES.map((tile) => {
            const left   = `${(tile.rect.x / LW) * 100}%`;
            const top    = `${(tile.rect.y / LH) * 100}%`;
            const width  = `${(tile.rect.w / LW) * 100}%`;
            const height = `${(tile.rect.h / LH) * 100}%`;
            const bg     = tileColor(tile.alloc);
            const fg     = textColor(tile.alloc);

            return (
              <div
                key={tile.ticker}
                style={{
                  position: "absolute",
                  left, top, width, height,
                  padding: 1.5,
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: bg,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    gap: 3,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: fg,
                      lineHeight: 1,
                    }}
                  >
                    {tile.ticker}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontSize: 9,
                      color: fg,
                      opacity: 0.75,
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {tile.alloc.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        className="flex flex-col items-center"
        style={{ marginTop: 20, gap: 5 }}
      >
        <div
          style={{
            width: 280,
            height: 10,
            borderRadius: 2,
            background: `linear-gradient(to right, ${lightColor}, ${darkColor})`,
          }}
        />
        <div
          style={{
            width: 280,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {legendStops.map((v) => (
            <span
              key={v}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: 9,
                color: "var(--subtle)",
              }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
