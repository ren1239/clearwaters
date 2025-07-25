import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-black/40 py-8">
      <div className="container flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold">
                Clear Waters Capital
              </span>
            </div>
            <p className="text-sm opacity-80 max-w-xs">
              In still waters, we find clarity. <br />
              In clarity, we grow.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#about" className="hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#team" className="hover:underline">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="hover:underline">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#investing" className="hover:underline">
                    Investing
                  </Link>
                </li>
                <li>
                  <Link href="#advisory" className="hover:underline">
                    Advisory
                  </Link>
                </li>
                <li>
                  <Link href="#research" className="hover:underline">
                    Research
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="mailto:info@clearwater.capital"
                    className="hover:underline"
                  >
                    Email
                  </Link>
                </li>
                <li>
                  <Link href="tel:+18005551234" className="hover:underline">
                    Phone
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:underline">
                    Form
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-sm opacity-60 text-center sm:text-left">
          © 2025 Clear Water Capital. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
