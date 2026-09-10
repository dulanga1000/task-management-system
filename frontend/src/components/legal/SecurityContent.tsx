import Link from "next/link";
import { ArrowLeft, CheckCircle2, Database, KeyRound, Lock, Server, ShieldCheck } from "lucide-react";

export default function SecurityContent() {
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
            Trust & Architecture
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Security Overview
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            A transparent look into the defense-in-depth architecture protecting your TaskFlow workspace
          </p>
        </div>

        {/* Security Highlights Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">JWT Token Rotation</h3>
                <p className="text-xs text-slate-500">Short-lived access tokens & atomic refresh</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control</h3>
                <p className="text-xs text-slate-500">Enforced user vs admin permissions</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Presigned Cloud Storage</h3>
                <p className="text-xs text-slate-500">Private S3 buckets with time-limited URLs</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hardened HTTP Transport</h3>
                <p className="text-xs text-slate-500">Helmet security headers & CORS origin whitelist</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="mt-12 space-y-10 text-base leading-7 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-900">1. Authentication & Session Security</h2>
            <p className="mt-3">
              TaskFlow implements a multi-tier authentication architecture designed to isolate credentials and withstand modern session hijacking vectors:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-800">Short-Lived Access Tokens:</strong> JWT access tokens expire in 15 minutes, drastically shrinking the window of vulnerability.
              </li>
              <li>
                <strong className="text-slate-800">HttpOnly, SameSite Refresh Cookies:</strong> Long-lived refresh tokens are stored exclusively in <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800 font-mono">HttpOnly</code>, <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800 font-mono">SameSite</code> cookies, rendering them inaccessible to client-side scripts (XSS immunity).
              </li>
              <li>
                <strong className="text-slate-800">Cryptographic Token Hashing:</strong> Refresh tokens are hashed via SHA-256 before storage in the database, preventing token leakage even in the unlikely event of database access.
              </li>
              <li>
                <strong className="text-slate-800">Atomic Token Rotation:</strong> Each token refresh atomically invalidates the previous token and links the replacement inside a MongoDB transaction. If a previously rotated token is reused, the system detects a potential replay attack and invalidates the entire token family immediately.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2. Credential Protection</h2>
            <p className="mt-3">
              User passwords are protected with strong cryptographic safeguards:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Passwords are automatically hashed using <strong>bcrypt</strong> with salted iterations before storage.
              </li>
              <li>
                Password hashes are explicitly excluded from database query projections (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800 font-mono">select: false</code>), ensuring passwords are never accidentally serialized into API responses or audit logs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3. Granular Role-Based Access Control (RBAC)</h2>
            <p className="mt-3">
              Every request is verified against strict server-side authorization middleware:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-800">Task Ownership Guard:</strong> Non-admin users are strictly restricted to updating and reordering tasks assigned to them. Server-side validation rejects unauthorized modifications, preventing unauthorized tampering.
              </li>
              <li>
                <strong className="text-slate-800">Admin Boundary:</strong> Global management endpoints (such as deleting users, viewing workspace metrics, and reassigning unowned tasks) require an explicit verified <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800 font-mono">admin</code> role.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">4. Private Cloud Storage Architecture</h2>
            <p className="mt-3">
              TaskFlow handles project attachments and media via private object storage (AWS S3 / MinIO):
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Storage buckets are private and block public read access by default.
              </li>
              <li>
                File access is granted exclusively through short-lived <strong>presigned URLs</strong> that expire automatically after a limited time window (e.g. 1 hour).
              </li>
              <li>
                File uploads undergo MIME-type validation and size restrictions to prevent malicious payload delivery.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">5. API Hardening & Input Sanitization</h2>
            <p className="mt-3">
              The backend API is defended by multiple security layers:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-800">Helmet Security Headers:</strong> Secures HTTP responses with Content Security Policy, strict HSTS, DNS prefetch control, and frameguard protections.
              </li>
              <li>
                <strong className="text-slate-800">Strict CORS Whitelisting:</strong> Cross-origin requests are restricted exclusively to authorized client origins.
              </li>
              <li>
                <strong className="text-slate-800">Zod Schema Validation:</strong> All input data is strictly parsed, validated, and sanitized before reaching controller logic, guarding against parameter tampering and NoSQL injection.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <h3 className="text-base font-bold text-slate-900">Responsible Disclosure</h3>
            <p className="mt-2 text-sm text-slate-600">
              We take security inquiries seriously. If you discover a potential security concern or vulnerability in TaskFlow, please notify your workspace administrator or team lead for prompt triage.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
