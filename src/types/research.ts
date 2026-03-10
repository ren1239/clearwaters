export type ResearchType = "memo" | "letter";

export type ResearchRating = "BUY" | "HOLD" | "SELL";

export type ResearchCategory =
  | "Deep Dive"
  | "Initiation"
  | "Update"
  | "Quarterly Letter";

export interface ResearchFrontmatter {
  title: string;
  slug: string;
  date: string;                // YYYY-MM-DD
  type: ResearchType;
  category: ResearchCategory;
  excerpt: string;
  summary?: string;            // 1–2 sentence italic pull-quote shown in article header
  // Memo-only fields (omit for letters)
  ticker?: string;             // e.g. "$TCEHY"
  rating?: ResearchRating;
  priceTarget?: number;        // USD
  priceAtPublication?: number; // USD
  // Letter-only fields
  pdfUrl?: string;
}

export interface ResearchPost {
  frontmatter: ResearchFrontmatter;
  content: string;             // raw MDX string (body only — no Disclosure section)
}
