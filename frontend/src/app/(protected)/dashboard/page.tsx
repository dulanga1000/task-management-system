"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";
import useTasks from "@/hooks/useTasks";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import Board from "@/components/board/Board";
import TaskModal from "@/components/tasks/TaskModal";

import type {
  CreateTaskData,
  Task,
  UpdateTaskData,
} from "@/types/task";

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
    clearError,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
  } = useTasks({
    enabled: !authLoading && !!user,
  });

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Task Board
            </h2>
            <p className="text-sm font-medium text-muted">
              {user?.role === "ADMIN"
                ? "Administrator workspace"
                : "Personal workspace"}
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 flex items-center justify-between rounded-xl border border-danger/20 bg-danger/5 p-4 glass">
            <p className="text-sm font-semibold text-danger">
              {error}
            </p>
            <button
              type="button"
              onClick={clearError}
              className="rounded-lg p-1 text-danger/70 hover:bg-danger/10 hover:text-danger cursor-pointer transition-colors"
              aria-label="Dismiss error"
            >
              ✕
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
      />
    </main>
  );
}