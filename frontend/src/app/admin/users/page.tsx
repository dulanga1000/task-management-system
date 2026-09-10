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
import EditUserModal from "@/components/admin/EditUserModal";
import DeleteUserConfirmation from "@/components/admin/DeleteUserConfirmation";
import type { User, UpdateUserData } from "@/types/user";

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
    updateUser,
    deleteUser,
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
    fetchTasks,
  } = useTasks({
    enabled: !authLoading && user?.role === "ADMIN",
    initialLimit: 100, // Fetch tasks to accurately compute user workload badges
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "USER">("ALL");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

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

  const isFiltered = searchQuery.trim() !== "" || roleFilter !== "ALL";

  const effectivePagination = useMemo(() => {
    if (isFiltered) {
      return {
        page: 1,
        limit,
        totalItems: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit) || 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
    return pagination;
  }, [isFiltered, filteredUsers.length, limit, pagination]);

  if (
    authLoading ||
    !user ||
    user.role !== "ADMIN" ||
    usersLoading ||
    tasksLoading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-blue-500/20 border-t-blue-600" />
          <p className="mt-4 text-xs font-semibold text-slate-500 tracking-wide">
            Loading team directory...
          </p>
        </div>
      </main>
    );
  }

  const handleUpdateUser = async (userId: string, data: UpdateUserData) => {
    await updateUser(userId, data);
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
    // Unassigned tasks need to be reloaded so workload badges refresh immediately
    fetchTasks();
  };

  const totalUsersCount = stats ? stats.totalUsers : pagination ? pagination.totalItems : users.length;
  const error = usersError || tasksError;

  return (
    <main className="min-h-screen bg-slate-50/60 pb-16">
      <AdminNavigation />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <Users className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                User Directory & Accounts
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              Oversee all registered team accounts, workload distribution, and role classifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
              Total Members: {totalUsersCount}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by full name, username, or email address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-9 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1">
            {(["ALL", "ADMIN", "USER"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  roleFilter === role
                    ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200"
                    : "text-slate-500 hover:text-slate-900"
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
          pagination={effectivePagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onEditUser={(u) => setEditingUser(u)}
          onDeleteUser={(u) => setDeletingUser(u)}
          currentUserId={user?.id}
          title="Registered Accounts"
          subtitle="Page-based directory of user accounts and workload allocation."
        />
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleUpdateUser}
      />

      {/* Delete User Confirmation Modal */}
      <DeleteUserConfirmation
        open={!!deletingUser}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
      />
    </main>
  );
}
