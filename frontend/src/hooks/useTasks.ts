"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getTasks,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  assignTask as assignTaskApi,
} from "@/services/task.service";

import type {
  AssignTaskData,
  CreateTaskData,
  Task,
  UpdateTaskData,
} from "@/types/task";

interface UseTasksOptions {
  enabled?: boolean;
}

export default function useTasks(
  options: UseTasksOptions = {}
) {
  const {
    enabled = true,
  } = options;

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ----------------------------------------------
  // GET TASKS
  // ----------------------------------------------

  const fetchTasks = useCallback(
    async () => {
      if (!enabled) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getTasks();

        setTasks(
          response.data.tasks
        );
      } catch (error: any) {
        console.error(
          "Get tasks failed:",
          error?.response?.data || error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load tasks."
        );
      } finally {
        setLoading(false);
      }
    },
    [enabled]
  );

  // ----------------------------------------------
  // FETCH WHEN AUTH IS READY
  // ----------------------------------------------

  useEffect(() => {
    if (!enabled) {
      return;
    }

    fetchTasks();
  }, [enabled, fetchTasks]);

  // ----------------------------------------------
  // CREATE
  // ----------------------------------------------

  const createTask = async (
    data: CreateTaskData
  ) => {
    const response =
      await createTaskApi(data);

    const newTask = response.data.task;

    setTasks((previous) => [
      newTask,
      ...previous,
    ]);

    return newTask;
  };

  // ----------------------------------------------
  // UPDATE
  // ----------------------------------------------

  const updateTask = async (
    taskId: string,
    data: UpdateTaskData
  ) => {
    // Snapshot previous tasks for rollback
    let previousTasks: Task[] = [];
    setTasks((previous) => {
      previousTasks = previous;
      return previous.map((task) =>
        task._id === taskId
          ? { ...task, ...data }
          : task
      );
    });

    try {
      const response =
        await updateTaskApi(
          taskId,
          data
        );

      const updatedTask = response.data.task;

      setTasks((previous) =>
        previous.map((task) =>
          task._id === taskId
            ? updatedTask
            : task
        )
      );

      return updatedTask;
    } catch (err: any) {
      // Rollback to previous state on failure
      if (previousTasks.length > 0) {
        setTasks(previousTasks);
      }
      const errorMsg =
        err?.response?.data?.message ||
        "Failed to update task.";
      setError(errorMsg);
      throw err;
    }
  };

  // ----------------------------------------------
  // DELETE
  // ----------------------------------------------

  const deleteTask = async (
    taskId: string
  ) => {
    await deleteTaskApi(taskId);

    setTasks((previous) =>
      previous.filter(
        (task) =>
          task._id !== taskId
      )
    );
  };

  // ----------------------------------------------
  // ASSIGN
  // ----------------------------------------------

  const assignTask = async (
    taskId: string,
    data: AssignTaskData
  ) => {
    const response =
      await assignTaskApi(
        taskId,
        data
      );

    const assignedTask = response.data.task;

    setTasks((previous) =>
      previous.map((task) =>
        task._id === taskId
          ? assignedTask
          : task
      )
    );

    return assignedTask;
  };

  const clearError = () => setError("");

  return {
    tasks,
    loading,
    error,
    clearError,

    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
  };
}