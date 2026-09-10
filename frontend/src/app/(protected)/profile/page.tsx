"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User as UserIcon, Shield } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { ProfileInformationForm } from "@/components/profile/ProfileInformationForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { ProfilePictureManager } from "@/components/profile/ProfilePictureManager";

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-blue-500/20 border-t-blue-600" />
          <p className="mt-4 text-xs font-semibold text-slate-500 tracking-wide">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const backRoute = user.role === "ADMIN" ? "/admin" : "/dashboard";
  const backLabel = user.role === "ADMIN" ? "Back to Admin Console" : "Back to Kanban Board";

  return (
    <main className="min-h-screen bg-slate-50/60 pb-16">
      {/* Sticky SaaS Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link
              href={backRoute}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              <span>{backLabel}</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="TaskFlow Logo"
                width={24}
                height={24}
                className="h-6 w-6 rounded-md object-contain"
              />
              <span className="text-sm font-bold tracking-tight text-slate-900 hidden sm:inline">
                TaskFlow
              </span>
            </Link>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${
                user.role === "ADMIN"
                  ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                  : "bg-slate-100 text-slate-700 border border-slate-200/60"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <UserIcon className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Account Profile & Settings
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Manage your personal identity, display photo, and security credentials.
          </p>
        </div>

        {/* User Summary & Photo Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <ProfilePictureManager user={user} onUpdateUser={updateUser} />
          {formattedDate && (
            <div className="text-xs text-slate-400 mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>Member since {formattedDate}</span>
              <span className="text-slate-400 font-mono text-[11px]">User ID: {user.id}</span>
            </div>
          )}
        </div>

        {/* Section 1: Personal Information Form */}
        <ProfileInformationForm user={user} onUpdateUser={updateUser} />

        {/* Section 2: Change Password Form */}
        <ChangePasswordForm />
      </div>
    </main>
  );
}
