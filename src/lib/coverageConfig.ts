export interface CoverageEntry {
  /** Matches the `ticker` field in MDX frontmatter exactly (including $ prefix if present) */
  ticker: string;
  name: string;
  exchange: string;
  currency: string; // ISO code matching MDX frontmatter
  bear: number;
  pt: number;
  bull: number;
  rating: "BUY" | "HOLD" | "SELL";
  /** Relative portfolio weight 0–100 (display only — not disclosed as absolute $) */
  weight: number;
}

/** Active coverage universe. Sorted by descending portfolio weight. */
export const COVERAGE: CoverageEntry[] = [
  {
    ticker: "$META",
    name: "Meta Platforms",
    exchange: "NASDAQ",
    currency: "USD",
    bear: 400,
    pt: 720,
    bull: 900,
    rating: "BUY",
    weight: 19,
  },
  {
    ticker: "$SPGI",
    name: "S&P Global",
    exchange: "NYSE",
    currency: "USD",
    bear: 320,
    pt: 540,
    bull: 680,
    rating: "BUY",
    weight: 17,
  },
  {
    ticker: "0700.HK",
    name: "Tencent Holdings",
    exchange: "HKEX",
    currency: "HKD",
    bear: 380,
    pt: 640,
    bull: 980,
    rating: "BUY",
    weight: 16,
  },
  {
    ticker: "$1211.HK",
    name: "BYD Company",
    exchange: "HKEX",
    currency: "HKD",
    bear: 75,
    pt: 121,
    bull: 170,
    rating: "BUY",
    weight: 14,
  },
  {
    ticker: "$1810.HK",
    name: "Xiaomi Corp.",
    exchange: "HKEX",
    currency: "HKD",
    bear: 28,
    pt: 44,
    bull: 85,
    rating: "HOLD",
    weight: 12,
  },
  {
    ticker: "005930.KS",
    name: "Samsung Elec.",
    exchange: "KRX",
    currency: "KRW",
    bear: 120000,
    pt: 240000,
    bull: 340000,
    rating: "BUY",
    weight: 10,
  },
  {
    ticker: "2525.HK",
    name: "Hesai Group",
    exchange: "HKEX",
    currency: "HKD",
    bear: 100,
    pt: 231,
    bull: 320,
    rating: "BUY",
    weight: 7,
  },
  {
    ticker: "002156.SZ",
    name: "Tongfu Micro.",
    exchange: "SZSE",
    currency: "CNY",
    bear: 30,
    pt: 47,
    bull: 75,
    rating: "HOLD",
    weight: 5,
  },
];
