export interface PortfolioHolding {
  ticker: string;
  name: string;
  alloc: number; // portfolio allocation %
}

/** Top 10 holdings by allocation. Update to reflect current portfolio. */
export const TOP_HOLDINGS: PortfolioHolding[] = [
  { ticker: "GOOG",    name: "Alphabet",   alloc: 15.53 },
  { ticker: "1211.HK", name: "BYD",        alloc: 12.57 },
  { ticker: "NVDA",    name: "NVIDIA",     alloc: 12.40 },
  { ticker: "0700.HK", name: "Tencent",    alloc: 11.40 },
  { ticker: "9988.HK", name: "Alibaba",    alloc: 11.02 },
  { ticker: "AMZN",    name: "Amazon",     alloc:  7.89 },
  { ticker: "1810.HK", name: "Xiaomi",     alloc:  6.56 },
  { ticker: "META",    name: "Meta",       alloc:  5.28 },
  { ticker: "MSFT",    name: "Microsoft",  alloc:  5.18 },
  { ticker: "AMD",     name: "AMD",        alloc:  2.50 },
];
