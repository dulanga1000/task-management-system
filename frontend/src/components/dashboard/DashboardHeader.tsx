"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Plus, LogOut, ChevronDown, User as UserIcon, ShieldCheck } from "lucide-react";

interface DashboardHeaderProps {
  onCreateTask: () => void;
}

export default function DashboardHeader({
  onCreateTask,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);

  const firstName = user?.firstName || "there";

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-gray-200/50 bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Left side */}
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">
            Welcome back
          </p>
          <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Good morning, {firstName} 👋
          </h1>
        </div>

        {/* Right side */}
        <div className="relative flex items-center gap-4">
          {/* Back to Admin Dashboard for ADMIN users */}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="hidden h-10 items-center gap-2 rounded-xl border border-purple-200 bg-purple-50/90 px-3.5 text-xs font-bold text-purple-700 shadow-xs transition-all hover:bg-purple-100 hover:border-purple-300 sm:flex"
            >
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {/* Create task */}
          <button
            type="button"
            onClick={onCreateTask}
            className="hidden h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-hover hover:shadow-primary/40 hover:-translate-y-0.5 sm:flex"
          >
            <Plus className="h-4 w-4" />
            Create task
          </button>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((previous) => !previous)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 shadow-sm transition-all hover:bg-gray-50 focus:ring-2 focus:ring-primary/20"
              aria-label="Open account menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {user?.firstName?.charAt(0).toUpperCase() || "U"}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {/* Account menu */}
            {showMenu && (
              <div className="absolute right-0 top-12 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 transition-all glass">
                <div className="border-b border-gray-100 px-3 py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {user?.email}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    <UserIcon className="h-3 w-3" />
                    {user?.role}
                  </span>
                </div>

                <div className="mt-2 space-y-1">
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setShowMenu(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-purple-700 bg-purple-50/80 hover:bg-purple-100 transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 text-purple-600" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    Profile & Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-danger transition-colors hover:bg-danger/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile create and admin return buttons */}
      <div className="border-t border-gray-100/50 px-6 py-3 space-y-2 sm:hidden">
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 active:scale-95"
          >
            <ShieldCheck className="h-4 w-4 text-purple-600" />
            Back to Admin Dashboard
          </Link>
        )}

        <button
          type="button"
          onClick={onCreateTask}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Create task
        </button>
      </div>
    </header>
  );
}