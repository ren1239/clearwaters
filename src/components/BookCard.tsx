import Image from "next/image";

interface BookCardProps {
  title: string;
  author: string;
  image: string;
}

export function BookCard({ title, author, image }: BookCardProps) {
  return (
    <div
      className="group cursor-pointer"
      style={{ transition: "opacity 0.2s ease" }}
    >
      <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-sm" style={{ background: "var(--muted)" }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>
      <p className="text-sm font-semibold leading-snug mb-1 group-hover:opacity-70 transition-opacity" style={{ color: "var(--ink)" }}>
        {title}
      </p>
      <p className="text-xs" style={{ color: "var(--subtle)" }}>
        {author}
      </p>
    </div>
  );
}
