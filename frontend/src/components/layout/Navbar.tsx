import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-150 active:scale-95"
          aria-label="TaskFlow home"
        >
          <img
            src="/logo.png"
            alt="TaskFlow Logo"
            className="h-8 w-8 rounded-lg object-contain shadow-xs"
          />

          <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            TaskFlow
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/#features"
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/70 hover:text-slate-900"
          >
            Features
          </Link>

          <Link
            href="/#how-it-works"
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/70 hover:text-slate-900"
          >
            How it works
          </Link>

          <Link
            href="/#faq"
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/70 hover:text-slate-900"
          >
            FAQ
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100/70 hover:text-slate-900 sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}