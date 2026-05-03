import { getAllResearchPosts, getAllTickers } from "@/lib/mdx";
import { getLivePrice, type LivePrice } from "@/lib/prices";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ResearchList } from "@/components/research/ResearchList";

export default async function ResearchPage() {
  const posts = getAllResearchPosts();
  const tickers = getAllTickers();

  // Build a map of ticker → { currency, priceAtPublication } from the latest post per ticker
  const tickerMeta: Record<string, { currency: string; priceAtPublication?: number }> = {};
  for (const post of posts) {
    if (post.ticker && !tickerMeta[post.ticker]) {
      tickerMeta[post.ticker] = {
        currency: post.currency ?? "USD",
        priceAtPublication: post.priceAtPublication,
      };
    }
  }

  // Fetch live prices in parallel for all covered tickers
  const priceEntries = await Promise.all(
    Object.entries(tickerMeta).map(([ticker, meta]) =>
      getLivePrice(ticker, meta.priceAtPublication, meta.currency).then(
        (lp) => [ticker, lp] as [string, LivePrice]
      )
    )
  );
  const livePrices: Record<string, LivePrice> = Object.fromEntries(priceEntries);

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)", color: "var(--ink)" }}>
      <header className="container py-6" style={{ borderBottom: "1px solid var(--muted)" }}>
        <Nav />
      </header>

      <main className="container py-16">
        <h1
          className="font-display text-5xl font-bold mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Research
        </h1>
        <div className="h-px w-10 mb-10" style={{ background: "var(--gold)" }} />

        <ResearchList posts={posts} tickers={tickers} livePrices={livePrices} />
      </main>

      <Footer />
    </div>
  );
}
