import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-50/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        {/* Hero content */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Simple task management for modern teams
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Manage your work.
            <br />
            <span className="text-blue-600">Stay organized.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            Plan tasks, track progress, and keep your team aligned with a
            simple and powerful workspace built to help you get things done.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Get started
              <span className="ml-2">→</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-sm font-semibold !text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            No complicated setup. Start managing your tasks today.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mx-auto mt-16 max-w-6xl lg:mt-20">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60">
            {/* Browser header */}
            <div className="flex h-11 items-center border-b border-gray-100 bg-gray-50 px-4">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              </div>

              <div className="mx-auto hidden rounded-md bg-white px-16 py-1 text-[10px] text-gray-400 shadow-sm sm:block">
                app.taskflow.com/dashboard
              </div>
            </div>

            {/* Fake dashboard */}
            <div className="bg-gray-50 p-4 sm:p-6">
              {/* Dashboard top */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-28 rounded bg-gray-200" />
                  <div className="mt-2 h-2.5 w-40 rounded bg-gray-100" />
                </div>

                <div className="h-8 w-24 rounded-lg bg-blue-600" />
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["12", "Total tasks"],
                  ["5", "To do"],
                  ["3", "In progress"],
                  ["4", "Completed"],
                ].map(([number, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <p className="text-xl font-bold text-gray-900">
                      {number}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Board */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "TO DO",
                    count: 5,
                  },
                  {
                    title: "DOING",
                    count: 3,
                  },
                  {
                    title: "DONE",
                    count: 4,
                  },
                ].map((column) => (
                  <div
                    key={column.title}
                    className="rounded-xl border border-gray-200 bg-gray-100/70 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[11px] font-semibold tracking-wide text-gray-600">
                        {column.title}
                      </p>

                      <span className="text-[10px] text-gray-400">
                        {column.count}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {Array.from({
                        length: Math.min(column.count, 2),
                      }).map((_, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                        >
                          <div className="h-2.5 w-3/4 rounded bg-gray-200" />
                          <div className="mt-2 h-2 w-1/2 rounded bg-gray-100" />

                          <div className="mt-4 flex items-center justify-between">
                            <div className="h-5 w-5 rounded-full bg-gray-200" />
                            <div className="h-2 w-10 rounded bg-gray-100" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            A simple workspace for managing your team's work
          </p>
        </div>
      </div>
    </section>
  );
}