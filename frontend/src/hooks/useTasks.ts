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

    setTasks((previous) => [
      response.data,
      ...previous,
    ]);

    return response.data;
  };

  // ----------------------------------------------
  // UPDATE
  // ----------------------------------------------

  const updateTask = async (
    taskId: string,
    data: UpdateTaskData
  ) => {
    const response =
      await updateTaskApi(
        taskId,
        data
      );

    setTasks((previous) =>
      previous.map((task) =>
        task._id === taskId
          ? response.data
          : task
      )
    );

    return response.data;
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

    setTasks((previous) =>
      previous.map((task) =>
        task._id === taskId
          ? response.data
          : task
      )
    );

    return response.data;
  };

  return {
    tasks,
    loading,
    error,

    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
  };
}