import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Paperclip, Plus, Shield, Sparkles, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-50/80 via-indigo-50/40 to-transparent blur-3xl" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-sky-50/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
        {/* Hero content */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-xs backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
            </span>
            Next-Generation Task Management for Agile Teams
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Plan clearly. Execute fast.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Deliver on schedule.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            An intuitive, high-velocity Kanban workspace built for modern engineering and product teams to track progress, assign ownership, and ship quality results without friction.
          </p>

          {/* Actions */}
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
              Sign in to workspace
            </Link>
          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">
            Instant setup • No credit card required • Role-based access control
          </p>
        </div>

        {/* Realistic Dashboard Preview */}
        <div className="mx-auto mt-14 max-w-6xl lg:mt-18">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-300/40">
            {/* Browser header */}
            <div className="flex h-11 items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>

              <div className="hidden rounded-md border border-slate-200/80 bg-white px-8 py-1 text-xs font-medium text-slate-500 shadow-2xs sm:block">
                app.taskflow.com/dashboard/sprint-14
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Live Sync
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="bg-slate-50/50 p-4 sm:p-6">
              {/* Dashboard top controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Sprint 14 • Q3 Product Release</h3>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Active</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">8 of 12 tasks completed • Updated 2m ago</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="hidden sm:inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs">
                    Filter: All Members
                  </span>
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs">
                    <Plus className="h-3.5 w-3.5" />
                    <span>New Task</span>
                  </div>
                </div>
              </div>

              {/* Board Columns */}
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {/* Column 1: TO DO */}
                <div className="rounded-xl border border-slate-200/90 bg-slate-100/60 p-3.5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                      <p className="text-xs font-bold tracking-wider uppercase text-slate-700">To Do</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">2</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Card 1 */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">Design</span>
                        <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Medium</span>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-slate-800">Design System Tokens & Typography</h4>
                      <p className="mt-1 text-[11px] leading-4 text-slate-500">Standardize spacing, button states and theme variables.</p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>Tomorrow</span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                          JD
                        </div>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase">Storage</span>
                        <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">High</span>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-slate-800">S3 Presigned URL Image Upload</h4>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          <span>2 files</span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700">
                          AL
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: IN PROGRESS */}
                <div className="rounded-xl border border-blue-200/80 bg-blue-50/30 p-3.5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                      <p className="text-xs font-bold tracking-wider uppercase text-blue-800">In Progress</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">2</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Card 1 */}
                    <div className="rounded-xl border border-blue-200/90 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">Core</span>
                        <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Urgent</span>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-slate-800">Kanban Drag & Drop Order Sorting</h4>
                      <p className="mt-1 text-[11px] leading-4 text-slate-500">Smooth optimistic reordering with permission feedback.</p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1 text-blue-600 font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                          <span>In Review</span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                          DK
                        </div>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">Security</span>
                        <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Medium</span>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-slate-800">RBAC Session Validation</h4>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-700 font-medium">Protected</span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                          JD
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: DONE */}
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/20 p-3.5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <p className="text-xs font-bold tracking-wider uppercase text-emerald-800">Completed</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">2</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Card 1 */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md opacity-90">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase">Auth</span>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Done</span>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-slate-800 line-through decoration-slate-400">JWT Refresh Token Rotation</h4>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-emerald-600">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Verified</span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                          SK
                        </div>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-shadow hover:shadow-md opacity-90">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 uppercase">Logs</span>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Done</span>
                      </div>
                      <h4 className="mt-2 text-xs font-bold text-slate-800 line-through decoration-slate-400">Activity History Feed</h4>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-emerald-600">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Shipped</span>
                        </div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-700">
                          DK
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics / Key highlights row below board */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center shadow-2xs">
              <p className="text-2xl font-extrabold text-slate-900">10,000+</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Tasks Delivered</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center shadow-2xs">
              <p className="text-2xl font-extrabold text-blue-600">99.9%</p>
              <p className="mt-1 text-xs font-medium text-slate-500">System Uptime</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center shadow-2xs">
              <p className="text-2xl font-extrabold text-slate-900">&lt; 50ms</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Optimistic UI Sync</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 text-center shadow-2xs">
              <p className="text-2xl font-extrabold text-emerald-600">100%</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Role Protected</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}