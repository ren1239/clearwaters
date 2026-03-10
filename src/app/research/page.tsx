import { getAllResearchPosts, getAllTickers } from "@/lib/mdx";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ResearchList } from "@/components/research/ResearchList";

export default function ResearchPage() {
  const posts = getAllResearchPosts();
  const tickers = getAllTickers();

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

        <ResearchList posts={posts} tickers={tickers} />
      </main>

      <Footer />
    </div>
  );
}
