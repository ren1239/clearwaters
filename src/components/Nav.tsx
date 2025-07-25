import Link from "next/link";
import Image from "next/image";

export function Nav() {
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/logo/clear.png"
          alt="Clear Water Capital"
          width={140}
          height={140}
        />
      </div>
      <div className="flex gap-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/toolbox" className="hover:underline">
          Toolbox
        </Link>
      </div>
    </nav>
  );
}
