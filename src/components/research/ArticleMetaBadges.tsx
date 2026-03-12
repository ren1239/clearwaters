import type { ResearchFrontmatter } from "@/types/research";
import type { LivePrice } from "@/lib/prices";
import { formatPrice } from "@/lib/prices";

interface Props {
  frontmatter: ResearchFrontmatter;
  livePrice?: LivePrice;
}

const ratingColors: Record<string, string> = {
  BUY:  "var(--teal)",
  HOLD: "var(--gold)",
  SELL: "#b91c1c",
};

export function ArticleMetaBadges({ frontmatter, livePrice }: Props) {
  const { ticker, rating, priceTarget, priceAtPublication, pdfUrl, type, currency = "USD" } = frontmatter;

  if (type === "letter") {
    return (
      <div className="flex gap-2 flex-wrap items-center">
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold py-1 px-3 rounded-sm transition-opacity hover:opacity-80"
            style={{ border: "1px solid var(--gold)", color: "var(--gold)" }}
          >
            PDF Download ↓
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {ticker && (
        <span
          className="text-xs font-bold py-1 px-3 rounded-sm"
          style={{ background: "var(--ink)", color: "var(--ivory)" }}
        >
          {ticker}
        </span>
      )}
      {rating && (
        <span
          className="text-xs font-bold py-1 px-3 rounded-sm"
          style={{ background: ratingColors[rating] ?? "var(--subtle)", color: "#fff" }}
        >
          {rating}
        </span>
      )}
      {priceTarget != null && (
        <span
          className="text-xs py-1 px-3 rounded-sm"
          style={{ border: "1px solid var(--muted)", color: "var(--subtle)" }}
        >
          PT {formatPrice(priceTarget, currency)}
        </span>
      )}
      {priceAtPublication != null && (
        <span
          className="text-xs py-1 px-3 rounded-sm"
          style={{ border: "1px solid var(--muted)", color: "var(--subtle)" }}
        >
          Pub {formatPrice(priceAtPublication, currency)}
        </span>
      )}
      {livePrice && (
        <span
          className="text-xs font-semibold py-1 px-3 rounded-sm"
          style={{
            border: `1px solid ${livePrice.price != null ? "var(--teal)" : "var(--muted)"}`,
            color: livePrice.price != null ? "var(--teal)" : "var(--subtle)",
          }}
        >
          Now {formatPrice(livePrice.price, livePrice.currency)}
          {livePrice.direction === "up" && " ↑"}
          {livePrice.direction === "down" && " ↓"}
        </span>
      )}
    </div>
  );
}
