import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ArticleMetaBadges } from "@/components/research/ArticleMetaBadges";
import { Figure } from "@/components/research/Figure";
import { Disclosure } from "@/components/research/Disclosure";
import { getResearchPost, getAllSlugs } from "@/lib/mdx";
import { getLivePrice } from "@/lib/prices";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ResearchPost } from "@/types/research";

const mdxComponents = {
  Figure,
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: ResearchPost;
  try {
    post = getResearchPost(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = post;

  const livePrice = frontmatter.ticker
    ? await getLivePrice(frontmatter.ticker, frontmatter.priceAtPublication)
    : undefined;

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)", color: "var(--ink)" }}>
      <header className="container py-6" style={{ borderBottom: "1px solid var(--muted)" }}>
        <Nav />
      </header>

      <main className="container py-16">
        <article className="max-w-[680px] mx-auto">

          {/* ── Fixed header block ── */}
          <header className="mb-10">
            <p
              className="text-xs font-semibold tracking-[0.12em] uppercase mb-3"
              style={{ color: "var(--teal)", fontFamily: "var(--font-dm-sans)" }}
            >
              {frontmatter.category}
            </p>
            <h1
              className="font-display text-4xl md:text-5xl font-bold leading-[1.1] mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              {frontmatter.title}
            </h1>
            <p
              className="text-sm mb-6"
              style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
            >
              Clear Waters Capital ·{" "}
              {new Date(frontmatter.date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="mb-6" style={{ borderTop: "2px solid var(--ink)" }} />

            <ArticleMetaBadges frontmatter={frontmatter} livePrice={livePrice} />

            {/* Thesis pull-quote (from `summary` frontmatter field) */}
            {frontmatter.summary && (
              <blockquote
                className="mt-8 py-4 px-5 italic text-base leading-relaxed"
                style={{
                  borderLeft: "3px solid var(--gold)",
                  background: "rgba(200,169,110,0.06)",
                  color: "#444",
                  fontFamily: "var(--font-playfair)",
                }}
              >
                {frontmatter.summary}
              </blockquote>
            )}

            <div className="mt-8 h-px w-10" style={{ background: "var(--gold)" }} />
          </header>

          {/* ── Article body ── */}
          <div className="article-body">
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          {/* ── Disclosure (always last) ── */}
          <Disclosure />
        </article>
      </main>

      <Footer />
    </div>
  );
}
