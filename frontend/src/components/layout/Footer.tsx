import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand & Mission */}
          <div className="md:col-span-6 lg:col-span-7">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              <img
                src="/logo.png"
                alt="TaskFlow Logo"
                className="h-7 w-7 rounded-lg object-contain"
              />
              <span className="text-lg">TaskFlow</span>
            </Link>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              A modern, high-velocity task management workspace designed for agile teams to plan, collaborate, and ship together with confidence.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#features"
                  className="transition-colors hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="transition-colors hover:text-white"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="transition-colors hover:text-white"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-white"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="transition-colors hover:text-white"
                >
                  Get Started Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Trust & Legal
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="transition-colors hover:text-white"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} TaskFlow. Built for modern productive teams. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="transition-colors hover:text-slate-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-slate-200">
              Terms of Service
            </Link>
            <Link href="/security" className="transition-colors hover:text-slate-200">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}