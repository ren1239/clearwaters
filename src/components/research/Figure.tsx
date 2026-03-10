import Image from "next/image";

interface FigureProps {
  src: string;
  caption?: string;
  slot?: "post-intro" | "post-section" | "full-width";
}

export function Figure({ src, caption }: FigureProps) {
  return (
    <figure className="my-8 w-full">
      <div
        className="relative w-full overflow-hidden rounded-sm"
        style={{ aspectRatio: "16/9", background: "var(--muted)" }}
      >
        <Image
          src={src}
          alt={caption ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 680px"
        />
      </div>
      {caption && (
        <figcaption
          className="mt-2 text-xs text-center"
          style={{ color: "var(--subtle)", fontFamily: "var(--font-dm-sans)" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
