import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ResearchFrontmatter, ResearchPost } from "@/types/research";

const CONTENT_DIR = path.join(process.cwd(), "content", "research");

/** Read and parse a single MDX file by slug */
export function getResearchPost(slug: string): ResearchPost {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as ResearchFrontmatter,
    content,
  };
}

/** Return all posts sorted newest-first */
export function getAllResearchPosts(): ResearchFrontmatter[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data } = matter(raw);
      return data as ResearchFrontmatter;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Return all unique tickers across all posts (for company filter) */
export function getAllTickers(): string[] {
  const posts = getAllResearchPosts();
  const tickers = posts
    .filter((p) => p.ticker)
    .map((p) => p.ticker as string);
  return [...new Set(tickers)];
}

/** Return all slugs (for generateStaticParams) */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
