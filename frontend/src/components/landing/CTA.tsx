import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200/80 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white px-6 py-16 text-center shadow-xl shadow-blue-500/5 sm:px-12 sm:py-20">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-blue-50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-blue-50/60 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              Ready to elevate your sprint velocity?
            </span>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Bring your team's tasks together in one focused workspace
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
              Join teams shipping better software faster. Organize your tasks, eliminate ambiguities, and hit your deadlines with confidence.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold !text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                <span>Get started free</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold !text-slate-700 shadow-xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                Sign in
              </Link>
            </div>

            {/* Micro assurances */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free forever tier
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Instant team onboarding
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}