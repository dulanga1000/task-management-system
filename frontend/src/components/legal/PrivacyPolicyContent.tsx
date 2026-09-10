import Link from "next/link";
import { ArrowLeft, Lock, ShieldCheck, UserCheck } from "lucide-react";

export default function PrivacyPolicyContent() {
  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Legal
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: September 2026 • Effective immediately
          </p>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-10 text-base leading-7 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
            <p className="mt-3">
              TaskFlow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides an agile task management platform designed to help teams plan, track, and ship work collaboratively. This Privacy Policy outlines the specific data we collect, how it is processed, and the security measures safeguarding your workspace data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
            <p className="mt-3">
              We only collect data necessary to provide and secure your TaskFlow workspace:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-800">Account Profile:</strong> Your first name, last name, unique username, and email address provided during registration.
              </li>
              <li>
                <strong className="text-slate-800">Security Credentials:</strong> Passwords are cryptographically hashed using salted bcrypt before database persistence. Plaintext passwords are never stored, logged, or exposed via our APIs.
              </li>
              <li>
                <strong className="text-slate-800">Task & Workspace Data:</strong> Task titles, descriptions, status columns (To Do, Doing, Done), priority ordering, and assigned member IDs.
              </li>
              <li>
                <strong className="text-slate-800">File Attachments & Covers:</strong> Uploaded task documents, screenshots, and profile images stored in secured object storage accessed exclusively through short-lived presigned URLs.
              </li>
              <li>
                <strong className="text-slate-800">Audit Activity Logs:</strong> Automatic audit records capturing task creation, status transitions, property edits, and reassignments with timestamps for team transparency.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3. How We Use Your Data</h2>
            <p className="mt-3">
              Your information is used strictly to power the TaskFlow workspace:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Authenticating user sessions and verifying identity via short-lived JWTs.</li>
              <li>Enforcing Role-Based Access Control (RBAC) to ensure only authorized team members can update or reorder specific tasks.</li>
              <li>Maintaining real-time board state, task ordering, and team activity feeds.</li>
              <li>Providing secure file upload and temporary presigned URL retrieval.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">4. Cookies & Session Storage</h2>
            <p className="mt-3">
              We do not employ third-party tracking, advertising pixels, or cross-site analytics cookies. We use cookies exclusively for:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-800">Authentication Cookies:</strong> Secure, <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800 font-mono">HttpOnly</code> and <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800 font-mono">SameSite</code> cookies storing hashed refresh tokens to protect your session against cross-site scripting (XSS) and CSRF attacks.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">5. Data Sharing & Third-Party Infrastructure</h2>
            <p className="mt-3">
              We do not sell, rent, or monetize your personal or task data under any circumstances. Data is stored on dedicated cloud infrastructure:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-800">Database:</strong> MongoDB for structured user, task, and activity records.
              </li>
              <li>
                <strong className="text-slate-800">Cloud Storage:</strong> AWS S3 / MinIO object storage for secure, private file attachments with time-limited presigned URL access.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">6. User Rights & Data Management</h2>
            <p className="mt-3">
              You retain control over your data within the application:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>You may update your profile details and change your password via your Profile settings at any time.</li>
              <li>Assigned members and administrators can modify, archive, or delete tasks directly on the board.</li>
              <li>Workspace administrators have administrative privileges to manage or deactivate user accounts.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
            <h3 className="text-base font-bold text-slate-900">Questions about your privacy?</h3>
            <p className="mt-2 text-sm text-slate-600">
              If you have any questions regarding your data or wish to request full account removal, please reach out to your workspace administrator or review our{" "}
              <Link href="/security" className="font-semibold text-blue-600 hover:underline">
                Security Overview
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
