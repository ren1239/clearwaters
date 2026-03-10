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
  priceAtPublication?: number
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

    return { ticker, price, currency: "USD", direction, priceAtPublication };
  } catch {
    return { ticker, price: null, currency: "USD", direction: null, priceAtPublication };
  }
}

/** Format price for display: $53.40. Accepts null or undefined. */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return "—";
  return `$${price.toFixed(2)}`;
}
