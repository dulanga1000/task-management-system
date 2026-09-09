"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare } from "lucide-react";

import useAuth from "@/hooks/useAuth";
import useUsers from "@/hooks/useUsers";
import useTasks from "@/hooks/useTasks";
import useAdminStats from "@/hooks/useAdminStats";

import AdminNavigation from "@/components/admin/AdminNavigation";
import AdminSearchFilterBar from "@/components/admin/AdminSearchFilterBar";
import AdminTaskTable from "@/components/admin/AdminTaskTable";
import type { TaskStatus } from "@/types/task";

export default function AdminTasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useUsers({
    enabled: !authLoading && user?.role === "ADMIN",
    initialLimit: 100, // Fetch users list for assignee dropdown and reassign modal
  });

  const {
    tasks,
    pagination,
    page,
    setPage,
    limit,
    setLimit,
    loading: tasksLoading,
    error: tasksError,
    updateTask,
    deleteTask,
    assignTask,
  } = useTasks({
    enabled: !authLoading && user?.role === "ADMIN",
    initialLimit: 10,
  });

  const { stats } = useAdminStats({
    enabled: !authLoading && user?.role === "ADMIN",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");

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

  // Client-side search and filtering on current page items
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        const creatorMatch = `${task.creator?.firstName} ${task.creator?.lastName} ${task.creator?.username}`
          .toLowerCase()
          .includes(query);
        const assigneeMatch = task.assignedUser
          ? `${task.assignedUser.firstName} ${task.assignedUser.lastName} ${task.assignedUser.email}`
              .toLowerCase()
              .includes(query)
          : false;

        if (!titleMatch && !descMatch && !creatorMatch && !assigneeMatch) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "ALL" && task.status !== statusFilter) {
        return false;
      }

      // 3. Assignee Filter
      if (assigneeFilter === "UNASSIGNED" && task.assignedUser) {
        return false;
      } else if (
        assigneeFilter !== "ALL" &&
        assigneeFilter !== "UNASSIGNED" &&
        task.assignedUser?._id !== assigneeFilter
      ) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, statusFilter, assigneeFilter]);

  const isFiltered =
    searchQuery.trim() !== "" ||
    statusFilter !== "ALL" ||
    assigneeFilter !== "ALL";

  const effectivePagination = useMemo(() => {
    if (isFiltered) {
      return {
        page: 1,
        limit,
        totalItems: filteredTasks.length,
        totalPages: Math.ceil(filteredTasks.length / limit) || 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
    return pagination;
  }, [isFiltered, filteredTasks.length, limit, pagination]);

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
            Loading task governance center...
          </p>
        </div>
      </main>
    );
  }

  const userOptions = users.map((u) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
  }));

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

  const totalTasksCount = stats ? stats.totalTasks : pagination ? pagination.totalItems : tasks.length;
  const error = usersError || tasksError;

  return (
    <main className="min-h-screen bg-gray-50/60 pb-16">
      <AdminNavigation />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <CheckSquare className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-gray-950 tracking-tight">
                Tasks Management
              </h1>
            </div>
            <p className="mt-1 text-xs text-gray-400 font-medium">
              View, search, filter, reassign, or adjust statuses for all system tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs">
              Total Platform Tasks: {totalTasksCount}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <AdminSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          users={userOptions}
          placeholder="Search page tasks by title, description, creator, or assignee..."
          totalResults={filteredTasks.length}
        />

        {/* Full Task Table with Server-Side Pagination */}
        <AdminTaskTable
          tasks={filteredTasks}
          users={users}
          pagination={effectivePagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onReassignTask={handleReassignTask}
          onUpdateTaskStatus={handleUpdateTaskStatus}
          onDeleteTask={handleDeleteTask}
          title="All Platform Tasks"
          subtitle="Page-based task listings matching your query and status criteria."
        />
      </div>
    </main>
  );
}
