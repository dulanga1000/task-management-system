"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, AlertCircle, X } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import useTasks from "@/hooks/useTasks";
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

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const loading =
    authLoading || tasksLoading;

  const handleCreateTask = async (
    data: CreateTaskData
  ) => {
    await createTask(data);
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
    taskId: string
  ) => {
    if (!user) return;

    await assignTask(taskId, {
      assignedUserId: user.id,
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
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm font-medium text-muted">
            Loading your workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-background to-background">
      <DashboardHeader
        onCreateTask={() =>
          setShowCreateModal(true)
        }
      />

      <div className="mx-auto max-w-[1600px] px-6 py-8 lg:px-8">

        {/* Workspace */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Task Board
              </h2>
              {user?.role === "ADMIN" && (
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 ring-1 ring-inset ring-purple-600/20">
                  ADMIN VIEW
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-muted">
              {user?.role === "ADMIN"
                ? "Administrator workspace — viewing all tasks in interactive board mode"
                : "Personal workspace"}
            </p>
          </div>

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-purple-200 bg-purple-50/80 px-4 py-2 text-xs font-bold text-purple-700 shadow-xs hover:bg-purple-100 hover:border-purple-300 transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>Back to Admin Dashboard</span>
            </Link>
          )}
        </div>

        {/* Floating Toast Notification (always visible on screen regardless of scroll position) */}
        {error && (
          <div
            role="alert"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 rounded-2xl border border-red-200 bg-white/95 px-5 py-4 text-red-700 shadow-2xl backdrop-blur-md ring-1 ring-red-500/20 transition-all animate-in fade-in slide-in-from-bottom-5 max-w-md pointer-events-auto"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 leading-snug">
                {error}
              </p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Statistics */}
        <DashboardStats tasks={tasks} />

        {/* Board */}
        <div className="mt-8 overflow-x-auto pb-4">
          <Board
            tasks={tasks}
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
        currentUserId={user?.id}
        onAttachmentChange={fetchTasks}
      />
    </main>
  );
}