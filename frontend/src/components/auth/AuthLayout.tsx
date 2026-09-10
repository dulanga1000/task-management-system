import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AuthLayout({
  children,
  title,
  description,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Brand Header */}
      <div className="flex justify-center">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-150 active:scale-95"
          aria-label="TaskFlow home"
        >
          <img
            src="/logo.png"
            alt="TaskFlow Logo"
            className="h-9 w-9 rounded-xl object-contain shadow-xs"
          />
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            TaskFlow
          </span>
        </Link>
      </div>

      {/* Centered Auth Card */}
      <div className="my-auto py-8">
        <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-7 sm:p-9">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {description}
            </p>
          </div>

          {children}
        </div>
      </div>

      {/* Bottom Legal & Copyright */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500 py-2">
        <span>© {new Date().getFullYear()} TaskFlow Inc.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-slate-700 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/terms" className="hover:text-slate-700 transition-colors">
            Terms of Service
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/security" className="hover:text-slate-700 transition-colors">
            Security
          </Link>
        </div>
      </div>
    </main>
  );
}