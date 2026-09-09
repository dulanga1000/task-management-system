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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        {/* Brand Panel */}
        <section className="hidden w-[44%] bg-gray-950 lg:flex">
          <div className="flex w-full flex-col px-12 py-10 xl:px-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold !text-white">
                T
              </div>

              <span className="text-lg font-bold tracking-tight !text-white">
                TaskFlow
              </span>
            </Link>

            {/* Main Brand Content */}
            <div className="my-auto max-w-lg">
              <p className="text-sm font-semibold text-blue-400">
                Task management made simple
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight text-white xl:text-5xl">
                Keep your work organized and moving forward.
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-gray-400">
                Create tasks, track progress, and collaborate with your team
                from one focused workspace.
              </p>

              {/* Small visual indicator */}
              <div className="mt-10 flex items-center gap-3">
                <div className="h-1.5 w-8 rounded-full bg-blue-500" />
                <div className="h-1.5 w-2 rounded-full bg-gray-700" />
                <div className="h-1.5 w-2 rounded-full bg-gray-700" />
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </section>

        {/* Form Panel */}
        <section className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-[56%] lg:px-12">
          <div className="w-full max-w-[420px]">
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-10 flex items-center justify-center gap-2 lg:hidden"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold !text-white">
                T
              </div>

              <span className="text-lg font-bold tracking-tight text-gray-900">
                TaskFlow
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-950">
                {title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}