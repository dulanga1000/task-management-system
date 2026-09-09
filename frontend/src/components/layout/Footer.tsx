import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-gray-900"
          >
            TaskFlow
          </Link>

          <p className="mt-1 text-xs text-gray-500">
            Simple task management for modern teams.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium !text-gray-600 transition-colors hover:!text-gray-900"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="text-sm font-medium !text-gray-600 transition-colors hover:!text-gray-900"
          >
            Get started
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}