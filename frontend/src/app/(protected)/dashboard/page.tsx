"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, X, ArrowLeft, Search, Filter, KanbanSquare } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import useTasks from "@/hooks/useTasks";
import useUsers from "@/hooks/useUsers";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import Board from "@/components/board/Board";
import TaskModal from "@/components/tasks/TaskModal";
import type {CreateTaskData,Task,UpdateTaskData} from "@/types/task";

export default function DashboardPage() {
  const {
    user,
    loading: authLoading,
  } = useAuth();
  
  const router = useRouter();
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  const {
    tasks,
    loading: tasksLoading,
    error,
    setError,
    clearError,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    reorderTasks,
    fetchTasks,
  } = useTasks({
    enabled: !authLoading && !!user,
    initialLimit: 100,
  });

  // Auto-dismiss floating error toast after 4 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Client-side board search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"ALL" | "MINE" | "UNASSIGNED">("ALL");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(q);
        const descMatch = task.description?.toLowerCase().includes(q);
        const labelMatch = task.labels?.some((l) => l.name.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !labelMatch) return false;
      }
      if (assignmentFilter === "MINE") {
        const assignedId = task.assignedUser?._id;
        if (!user?.id || assignedId !== user.id) return false;
      } else if (assignmentFilter === "UNASSIGNED") {
        if (task.assignedUser) return false;
      }
      return true;
    });
  }, [tasks, searchQuery, assignmentFilter, user?.id]);

  const { users } = useUsers({
    enabled: !authLoading && user?.role === "ADMIN",
    initialLimit: 100,
  });

  const handleCreateTask = async (
    data: CreateTaskData,
    assignedUserId?: string
  ) => {
    await createTask({
      ...data,
      assignedUserId: assignedUserId || data.assignedUserId,
    });
  };

  const handleUpdateTask = async (
    taskId: string,
    data: UpdateTaskData
  ) => {
    const targetTask = tasks.find((t) => t._id === taskId);
    if (
      user &&
      targetTask &&
      !targetTask.assignedUser &&
      targetTask.creator?._id !== user.id &&
      user.role !== "ADMIN"
    ) {
      // Auto-assign unassigned task to current user when moving it
      await assignTask(taskId, {
        assignedUserId: user.id,
      });
    }

    await updateTask(taskId, data);
  };

  const handleDeleteTask = async (
    taskId: string
  ) => {
    await deleteTask(taskId);
  };

  const handleAssignTask = async (
    taskId: string,
    assignedUserId?: string
  ) => {
    if (!user) return;

    await assignTask(taskId, {
      assignedUserId: assignedUserId !== undefined ? assignedUserId : user.id,
    });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedTask(null);
  };

  if (authLoading || !user || tasksLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-3 border-blue-500/20 border-t-blue-600" />
          <p className="mt-4 text-xs font-semibold text-slate-500 tracking-wide">
            Loading your workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/60 pb-16">
      <DashboardHeader
        onCreateTask={() =>
          setShowCreateModal(true)
        }
      />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Workspace Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                <KanbanSquare className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Task Board
              </h1>
              {user?.role === "ADMIN" && (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60">
                  Admin View
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {user?.role === "ADMIN"
                ? "Administrator workspace — viewing all tasks in interactive board mode"
                : "Personal workspace — organize and track your tasks"}
            </p>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {error && (
          <div
            role="alert"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 rounded-2xl border border-rose-200 bg-white px-5 py-4 text-rose-700 shadow-2xl ring-1 ring-rose-500/10 transition-all animate-in fade-in slide-in-from-bottom-5 max-w-md pointer-events-auto"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-900 leading-snug">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Statistics */}
        <DashboardStats tasks={tasks} />

        {/* Search & Priority Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search board tasks by title, description, or label..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-9 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Filter:
            </span>
            {[
              { id: "ALL", label: "All Tasks" },
              { id: "MINE", label: "Assigned to Me" },
              { id: "UNASSIGNED", label: "Unassigned" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAssignmentFilter(opt.id as "ALL" | "MINE" | "UNASSIGNED")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  assignmentFilter === opt.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            ))}

            {(searchQuery || assignmentFilter !== "ALL") && (
              <span className="text-xs font-medium text-slate-400 ml-2">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
              </span>
            )}
          </div>
        </div>

        {/* Board */}
        <div className="overflow-x-auto pb-4">
          <Board
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onTaskUpdate={handleUpdateTask}
            onTaskAssign={handleAssignTask}
            onReorderTasks={reorderTasks}
            onError={setError}
            currentUserId={user?.id}
            isAdmin={user?.role === "ADMIN"}
          />
        </div>
      </div>

      {/* Create Task Modal */}
      <TaskModal
        open={showCreateModal}
        onClose={handleCloseModal}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onAssign={handleAssignTask}
        users={users}
        currentUserId={user?.id}
      />

      {/* Task Details / Edit Modal */}
      <TaskModal
        open={!!selectedTask}
        task={selectedTask}
        onClose={handleCloseModal}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onAssign={handleAssignTask}
        users={users}
        currentUserId={user?.id}
        onAttachmentChange={fetchTasks}
      />
    </main>
  );
}