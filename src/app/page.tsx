import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <header className="container py-8 border-b border-black/[.08] dark:border-white/[.08]">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/clearwater-logo.svg"
              alt="Clear Water Capital"
              width={40}
              height={40}
            />
            <span className="text-xl font-semibold">Clear Water Capital</span>
          </div>
          <div className="flex gap-6">
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#services" className="hover:underline">
              Services
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </div>
        </nav>
      </header>
      <main className="container flex flex-col items-center justify-center min-h-[calc(100vh-160px)] py-16 gap-12">
        <h1 className="text-4xl font-bold text-center">
          Investment Solutions
          <br />
          For a Sustainable Future
        </h1>
        <p className="text-xl text-center max-w-2xl">
          Clear Water Capital provides innovative financial strategies
          <br />
          that align profitability with environmental responsibility.
        </p>

        <div className="flex gap-6 items-center flex-col sm:flex-row w-full sm:w-auto">
          <a
            className="rounded-full border border-solid border-transparent flex items-center justify-center bg-foreground text-background gap-3 hover:opacity-90 font-medium text-base h-12 px-6 w-full sm:w-auto"
            href="#contact"
          >
            Contact Us
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] font-medium text-base h-12 px-6 w-full sm:w-auto"
            href="#about"
          >
            Learn More
          </a>
        </div>
      </main>
      <footer className="container flex flex-col gap-8 py-8 border-t border-black/[.08] dark:border-white/[.08]">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/clearwater-logo.svg"
                alt="Clear Water Capital"
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold">Clear Water Capital</span>
            </div>
            <p className="text-sm opacity-80 max-w-xs">
              Sustainable investment solutions for forward-thinking investors.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="#team" className="hover:underline">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:underline">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#investing" className="hover:underline">
                    Investing
                  </a>
                </li>
                <li>
                  <a href="#advisory" className="hover:underline">
                    Advisory
                  </a>
                </li>
                <li>
                  <a href="#research" className="hover:underline">
                    Research
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:info@clearwater.capital"
                    className="hover:underline"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a href="tel:+18005551234" className="hover:underline">
                    Phone
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:underline">
                    Form
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-sm opacity-60 text-center sm:text-left">
          © 2025 Clear Water Capital. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
