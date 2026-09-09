import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md text-center">
        {/* Error Code */}
        <div className="mb-6">
          <span className="text-7xl font-bold tracking-tight text-red-600">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Page not found
        </h1>

        {/* Description */}
        <p className="mt-4 text-base leading-7 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved.
        </p>

        {/* Button */}
        <div className="mt-8">
            <Link href="/" className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Back to home</Link>
        </div>
      </div>
    </main>
  );
}