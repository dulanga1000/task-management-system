"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

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
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        {/* Left side */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            Welcome back
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Good morning, {firstName} 👋
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your tasks today.
          </p>
        </div>

        {/* Right side */}
        <div className="relative flex items-center gap-3">
          {/* Create task */}
          <button
            type="button"
            onClick={onCreateTask}
            className="hidden h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md sm:inline-flex"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Create task
          </button>

          {/* Avatar */}
          <button
            type="button"
            onClick={() =>
              setShowMenu((previous) => !previous)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-200"
            aria-label="Open account menu"
          >
            {user?.firstName?.charAt(0).toUpperCase() || "U"}
          </button>

          {/* Account menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {user?.email}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  {user?.role}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 flex w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile create button */}
      <div className="border-t border-gray-100 px-6 py-3 sm:hidden">
        <button
          type="button"
          onClick={onCreateTask}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Create task
        </button>
      </div>
    </header>
  );
}