import Link from "next/link";

export default function CTA() {
  return (
    <section className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-3xl bg-gray-900 px-6 py-14 text-center sm:px-12">
          <p className="text-sm font-semibold text-blue-400">
            Ready to get organized?
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Bring your tasks together in one simple workspace.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400">
            Start organizing your work and keep your progress clear from
            start to finish.
          </p>

          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold !text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Get started
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}