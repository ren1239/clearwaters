import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-10 mt-16" style={{ borderTop: "1px solid var(--muted)" }}>
      <div className="container flex flex-col sm:flex-row justify-between gap-8">

        <div>
          <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--ink)" }}>
            Clear Waters Capital
          </p>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--subtle)" }}>
            In Still Waters<br />We Find Clarity
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-semibold mb-3" style={{ color: "var(--ink)" }}>Company</p>
            <ul className="space-y-2" style={{ color: "var(--subtle)" }}>
              <li><Link href="/about" className="hover:opacity-70 transition-opacity">About</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3" style={{ color: "var(--ink)" }}>Research</p>
            <ul className="space-y-2" style={{ color: "var(--subtle)" }}>
              <li><Link href="/research" className="hover:opacity-70 transition-opacity">Memos</Link></li>
              <li><Link href="/research?type=letters" className="hover:opacity-70 transition-opacity">Letters</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3" style={{ color: "var(--ink)" }}>Contact</p>
            <ul className="space-y-2" style={{ color: "var(--subtle)" }}>
              <li>
                <a href="mailto:info@clearwaterscapital.com" className="hover:opacity-70 transition-opacity">
                  Email
                </a>
              </li>
              <li>
                <Link
                  href="https://client.clearwaterscapital.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <div className="container mt-8 pt-6 text-xs" style={{ borderTop: "1px solid var(--muted)", color: "var(--subtle)" }}>
        © {new Date().getFullYear()} Clear Waters Capital LP. All rights reserved.
      </div>
    </footer>
  );
}
