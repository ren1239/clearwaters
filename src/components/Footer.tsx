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
              In Still Waters <br /> We Find Clarity
            </p>
          </div>

          {/* Grid with no links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>About</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>Investing</li>
                <li>Advisory</li>
                <li>Research</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Email</li>
                <li>Phone</li>
                <li>Form</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-sm opacity-60 text-center sm:text-left">
          © 2025 Clear Waters Capital. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
