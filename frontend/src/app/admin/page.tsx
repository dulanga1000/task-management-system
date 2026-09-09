"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";
import useUsers from "@/hooks/useUsers";
import useTasks from "@/hooks/useTasks";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import UserTable from "@/components/admin/UserTable";
import AdminTaskTable from "@/components/admin/AdminTaskTable";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useUsers({
    enabled:
      !authLoading &&
      user?.role === "ADMIN",
  });

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useTasks({
    enabled:
      !authLoading &&
      user?.role === "ADMIN",
  });

  /*
   * Admin route protection
   */
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

  /*
   * Loading
   */
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
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading admin dashboard...
          </p>
        </div>
      </main>
    );
  }

  const error = usersError || tasksError;

  return (
    <main className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Statistics */}
        <AdminStats
          users={users}
          tasks={tasks}
        />

        {/* Users */}
        <UserTable users={users} />

        {/* Recent Tasks */}
        <AdminTaskTable tasks={tasks} />
      </div>
    </main>
  );
}