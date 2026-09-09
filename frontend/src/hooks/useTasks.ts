"use client";

import {useCallback,useEffect,useState} from "react";
import {getTasks,createTask as createTaskApi,updateTask as updateTaskApi,deleteTask as deleteTaskApi,assignTask as assignTaskApi,reorderTasks as reorderTasksApi,} from "@/services/task.service";
import type {AssignTaskData,CreateTaskData,Task,UpdateTaskData} from "@/types/task";
import type { PaginationMeta } from "@/types/pagination";

interface UseTasksOptions {
  enabled?: boolean;
  initialPage?: number;
  initialLimit?: number;
}

export default function useTasks(
  options: UseTasksOptions = {}
) {
  const {
    enabled = true,
    initialPage = 1,
    initialLimit = 10,
  } = options;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GET TASKS

  const fetchTasks = useCallback(
    async () => {
      if (!enabled) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getTasks({ page, limit });

        setTasks(response.data.tasks);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } catch (err: any) {
        console.error(
          "Get tasks failed:",
          err?.response?.data || err
        );

        setError(
          err?.response?.data?.message ||
            "Failed to load tasks."
        );
      } finally {
        setLoading(false);
      }
    },
    [enabled, page, limit]
  );

  // FETCH WHEN AUTH OR PARAMS ARE READY

  useEffect(() => {
    if (!enabled) {
      return;
    }

    fetchTasks();
  }, [enabled, fetchTasks]);

  // CREATE

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

  // UPDATE

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
            ? {
                ...task,
                ...updatedTask,
                coverImageUrl:
                  updatedTask.coverImageUrl !== undefined
                    ? updatedTask.coverImageUrl
                    : task.coverImageUrl,
                attachmentCount:
                  updatedTask.attachmentCount !== undefined
                    ? updatedTask.attachmentCount
                    : task.attachmentCount,
              }
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

  // DELETE

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

  // ASSIGN

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
          ? {
              ...task,
              ...assignedTask,
              coverImageUrl:
                assignedTask.coverImageUrl !== undefined
                  ? assignedTask.coverImageUrl
                  : task.coverImageUrl,
              attachmentCount:
                assignedTask.attachmentCount !== undefined
                  ? assignedTask.attachmentCount
                  : task.attachmentCount,
            }
          : task
      )
    );

    return assignedTask;
  };

  // REORDER

  const reorderTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);

    try {
      const items = newTasks.map((t, index) => ({
        taskId: t._id,
        order: index,
      }));
      await reorderTasksApi(items);
    } catch (err: any) {
      console.warn("Failed to persist task order:", err);
    }
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to page 1 on page size change
  };

  const clearError = () => setError("");

  return {
    tasks,
    pagination,
    page,
    setPage,
    limit,
    setLimit: handleSetLimit,
    loading,
    error,
    setError,
    clearError,

    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    assignTask,
    reorderTasks,
  };
}