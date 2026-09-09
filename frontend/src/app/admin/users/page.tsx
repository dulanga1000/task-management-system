"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search, X } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import useUsers from "@/hooks/useUsers";
import useTasks from "@/hooks/useTasks";
import useAdminStats from "@/hooks/useAdminStats";

import AdminNavigation from "@/components/admin/AdminNavigation";
import UserTable from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    users,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
    loading: usersLoading,
    error: usersError,
  } = useUsers({
    enabled: !authLoading && user?.role === "ADMIN",
    initialLimit: 10,
  });

  const { stats } = useAdminStats({
    enabled: !authLoading && user?.role === "ADMIN",
  });

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks({
    enabled: !authLoading && user?.role === "ADMIN",
    initialLimit: 100, // Fetch tasks to accurately compute user workload badges
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  // Route protection
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  // Client-side search & role filter on current page items
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const nameMatch = `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(query);
        const usernameMatch = u.username.toLowerCase().includes(query);
        const emailMatch = u.email.toLowerCase().includes(query);

        if (!nameMatch && !usernameMatch && !emailMatch) {
          return false;
        }
      }

      // 2. Role Filter
      if (roleFilter !== "ALL" && u.role !== roleFilter) {
        return false;
      }

      return true;
    });
  }, [users, searchQuery, roleFilter]);

  if (
    authLoading ||
    !user ||
    user.role !== "ADMIN" ||
    usersLoading ||
    tasksLoading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
          <p className="mt-4 text-xs font-semibold text-gray-500 tracking-wide">
            Loading user directory...
          </p>
        </div>
      </main>
    );
  }

  const totalUsersCount = stats ? stats.totalUsers : pagination ? pagination.totalItems : users.length;
  const error = usersError || tasksError;

  return (
    <main className="min-h-screen bg-gray-50/60 pb-16">
      <AdminNavigation />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                <Users className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-gray-950 tracking-tight">
                User Directory
              </h1>
            </div>
            <p className="mt-1 text-xs text-gray-400 font-medium">
              View registered users, roles, and assigned workload distribution.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs">
              Total Accounts: {totalUsersCount}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Search & Role Filter Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search page users by name, username, or email..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-9 text-xs text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50/80 p-1">
            {(["ALL", "ADMIN", "USER"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  roleFilter === role
                    ? "bg-white text-gray-900 shadow-xs ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {role === "ALL" ? "All Roles" : role === "ADMIN" ? "Admins" : "Standard Users"}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Table with Server Pagination */}
        <UserTable
          users={filteredUsers}
          tasks={tasks}
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          title="Registered Accounts"
          subtitle="Page-based directory of user accounts and workload allocation."
        />
      </div>
    </main>
  );
}
