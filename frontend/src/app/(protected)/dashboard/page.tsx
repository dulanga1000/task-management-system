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
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <DashboardHeader
        onCreateTask={() =>
          setShowCreateModal(true)
        }
      />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* Workspace */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {user?.role === "ADMIN"
              ? "Administrator workspace"
              : "Personal workspace"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Statistics */}
        <DashboardStats tasks={tasks} />

        {/* Board */}
        <div className="mt-8">
          <Board
            tasks={tasks}
            onTaskClick={handleTaskClick}
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