"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import useUsers from "@/hooks/useUsers";
import useTasks from "@/hooks/useTasks";
import AdminNavigation from "@/components/admin/AdminNavigation";
import AdminStats from "@/components/admin/AdminStats";
import AdminTaskTable from "@/components/admin/AdminTaskTable";
import UserTable from "@/components/admin/UserTable";
import type { TaskStatus } from "@/types/task";

export default function AdminOverviewPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useUsers({
    enabled: !authLoading && user?.role === "ADMIN",
    initialLimit: 5,
  });

  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    updateTask,
    deleteTask,
    assignTask,
  } = useTasks({
    enabled: !authLoading && user?.role === "ADMIN",
    initialLimit: 5,
  });

  // Admin access guard
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
            Accessing Administrator Console...
          </p>
        </div>
      </main>
    );
  }

  const error = usersError || tasksError;

  const handleReassignTask = async (taskId: string, assignedUserId: string) => {
    await assignTask(taskId, { assignedUserId });
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    status: TaskStatus
  ) => {
    await updateTask(taskId, { status });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  return (
    <main className="min-h-screen bg-slate-50/60 selection:bg-blue-100 selection:text-blue-900 pb-20">
      <AdminNavigation />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:px-8 space-y-8">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              System Overview
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Welcome back, {user?.firstName}. Monitor team velocity, task distribution, and workspace accounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>Kanban Board</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/tasks")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <span>Manage Tasks</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 shadow-2xs">
            {error}
          </div>
        )}

        {/* Global Statistics (Aggregated from /api/admin/stats) */}
        <AdminStats />

        {/* Recent Tasks Widget with Reassign & Actions */}
        <AdminTaskTable
          tasks={tasks}
          users={users}
          currentUserId={user?.id}
          onReassignTask={handleReassignTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
          title="Recent System Tasks"
          subtitle="Latest task creations and updates across the platform."
          showViewAllLink={true}
          limit={5}
        />

        {/* Registered Users Overview */}
        <UserTable
          users={users}
          tasks={tasks}
          title="Recent User Registrations"
          subtitle="Latest team members and administrators added to the organization."
          showViewAllLink={true}
          limit={5}
        />
      </div>
    </main>
  );
}