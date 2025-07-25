import Image from "next/image";

interface BookCardProps {
  title: string;
  author: string;
  image: string;
}

export function BookCard({ title, author, image }: BookCardProps) {
  return (
    <div className="bg-white/30 rounded-lg p-4 hover:bg-black/70 transition-all cursor-pointer text-black hover:text-white">
      <div className="relative aspect-square mb-4">
        <Image src={image} alt={title} fill className="rounded object-cover" />
      </div>
      <h3 className="font-medium truncate">{title}</h3>
      <p className="text-sm text-muted-foreground">{author}</p>
    </div>
  );
}
