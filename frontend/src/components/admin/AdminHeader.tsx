"use client";

import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
        <div>
          <p className="text-sm font-medium text-blue-600">
            Administrator
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            ADMIN
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}