import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServiceContent() {
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
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: September 2026 • Effective immediately
          </p>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-10 text-base leading-7 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By registering, accessing, or using the TaskFlow platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any portion of these terms, you should not access or use the application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">2. User Accounts & Credential Security</h2>
            <p className="mt-3">
              To use TaskFlow, you must create an account with accurate information, including your legal name, username, and a valid email address:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>You are solely responsible for maintaining the confidentiality of your credentials and passwords.</li>
              <li>You must choose a strong password (minimum 6 characters) and notify workspace administrators immediately if you suspect unauthorized access.</li>
              <li>Accounts cannot be shared between multiple individuals. Each team member must have their own registered identity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">3. Role-Based Access Control (RBAC) & Acceptable Use</h2>
            <p className="mt-3">
              TaskFlow enforces role-based access control to preserve project integrity:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-slate-800">Team Members:</strong> You may view shared workspace boards, create tasks, and update or reorder tasks assigned directly to you. Attempting to bypass client or server authorization to modify another member&apos;s tasks is strictly prohibited.
              </li>
              <li>
                <strong className="text-slate-800">Administrators:</strong> Administrators have full oversight of user management, global task assignment, and workspace configuration.
              </li>
              <li>
                <strong className="text-slate-800">Prohibited Conduct:</strong> You agree not to attempt to reverse engineer, inject malicious scripts, or tamper with JWT tokens or API endpoints.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">4. Uploaded Content & Cloud Storage</h2>
            <p className="mt-3">
              TaskFlow allows users to upload task descriptions, cover photos, and file attachments:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>You retain full ownership and intellectual property rights to the content and documents you post.</li>
              <li>You agree not to upload malicious software, viruses, executable binaries, or defamatory materials.</li>
              <li>Uploads are subject to system file size limitations and MIME-type verification to safeguard team infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">5. Service Availability & Modifications</h2>
            <p className="mt-3">
              We continually improve TaskFlow. We may add new features, update workflows, or apply security patches without prior notice. While we strive for high uptime and availability, the service is provided on an &quot;as is&quot; and &quot;as available&quot; basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">6. Termination & Suspension</h2>
            <p className="mt-3">
              Workspace administrators reserve the right to suspend or terminate accounts that breach these Terms or compromise project security. You may discontinue your use of TaskFlow at any time by requesting account deletion through your workspace administrator.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
