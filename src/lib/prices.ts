// Server-only: uses Next.js fetch cache options — do not import from client components.

export interface LivePrice {
  ticker: string;
  price: number | null;
  currency: string;
  direction: "up" | "down" | "flat" | null;
  priceAtPublication?: number;
}

/**
 * Fetch live price for a ticker via Yahoo Finance.
 * Falls back gracefully — price is null if fetch fails.
 * Called from Server Components only; revalidates every 5 minutes.
 */
export async function getLivePrice(
  ticker: string,
  priceAtPublication?: number,
  currency = "USD"
): Promise<LivePrice> {
  const symbol = ticker.replace("$", "");

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        next: { revalidate: 300 },
        headers: { "User-Agent": "Mozilla/5.0" },
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const price: number | null =
      json?.chart?.result?.[0]?.meta?.regularMarketPrice ?? null;

    if (!price) throw new Error("No price in response");

    let direction: LivePrice["direction"] = "flat";
    if (priceAtPublication != null) {
      if (price > priceAtPublication) direction = "up";
      else if (price < priceAtPublication) direction = "down";
    }

    return { ticker, price, currency, direction, priceAtPublication };
  } catch {
    return { ticker, price: null, currency, direction: null, priceAtPublication };
  }
}

/** Currency symbols for display */
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  HKD: "HK$",
  CNY: "¥",
  CNH: "¥",
  SGD: "S$",
  TWD: "NT$",
};

/**
 * Format price for display, currency-aware.
 * KRW: whole numbers with commas (e.g. ₩173,500)
 * Others: symbol + 2 decimal places (e.g. $53.40, HK$72.00)
 */
export function formatPrice(price: number | null | undefined, currency = "USD"): string {
  if (price == null) return "—";

  if (currency === "KRW") {
    return `₩${Math.round(price).toLocaleString("en-US")}`;
  }

  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  return `${symbol}${price.toFixed(2)}`;
}
