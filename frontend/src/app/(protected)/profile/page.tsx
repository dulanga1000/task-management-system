"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-blue-600/20 border-t-blue-600" />
          <p className="mt-4 text-xs font-semibold text-gray-500 tracking-wide">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : (user.username || "U").slice(0, 2).toUpperCase();

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-gray-50/70 pb-16">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{user.role === "ADMIN" ? "Back to Admin Console" : "Back to Dashboard"}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                user.role === "ADMIN"
                  ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20"
                  : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Account Profile
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal profile details and account security settings.
          </p>
        </div>

        {/* User Summary Card */}
        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm">
          <ProfilePictureManager user={user} onUpdateUser={updateUser} />
          {formattedDate && (
            <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
              Member since {formattedDate}
            </p>
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
